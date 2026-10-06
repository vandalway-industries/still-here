#!/usr/bin/env bash
# vandalwayind-public-uninstall.sh — the undo of deploy/vandalwayind-public-install.sh. Takes the
# public blocks out of /etc/caddy/Caddyfile (a timestamped copy is kept first), after
# `caddy validate` and a check that every other block is byte-identical; then a reload. The
# internal copy, its files and the counter stay as they are; the go-live reset is not undone (the
# counter keeps counting from it). It ends by comparing the Caddyfile with the public install's last
# backup: the same sha256, or it says so. Run on the server, as root, the same way as the install.
# (Jules, 2026-10-06)
set -euo pipefail

HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=deploy/lib/caddyfile.sh
. "$HERE/lib/caddyfile.sh"
PUB_BEGIN='# BEGIN vandalwayind public (deploy/vandalwayind-public-install.sh)'
PUB_END='# END vandalwayind public'
# the public blocks' addresses, matched exactly (one per block)
PUB_KEYS=$'vandalwayind.com\nwww.vandalwayind.com\nhttp://vandalwayind.com\nhttp://www.vandalwayind.com'

[ "$(id -u)" = 0 ] || die "run as root"
say "== vandalwayind-public-uninstall.sh, $(date -u +%Y-%m-%dT%H:%M:%SZ)"
grep -qxF "$PUB_BEGIN" "$CADDYFILE" || die "the public blocks are not there; nothing to undo"

WORK=$(mktemp -d)
chmod 755 "$WORK"
trap 'rm -rf "$WORK"' EXIT

site_hosts "$CADDYFILE" | awk -v keys="$PUB_KEYS" 'BEGIN { n = split(keys, k, "\n"); for (i = 1; i <= n; i++) { h = k[i]; sub(/^http:\/\//, "", h); ours[h] = 1 } } !($0 in ours)' > "$WORK/hosts"
site_codes "$WORK/hosts" "$WORK/codes.before"

COPY="/etc/caddy/Caddyfile.pre-undo-vandalwayind-public-$(date -u +%Y%m%dT%H%M%SZ)"
cp -p /etc/caddy/Caddyfile "$COPY"
say "Caddyfile copied before the undo: $COPY (sha256 $(sha "$COPY"))"

# The file without the public blocks (and the blank line the install puts before them).
CANDIDATE="$WORK/Caddyfile.candidate"
awk -v b="$PUB_BEGIN" -v e="$PUB_END" '
  { line[NR] = $0 }
  END {
    skip = 0
    for (i = 1; i <= NR; i++) {
      if (line[i] == b) { skip = 1; if (n > 0 && out[n] == "") n--; continue }
      if (skip) { if (line[i] == e) skip = 0; continue }
      out[++n] = line[i]
    }
    for (i = 1; i <= n; i++) print out[i]
  }' "$CADDYFILE" > "$CANDIDATE"
# The others: every block of the current file whose address is still there after the marked lines
# are taken out (the marks decide what is ours, whatever its blocks are called). Each must come
# through byte-identical.
block_hashes "$CANDIDATE" "$WORK/blocks.after"
block_hashes "$CADDYFILE" "$WORK/blocks.current"
awk -F'\t' 'NR == FNR { keep[$1] = 1; next } ($1 in keep)' "$WORK/blocks.after" "$WORK/blocks.current" > "$WORK/blocks.before"
say "the marked lines hold $(( $(wc -l < "$WORK/blocks.current") - $(wc -l < "$WORK/blocks.before") )) public blocks; $(wc -l < "$WORK/blocks.before") others"
validate "$CANDIDATE" || die "caddy validate failed; the Caddyfile was not changed"
say "caddy validate passed (the Caddyfile without the public blocks)"
compare_blocks "$WORK/blocks.before" "$WORK/blocks.after" || die "another block would change; the Caddyfile was not changed"
say "every other block byte-identical before and after"

cat "$CANDIDATE" > /etc/caddy/Caddyfile
if ! systemctl reload caddy; then
  cp -p "$COPY" /etc/caddy/Caddyfile; systemctl reload caddy || true
  die "the reload failed; the copy is back"
fi
sleep 2
systemctl is-active --quiet caddy || die "caddy is not active after the reload"
site_codes "$WORK/hosts" "$WORK/codes.after"
compare_codes "$WORK/codes.before" "$WORK/codes.after" || say "warning: a site that answered before does not answer now"

LAST=$(ls -1t /etc/caddy/Caddyfile.bak-vandalwayind-public-* 2>/dev/null | head -1 || true)
if [ -n "$LAST" ] && [ "$(sha "$LAST")" = "$(sha "$CADDYFILE")" ]; then
  say "the Caddyfile equals the public install's backup ($LAST): sha256 $(sha "$CADDYFILE")"
else
  say "the Caddyfile differs from the public install's backup: sha256 now $(sha "$CADDYFILE")"
fi
say "== vandalwayind-public-uninstall.sh done"
