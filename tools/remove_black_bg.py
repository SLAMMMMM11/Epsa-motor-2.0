"""Remove near-black background from Bajaj logo and save transparent PNG."""
from pathlib import Path
from PIL import Image

SRC = Path(r"C:\Users\harol\Documents\Proyectos Web\Epsa-motor-2.0\public\assets\media\images\bajaj_logo.png")
DL = Path(r"C:\Users\harol\Downloads\bajaj_logo.png")
p = SRC if SRC.exists() else DL

im = Image.open(p).convert("RGBA")
w, h = im.size
print(f"source={p} size={w}x{h}")

pixels = im.load()
out = Image.new("RGBA", (w, h))
op = out.load()

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        bri = (r + g + b) / 3.0
        if bri < 25:
            op[x, y] = (r, g, b, 0)
        elif bri < 55:
            alpha = int(max(0, min(255, (bri - 25) / 30.0 * 255)))
            op[x, y] = (r, g, b, alpha)
        else:
            op[x, y] = (r, g, b, a)

bbox = out.getbbox()
print(f"content bbox={bbox}")
if bbox:
    out = out.crop(bbox)

backup = SRC.with_name("bajaj_logo_original_black_bg.png")
if SRC.exists() and not backup.exists():
    Image.open(SRC).save(backup)
    print(f"backup={backup}")

out.save(SRC, "PNG", optimize=True)
print(f"saved={SRC} size={out.size} kb={round(SRC.stat().st_size / 1024, 1)}")

dl_out = DL.with_name("bajaj_logo_transparent.png")
out.save(dl_out, "PNG", optimize=True)
print(f"also_downloads={dl_out}")
