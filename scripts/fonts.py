#!/usr/bin/env python3
"""Fetch and instance the four STILL HERE faces into src/fonts/.

Run once, by hand, when the faces change (never by the build, which stays offline):

    uv run --no-project --with fonttools==4.61.1 --with brotli==1.1.0 python3 scripts/fonts.py

Source: the official Google Fonts repository (github.com/google/fonts, ofl/), pinned to one
commit, each download checked against its SHA-256 below. Each variable master is cut into static
instances at exactly the weights DESIGN.md's typography tokens use (DESIGN.md § Typography: no
variable fonts; jsPDF needs static TrueType). Every face is written as TTF (the PDF) and WOFF2 (the
page), with the family's OFL beside it. Cormorant Garamond's cmap goes to src/fonts/coverage.json
for PRD R11's check. If a download fails or its checksum differs, the script stops; it never
substitutes a face. (Jules, 2026-10-04)
"""
import hashlib
import json
import sys
import urllib.request
from io import BytesIO
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

COMMIT = "9710da1eacb3be272583c3224dcb70f9da6eadbb"
RAW = f"https://raw.githubusercontent.com/google/fonts/{COMMIT}/ofl"
OUT = Path(__file__).resolve().parent.parent / "src" / "fonts"

WEIGHT_NAMES = {400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold"}

# family, google/fonts folder, variable file and its SHA-256, OFL.txt's SHA-256, file stem,
# pinned non-weight axes, the weights DESIGN.md's typography tokens use
FAMILIES = [
    ("Inter", "inter", "Inter[opsz,wght].ttf",
     "29160a80ff49ddcab2c97711247e08b1fab27a484a329ce8b813d820dc559031",
     "5b9321a4298cfeb6b34354164a1c3afc3db114569984c502b9b35d988fd58c57",
     "Inter", {"opsz": 14}, [400]),
    ("Inter Tight", "intertight", "InterTight[wght].ttf",
     "b81b73dcb64df3c230cabade7df6c5773bf863233f24c9ee51087519f1f88b6f",
     "50240ab035cf1b6b3307940235481d515c4b6de3ab1fa843dbe59e7892cb9d58",
     "InterTight", {}, [600, 700]),
    ("JetBrains Mono", "jetbrainsmono", "JetBrainsMono[wght].ttf",
     "48715a42ec242c21e9f02692891e147d022299a52e48d5e413e1a942193ffeda",
     "b2fe5e8987594e9ffd1d2ca52a2f5d73eb8335243893c5d6254b5ad69269591d",
     "JetBrainsMono", {}, [500]),
    ("Cormorant Garamond", "cormorantgaramond", "CormorantGaramond[wght].ttf",
     "b20b7d9626dd956b2c5e558692ad328b1f19e3275e2782db4fa07670d83f35e0",
     "60700d351cac4650c51f3f9db318d2a420f8b45052dba2715eb5fec41f0f6956",
     "CormorantGaramond", {}, [500, 600]),
]


def fetch(url: str, want: str) -> bytes:
    try:
        with urllib.request.urlopen(url.replace("[", "%5B").replace("]", "%5D"), timeout=60) as r:
            data = r.read()
    except Exception as e:  # noqa: BLE001
        sys.exit(f"unreachable: {url} ({e}); stopping, no face is substituted")
    got = hashlib.sha256(data).hexdigest()
    if got != want:
        sys.exit(f"checksum differs for {url}: {got} (lock says {want}); stopping")
    return data


def set_names(font: TTFont, family: str, weight: int) -> None:
    style = WEIGHT_NAMES[weight]
    ps = f"{family.replace(' ', '')}-{style}"
    name = font["name"]
    # Drop names the variable font used for its axes and instances; keep the rest (copyright,
    # licence, designer, vendor).
    for rec in list(name.names):
        if rec.nameID in (1, 2, 3, 4, 6, 16, 17, 21, 22, 25) or rec.nameID >= 256:
            name.names.remove(rec)
    # RIBBI names: Regular and Bold sit in the family itself; other weights get their own.
    rib = family if weight in (400, 700) else f"{family} {style}"
    name.setName(rib, 1, 3, 1, 0x409)
    name.setName("Bold" if weight == 700 else "Regular", 2, 3, 1, 0x409)
    name.setName(f"{ps};{COMMIT[:7]}", 3, 3, 1, 0x409)
    name.setName(f"{family} {style}", 4, 3, 1, 0x409)
    name.setName(ps, 6, 3, 1, 0x409)
    name.setName(family, 16, 3, 1, 0x409)
    name.setName(style, 17, 3, 1, 0x409)
    font["OS/2"].usWeightClass = weight
    sel = font["OS/2"].fsSelection & ~0b1100001  # clear italic, bold, regular
    sel |= 0b100000 if weight == 700 else 0b1000000
    font["OS/2"].fsSelection = sel
    font["head"].macStyle = 1 if weight == 700 else 0
    if "STAT" in font:
        del font["STAT"]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for family, folder, var_file, var_sha, ofl_sha, stem, axes, weights in FAMILIES:
        var = fetch(f"{RAW}/{folder}/{var_file}", var_sha)
        ofl = fetch(f"{RAW}/{folder}/OFL.txt", ofl_sha)
        (OUT / f"{stem}-OFL.txt").write_bytes(ofl)
        for w in weights:
            vf = TTFont(BytesIO(var), recalcTimestamp=False)  # reproducible output
            static = instancer.instantiateVariableFont(vf, {**axes, "wght": w})
            set_names(static, family, w)
            base = OUT / f"{stem}-{WEIGHT_NAMES[w]}"
            static.flavor = None
            static.save(f"{base}.ttf")
            static.flavor = "woff2"
            static.save(f"{base}.woff2")
            print(f"wrote {base.name}.ttf and .woff2")

    # Cormorant Garamond's cmap, for PRD R11 (a name is vector text only if every character is in
    # the face). One entry per TTF, as sorted code points with their U+ form.
    cov = {"generated_by": "scripts/fonts.py", "source_commit": COMMIT, "faces": {}}
    for p in sorted(OUT.glob("CormorantGaramond-*.ttf")):
        cmap = sorted(TTFont(p).getBestCmap().keys())
        cov["faces"][p.name] = [f"U+{c:04X}" for c in cmap]
    (OUT / "coverage.json").write_text(json.dumps(cov, indent=1) + "\n")
    print("wrote coverage.json")


if __name__ == "__main__":
    main()
