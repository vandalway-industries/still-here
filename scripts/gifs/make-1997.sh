#!/usr/bin/env bash
# make-1997.sh — draws the images of vandalwayind/ (the company page, 1997) with ImageMagick 6.
#
#   bash scripts/gifs/make-1997.sh
#
# Writes, under vandalwayind/:
#   images/bgtile.gif     the tiled background (96 x 96, seamless, two web-safe colours)
#   images/vilogo.gif     the company logo, 410 x 183, flattened onto the page colour, <= 64 colours
#   images/construct.gif  the under-construction sign (static)
#   images/netscape.gif   the "best viewed with Netscape" badge, 88 x 31, drawn here, not copied
#   images/email.gif      the e-mail icon, animated (four frames, looping)
#   images/s09mkt.jpg     the Sunday market photograph, 320 wide, no metadata, under 40 KB
#   cgi-bin/digits/0.gif … 9.gif   odometer digits for the hit counter
#   cgi-bin/counter.gif   the counter as served before counting starts: 000000
#
# Inputs: assets/brand/vandalway-industries-logo.png and assets/s09-sunday-market-1997.png.
# Palette: the 216-colour web-safe cube (00 33 66 99 CC FF) for everything drawn here.
# Deterministic: fixed seed, no timestamps written into the files.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/vandalwayind"
IMG="$OUT/images"
CGI="$OUT/cgi-bin"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$IMG" "$CGI/digits"

PAGE_BG='#FFFFFF'   # the page's BGCOLOR, under the tiles
NAVY='#000066'
GIF_OPTS=(-strip +set date:create +set date:modify)

# The tiled background: white paper with faint cream flecks, seamless (blur wraps at the edges).
convert -size 96x96 xc: -seed 1997 +noise Random -channel R -separate +channel \
  -virtual-pixel tile -blur 0x4 -auto-level -threshold 78% \
  +level-colors '#FFFFFF,#FFFFCC' -colors 2 "${GIF_OPTS[@]}" "$IMG/bgtile.gif"

# The logo, flattened onto the page colour at the size the page asks for (WIDTH=410 HEIGHT=183).
convert "$ROOT/assets/brand/vandalway-industries-logo.png" -background "$PAGE_BG" -flatten \
  -resize '410x183!' -colors 64 "${GIF_OPTS[@]}" "$IMG/vilogo.gif"

# Under construction: a yellow sign with a striped band top and bottom.
convert -size 16x8 xc:'#FFCC00' -fill black -draw 'polygon 0,8 4,0 8,0 4,8' \
  -draw 'polygon 8,8 12,0 16,0 12,8' "$TMP/stripe.png"
convert -size 170x8 tile:"$TMP/stripe.png" "$TMP/band.png"
convert -size 170x26 xc:'#FFCC00' -font Helvetica-Bold -pointsize 13 -fill black \
  -gravity center -annotate +0+1 'UNDER CONSTRUCTION' "$TMP/mid.png"
convert "$TMP/band.png" "$TMP/mid.png" "$TMP/band.png" -append \
  -bordercolor black -border 1 +antialias -colors 8 "${GIF_OPTS[@]}" "$IMG/construct.gif"

# The badge: 88 x 31, a grey raised button with a navy square and a drawn "N".
convert -size 88x31 xc:'#CCCCCC' \
  -fill white -draw 'line 0,0 87,0' -draw 'line 0,0 0,30' \
  -fill '#666666' -draw 'line 0,30 87,30' -draw 'line 87,0 87,30' \
  -fill "$NAVY" -draw 'rectangle 3,3 27,27' \
  -fill '#3399FF' -draw 'line 4,22 26,22' \
  -fill white -font Times-Bold -pointsize 22 -annotate +8+22 'N' \
  -fill black -font Helvetica -pointsize 9 -annotate +31+12 'best viewed' \
  -fill black -font Helvetica -pointsize 9 -annotate +31+20 'with' \
  -fill "$NAVY" -font Helvetica-Bold -pointsize 10 -annotate +31+28 'Netscape' \
  -colors 16 "${GIF_OPTS[@]}" "$IMG/netscape.gif"

# The e-mail icon: an envelope whose letter rises out of it and drops back, four frames, looping.
envelope() { # $1 = letter offset (pixels the letter shows above the envelope), $2 = out file
  local up=$1
  convert -size 36x30 xc:"$PAGE_BG" -transparent "$PAGE_BG" \
    -fill white -stroke black -strokewidth 1 \
    -draw "rectangle 9,$((14 - up)) 27,$((26 - up))" \
    -stroke '#999999' -draw "line 12,$((17 - up)) 24,$((17 - up))" -draw "line 12,$((20 - up)) 22,$((20 - up))" \
    -stroke black -fill '#FFFFCC' -draw 'rectangle 3,14 33,28' \
    -fill none -draw 'line 3,14 18,23' -draw 'line 33,14 18,23' \
    -draw 'line 3,28 14,20' -draw 'line 33,28 22,20' \
    +antialias "$2"
}
envelope 0 "$TMP/e0.png"
envelope 4 "$TMP/e1.png"
envelope 8 "$TMP/e2.png"
envelope 11 "$TMP/e3.png"
convert -dispose Background -loop 0 \
  -delay 60 "$TMP/e0.png" -delay 20 "$TMP/e1.png" "$TMP/e2.png" -delay 80 "$TMP/e3.png" \
  -colors 8 "${GIF_OPTS[@]}" "$IMG/email.gif"

# Odometer digits for the counter, and the counter as it stands before counting begins.
for d in 0 1 2 3 4 5 6 7 8 9; do
  convert -size 13x19 xc:black -fill '#33FF33' -font Courier-Bold -pointsize 17 \
    -gravity center -annotate +0+1 "$d" \
    -fill '#333333' -draw 'line 0,0 12,0' -draw 'line 0,18 12,18' \
    -colors 8 "${GIF_OPTS[@]}" "$CGI/digits/$d.gif"
done
convert "$CGI/digits/0.gif" "$CGI/digits/0.gif" "$CGI/digits/0.gif" \
  "$CGI/digits/0.gif" "$CGI/digits/0.gif" "$CGI/digits/0.gif" +append \
  -bordercolor '#666666' -border 1 -colors 8 "${GIF_OPTS[@]}" "$CGI/counter.gif"

# The Sunday market photograph: a small JPEG, as the page had it, with no metadata.
convert "$ROOT/assets/s09-sunday-market-1997.png" -resize 320x -strip -interlace none \
  -sampling-factor 2x2 -quality 72 "$IMG/s09mkt.jpg"

echo "1997 images written to vandalwayind/"
