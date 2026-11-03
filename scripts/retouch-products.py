#!/usr/bin/env python3
"""Cut product photos off the checkered cloth and set them on one studio ground.

Originals stay in business_ideas/bluepoint/photos/originals.
"""

from __future__ import annotations

import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[2]
ORIGINALS = ROOT / "photos" / "originals"
STUDIO = ROOT / "demo" / "public" / "images" / "studio"
SCENES = ROOT / "demo" / "public" / "images" / "scenes"
CUTS = ROOT / "photos" / "cutouts"

# Cloth (and a few parchment close-ups used as product cards).
PRODUCTS = [
    "12--+Par+Bk+Baguette+_4_.jpg",
    "16x4+Loaf+_3_.jpg",
    "24--+Golden+Parisien+1.jpg",
    "3oz+Croissant+3.jpg",
    "4pk+Muffin+Variety+_1_.jpg",
    "4pk+Variety+_4_.jpg",
    "Brioche+Dinner+Rolls+4.jpg",
    "Cherry+Turnover+_5_.jpg",
    "Dipped+-+Undipped+_2_.jpg",
    "Dutch-Apple-Pie-1.jpg",
    "Iced-Ring--282-29.JPG",
    "Marble+Rye+TK+slice+_3_.jpg",
    "Marble+Rye+_2_.jpg",
    "Pan+Size+Variety+_3_.jpg",
    "Philly--Pump-and-Club--282-29.jpg",
    "Pump+Choc-+Loaf+and+Slice+_1_.jpg",
    "Scones-4b4a6de9.JPG",
    "Specialty+Variety+_1_.jpg",
    "Variety+Danish+1.jpg",
    "Variety+_2_.jpg",
    "Variety-2-6815e947-2bae6899.jpg",
    "IMG_1053.jpg",
    "IMG_1070.jpg",
    "IMG_1074.jpg",
]

SLUG = {
    "12--+Par+Bk+Baguette+_4_.jpg": "baguettes",
    "16x4+Loaf+_3_.jpg": "sixteen-loaf",
    "24--+Golden+Parisien+1.jpg": "parisien",
    "3oz+Croissant+3.jpg": "croissant",
    "4pk+Muffin+Variety+_1_.jpg": "muffins",
    "4pk+Variety+_4_.jpg": "brownies",
    "Brioche+Dinner+Rolls+4.jpg": "brioche-rolls",
    "Cherry+Turnover+_5_.jpg": "turnover",
    "Dipped+-+Undipped+_2_.jpg": "biscotti",
    "Dutch-Apple-Pie-1.jpg": "pie",
    "Iced-Ring--282-29.JPG": "iced-ring",
    "Marble+Rye+TK+slice+_3_.jpg": "marble-slice",
    "Marble+Rye+_2_.jpg": "marble-rye",
    "Pan+Size+Variety+_3_.jpg": "pan-loaves",
    "Philly--Pump-and-Club--282-29.jpg": "sandwich-rolls",
    "Pump+Choc-+Loaf+and+Slice+_1_.jpg": "quick-bread",
    "Scones-4b4a6de9.JPG": "scones",
    "Specialty+Variety+_1_.jpg": "specialty",
    "Variety+Danish+1.jpg": "danish",
    "Variety+_2_.jpg": "muffins-berry",
    "Variety-2-6815e947-2bae6899.jpg": "cookies",
    "IMG_1053.jpg": "sesame-bun",
    "IMG_1070.jpg": "round-bun",
    "IMG_1074.jpg": "split-bun",
}

CREAM = (246, 241, 232)


def defringe(image: Image.Image) -> Image.Image:
    """Pull blue cloth bleed off the cutout edge."""
    arr = np.array(image).astype(np.int16)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]
    blue = (rgb[:, :, 2] > rgb[:, :, 0] + 18) & (rgb[:, :, 2] > rgb[:, :, 1] + 8)
    edge = (alpha > 0) & (alpha < 250)
    kill = blue & edge
    alpha = alpha.copy()
    alpha[kill] = 0
    # soften a 1px fringe by shrinking alpha where neighbors are empty
    arr[:, :, 3] = np.clip(alpha, 0, 255)
    out = Image.fromarray(arr.astype(np.uint8), "RGBA")
    return out


def prepare_cut(src: Path, session) -> Image.Image:
    image = Image.open(src).convert("RGB")
    image = ImageOps.exif_transpose(image)
    image.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
    image = ImageEnhance.Color(image).enhance(1.04)
    image = ImageEnhance.Contrast(image).enhance(1.04)
    image = ImageEnhance.Sharpness(image).enhance(1.08)
    cut = remove(image, session=session)
    return defringe(cut)


def studio(cut: Image.Image, size: tuple[int, int] = (1200, 900)) -> Image.Image:
    alpha = cut.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise RuntimeError("empty cutout")
    cut = cut.crop(bbox)
    max_w = int(size[0] * 0.84)
    max_h = int(size[1] * 0.74)
    scale = min(max_w / cut.width, max_h / cut.height)
    cut = cut.resize((max(1, int(cut.width * scale)), max(1, int(cut.height * scale))), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", size, CREAM + (255,))
    x = (size[0] - cut.width) // 2
    y = (size[1] - cut.height) // 2 + int(size[1] * 0.02)
    shadow = Image.new("L", size, 0)
    draw = ImageDraw.Draw(shadow)
    foot = y + cut.height - 6
    rx = max(40, int(cut.width * 0.34))
    draw.ellipse((size[0] // 2 - rx, foot - 16, size[0] // 2 + rx, foot + 26), fill=110)
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    shade = Image.new("RGBA", size, (70, 48, 28, 0))
    shade.putalpha(shadow.point(lambda p: int(p * 0.55)))
    canvas.alpha_composite(shade)
    canvas.alpha_composite(cut, (x, y))
    return canvas.convert("RGB")


def main() -> None:
    STUDIO.mkdir(parents=True, exist_ok=True)
    CUTS.mkdir(parents=True, exist_ok=True)
    session = new_session("birefnet-general")
    for name in PRODUCTS:
        src = ORIGINALS / name
        slug = SLUG[name]
        print("cut", slug, flush=True)
        started = time.time()
        cut = prepare_cut(src, session)
        cut.save(CUTS / f"{slug}.png")
        frame = studio(cut)
        frame.save(STUDIO / f"{slug}.webp", "WEBP", quality=78, method=6)
        # wider hero plate for the Parisien
        if slug == "parisien":
            hero = studio(cut, (1600, 1000))
            hero.save(STUDIO / "parisien-hero.webp", "WEBP", quality=78, method=6)
        print("  ", round(time.time() - started, 1), "s", frame.size, flush=True)


if __name__ == "__main__":
    main()
