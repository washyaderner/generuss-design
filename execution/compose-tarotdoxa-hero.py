#!/usr/bin/env python3
"""
Compose the Tarotdoxa bento-card hero banner.

Faithfully reproduces the live tarotdoxa.com hero: the painterly dancer
(presence-hero.jpg) as a full-bleed background with the jewel-tone TAROTDOXA
wordmark (wordmark-cut.png, transparent) centered on top. Output is a clean
16:9 webp for the dedicated Tarotdoxa card in generuss-design/connect.astro.

Sources live in tarotdoxa-site; output lands in generuss-design/public.
Re-run freely with --mark-frac / --y-bias to tune the wordmark size/position.
"""
import argparse
from pathlib import Path
from PIL import Image

BUILD = Path("/Users/studio/Build")
BG_SRC = BUILD / "tarotdoxa-site/public/presence-hero.jpg"          # 1248x768 dancer
MARK_SRC = BUILD / "tarotdoxa-site/public/wordmark-cut.png"          # 1600x640 transparent wordmark
OUT = BUILD / "generuss-design/public/images/slides/tarotdoxa-hero.webp"


def cover_resize(img: Image.Image, tw: int, th: int) -> Image.Image:
    """Scale to cover (tw x th) preserving aspect, center-crop the overflow."""
    sw, sh = img.size
    scale = max(tw / sw, th / sh)
    nw, nh = round(sw * scale), round(sh * scale)
    img = img.resize((nw, nh), Image.LANCZOS)
    left, top = (nw - tw) // 2, (nh - th) // 2
    return img.crop((left, top, left + tw, top + th))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--w", type=int, default=1280)
    ap.add_argument("--h", type=int, default=720)
    ap.add_argument("--mark-frac", type=float, default=0.78,
                    help="wordmark width as fraction of canvas width")
    ap.add_argument("--y-bias", type=int, default=0,
                    help="vertical nudge for the wordmark in px (negative = up)")
    ap.add_argument("--quality", type=int, default=88)
    args = ap.parse_args()

    W, H = args.w, args.h

    bg = Image.open(BG_SRC).convert("RGB")
    canvas = cover_resize(bg, W, H).convert("RGBA")

    mark = Image.open(MARK_SRC).convert("RGBA")
    mw = round(W * args.mark_frac)
    mh = round(mark.size[1] * (mw / mark.size[0]))
    mark = mark.resize((mw, mh), Image.LANCZOS)

    mx = (W - mw) // 2
    my = (H - mh) // 2 + args.y_bias
    canvas.alpha_composite(mark, (mx, my))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(OUT, "WEBP", quality=args.quality, method=6)

    kb = OUT.stat().st_size / 1024
    print(f"wrote {OUT}  {W}x{H}  mark {mw}x{mh} @ ({mx},{my})  {kb:.0f}KB")


if __name__ == "__main__":
    main()
