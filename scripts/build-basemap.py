#!/usr/bin/env python3
"""Build a self-hosted Front Range basemap from open data.

Terrain: AWS Terrain Tiles (Mapzen Terrarium), derived from SRTM (public domain).
Roads: OpenStreetMap via Overpass (ODbL).
No third-party requests at runtime; this runs once at build time.
"""

from __future__ import annotations

import json
import math
import urllib.request
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

NORTH, SOUTH, WEST, EAST = 41.32, 38.48, -106.40, -104.35
ZOOM = 10
OUT_DIR = Path(__file__).resolve().parents[1] / "public" / "geo"
IMG_PATH = Path(__file__).resolve().parents[1] / "public" / "images" / "front-range.jpg"
META_PATH = OUT_DIR / "front-range.json"

UA = "BluepointDemoBuild/1.0 (private local demo; one-time open-data basemap)"


def xtile(lon: float, n: int) -> float:
    return (lon + 180.0) / 360.0 * n


def ytile(lat: float, n: int) -> float:
    lr = math.radians(lat)
    return (1.0 - math.log(math.tan(lr) + 1.0 / math.cos(lr)) / math.pi) / 2.0 * n


def decode_terrarium(rgb: np.ndarray) -> np.ndarray:
    r = rgb[:, :, 0].astype(np.float32)
    g = rgb[:, :, 1].astype(np.float32)
    b = rgb[:, :, 2].astype(np.float32)
    return (r * 256.0 + g + b / 256.0) - 32768.0


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as response:
        return response.read()


def stitch_elevation() -> tuple[np.ndarray, int, int, int, int]:
    n = 2**ZOOM
    x0 = math.floor(xtile(WEST, n))
    x1 = math.floor(xtile(EAST, n))
    y0 = math.floor(ytile(NORTH, n))
    y1 = math.floor(ytile(SOUTH, n))
    tiles = []
    for y in range(y0, y1 + 1):
        row = []
        for x in range(x0, x1 + 1):
            url = f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{ZOOM}/{x}/{y}.png"
            print("tile", x, y)
            raw = fetch(url)
            img = Image.open(BytesIO(raw)).convert("RGB")
            row.append(np.asarray(img))
        tiles.append(np.concatenate(row, axis=1))
    mosaic = np.concatenate(tiles, axis=0)
    return decode_terrarium(mosaic), x0, y0, x1, y1


def hillshade(elev: np.ndarray) -> np.ndarray:
    cell = 90.0
    dzdx = (np.roll(elev, -1, axis=1) - np.roll(elev, 1, axis=1)) / (2 * cell)
    dzdy = (np.roll(elev, -1, axis=0) - np.roll(elev, 1, axis=0)) / (2 * cell)
    slope = np.arctan(np.hypot(dzdx, dzdy))
    aspect = np.arctan2(dzdy, -dzdx)
    zenith = math.radians(48)
    azimuth = math.radians(315)
    shade = np.cos(zenith) * np.cos(slope) + np.sin(zenith) * np.sin(slope) * np.cos(azimuth - aspect)
    shade = np.clip(shade, 0, 1)
    return shade


def colorize(elev: np.ndarray, shade: np.ndarray) -> Image.Image:
    """Paper plains, tan foothills, navy peaks. Hillshade keeps the ridges readable."""
    t = np.clip((elev - 1500.0) / (3400.0 - 1500.0), 0, 1)
    t = t**0.72
    plains = np.array([244, 236, 220], dtype=np.float32)
    foothill = np.array([176, 158, 112], dtype=np.float32)
    mountain = np.array([36, 48, 78], dtype=np.float32)
    color = np.empty(elev.shape + (3,), dtype=np.float32)
    low = t < 0.38
    high = ~low
    u = np.clip(t / 0.38, 0, 1)[..., None]
    v = np.clip((t - 0.38) / 0.62, 0, 1)[..., None]
    color[low] = plains + (foothill - plains) * u[low]
    color[high] = foothill + (mountain - foothill) * v[high]
    light = (0.38 + 0.82 * shade)[..., None]
    color *= light
    color = np.clip(color, 0, 255).astype(np.uint8)
    return Image.fromarray(color, mode="RGB")


