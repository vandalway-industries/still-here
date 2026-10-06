#!/usr/bin/env bash
# staging-install.sh — puts STILL HERE staging on the production server, reachable only over the
# internal network. Its undo is deploy/staging-uninstall.sh, which takes out everything this adds.
#
# Build site/ with the commit as its build id, then run this on the server, as root, from a copy of
# the repository's site/ and deploy/ folders:
#
#   BUILD_ID=$(git rev-parse HEAD) npm run build
#   tar -czf - site deploy | ssh <server> 'd=$(mktemp -d) && tar -xzf - -C "$d" &&
#     STAGING_TS_PORT=<new internal-network HTTPS port> bash "$d/deploy/staging-install.sh";
#     rc=$?; rm -rf "$d"; exit $rc'
#
# With --update (no port needed) it only replaces the files of an installed staging with the new
# build (rsync), and touches nothing else.
#
# What it changes, and nothing else:
#   - files under /srv/still-here-staging/ (site/, the build, copied by rsync; .run/ for the socket)
#   - one block appended to /etc/caddy/Caddyfile between BEGIN and END marks, after a timestamped
#     backup, `caddy validate`, and a check that every other block is byte-identical; then a reload
#   - staging's own access log, /var/log/caddy/still-here-staging.access.log (written by Caddy),
#     one day kept
#   - one new internal-network HTTPS port of its own, proxying to the socket; no existing port or
#     route is touched
# What it prints is the deploy log's evidence: hashes, codes and labels. It never prints a host
# name, an address or a port. If another site stops answering after the reload, it puts the
# backed-up Caddyfile back, reloads, and stops. (Jules, 2026-10-06)
set -euo pipefail

HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
SRC=$(cd "$HERE/.." && pwd)
# shellcheck source=deploy/lib/staging.sh
. "$HERE/lib/staging.sh"

[ "$(id -u)" = 0 ] || die "run as root"
[ -f "$SRC/site/index.html" ] && [ -f "$HERE/caddy/staging.caddy" ] || die "run from a copy of site/ and deploy/"
BUILD=$(tr -d '\n' < "$SRC/site/build.txt" 2>/dev/null || true)
[[ "$BUILD" =~ ^[0-9a-f]{40}$ ]] || die "site/build.txt is not a commit id (build with BUILD_ID=\$(git rev-parse HEAD))"
command -v rsync >/dev/null 2>&1 || die "rsync is not on the server"

sync_site() {
  install -d -m 755 "$STAGING_DIR" "$SITE_DIR"
  rsync -a --delete --checksum --chmod=D755,F644 "$SRC/site/" "$SITE_DIR/"
  [ "$(tr -d '\n' < "$SITE_DIR/build.txt")" = "$BUILD" ] || die "the served build.txt is not the build's"
  say "files: site/ synced to $SITE_DIR by rsync ($(find "$SITE_DIR" -type f | wc -l) files); build $BUILD"
}

if [ "${1:-}" = "--update" ]; then
  say "== staging-install.sh --update, $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  grep -qxF "$MARK_BEGIN" "$CADDYFILE" || die "staging is not installed; run the install without --update"
  sync_site
  say "staging /build.txt through the socket: $(curl -s --unix-socket "$SOCKET" http://localhost/build.txt)"
  say "== staging-install.sh --update done"
  exit 0
fi

TS_PORT=${STAGING_TS_PORT:-}
[[ "$TS_PORT" =~ ^[0-9]{2,5}$ ]] || die "STAGING_TS_PORT (the new internal-network HTTPS port) is not set"

