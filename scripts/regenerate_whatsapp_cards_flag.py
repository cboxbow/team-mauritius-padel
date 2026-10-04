from __future__ import annotations

import re
import unicodedata
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "deck" / "manifest.txt"
SOURCE_DIR = ROOT / "deck" / "photos-renommees"
OUT_DIR = ROOT / "deck" / "whatsapp-cards"
LOGO = ROOT / "public" / "images" / "team-mauritius-logo.png"
WAVE = ROOT / "public" / "images" / "dot-wave-red.png"
WIDTH = 1080
HEIGHT = 1350


def slug(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    paths = [r"C:/Windows/Fonts/arialbd.ttf", r"C:/Windows/Fonts/impact.ttf"] if bold else [r"C:/Windows/Fonts/arial.ttf"]
    for path in paths:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            pass
    return ImageFont.load_default()


def cover_crop(image: Image.Image) -> Image.Image:
    scale = max(WIDTH / image.width, HEIGHT / image.height)
    resized = image.resize((int(image.width * scale), int(image.height * scale)), Image.Resampling.LANCZOS)
    x = (resized.width - WIDTH) // 2
    y = (resized.height - HEIGHT) // 2
    if resized.height > HEIGHT:
        y = max(0, min(y - 90, resized.height - HEIGHT))
    return resized.crop((x, y, x + WIDTH, y + HEIGHT))


def draw_shadowed_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, font: ImageFont.ImageFont, fill: tuple[int, int, int, int]) -> None:
    x, y = xy
    draw.text((x + 2, y + 2), text, font=font, fill=(0, 0, 0, 175))
    draw.text((x, y), text, font=font, fill=fill)


def add_mauritius_flag(card: Image.Image) -> None:
    accent = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(accent, "RGBA")
    colors = [
        (234, 40, 57, 76),
        (30, 58, 138, 70),
        (255, 210, 0, 62),
        (0, 151, 57, 68),
    ]

    start_x = WIDTH - 455
    start_y = 52
    band_height = 30
    band_gap = 2
    for index, color in enumerate(colors):
        offset = index * (band_height + band_gap)
        points = [
            (start_x, start_y + offset + 74),
            (WIDTH - 315, start_y + offset + 26),
            (WIDTH - 135, start_y + offset + 8),
            (WIDTH + 58, start_y + offset + 36),
        ]
        draw.line(points, fill=color, width=band_height, joint="curve")

    fade = Image.new("L", (WIDTH, HEIGHT), 0)
    fade_draw = ImageDraw.Draw(fade)
    for x in range(start_x - 40, WIDTH):
        strength = int(255 * max(0, min(1, (x - (start_x - 40)) / 310)))
        fade_draw.line((x, 0, x, 260), fill=strength)
    for y in range(0, 300):
        vertical = int(255 * max(0, min(1, 1 - (y - 42) / 260)))
        fade_draw.line((0, y, WIDTH, y), fill=vertical)
    accent.putalpha(ImageChops.multiply(accent.getchannel("A"), fade))
    accent = accent.filter(ImageFilter.GaussianBlur(1.8))
    card.alpha_composite(accent)


def parse_manifest() -> list[tuple[str, str, str]]:
    players: list[tuple[str, str, str]] = []
    for line in MANIFEST.read_text(encoding="utf-8").splitlines():
        match = re.match(r"(\d{2})\.\s+(.+?)\s+\[(MEN|WOMEN)\]", line)
        if match:
            players.append((match.group(1), match.group(2), match.group(3)))
    return players


def make_card(number: str, name: str, gender: str) -> None:
    matches = list(SOURCE_DIR.glob(f"{number}-*.jpg"))
    if not matches:
        raise FileNotFoundError(f"Missing source photo for {number} {name}")
    source = matches[0]

    photo = Image.open(source).convert("RGB")
    photo = cover_crop(photo)
    photo = ImageEnhance.Contrast(photo).enhance(1.05)
    photo = ImageEnhance.Color(photo).enhance(1.06)

    card = photo.convert("RGBA")
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    for i in range(310):
        overlay_draw.line((0, i, WIDTH, i), fill=(0, 0, 0, int(82 * (1 - i / 310))))
    for i in range(510):
        overlay_draw.line((0, HEIGHT - 510 + i, WIDTH, HEIGHT - 510 + i), fill=(0, 0, 0, int(185 * (i / 510))))
    card = Image.alpha_composite(card, overlay)

    if WAVE.exists():
        wave = Image.open(WAVE).convert("RGBA").resize((WIDTH, 430), Image.Resampling.LANCZOS)
        wave.putalpha(wave.getchannel("A").point(lambda p: int(p * 0.34)))
        card.alpha_composite(wave, (0, HEIGHT - 430))

    add_mauritius_flag(card)

    if LOGO.exists():
        logo = Image.open(LOGO).convert("RGBA")
        logo.thumbnail((172, 94), Image.Resampling.LANCZOS)
        card.alpha_composite(logo, (76, 68))

    draw = ImageDraw.Draw(card)
    draw_shadowed_text(draw, (290, 72), "TEAM MAURITIUS", load_font(28, True), (255, 255, 255, 242))
    draw_shadowed_text(draw, (290, 118), "ROAD TO LA REUNION 2026", load_font(26), (255, 255, 255, 220))
    draw.rectangle((76, 1016, 186, 1024), fill=(239, 49, 42, 255))
    draw_shadowed_text(draw, (76, 1070), f"SELECTED SQUAD / {gender}", load_font(28, True), (239, 49, 42, 255))

    display_name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii").upper()
    if len(display_name) > 24:
        parts = display_name.split(" ")
        line_one = " ".join(parts[:2])
        line_two = " ".join(parts[2:])
        draw_shadowed_text(draw, (76, 1138), line_one, load_font(58, True), (255, 255, 255, 255))
        draw_shadowed_text(draw, (76, 1204), line_two, load_font(58, True), (255, 255, 255, 255))
        sub_y = 1278
    else:
        draw_shadowed_text(draw, (76, 1160), display_name, load_font(66, True), (255, 255, 255, 255))
        sub_y = 1252
    draw_shadowed_text(draw, (76, sub_y), "ISLAND PADEL CUP 2026", load_font(28), (255, 255, 255, 220))

    output = OUT_DIR / f"{number}-{slug(name)}.jpg"
    card.convert("RGB").save(output, quality=92, optimize=True)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    players = parse_manifest()
    for player in players:
        make_card(*player)
    print(f"regenerated {len(players)} cards")


if __name__ == "__main__":
    main()
