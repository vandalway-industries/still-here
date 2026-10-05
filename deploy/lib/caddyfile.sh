# deploy/lib/caddyfile.sh — shared by deploy/vandalwayind-install.sh and its undo.
# Sourced, not run. Every function prints only what the deploy log may hold: hashes, counts,
# status codes and labels. No site address, host name, IP address or port is ever printed.
# (Jules, 2026-10-05)

CADDYFILE=/etc/caddy/Caddyfile
MARK_BEGIN='# BEGIN vandalwayind (deploy/vandalwayind-install.sh)'
MARK_END='# END vandalwayind'
SOCKET=/srv/vandalwayind/.run/caddy.sock
LOCAL_URL=http://localhost:18997
ACCESS_LOG=/var/log/caddy/vandalwayind.access.log

say() { printf '%s\n' "$*"; }
die() { printf 'stopped: %s\n' "$*" >&2; exit 1; }
sha() { sha256sum "$1" | cut -d' ' -f1; }

# The file without the vandalwayind block (and the blank line the install puts before it).
without_ours() {
  awk -v b="$MARK_BEGIN" -v e="$MARK_END" '
    { line[NR] = $0 }
    END {
      skip = 0
      for (i = 1; i <= NR; i++) {
        if (line[i] == b) { skip = 1; if (n > 0 && out[n] == "") n--; continue }
        if (skip) { if (line[i] == e) skip = 0; continue }
        out[++n] = line[i]
      }
      for (i = 1; i <= n; i++) print out[i]
    }' "$1"
}

# Split a Caddyfile into its top-level blocks, one file per block in $2, and write an index
# "<n><TAB><address><TAB><file>" to $2/index. The index stays on the server, in a temporary folder.
split_blocks() {
  local src=$1 dir=$2
  mkdir -p "$dir"
  awk -v dir="$dir" '
    function strip(s) { sub(/(^|[ \t])#.*$/, "", s); return s }
    {
      s = strip($0)
      if (depth == 0 && s ~ /\{[ \t]*$/) {
        n++
        key = s; sub(/[ \t]*\{[ \t]*$/, "", key); sub(/^[ \t]+/, "", key)
        if (key == "") key = "(global options)"
        file = dir "/block-" n
        printf "%d\t%s\t%s\n", n, key, file > (dir "/index")
      }
      if (depth > 0 || s ~ /\{[ \t]*$/) print $0 > file
      o = gsub(/\{/, "{", s); c = gsub(/\}/, "}", s)
      depth += o - c
      if (depth == 0 && file != "") { close(file); file = "" }
    }' "$src"
  touch "$dir/index"
}

# Hash every block of $1 into $2 as "<address><TAB><sha256>" (kept on the server).
block_hashes() {
  local src=$1 out=$2 dir
  dir=$(mktemp -d)
  split_blocks "$src" "$dir"
  while IFS=$'\t' read -r _ key file; do
    printf '%s\t%s\n' "$key" "$(sha256sum "$file" | cut -d' ' -f1)"
  done < "$dir/index" > "$out"
  rm -rf "$dir"
}

# Hash every block of $1 except the vandalwayind block itself into $2 (kept on the server).
other_block_hashes() {
  block_hashes "$1" "$2.all"
  awk -F'\t' -v ours="$LOCAL_URL" '$1 != ours' "$2.all" > "$2"
  rm -f "$2.all"
}

# Compare two block-hash files of the OTHER blocks. Prints one line per block, labelled by its
# order (global-options, site-01, site-02, …), never by its address. Fails if any block differs,
# is missing, or is new.
compare_blocks() {
  local before=$1 after=$2 n=0 bad=0 key b a label
  while IFS=$'\t' read -r key b; do
    if [ "$key" = "(global options)" ]; then label=global-options; else n=$((n + 1)); label=$(printf 'site-%02d' "$n"); fi
    a=$(awk -F'\t' -v k="$key" '$1 == k { print $2; exit }' "$after")
    [ -n "$a" ] || { a=missing; bad=1; }
    [ "$a" = "$b" ] || bad=1
    say "block $label sha256 before $b after $a"
  done < "$before"
  [ "$(wc -l < "$before")" = "$(wc -l < "$after")" ] || { say "block count differs: before $(wc -l < "$before") after $(wc -l < "$after")"; bad=1; }
  return $bad
}

# The other sites' first addresses, for the "still answering" check (kept on the server).
site_hosts() {
  local dir
  dir=$(mktemp -d)
  split_blocks "$1" "$dir"
  awk -F'\t' '$2 != "(global options)" { split($2, a, /[ ,]+/); h = a[1]; sub(/^https?:\/\//, "", h); print h }' "$dir/index"
  rm -rf "$dir"
}

# One status code per other site, in order, into $2 (kept on the server).
site_codes() {
  local h
  while read -r h; do
    curl -s -o /dev/null --max-time 15 --proto-default https -w '%{http_code}\n' "$h/" || printf '000\n'
  done < "$1" > "$2"
}

# Fails if a site that answered before does not answer now. Prints labels and codes only.
compare_codes() {
  local before=$1 after=$2 i=0 bad=0 b a
  while read -r b; do
    i=$((i + 1))
    a=$(sed -n "${i}p" "$after")
    say "site-$(printf '%02d' "$i") answers: before $b after $a"
    if [ "$b" != 000 ] && [ "$a" = 000 ]; then bad=1; fi
  done < "$before"
  return $bad
}

# caddy validate, as the caddy user would run it; prints "caddy validate: <its last line>".
validate() {
  local f=$1 out
  chmod 644 "$f"
  if out=$(runuser -u caddy -- env HOME=/var/lib/caddy caddy validate --adapter caddyfile --config "$f" 2>/dev/null | tail -n 1); then
    say "caddy validate: $out"
    [ "$out" = "Valid configuration" ]
  else
    say "caddy validate: failed"
    return 1
  fi
}

# The internal network's serve settings, minus any port that proxies to our socket, hashed.
serve_others_sha() {
  tailscale serve status --json 2>/dev/null | node -e '
    let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
      const j = s.trim() ? JSON.parse(s) : {};
      const ours = new Set();
      for (const [k, v] of Object.entries(j.Web ?? {}))
        for (const h of Object.values(v.Handlers ?? {})) if (h.Proxy === "unix:" + process.argv[1]) ours.add(k.split(":").pop());
      for (const p of ours) delete (j.TCP ?? {})[p];
      for (const k of Object.keys(j.Web ?? {})) if (ours.has(k.split(":").pop())) delete j.Web[k];
      process.stdout.write(JSON.stringify(j));
    });' "$SOCKET" | sha256sum | cut -d' ' -f1
}

# The ports that proxy to our socket (kept on the server).
serve_our_ports() {
  tailscale serve status --json 2>/dev/null | node -e '
    let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
      const j = s.trim() ? JSON.parse(s) : {};
      for (const [k, v] of Object.entries(j.Web ?? {}))
        for (const h of Object.values(v.Handlers ?? {})) if (h.Proxy === "unix:" + process.argv[1]) console.log(k.split(":").pop());
    });' "$SOCKET" | sort -u
}

# Every port the internal network serves on (kept on the server).
serve_all_ports() {
  tailscale serve status --json 2>/dev/null | node -e '
    let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
      const j = s.trim() ? JSON.parse(s) : {};
      for (const p of Object.keys(j.TCP ?? {})) console.log(p);
    });'
}
