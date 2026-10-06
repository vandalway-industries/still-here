#!/usr/bin/env bash
# vandalwayind-public-install.sh — puts vandalwayind.com on the public internet: go-live (N2).
# Its undo is deploy/vandalwayind-public-uninstall.sh, which takes the public blocks out again.
#
# Needs the internal copy installed first (deploy/vandalwayind-install.sh): this serves the same
# files, /srv/vandalwayind/, and writes the same access log, so the counter counts public visits.
# Run on the server, as root, from a copy of the repository's vandalwayind/ and deploy/ folders:
#
#   tar -czf - vandalwayind deploy | ssh <server> 'd=$(mktemp -d) && tar -xzf - -C "$d" &&
#     bash "$d/deploy/vandalwayind-public-install.sh"; rc=$?; rm -rf "$d"; exit $rc'
#
# What it changes, and nothing else:
#   - the site's files under /srv/vandalwayind/ refreshed from the repository (the counter's own
#     files under .counter/ and the socket under .run/ are kept)
#   - go-live: the running total reset to 0 from this moment, so loads made during internal testing
#     are not carried over; the page's counter line dated today; index.html dated back to 1997
#   - three blocks appended to /etc/caddy/Caddyfile between their own BEGIN and END marks, after a
#     timestamped backup, `caddy validate`, and a check that every other block is byte-identical;
#     then a reload. vandalwayind.com serves the site over HTTPS (Caddy obtains the certificate);
#     http:// and www answer 301 to https://vandalwayind.com/.
# It prints the deploy log's evidence only: hashes, codes, labels and the go-live line. Never a
# host name of another site, an address or a port. If another site stops answering after the
# reload, it puts the backed-up Caddyfile back, reloads, and stops. (Jules, 2026-10-06)
set -euo pipefail

HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
SRC=$(cd "$HERE/.." && pwd)
# shellcheck source=deploy/lib/caddyfile.sh
. "$HERE/lib/caddyfile.sh"
PUB_BEGIN='# BEGIN vandalwayind public (deploy/vandalwayind-public-install.sh)'
PUB_END='# END vandalwayind public'
PUB_KEYS='^(vandalwayind\.com|www\.vandalwayind\.com|http://vandalwayind\.com, http://www\.vandalwayind\.com)'
TOTAL=/srv/vandalwayind/.counter/total

[ "$(id -u)" = 0 ] || die "run as root"
[ -f "$SRC/vandalwayind/index.html" ] || die "run from a copy of vandalwayind/ and deploy/"
say "== vandalwayind-public-install.sh, $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# ── Preconditions ─────────────────────────────────────────────────────────────────────────────
grep -qxF "$MARK_BEGIN" "$CADDYFILE" || die "the internal copy is not installed; run deploy/vandalwayind-install.sh first"
grep -qxF "$PUB_BEGIN" "$CADDYFILE" && die "the public blocks are already there; run the undo first"
[ -f "$TOTAL" ] || die "the counter has no running total yet"
say "preconditions: the internal copy installed, no public block yet"

WORK=$(mktemp -d)
chmod 755 "$WORK" # caddy validate runs as the caddy user and reads the candidate here
trap 'rm -rf "$WORK"' EXIT

# Every block's hash except the public ones (the internal block is one of the "others" here).
public_free_hashes() { block_hashes "$1" "$2.all"; grep -Pv "$PUB_KEYS\t" "$2.all" > "$2" || true; rm -f "$2.all"; }

# ── Before ────────────────────────────────────────────────────────────────────────────────────
public_free_hashes "$CADDYFILE" "$WORK/blocks.before"
site_hosts "$CADDYFILE" > "$WORK/hosts"
site_codes "$WORK/hosts" "$WORK/codes.before"
say "before: $(wc -l < "$WORK/blocks.before") blocks hashed, $(wc -l < "$WORK/hosts") other sites checked"

