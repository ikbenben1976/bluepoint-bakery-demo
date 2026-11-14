#!/usr/bin/env python3
"""Reproduce the 47 visually reviewed Breads candidates (not generated SKU photographs).

The source photographs, crop polygons, legacy illustration subjects and sandwich
sheet are fixed inputs. Each SKU receives its own file path, and the companion
manifest records the difference between photograph / new illustration / old illustration.
Do not reuse this build for other website pages.
"""
from __future__ import annotations
import json
import re
import urllib.request
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public/images/catalog/reviewed-breads"
OUT.mkdir(parents=True,exist_ok=True)
CREAM="#f6f1e8"
CATS=("sandwich-rolls","french-breads","deli-loaves","pan-loaves","dinner-rolls","specialty-breads")
SRC_TITLE={
 "B02":"Philly, pumpkin, and club rolls",
 "B03":"Golden Parisien",
 "B04":"Marble rye",
 "B05":"Pan size variety",
 "B06":"Brioche dinner rolls",
 "B07":"16x4 loaf",
}
PAGE_GROUP={"sandwich-rolls":"B02","french-breads":"B03","deli-loaves":"B04",
 "pan-loaves":"B05","dinner-rolls":"B06","specialty-breads":"B07"}
POLYGONS={
 "B03-front":("B03",[(146,499),(163,475),(197,450),(255,413),(333,376),(420,330),(501,276),(574,235),(650,191),(714,164),(769,150),(786,157),(794,176),(787,197),(765,214),(716,249),(649,291),(575,336),(501,381),(420,423),(337,476),(260,527),(208,548),(164,548),(148,531)]),
 "B04-marble-slice":("B04",[(6,504),(19,469),(64,436),(117,415),(179,403),(250,407),(321,424),(381,457),(426,483),(464,528),(486,573),(489,634),(474,674),(439,712),(387,748),(335,759),(278,745),(212,722),(145,705),(81,688),(37,662),(8,622)]),
 "B05-white-slice":("B05",[(149,589),(164,565),(210,525),(252,501),(299,485),(349,515),(402,540),(443,575),(454,596),(448,622),(423,665),(382,706),(349,735),(295,746),(227,719),(166,670),(149,631)]),
 "B06-front":("B06",[(282,492),(290,460),(315,428),(350,401),(391,382),(436,377),(487,382),(530,400),(567,437),(587,479),(603,525),(596,567),(581,606),(549,644),(509,667),(461,676),(416,668),(371,654),(331,623),(304,585),(285,540)]),
 "B07-front":("B07",[(27,593),(49,561),(79,540),(122,522),(169,505),(238,501),(311,501),(392,498),(466,508),(531,526),(602,552),(653,585),(677,610),(691,648),(690,675),(675,705),(639,728),(562,752),(472,767),(391,769),(306,772),(222,766),(143,752),(80,728),(42,709),(29,678),(21,641)]),
}
# Products with actual first-party photographic pixels, not proof of pack size or exact SKU.
PHOTO_SKUS={
 "french-breads-golden-parisien-24-in":"B03-front",
 "deli-loaves-marble-rye":"B04-marble-slice",
 "pan-loaves-vienna-white":"B05-white-slice",
 "dinner-rolls-brioche-dozen":"B06-front",
 "dinner-rolls-brioche-case-120":"B06-front",
 "specialty-breads-16x4-vienna":"B07-front",
}
SANDWICH_CELL={
 "sandwich-rolls-hot-dog-6-in":(0,0),
 "sandwich-rolls-soft-hoagie-7-in":(1,0),
 "sandwich-rolls-philly-roll-6-in":(2,0),
 "sandwich-rolls-club-roll-6-in":(1,1),
 "sandwich-rolls-club-roll-6-in-sliced":(2,1),
 "sandwich-rolls-club-roll-8-in":(1,1),
 "sandwich-rolls-club-roll-8-in-sliced":(2,1),
}
assert len(PHOTO_SKUS)==6 and len(SANDWICH_CELL)==7

# Resolve image URLs from the actual Bluepoint first-party provenance ledger.
text=(ROOT/"docs/PHOTOS.md").read_text()
official={}
for code,title in SRC_TITLE.items():
    hit=re.search(r"\|\s*\["+re.escape(title)+r"\]\((https?://[^)]+)\)",text)
    if not hit:raise RuntimeError("Missing official image source "+title)
    official[code]=hit.group(1)
source_images={}
for code,url in official.items():
    request=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0","Referer":"https://www.bluepointbakery.com/"})
    with urllib.request.urlopen(request,timeout=45) as response: raw=response.read()
    im=Image.open(BytesIO(raw)).convert("RGB")
    im.thumbnail((800,800),Image.Resampling.LANCZOS)
    source_images[code]=im

