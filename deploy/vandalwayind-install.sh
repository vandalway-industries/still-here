#!/usr/bin/env bash
# vandalwayind-install.sh — puts the internal copy of vandalwayind.com on the production server.
# Its undo is deploy/vandalwayind-uninstall.sh, which takes out everything this adds.
#
# Run on the server, as root, from a copy of the repository's vandalwayind/ and deploy/ folders:
#
#   tar -czf - vandalwayind deploy | ssh <server> 'd=$(mktemp -d) && tar -xzf - -C "$d" &&
#     VANDALWAYIND_TS_PORT=<new internal-network HTTPS port> bash "$d/deploy/vandalwayind-install.sh";
#     rc=$?; rm -rf "$d"; exit $rc'
#
# What it changes, and nothing else:
#   - files under /srv/vandalwayind/ (the site; .counter/ for the counter; .run/ for the socket)
#   - one block appended to /etc/caddy/Caddyfile between BEGIN and END marks, after a timestamped
#     backup, `caddy validate`, and a check that every other block is byte-identical; then a reload
#   - the site's own access log, /var/log/caddy/vandalwayind.access.log (written by Caddy)
#   - vandalwayind-counter.service and .timer in /etc/systemd/system/ (every ten minutes)
#   - one new internal-network HTTPS port of its own, proxying to the site's socket; no existing
#     port or route is touched
#   - Node only if absent (the counter needs v18 or later)
# What it prints is the deploy log's evidence: hashes, codes and labels. It never prints a host
# name, an address or a port. If another site stops answering after the reload, it puts the
# backed-up Caddyfile back, reloads, and stops. (Jules, 2026-10-05)
set -euo pipefail

HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
SRC=$(cd "$HERE/.." && pwd)
# shellcheck source=deploy/lib/caddyfile.sh
. "$HERE/lib/caddyfile.sh"
UNITS=(vandalwayind-counter.service vandalwayind-counter.timer)

[ "$(id -u)" = 0 ] || die "run as root"
TS_PORT=${VANDALWAYIND_TS_PORT:-}
[[ "$TS_PORT" =~ ^[0-9]{2,5}$ ]] || die "VANDALWAYIND_TS_PORT (the new internal-network HTTPS port) is not set"
[ -f "$SRC/vandalwayind/index.html" ] && [ -f "$HERE/caddy/vandalwayind.caddy" ] || die "run from a copy of vandalwayind/ and deploy/"