say "== staging-install.sh, $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# ── Preconditions: nothing of ours is there yet, and nothing we need is taken ──────────────────
grep -qxF "$MARK_BEGIN" "$CADDYFILE" && die "the Caddyfile already holds the staging block; run the undo first"
[ -e "$STAGING_DIR" ] && die "$STAGING_DIR exists; run the undo first"
[ "$(tail -c 1 "$CADDYFILE" | od -An -c | tr -d ' ')" = '\n' ] || die "the Caddyfile does not end in a newline"
LOCAL_PORT=${LOCAL_URL##*:}
ss -ltnH | awk '{print $4}' | grep -Eq "[:.]$LOCAL_PORT\$" && die "the local port is taken"
ss -ltnH | awk '{print $4}' | grep -Eq "[:.]$TS_PORT\$" && die "the internal-network port is taken"
serve_all_ports | grep -qx "$TS_PORT" && die "the internal network already serves that port"
say "preconditions: no staging block, no $STAGING_DIR, local port free, a new port of its own free"

WORK=$(mktemp -d)
chmod 755 "$WORK" # caddy validate runs as the caddy user and reads the candidate here
trap 'rm -rf "$WORK"' EXIT

# ── Before: the other blocks, the other sites, the other serve routes ─────────────────────────
other_block_hashes "$CADDYFILE" "$WORK/blocks.before"
site_hosts "$CADDYFILE" > "$WORK/hosts"
site_codes "$WORK/hosts" "$WORK/codes.before"
SERVE_BEFORE=$(serve_others_sha)
say "before: $(wc -l < "$WORK/blocks.before") blocks hashed, $(wc -l < "$WORK/hosts") other sites checked"

# ── Back up the Caddyfile, with a timestamp ───────────────────────────────────────────────────
BACKUP="/etc/caddy/Caddyfile.bak-staging-$(date -u +%Y%m%dT%H%M%SZ)"
cp -p "$CADDYFILE" "$BACKUP"
say "staging: Caddyfile backed up: $BACKUP"
say "staging backup $BACKUP sha256 $(sha "$BACKUP")"

# ── The files ─────────────────────────────────────────────────────────────────────────────────
install -d -m 750 -o caddy -g caddy "$STAGING_DIR/.run"
sync_site

# ── The Caddyfile: append our block, validate, prove the others unchanged, reload ─────────────
CANDIDATE="$WORK/Caddyfile.candidate"
{ cat "$CADDYFILE"; printf '\n%s\n' "$MARK_BEGIN"; cat "$HERE/caddy/staging.caddy"; printf '%s\n' "$MARK_END"; } > "$CANDIDATE"
validate "$CANDIDATE" || die "caddy validate failed; the Caddyfile was not changed"
say "caddy validate passed (the Caddyfile with the staging block)"
other_block_hashes "$CANDIDATE" "$WORK/blocks.after"
without_ours "$CANDIDATE" > "$WORK/others.after"
compare_blocks "$WORK/blocks.before" "$WORK/blocks.after" || die "another block would change; the Caddyfile was not changed"
[ "$(sha "$WORK/others.after")" = "$(sha "$CADDYFILE")" ] || die "the Caddyfile outside our block would change"
say "every other site block byte-identical before and after (and the Caddyfile outside the staging block: sha256 $(sha "$WORK/others.after"), as before)"

restore() {
  say "restoring the backed-up Caddyfile"
  cp -p "$BACKUP" "$CADDYFILE"
  systemctl reload caddy || true
}
cat "$CANDIDATE" > "$CADDYFILE"
if ! systemctl reload caddy; then
  restore
  die "the reload failed; the backed-up Caddyfile is back"
fi
sleep 2
systemctl is-active --quiet caddy || { restore; die "caddy is not active after the reload"; }
say "reload: done (systemctl reload caddy); caddy active"
site_codes "$WORK/hosts" "$WORK/codes.after"
if ! compare_codes "$WORK/codes.before" "$WORK/codes.after"; then
  restore
  die "another site stopped answering after the reload; the backed-up Caddyfile is back"
fi
say "other sites: every site that answered before the reload answers after it"

# The log file is written at the first request; check it is the file Caddy holds open (Caddy 2.6.2
# keeps a removed site's log open until it restarts, see deploy/vandalwayind-install.sh).
curl -s -o /dev/null "$LOCAL_URL/robots.txt" || true
sleep 1
CADDY_PID=$(systemctl show -p MainPID --value caddy)
if ls -l "/proc/$CADDY_PID/fd" | grep -qF "$ACCESS_LOG (deleted)"; then
  die "Caddy is writing staging's log to a deleted file; restart Caddy before relying on the log"
fi
[ -s "$ACCESS_LOG" ] || die "staging's access log is not being written"
say "access log: written, one day kept"

# ── The internal network: a new HTTPS port of its own, proxying to the socket ─────────────────
for _ in 1 2 3 4 5; do [ -S "$SOCKET" ] && break; sleep 1; done
[ -S "$SOCKET" ] || die "staging's socket did not appear"
tailscale serve --bg --https="$TS_PORT" "unix:$SOCKET" >/dev/null 2>&1 || die "tailscale serve failed"
[ "$(serve_our_ports)" = "$TS_PORT" ] || die "the new port is not serving staging"
SERVE_AFTER=$(serve_others_sha)
[ "$SERVE_AFTER" = "$SERVE_BEFORE" ] || die "another internal-network route changed"
say "internal network: a new port of its own added for staging; no existing route changed (other routes sha256 before $SERVE_BEFORE after $SERVE_AFTER)"

# ── Staging answers as Pages does ─────────────────────────────────────────────────────────────
url_table
say "staging /build.txt through the socket: $(curl -s --unix-socket "$SOCKET" http://localhost/build.txt)"
say "POST / $(curl -s -o /dev/null -w '%{http_code}' -X POST -d x --unix-socket "$SOCKET" http://localhost/)"
say "staging Caddyfile now sha256 $(sha "$CADDYFILE")"
say "== staging-install.sh done"
