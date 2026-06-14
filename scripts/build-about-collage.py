# Builds the About "Who we are" collage (one image) from team/event photos in
# public/assets/images/life/. 3x3 square mosaic, thin white seams. Re-run after
# adding/swapping source photos below.
from PIL import Image, ImageOps
L = "public/assets/images/life"
W = H = 1500
gap = 12
cell = (W - 2 * gap) // 3
order = [
    "team-group", "team-dfb", "team-presenting",
    "team-breakfast", "team-summit-selfie", "team-dinner",
    "welcome-summit", "booth-aiml", "snowflake-bear",
]
canvas = Image.new("RGB", (W, H), (255, 255, 255))
for i, name in enumerate(order):
    r, c = divmod(i, 3)
    im = Image.open(f"{L}/{name}.jpg").convert("RGB")
    im = ImageOps.fit(im, (cell, cell), Image.LANCZOS)
    canvas.paste(im, (c * (cell + gap), r * (cell + gap)))
canvas.save(f"{L}/about-collage.jpg", quality=88)
print("saved about-collage.jpg", canvas.size)