def crop_to_bbox(image: Image.Image, x0: int, y0: int, x1: int, y1: int) -> Image.Image:
    n = 2**ZOOM
    tile = 256
    full_w = (x1 - x0 + 1) * tile
    full_h = (y1 - y0 + 1) * tile
    px0 = int(round((xtile(WEST, n) - x0) * tile))
    px1 = int(round((xtile(EAST, n) - x0) * tile))
    py0 = int(round((ytile(NORTH, n) - y0) * tile))
    py1 = int(round((ytile(SOUTH, n) - y0) * tile))
    px0 = max(0, min(full_w - 1, px0))
    px1 = max(px0 + 1, min(full_w, px1))
    py0 = max(0, min(full_h - 1, py0))
    py1 = max(py0 + 1, min(full_h, py1))
    return image.crop((px0, py0, px1, py1))


def fetch_highways() -> list[dict]:
    query = """
    [out:json][timeout:90];
    (
      way["highway"="motorway"](38.45,-106.45,41.35,-104.15);
      way["highway"="motorway_link"]["ref"~"I ?76|I ?70|I ?25"](38.45,-106.45,41.35,-104.15);
    );
    out geom;
    """
    data = urllib.parse.urlencode({"data": query}).encode()
    req = urllib.request.Request(
        "https://overpass-api.de/api/interpreter",
        data=data,
        headers={"User-Agent": UA},
    )
    print("overpass")
    with urllib.request.urlopen(req, timeout=120) as response:
        payload = json.loads(response.read().decode())
    ways = []
    for element in payload.get("elements", []):
        if element.get("type") != "way":
            continue
        geom = element.get("geometry") or []
        if len(geom) < 2:
            continue
        tags = element.get("tags") or {}
        ways.append(
            {
                "ref": tags.get("ref", ""),
                "coords": [[pt["lon"], pt["lat"]] for pt in geom],
            }
        )
    return ways


def project_factory(width: int, height: int):
    def y_merc(lat: float) -> float:
        s = math.sin(math.radians(lat))
        return math.log((1 + s) / (1 - s)) / 2

    north_y = y_merc(NORTH)
    south_y = y_merc(SOUTH)

    def project(lon: float, lat: float) -> tuple[float, float]:
        x = (lon - WEST) / (EAST - WEST) * width
        y = (north_y - y_merc(lat)) / (north_y - south_y) * height
        return x, y

    return project


def draw_roads(base: Image.Image, ways: list[dict]) -> None:
    draw = ImageDraw.Draw(base)
    project = project_factory(base.width, base.height)
    for way in ways:
        ref = way["ref"].replace(" ", "")
        pts = [project(lon, lat) for lon, lat in way["coords"]]
        if ref in {"I-25", "I25"}:
            color, width = (13, 13, 37), 4
        elif ref in {"I-70", "I70"}:
            color, width = (246, 102, 49), 4
        elif ref in {"I-76", "I76"}:
            color, width = (32, 53, 232), 3
        else:
            color, width = (90, 84, 72), 2
        draw.line(pts, fill=color, width=width, joint="curve")


def simplify(coords: list[list[float]], step: int) -> list[list[float]]:
    if len(coords) <= 2:
        return coords
    slim = coords[::step]
    if slim[-1] != coords[-1]:
        slim.append(coords[-1])
    return slim


BAKERY_LON, BAKERY_LAT = -104.9476617, 39.7893685


def endpoint_dist(a: list[float], b: list[float]) -> float:
    return math.hypot(a[0] - b[0], a[1] - b[1])


def stitch(segments: list[list[list[float]]], tol: float = 0.03) -> list[list[list[float]]]:
    unused = [list(seg) for seg in segments if len(seg) >= 2]
    lines: list[list[list[float]]] = []
    while unused:
        line = unused.pop(0)
        grew = True
        while grew:
            grew = False
            for index, seg in enumerate(unused):
                if endpoint_dist(line[-1], seg[0]) < tol:
                    line.extend(seg[1:])
                elif endpoint_dist(line[-1], seg[-1]) < tol:
                    line.extend(reversed(seg[:-1]))
                elif endpoint_dist(line[0], seg[-1]) < tol:
                    line = seg[:-1] + line
                elif endpoint_dist(line[0], seg[0]) < tol:
                    line = list(reversed(seg[1:])) + line
                else:
                    continue
                unused.pop(index)
                grew = True
                break
        if len(line) >= 4:
            lines.append(line)
    lines.sort(key=len, reverse=True)
    return lines


