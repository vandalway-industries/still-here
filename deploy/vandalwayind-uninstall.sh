#!/usr/bin/env bash
# vandalwayind-uninstall.sh — the undo of deploy/vandalwayind-install.sh. Takes out everything the
# install added and returns the server to its backed-up state:
#   - the internal-network port that proxies to the site's socket (found by its target; no other
#     port or route is touched)
#   - vandalwayind-counter.timer and .service
#   - the vandalwayind block of /etc/caddy/Caddyfile (a timestamped copy is kept first), after
#     `caddy validate` and a check that every other block is byte-identical; then a reload
#   - /srv/vandalwayind/ and the site's access log
# It ends by comparing the Caddyfile with the install's backup: the same sha256, or it says so.
# Run on the server, as root, the same way as the install (no port needed). (Jules, 2026-10-05)
set -euo pipefail

HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=deploy/lib/caddyfile.sh
. "$HERE/lib/caddyfile.sh"

[ "$(id -u)" = 0 ] || die "run as root"
say "== vandalwayind-uninstall.sh, $(date -u +%Y-%m-%dT%H:%M:%SZ)"

WORK=$(mktemp -d)
chmod 755 "$WORK" # caddy validate runs as the caddy user and reads the candidate here
trap 'rm -rf "$WORK"' EXIT

# ── The internal network: remove only the port(s) that proxy to our socket ────────────────────
SERVE_BEFORE=$(serve_others_sha)
removed=0
for p in $(serve_our_ports); do
  tailscale serve --https="$p" off >/dev/null 2>&1 || die "could not remove the site's internal-network port"
  removed=$((removed + 1))
done
[ -z "$(serve_our_ports)" ] || die "the site's internal-network port is still there"
SERVE_AFTER=$(serve_others_sha)
[ "$SERVE_AFTER" = "$SERVE_BEFORE" ] || die "another internal-network route changed"
say "internal network: $removed port of the site removed; no other route changed (other routes sha256 before $SERVE_BEFORE after $SERVE_AFTER)"

# ── The counter's timer ───────────────────────────────────────────────────────────────────────
systemctl disable --now vandalwayind-counter.timer >/dev/null 2>&1 || true
systemctl stop vandalwayind-counter.service >/dev/null 2>&1 || true
rm -f /etc/systemd/system/vandalwayind-counter.timer /etc/systemd/system/vandalwayind-counter.service
rm -f /var/lib/systemd/timers/stamp-vandalwayind-counter.timer # the timer's last-run record (Persistent=true)
systemctl daemon-reload
systemctl reset-failed vandalwayind-counter.service vandalwayind-counter.timer >/dev/null 2>&1 || true
if systemctl list-timers --all --no-pager | grep -q vandalwayind-counter; then die "the timer is still listed"; fi
[ ! -e /var/lib/systemd/timers/stamp-vandalwayind-counter.timer ] || die "the timer's last-run record is still there"
say "timer: vandalwayind-counter.timer disabled and removed; systemctl list-timers no longer shows it"

# ── The Caddyfile: take our block out, validate, prove the others unchanged, reload ───────────
if grep -qxF "$MARK_BEGIN" "$CADDYFILE"; then
  PRE="/etc/caddy/Caddyfile.pre-undo-vandalwayind-$(date -u +%Y%m%dT%H%M%SZ)"
  cp -p /etc/caddy/Caddyfile "$PRE"
  say "Caddyfile copied before the undo: $PRE (sha256 $(sha "$PRE"))"
  other_block_hashes "$CADDYFILE" "$WORK/blocks.before"
  without_ours "$CADDYFILE" > "$WORK/candidate"
  other_block_hashes "$WORK/candidate" "$WORK/blocks.after"
  compare_blocks "$WORK/blocks.before" "$WORK/blocks.after" || die "another block would change"
  validate "$WORK/candidate" || die "caddy validate failed; the Caddyfile was not changed"
  site_hosts "$WORK/candidate" > "$WORK/hosts"
  site_codes "$WORK/hosts" "$WORK/codes.before"
  cat "$WORK/candidate" > /etc/caddy/Caddyfile
  if ! systemctl reload caddy; then
    cp -p "$PRE" /etc/caddy/Caddyfile
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
  say "Caddyfile: no vandalwayind block; nothing to take out"
fi

# ── The files and the log ─────────────────────────────────────────────────────────────────────
rm -rf /srv/vandalwayind
# Caddy 2.6.2 keeps a removed site's log file open until it restarts, and writes a re-added site's
# log to that same open file; a deleted log would leave the next install's log unreadable. So the
# log is emptied, not deleted, and any rolled copies are deleted.
if [ -e "$ACCESS_LOG" ]; then : > "$ACCESS_LOG"; fi
rm -f /var/log/caddy/vandalwayind.access-*.log /var/log/caddy/vandalwayind.access-*.log.gz
say "files: /srv/vandalwayind/ removed; the site's access log emptied (left in place, 0 bytes, for the reason above)"

# ── Back to the backed-up state? ──────────────────────────────────────────────────────────────
NOW=$(sha256sum "$CADDYFILE" | cut -d' ' -f1)
say "uninstall Caddyfile sha256 $NOW"
LAST_BACKUP=$(ls -1 /etc/caddy/Caddyfile.bak-vandalwayind-* 2>/dev/null | sort | tail -n 1 || true)
if [ -n "$LAST_BACKUP" ] && [ "$(sha "$LAST_BACKUP")" = "$NOW" ]; then
  say "Caddyfile identical to the backup $LAST_BACKUP: the server returned to its backed-up state"
else
  die "the Caddyfile differs from the install's backup"
fi
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
say "the site is gone: local port $(code "$LOCAL_URL/"), socket $([ -e "$SOCKET" ] && echo present || echo absent)"
say "== vandalwayind-uninstall.sh done"