BACKUP="/etc/caddy/Caddyfile.bak-vandalwayind-public-$(date -u +%Y%m%dT%H%M%SZ)"
cp -p /etc/caddy/Caddyfile "$BACKUP"
say "backup $BACKUP sha256 $(sha256sum "$BACKUP" | cut -d' ' -f1)"

# ── The files, refreshed; then go-live ────────────────────────────────────────────────────────
for f in "$SRC"/vandalwayind/*; do cp -R "$f" /srv/vandalwayind/; done
find /srv/vandalwayind -path /srv/vandalwayind/.run -prune -o -type d -exec chmod 755 {} + -o -type f -exec chmod 644 {} +
TODAY=$(date -u +%F)
WAS=$(cut -d' ' -f1 "$TOTAL")
# go-live: the total starts again at 0, counting only requests from this moment
printf '0 %s\n' "$(date -u +%s)" > "$TOTAL.next" && mv "$TOTAL.next" "$TOTAL"
SINCE=$(LC_ALL=C date -u '+%B %-d, %Y')
sed -i -E "s/times since [A-Z][a-z]+ [0-9]{1,2}, [0-9]{4}\./times since $SINCE./" /srv/vandalwayind/index.html
grep -qF "times since $SINCE." /srv/vandalwayind/index.html || die "the go-live date was not written into the page"
# Last-Modified as the page says, after the go-live edit: the page and its images 1997-08-22, the
# guestbook 1999-03-02.
touch -d '1997-08-22 12:00:00 UTC' /srv/vandalwayind/index.html /srv/vandalwayind/images/*
touch -d '1999-03-02 12:00:00 UTC' /srv/vandalwayind/cgi-bin/guestbook.html
node /srv/vandalwayind/.counter/count.mjs --log "$ACCESS_LOG" --total "$TOTAL" --gif /srv/vandalwayind/counter.gif
say "go-live $TODAY total $WAS -> 0"
say "files: refreshed; the page reads \"times since $SINCE.\"; page and images dated 1997-08-22, guestbook 1999-03-02; counter at $(cut -d' ' -f1 "$TOTAL")"

# ── The Caddyfile: append the public blocks, validate, prove the others unchanged, reload ─────
CANDIDATE="$WORK/Caddyfile.candidate"
{
  cat "$CADDYFILE"
  printf '\n%s\n' "$PUB_BEGIN"
  cat <<'CADDY'
# vandalwayind.com, public (N2). The same files and access log as the internal copy.
vandalwayind.com {
	root * /srv/vandalwayind
	@fresh path / /index.html /cgi-bin/guestbook.html /counter.gif
	header @fresh Cache-Control "no-cache"
	@write not method GET HEAD
	header @write Allow "GET, HEAD"
	respond @write 405
	@private path /.*
	respond @private 404
	file_server
	log {
		output file /var/log/caddy/vandalwayind.access.log {
			roll_keep_for 168h
		}
		format json
	}
}
www.vandalwayind.com {
	redir https://vandalwayind.com{uri} permanent
}
http://vandalwayind.com, http://www.vandalwayind.com {
	redir https://vandalwayind.com{uri} permanent
}
CADDY
  printf '%s\n' "$PUB_END"
} > "$CANDIDATE"
validate "$CANDIDATE" || die "caddy validate failed; the Caddyfile was not changed"
say "caddy validate passed (the Caddyfile with the public blocks)"
public_free_hashes "$CANDIDATE" "$WORK/blocks.after"
compare_blocks "$WORK/blocks.before" "$WORK/blocks.after" || die "another block would change; the Caddyfile was not changed"
say "vandalwayind.com public block: every other block byte-identical before and after"

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
say "reload: done; caddy active"
site_codes "$WORK/hosts" "$WORK/codes.after"
if ! compare_codes "$WORK/codes.before" "$WORK/codes.after"; then
  restore
  die "another site stopped answering after the reload; the backed-up Caddyfile is back"
fi
say "other sites: every site that answered before the reload answers after it"
say "Caddyfile now sha256 $(sha "$CADDYFILE")"
say "== vandalwayind-public-install.sh done"
