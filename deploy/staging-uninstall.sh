#!/usr/bin/env bash
# staging-uninstall.sh — the undo of deploy/staging-install.sh. Takes out everything the install
# added and returns the server to its backed-up state:
#   - the internal-network port that proxies to staging's socket (found by its target; no other
#     port or route is touched)
#   - the staging block of /etc/caddy/Caddyfile (a timestamped copy is kept first), after
#     `caddy validate` and a check that every other block is byte-identical; then a reload
#   - /srv/still-here-staging/ and staging's access log (emptied, not deleted: Caddy 2.6.2 keeps a
#     removed site's log file open, see deploy/vandalwayind-uninstall.sh)
# It ends by comparing the Caddyfile with the install's backup: the same sha256, or it says so.
# Run on the server, as root, the same way as the install (no port needed). (Jules, 2026-10-06)
set -euo pipefail

HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=deploy/lib/staging.sh
. "$HERE/lib/staging.sh"

[ "$(id -u)" = 0 ] || die "run as root"
say "== staging-uninstall.sh, $(date -u +%Y-%m-%dT%H:%M:%SZ)"

WORK=$(mktemp -d)
chmod 755 "$WORK" # caddy validate runs as the caddy user and reads the candidate here
trap 'rm -rf "$WORK"' EXIT

# ── The internal network: remove only the port(s) that proxy to our socket ────────────────────
SERVE_BEFORE=$(serve_others_sha)
removed=0
for p in $(serve_our_ports); do
  tailscale serve --https="$p" off >/dev/null 2>&1 || die "could not remove staging's internal-network port"
  removed=$((removed + 1))
done
[ -z "$(serve_our_ports)" ] || die "staging's internal-network port is still there"
SERVE_AFTER=$(serve_others_sha)
[ "$SERVE_AFTER" = "$SERVE_BEFORE" ] || die "another internal-network route changed"
say "internal network: $removed port of staging removed; no other route changed (other routes sha256 before $SERVE_BEFORE after $SERVE_AFTER)"

# ── The Caddyfile: take our block out, validate, prove the others unchanged, reload ───────────
if grep -qxF "$MARK_BEGIN" "$CADDYFILE"; then
  PRE="/etc/caddy/Caddyfile.pre-undo-staging-$(date -u +%Y%m%dT%H%M%SZ)"
  cp -p "$CADDYFILE" "$PRE"
  say "Caddyfile copied before the undo: $PRE (sha256 $(sha "$PRE"))"
  other_block_hashes "$CADDYFILE" "$WORK/blocks.before"
  without_ours "$CADDYFILE" > "$WORK/candidate"
  other_block_hashes "$WORK/candidate" "$WORK/blocks.after"
  compare_blocks "$WORK/blocks.before" "$WORK/blocks.after" || die "another block would change"
  validate "$WORK/candidate" || die "caddy validate failed; the Caddyfile was not changed"
  site_hosts "$WORK/candidate" > "$WORK/hosts"
  site_codes "$WORK/hosts" "$WORK/codes.before"
  cat "$WORK/candidate" > "$CADDYFILE"
  if ! systemctl reload caddy; then
    cp -p "$PRE" "$CADDYFILE"
    systemctl reload caddy || true
    die "the reload failed; the pre-undo Caddyfile is back"
  fi
  sleep 2
  systemctl is-active --quiet caddy || die "caddy is not active after the reload"
  say "reload: done (systemctl reload caddy); caddy active"
  site_codes "$WORK/hosts" "$WORK/codes.after"
  compare_codes "$WORK/codes.before" "$WORK/codes.after" || die "another site stopped answering after the reload"
  say "other sites: every site that answered before the reload answers after it"
else
  say "Caddyfile: no staging block; nothing to take out"
fi

# ── The files and the log ─────────────────────────────────────────────────────────────────────
rm -rf "$STAGING_DIR"
if [ -e "$ACCESS_LOG" ]; then : > "$ACCESS_LOG"; fi
rm -f /var/log/caddy/still-here-staging.access-*.log /var/log/caddy/still-here-staging.access-*.log.gz
say "files: $STAGING_DIR removed; staging's access log emptied (left in place, 0 bytes)"

# ── Back to the backed-up state? ──────────────────────────────────────────────────────────────
NOW=$(sha "$CADDYFILE")
say "staging uninstall Caddyfile sha256 $NOW"
LAST_BACKUP=$(ls -1 /etc/caddy/Caddyfile.bak-staging-* 2>/dev/null | sort | tail -n 1 || true)
if [ -n "$LAST_BACKUP" ] && [ "$(sha "$LAST_BACKUP")" = "$NOW" ]; then
  say "Caddyfile identical to the backup $LAST_BACKUP: the server returned to its backed-up state"
else
  die "the Caddyfile differs from the install's backup"
fi
say "staging is gone: local port $(curl -s -o /dev/null -w '%{http_code}' "$LOCAL_URL/" || true), socket $([ -e "$SOCKET" ] && echo present || echo absent)"
say "== staging-uninstall.sh done"
