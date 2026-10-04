#!/usr/bin/env python3
"""Make the web copies of the photographs: every placement in garage/pack/ASSET_MANIFEST.md.

Reads the manifest's tables, takes each row's derivative widths, and writes WebP files named
`<id>-<width>.webp` under src/images/ (the id is the file's stem; the hero is `hero`), plus the one
Open Graph JPEG (`hero-og-1200.jpg`, 1200 x 630; named for the hero it is cut from). The hero is
cropped to the manifest's source box first.

Web copies carry no metadata (D21): images are re-encoded from pixels only, with no EXIF, XMP,
ICC or content-credential chunks, and each file is checked against 250 KB; quality steps down
until it fits. The originals in assets/ are only read.

Run by hand when the manifest or an original changes: `python3 scripts/derivatives.py`.
Needs Pillow. (Jules, 2026-10-04)
"""
import io
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / 'garage/pack/ASSET_MANIFEST.md'
ASSETS = ROOT / 'assets'
OUT = ROOT / 'src/images'
LIMIT = 250 * 1024

# The hero is cropped to the bracket area before it is scaled (ASSET_MANIFEST.md § The brand).
# The manifest's box (1008,162 -> 1550,834) cuts the callout ("ASSET 001 / FOL") and keeps the
# heading's last period at its left edge; this box holds the whole callout and none of the heading,
# at 4:5. Recorded for C2 so the manifest can follow.
HERO = 'still-here-hero-chair'
HERO_BOX = (1044, 110, 1656, 875)
SKIP = {'vandalway-industries-logo', 's09-sunday-market-1997'}  # the 1997 page's own (DS6)


def rows():
    """(stem, widths) for every manifest row naming a PNG."""
    header = None
    for line in MANIFEST.read_text().split('\n'):
        if not line.startswith('|'):
            header = None
            continue
        cells = [c.strip() for c in line.split('|')[1:-1]]
        if header is None:
            header = cells
            continue
        if re.fullmatch(r'-+', re.sub(r'[:\s]', '', cells[0])):
            continue
        m = re.search(r'`([^`]+\.png)`', cells[0])
        if not m:
            continue
        stem = m.group(1).split('/')[-1][:-4]
        col = next((i for i, h in enumerate(header) if re.fullmatch(r'Derivatives?', h)), -1)
        cell = cells[col] if col >= 0 else ''
        if stem in SKIP or not cell or re.search('none', cell, re.I):
            continue
        widths = [int(w) for w in re.findall(r'\b(\d{3,4})\b', re.split('Open Graph', cell, flags=re.I)[0])]
        yield stem, widths


def encode(img, fmt):
    """Pixels only, the best quality that fits in 250 KB."""
    for q in (84, 80, 76, 72, 68, 64, 60, 55, 50, 45, 40, 35, 30):
        buf = io.BytesIO()
        if fmt == 'webp':
            img.save(buf, 'WEBP', quality=q, method=6)
        else:
            img.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
        if buf.tell() <= LIMIT:
            return buf.getvalue()
    raise SystemExit(f'cannot fit {img.size} under 250 KB')


def clean(path):
    """A fresh RGB image from the original's pixels, so nothing of its metadata travels."""
    with Image.open(path) as im:
        im = im.convert('RGB')
        return Image.frombytes('RGB', im.size, im.tobytes())


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    wrote = []
    for stem, widths in rows():
        src = clean(ASSETS / f'{stem}.png')
        name = stem
        if stem == HERO:
            src = src.crop(HERO_BOX)
            name = 'hero'
        for w in widths:
            w = min(w, src.width)
            h = round(src.height * w / src.width)
            data = encode(src.resize((w, h), Image.LANCZOS), 'webp')
            (OUT / f'{name}-{w}.webp').write_bytes(data)
            wrote.append(f'{name}-{w}.webp ({len(data) // 1024} KB)')
    # the Open Graph image: the whole hero scaled to 1200 wide, trimmed evenly to 630 tall
    hero = clean(ASSETS / f'{HERO}.png')
    h = round(hero.height * 1200 / hero.width)
    og = hero.resize((1200, h), Image.LANCZOS)
    top = (h - 630) // 2
    og = og.crop((0, top, 1200, top + 630))
    data = encode(og, 'jpeg')
    (OUT / 'hero-og-1200.jpg').write_bytes(data)
    wrote.append(f'hero-og-1200.jpg ({len(data) // 1024} KB)')
    print('\n'.join(wrote))


if __name__ == '__main__':
    sys.exit(main())
