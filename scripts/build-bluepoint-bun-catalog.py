"""Produce first-party edited Bluepoint bun photos with traceable source coordinates.
Retouching is limited to extracting genuine pixels, background removal,
standard cream canvas and a photographic contact shadow. No generative product substitution.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from io import BytesIO
import shutil
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_ROOT = ROOT / "public/images/catalog"
CREAM = "#f6f1e8"
SOURCES = {
    "variety": "https://irp.cdn-website.com/59a1f314/dms3rep/multi/Specialty+Variety+%281%29.jpg",
    "sesame": "https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1053.jpg",
    "round": "https://irp-cdn.multiscreensite.com/59a1f314/dms3rep/multi/IMG_1070.jpg",
    "sandwich": "https://irp.cdn-website.com/59a1f314/dms3rep/multi/opt/Philly--Pump-and-Club--282-29-1920w.jpg",
}
# Polygon coordinates are in the source photograph's natural display reference frame.
# Individual visible objects A-E are documented in docs/PRODUCT-IMAGE-SKU-MAPPING-2026-11-14.md
OBJECTS = {
    "oat": ("variety", (1245,1247), [(346,939),(371,812),(448,741),(558,704),(690,713),(782,770),(826,908),(822,1030),(752,1130),(638,1187),(492,1183),(392,1113)]),
    "rounded": ("variety", (1245,1247), [(218,250),(235,166),(292,107),(401,92),(521,132),(602,208),(644,287),(641,364),(582,422),(468,455),(340,441),(257,387)]),
    "scored": ("variety", (1245,1247), [(537,508),(573,417),(666,352),(784,345),(881,378),(953,467),(967,569),(930,668),(847,723),(716,737),(620,701),(552,623)]),
    "smooth": ("variety", (1245,1247), [(40,612),(74,504),(158,429),(300,398),(422,407),(507,462),(539,554),(521,685),(460,763),(338,812),(199,804),(108,749)]),
    "right": ("variety", (1245,1247), [(849,850),(871,754),(954,681),(1071,652),(1162,693),(1229,777),(1244,909),(1220,1004),(1149,1048),(1019,1065),(924,1020),(857,951)]),
    "sesame": ("sesame", (480,640), [(4,395),(37,317),(112,279),(220,267),(341,272),(432,323),(465,413),(457,512),(409,577),(308,596),(143,588),(40,536)]),
    "plain": ("round", (640,480), [(124,232),(153,170),(237,131),(360,126),(436,162),(463,228),(452,279),(394,313),(277,325),(180,300)]),
    "club_front": ("sandwich", (1247,1247), [(89,865),(99,796),(160,732),(283,679),(431,647),(587,638),(689,651),(776,694),(813,750),(817,820),(784,889),(704,930),(579,975),(406,1010),(260,1039),(159,1028),(111,985)]),
    "philly_back": ("sandwich", (1247,1247), [(175,574),(189,516),(245,474),(365,443),(492,430),(564,439),(598,465),(625,523),(621,585),(600,639),(527,692),(410,722),(285,738),(210,701),(177,641)]),
}
# A distinct destination URL for each product, with explicitly intentional
# sharing between sizes and faithful legacy illustrations where no exact photo exists.
SKU_TO_SOURCE = {
    "buns-brioche-bun-4-in": ("photo", "smooth"),
    "buns-bp-hamburger-bun-4-in": ("photo", "plain"),
    "buns-plain-kaiser-4-in": ("photo", "scored"),
    "buns-sesame-kaiser-4-in": ("photo", "sesame"),
    "buns-cornmeal-kaiser-4-in": ("illustration", "product-kaiser-cornmeal"),
    "buns-oat-bun-4-in": ("photo", "oat"),
    "buns-potato-bun-4-in": ("illustration", "product-potato-bun"),
    "buns-picnic-bun-3-5-in": ("illustration", "product-plain-bun"),
    "buns-brioche-bun-5-in": ("photo", "smooth"),
    "buns-premium-brioche-bun": ("photo", "right"),
    "buns-plain-kaiser-5-in": ("photo", "scored"),
    "buns-sesame-topped-kaiser-5-in": ("photo", "sesame"),
    "buns-onion-topped-kaiser-5-in": ("illustration", "product-kaiser-onion"),
    "buns-poppy-topped-kaiser-5-in": ("illustration", "product-kaiser-poppy"),
    "buns-cornmeal-topped-kaiser-5-in": ("illustration", "product-kaiser-cornmeal"),
    "sandwich-rolls-hot-dog-6-in": ("illustration", "product-hot-dog"),
    "sandwich-rolls-soft-hoagie-7-in": ("illustration", "product-hoagie"),
    "sandwich-rolls-philly-roll-6-in": ("photo", "philly_back"),
    "sandwich-rolls-club-roll-6-in": ("photo", "club_front"),
    "sandwich-rolls-club-roll-6-in-sliced": ("illustration", "product-club"),
    "sandwich-rolls-club-roll-8-in": ("photo", "club_front"),
    "sandwich-rolls-club-roll-8-in-sliced": ("illustration", "product-club"),
}
assert len(SKU_TO_SOURCE) == 22

def source_image(key):
    request = Request(SOURCES[key], headers={"User-Agent":"Mozilla/5.0"})
    with urlopen(request, timeout=45) as r:
        if r.status != 200: raise RuntimeError(f"Unable to download {key}: {r.status}")
        raw = r.read()
        if len(raw) < 5000: raise RuntimeError(f"Truncated source: {key}")
    im = Image.open(BytesIO(raw)).convert("RGB")
    im.thumbnail((820,820), Image.Resampling.LANCZOS)
    return im

images = {key:source_image(key) for key in SOURCES}

def extract_photo(subject):
    source, (refw, refh), polygon = OBJECTS[subject]
    im = images[source]
    w,h = im.size
    coords=np.array([[(round(x*w/refw),round(y*h/refh)) for x,y in polygon]], dtype=np.int32)
    region=np.zeros((h,w),dtype=np.uint8)
    cv2.fillPoly(region,coords,255)
    rgb=np.asarray(im).astype(np.int16)
    r,g,b=rgb[:,:,0],rgb[:,:,1],rgb[:,:,2]
    # The blue checked cloth and gray tray are neutral/blue.
    # Keep warm crust/seed pixels, then fill internal pale seed holes.
    bread=((r>g+12)&(g>b+5)&(r>80)).astype(np.uint8)*255
    bread=cv2.bitwise_and(bread,region)
    count,labels,stats,_=cv2.connectedComponentsWithStats(bread,8)
    if count>1:
        k=1+np.argmax(stats[1:,cv2.CC_STAT_AREA])
        bread=(labels==k).astype(np.uint8)*255
    bread=cv2.morphologyEx(bread,cv2.MORPH_CLOSE,np.ones((11,11),dtype=np.uint8))
    contours,_=cv2.findContours(bread,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    filled=np.zeros_like(bread)
    if not contours: raise RuntimeError(f"No product isolated: {subject}")
    cv2.drawContours(filled,[max(contours,key=cv2.contourArea)],-1,255,-1)
    selected=cv2.GaussianBlur(filled,(0,0),1.2)
    alpha=Image.fromarray(selected)
    bounds=alpha.getbbox()
    if not bounds: raise RuntimeError(f"Empty image: {subject}")
    product=im.crop(bounds)
    alpha=alpha.crop(bounds)
    size=(960,720)
    ratio=min(650/product.width,510/product.height)
    target=(round(product.width*ratio),round(product.height*ratio))
    product=product.resize(target,Image.Resampling.LANCZOS)
    alpha=alpha.resize(target,Image.Resampling.LANCZOS)
    w2,h2=target
    x=(size[0]-w2)//2
    y=round((size[1]-h2)*0.50)-8
    canvas=Image.new("RGBA",size,CREAM)
    shadow=Image.new("RGBA",size)
    draw=ImageDraw.Draw(shadow)
    draw.ellipse((x+20,y+h2-37,x+w2-20,y+h2+11), fill=(65,50,34,44))
    shadow=shadow.filter(ImageFilter.GaussianBlur(26))
    canvas=Image.alpha_composite(canvas,shadow)
    layer=product.convert("RGBA")
    layer.putalpha(alpha)
    canvas.alpha_composite(layer,(x,y))
    return canvas.convert("RGB")

authentic={k:extract_photo(k) for k in OBJECTS}
for slug,(kind,subject) in SKU_TO_SOURCE.items():
    category = "buns" if slug.startswith("buns-") else "sandwich-rolls"
    folder = OUTPUT_ROOT / category
    folder.mkdir(parents=True, exist_ok=True)
    target=folder / f"{slug}.webp"
    if kind == "photo":
        authentic[subject].save(target,"WEBP",quality=86,method=6)
    else:
        original=ROOT / "public/images/illustrative" / f"{subject}.webp"
        if not original.exists(): raise RuntimeError(f"Missing existing illustrative fallback: {original}")
        shutil.copyfile(original,target)
    if target.stat().st_size < 1000: raise RuntimeError(f"Generated undersized photo: {target}")
    print(f"wrote {target.relative_to(ROOT)} ({target.stat().st_size} bytes; {kind}:{subject})")
print(f"SUCCESS: {len(SKU_TO_SOURCE)} unique product URL paths across Buns and Sandwich Rolls; {len(OBJECTS)} extracted source-photo subjects")