# Read current original illustration subjects without changing their assignments elsewhere.
visual_code=(ROOT/"data/illustrative.ts").read_text()
legacy={}
for group_name,body in re.findall(r'^\s+"(product-[^"]+)":\s*\[([\s\S]*?)\]',visual_code,re.MULTILINE):
    for sku in re.findall(r'"([^"]+)"',body):
        if sku in legacy:raise RuntimeError("Duplicate original assignment "+sku)
        legacy[sku]=group_name
all_skus=sorted([sku for sku in legacy if any(sku.startswith(g+"-") for g in CATS)])
if len(all_skus)!=47:raise RuntimeError("Expected 47 product SKUs, got "+str(len(all_skus)))
if not set(PHOTO_SKUS).union(SANDWICH_CELL).issubset(set(all_skus)):
    raise RuntimeError("A reviewed photo assignment does not correspond to a catalog SKU")

def photo_object(subject):
    code,poly=POLYGONS[subject]
    im=source_images[code]
    mask=Image.new("L",im.size,0)
    ImageDraw.Draw(mask).polygon(poly,fill=255)
    mask=mask.filter(ImageFilter.GaussianBlur(1.1))
    bounds=mask.getbbox()
    if not bounds:raise RuntimeError("Blank photo extraction "+subject)
    bread=im.crop(bounds).convert("RGBA")
    bread.putalpha(mask.crop(bounds))
    ratio=min(740/bread.width,480/bread.height)
    bread=bread.resize((round(bread.width*ratio),round(bread.height*ratio)),Image.Resampling.LANCZOS)
    w,h=bread.size;left=480-w//2;top=352-h//2
    base=Image.new("RGBA",(960,720),CREAM)
    shadow=Image.new("RGBA",(960,720),(0,0,0,0))
    ImageDraw.Draw(shadow).ellipse((left+45,top+h-23,left+w-45,top+h+18),fill=(50,40,31,43))
    base=Image.alpha_composite(base,shadow.filter(ImageFilter.GaussianBlur(27)))
    base.alpha_composite(bread,(left,top))
    return base.convert("RGB")

sheet=Image.open(ROOT/"scripts/assets/sandwich-reviewed-sheet.webp").convert("RGB")
if sheet.width!=768 or sheet.height!=512:
    raise RuntimeError("Unexpected sandwich review master dimensions")
def sandwich_image(sku):
    col,row=SANDWICH_CELL[sku]
    part=sheet.crop((col*256,row*256,(col+1)*256,(row+1)*256))
    part=part.resize((720,720),Image.Resampling.LANCZOS)
    base=Image.new("RGB",(960,720),CREAM)
    base.paste(part,(120,0))
    return base

def legacy_image(sku):
    source=ROOT/"public/images/illustrative"/(legacy[sku]+".webp")
    if not source.exists():raise RuntimeError("Missing source artwork "+str(source))
    original=Image.open(source).convert("RGB")
    target=original.resize((864,648),Image.Resampling.LANCZOS)
    base=Image.new("RGBA",(960,720),CREAM)
    shade=Image.new("RGBA",(960,720),(0,0,0,0))
    ImageDraw.Draw(shade).rounded_rectangle((43,32,915,689),radius=9,fill=(35,27,20,18))
    base=Image.alpha_composite(base,shade.filter(ImageFilter.GaussianBlur(13)))
    result=base.convert("RGB")
    result.paste(target,(48,36))
    return result

manifest=[]
for sku in all_skus:
    group=next(g for g in CATS if sku.startswith(g+"-"))
    code=PAGE_GROUP[group]
    if sku in PHOTO_SKUS:
        source_object=PHOTO_SKUS[sku]
        image=photo_object(source_object)
        kind="original-photo-edited"
        src=official[POLYGONS[source_object][0]]
        verified=sku in ("french-breads-golden-parisien-24-in","deli-loaves-marble-rye","specialty-breads-16x4-vienna")
    elif sku in SANDWICH_CELL:
        image=sandwich_image(sku);kind="ai-illustrative-concept"
        src=official[code]
        source_object="AI studio review sheet cell "+str(SANDWICH_CELL[sku])
        verified=False
    else:
        image=legacy_image(sku);kind="legacy-illustration-reframed"
        src=official[code]
        source_object="public/images/illustrative/"+legacy[sku]+".webp"
        verified=False
    path=OUT/(sku+".webp")
    image.save(path,"WEBP",quality=87 if kind!="ai-illustrative-concept" else 90,method=6)
    if not path.stat().st_size>1000:raise RuntimeError("Empty file "+str(path))
    manifest.append({"productId":sku,"imageUrl":"/images/catalog/reviewed-breads/"+sku+".webp",
        "sourceUrl":src,"sourceObject":source_object,"kind":kind,
        "exactSkuVerified":verified,"category":group,"size":[960,720]})
(OUT/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")
print("Generated",len(manifest),"individual SKU paths,",
      {kind:sum(x["kind"]==kind for x in manifest) for kind in set(x["kind"] for x in manifest)})