def split_from_bakery(line: list[list[float]]) -> list[list[list[float]]]:
    bakery = [BAKERY_LON, BAKERY_LAT]
    index = min(range(len(line)), key=lambda i: endpoint_dist(line[i], bakery))
    outward = []
    west = list(reversed(line[: index + 1]))
    east = line[index:]
    if len(west) >= 2:
        outward.append(west)
    if len(east) >= 2:
        outward.append(east)
    return outward


def path_d(coords: list[list[float]], project) -> str:
    pts = [project(lon, lat) for lon, lat in coords]
    if not pts:
        return ""
    parts = [f"M{pts[0][0]:.1f} {pts[0][1]:.1f}"]
    parts.extend(f"L{x:.1f} {y:.1f}" for x, y in pts[1:])
    return " ".join(parts)


def main() -> None:
    import urllib.parse  # noqa: F401 — used in fetch_highways via module global

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    elev, x0, y0, x1, y1 = stitch_elevation()
    print("elevation", elev.shape, "min", float(elev.min()), "max", float(elev.max()))
    shade = hillshade(elev)
    colored = colorize(elev, shade)
    colored = crop_to_bbox(colored, x0, y0, x1, y1)
    colored = colored.filter(ImageFilter.SMOOTH_MORE)
    target_w = 1400
    target_h = max(1, int(round(colored.height * (target_w / colored.width))))
    colored = colored.resize((target_w, target_h), Image.Resampling.LANCZOS)
    try:
        ways = fetch_highways()
        print("ways", len(ways))
    except Exception as error:  # noqa: BLE001 — build should still emit terrain
        print("overpass failed", error)
        ways = []
    if ways:
        draw_roads(colored, ways)
    # Colorado–Wyoming line, a real border just south of Cheyenne.
    border = ImageDraw.Draw(colored)
    project = project_factory(colored.width, colored.height)
    bx0, by = project(WEST, 41.0)
    bx1, _ = project(EAST, 41.0)
    border.line([(bx0, by), (bx1, by)], fill=(13, 13, 37), width=1)
    colored.save(IMG_PATH, "JPEG", quality=74, optimize=True, progressive=True)

    attribution = (
        "Terrain: AWS Terrain Tiles (Mapzen Terrarium / SRTM, public domain). "
        "Roads © OpenStreetMap contributors (ODbL)."
    )
    def has_ref(way: dict, aliases: set[str]) -> bool:
        parts = {part.upper() for part in way["ref"].upper().replace(" ", "").split(";") if part}
        return bool(parts & aliases)

    road_paths = []
    for ref, aliases in (
        ("I-25", {"I-25", "I25"}),
        ("I-70", {"I-70", "I70"}),
        ("I-76", {"I-76", "I76"}),
    ):
        segments = [way["coords"] for way in ways if has_ref(way, aliases)]
        for line in stitch(segments)[:3]:
            slim = simplify(line, 2)
            for branch in split_from_bakery(slim):
                d = path_d(simplify(branch, 1), project)
                if d:
                    road_paths.append({"ref": ref, "d": d})
    meta = {
        "width": colored.width,
        "height": colored.height,
        "north": NORTH,
        "south": SOUTH,
        "west": WEST,
        "east": EAST,
        "image": "/images/front-range.jpg",
        "roads": road_paths,
        "attribution": attribution,
    }
    META_PATH.write_text(json.dumps(meta))
    ts_path = Path(__file__).resolve().parents[1] / "data" / "basemap.ts"
    road_literal = ",\n".join(
        "  { ref: " + json.dumps(road["ref"]) + ", d: " + json.dumps(road["d"]) + " }"
        for road in road_paths
    )
    ts_path.write_text(
        "/** Generated by scripts/build-basemap.py. Do not edit by hand. */\n"
        "export const BASEMAP = {\n"
        f"  width: {colored.width},\n"
        f"  height: {colored.height},\n"
        f"  north: {NORTH},\n"
        f"  south: {SOUTH},\n"
        f"  west: {WEST},\n"
        f"  east: {EAST},\n"
        '  src: "/images/front-range.jpg",\n'
        f"  attribution: {json.dumps(attribution)},\n"
        "  roads: [\n"
        f"{road_literal}\n"
        "  ],\n"
        "} as const;\n"
    )
    print("wrote", IMG_PATH, IMG_PATH.stat().st_size, colored.size, "roads", len(road_paths))


if __name__ == "__main__":
    main()