say "== vandalwayind-install.sh, $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# ── Preconditions: nothing of ours is there yet, and nothing we need is taken ──────────────────
grep -qxF "$MARK_BEGIN" "$CADDYFILE" && die "the Caddyfile already holds the vandalwayind block; run the undo first"
[ -e /srv/vandalwayind ] && die "/srv/vandalwayind exists; run the undo first"
[ "$(tail -c 1 "$CADDYFILE" | od -An -c | tr -d ' ')" = '\n' ] || die "the Caddyfile does not end in a newline"
LOCAL_PORT=${LOCAL_URL##*:}
ss -ltnH | awk '{print $4}' | grep -Eq "[:.]$LOCAL_PORT\$" && die "the local port is taken"
ss -ltnH | awk '{print $4}' | grep -Eq "[:.]$TS_PORT\$" && die "the internal-network port is taken"
serve_all_ports | grep -qx "$TS_PORT" && die "the internal network already serves that port"
say "preconditions: no vandalwayind block, no /srv/vandalwayind, local port free, a new port of its own free"

# ── Node, for the counter ──────────────────────────────────────────────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  say "node: absent; installing"
  DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs >/dev/null
fi
NODE_MAJOR=$(node --version | sed -E 's/^v([0-9]+).*/\1/')
[ "$NODE_MAJOR" -ge 18 ] || die "node $(node --version) is older than v18"
say "node: $(node --version) present"

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
BACKUP="/etc/caddy/Caddyfile.bak-vandalwayind-$(date -u +%Y%m%dT%H%M%SZ)"
cp -p /etc/caddy/Caddyfile "$BACKUP"
say "Caddyfile backed up: $BACKUP"
say "backup $BACKUP sha256 $(sha256sum "$BACKUP" | cut -d' ' -f1)"

# ── The files ─────────────────────────────────────────────────────────────────────────────────
install -d -m 755 /srv/vandalwayind /srv/vandalwayind/.counter
install -d -m 750 -o caddy -g caddy /srv/vandalwayind/.run
cp -R "$SRC/vandalwayind/." /srv/vandalwayind/
install -m 644 "$HERE/counter/count.mjs" /srv/vandalwayind/.counter/count.mjs
find /srv/vandalwayind -path /srv/vandalwayind/.run -prune -o -type d -exec chmod 755 {} + -o -type f -exec chmod 644 {} +
# The counter starts at zero here (the undo removed the old total), so the served page says the
# date this copy began counting, in the page's own style ("October 5, 2026", UTC). The repository's
# vandalwayind/index.html keeps its own date; only the served copy is rewritten, before the touch.
SINCE=$(LC_ALL=C date -u '+%B %-d, %Y')
sed -i -E "s/times since [A-Z][a-z]+ [0-9]{1,2}, [0-9]{4}\./times since $SINCE./" /srv/vandalwayind/index.html
grep -qF "times since $SINCE." /srv/vandalwayind/index.html || die "the counting start date was not written into the served page"
say "counting start: the served page reads \"times since $SINCE.\""
# Last-Modified as the page says: the page and its images 1997-08-22, the guestbook 1999-03-02.
touch -d '1997-08-22 12:00:00 UTC' /srv/vandalwayind/index.html /srv/vandalwayind/images/*
touch -d '1999-03-02 12:00:00 UTC' /srv/vandalwayind/cgi-bin/guestbook.html
node /srv/vandalwayind/.counter/count.mjs --log "$ACCESS_LOG" \
  --total /srv/vandalwayind/.counter/total --gif /srv/vandalwayind/counter.gif
say "files: /srv/vandalwayind/ written; page and images dated 1997-08-22, guestbook 1999-03-02; counter at $(cut -d' ' -f1 /srv/vandalwayind/.counter/total)"

# ── The Caddyfile: append our block, validate, prove the others unchanged, reload ─────────────
CANDIDATE="$WORK/Caddyfile.candidate"
{ cat "$CADDYFILE"; printf '\n%s\n' "$MARK_BEGIN"; cat "$HERE/caddy/vandalwayind.caddy"; printf '%s\n' "$MARK_END"; } > "$CANDIDATE"
validate "$CANDIDATE" || die "caddy validate failed; the Caddyfile was not changed"
say "caddy validate passed (the Caddyfile with the vandalwayind block)"
other_block_hashes "$CANDIDATE" "$WORK/blocks.after"
without_ours "$CANDIDATE" > "$WORK/others.after"
compare_blocks "$WORK/blocks.before" "$WORK/blocks.after" || die "another block would change; the Caddyfile was not changed"
[ "$(sha "$WORK/others.after")" = "$(sha "$CADDYFILE")" ] || die "the Caddyfile outside our block would change"
say "every other site block byte-identical before and after (and the Caddyfile outside the vandalwayind block: sha256 $(sha "$WORK/others.after"), as before)"

restore() {
  say "restoring the backed-up Caddyfile"
  cp -p "$BACKUP" /etc/caddy/Caddyfile
  systemctl reload caddy || true
}
cat "$CANDIDATE" > /etc/caddy/Caddyfile
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

# Caddy 2.6.2 keeps a removed site's log file open until it restarts, and a re-added site writes to
# that same open file. If the file was deleted meanwhile, the log would be invisible to the counter.
curl -s -o /dev/null "$LOCAL_URL/robots.txt" || true
sleep 1
CADDY_PID=$(systemctl show -p MainPID --value caddy)
if ls -l "/proc/$CADDY_PID/fd" | grep -qF "$ACCESS_LOG (deleted)"; then
  die "Caddy is writing the site's log to a deleted file; the counter cannot read it until Caddy restarts"
fi
[ -s "$ACCESS_LOG" ] || die "the site's access log is not being written"
say "access log: written, and the file Caddy writes is the one the counter reads"

# ── The counter's timer ───────────────────────────────────────────────────────────────────────
for u in "${UNITS[@]}"; do install -m 644 "$HERE/counter/$u" "/etc/systemd/system/$u"; done
systemctl daemon-reload
systemctl enable --now vandalwayind-counter.timer >/dev/null 2>&1
systemctl start vandalwayind-counter.service
say "timer: vandalwayind-counter.timer enabled and started; the counter ran once"
say "systemctl list-timers vandalwayind-counter.timer:"
systemctl list-timers --no-pager vandalwayind-counter.timer | sed -n '1,2p'

# ── The internal network: a new HTTPS port of its own, proxying to the socket ─────────────────
for _ in 1 2 3 4 5; do [ -S "$SOCKET" ] && break; sleep 1; done
[ -S "$SOCKET" ] || die "the site's socket did not appear"
tailscale serve --bg --https="$TS_PORT" "unix:$SOCKET" >/dev/null 2>&1 || die "tailscale serve failed"
[ "$(serve_our_ports)" = "$TS_PORT" ] || die "the new port is not serving the site"
SERVE_AFTER=$(serve_others_sha)
[ "$SERVE_AFTER" = "$SERVE_BEFORE" ] || die "another internal-network route changed"
say "internal network: a new port of its own added for vandalwayind; no existing route changed (other routes sha256 before $SERVE_BEFORE after $SERVE_AFTER)"

# ── The site answers, through the port and through the socket ─────────────────────────────────
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
# HEAD, not GET, for the page itself: these checks are not visits, and the counter does not count HEAD.
say "served on the local port: HEAD / $(code -I "$LOCAL_URL/"), GET /cgi-bin/guestbook.html $(code "$LOCAL_URL/cgi-bin/guestbook.html"), POST / $(code -X POST -d x "$LOCAL_URL/")"
say "served through the socket: HEAD / $(code -I --unix-socket "$SOCKET" http://localhost/), GET /.counter/total $(code --unix-socket "$SOCKET" http://localhost/.counter/total)"
say "Caddyfile now sha256 $(sha "$CADDYFILE")"
say "== vandalwayind-install.sh done"
