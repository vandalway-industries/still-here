# deploy/lib/staging.sh — shared by deploy/staging-install.sh and its undo. Sourced, not run.
# Uses the Caddyfile helpers of deploy/lib/caddyfile.sh with staging's own marks, socket, local
# address and log, so every check the internal copy of vandalwayind.com passed applies here
# unchanged. Prints only hashes, counts, status codes and labels. (Jules, 2026-10-06)

# shellcheck source=deploy/lib/caddyfile.sh
. "$(dirname "${BASH_SOURCE[0]}")/caddyfile.sh"

MARK_BEGIN='# BEGIN still-here-staging (deploy/staging-install.sh)'
MARK_END='# END still-here-staging'
STAGING_DIR=/srv/still-here-staging
SITE_DIR=$STAGING_DIR/site
SOCKET=$STAGING_DIR/.run/caddy.sock
LOCAL_URL=http://localhost:18998
ACCESS_LOG=/var/log/caddy/still-here-staging.access.log

# Research 3's URL table, asked through the socket (as the internal network asks). One line per row.
url_table() {
  local base=http://localhost
  c() { curl -s -o /dev/null -w '%{http_code}' --unix-socket "$SOCKET" "$base$1"; }
  say "url table: /index $(c /index), /index.html $(c /index.html), /index/ $(c /index/), /research $(c /research) (location $(curl -s -o /dev/null -w '%{redirect_url}' --unix-socket "$SOCKET" http://localhost/research | sed -E 's#^https?://[^/]*##')), /research/ $(c /research/), /no-such-page $(c /no-such-page), /company/tracker/TRACKER.md $(c /company/tracker/TRACKER.md)"
  say "presence.json: $(c /api/v1/presence.json), access-control-allow-origin $(curl -s -D - -o /dev/null --unix-socket "$SOCKET" http://localhost/api/v1/presence.json | tr -d '\r' | awk -F': ' 'tolower($1) == "access-control-allow-origin" { print $2 }')"
}
