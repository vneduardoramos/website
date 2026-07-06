#!/usr/bin/env python3
"""Unify the /about team headshots into one cohesive COLOR set.

Source originals live in assets-src/team-originals/<slug>.png (kept intact).
Output -> public/assets/images/team/<slug>.png, wired via the seed `photo` field.

The originals share one blue-grey studio backdrop, so they read cohesively in
colour. Treatment:
  - face-aligned square crop from measured geometry: eye-line ~0.40 from top,
    head (hairline->chin) ~0.66 of frame. Per-person boxes in JOBS.
  - gentle exposure match: sample the top ~62% (head + background, excludes the
    torso/shirt that skews dark), measure luminance, and apply a clamped per-image
    brightness gain toward the GROUP MEDIAN. Preserves hue; just evens brightness.

Note: contrast/saturation are intentionally NOT normalized. They vary naturally
per person (skin tone, hair, what's in frame), so matching them to a median
flattens legitimate variation and regresses the on-target majority. Where a
source was shot under harder light (jc-rodriguez), brightness-matching narrows
the gap; full parity would need a re-shot frame, not post-processing.

Re-run after replacing an original to refresh, then `rm -rf .next/cache/images`.
"""
from PIL import Image, ImageStat, ImageEnhance
import os
import statistics

SRC = "/Users/eduardoramos/Documents/VN/assets-src/team-originals"
OUT = "/Users/eduardoramos/Documents/VN/public/assets/images/team"
SIZE = 900

# Exposure-sample region (output px): top 62%, full width.
NX0, NX1, NY0, NY1 = 0, SIZE, 0, int(0.62 * SIZE)

# slug -> (crop_left, crop_top, crop_side) in source px (originals are 1254x1254).
JOBS = {
    "eduardo-ramos": (93, 28, 1074),
    "carlos-egremy": (242, 45, 845),
    "rene-trevino":  (118, 9, 1068),
    "aydhe-mota":    (143, 0, 956),
    "karen-berber":  (251, 0, 877),
    "jc-rodriguez":  (130, 16, 931),
}


def luma(region):
    r, g, b = ImageStat.Stat(region).mean[:3]
    return 0.299 * r + 0.587 * g + 0.114 * b


# Pass 1: crop + resize, measure luminance of the head+background region.
imgs, lumas = {}, {}
for slug, (l, t, s) in JOBS.items():
    im = Image.open(os.path.join(SRC, f"{slug}.png")).convert("RGB").crop((l, t, l + s, t + s))
    im = im.resize((SIZE, SIZE), Image.LANCZOS)
    imgs[slug] = im
    lumas[slug] = luma(im.crop((NX0, NY0, NX1, NY1)))

target = statistics.median(lumas.values())

# Pass 2: gentle brightness gain toward the group median (hue preserved).
for slug, im in imgs.items():
    gain = max(0.85, min(1.18, target / lumas[slug]))
    ImageEnhance.Brightness(im).enhance(gain).save(os.path.join(OUT, f"{slug}.png"))
    print(f"{slug:14} luma {lumas[slug]:5.1f} -> target {target:.0f}  gain {gain:.3f}")
print(f"group target luminance: {target:.0f}")
