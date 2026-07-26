"""Crea una variante clara del logo EPSA para superficies oscuras."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/media/images/epsa-motor-logo-transparente.png"
OUTPUT = ROOT / "public/assets/media/images/epsa-motor-logo-claro.png"


def is_brand_red(red: int, green: int, blue: int) -> bool:
    return red >= 120 and red > green * 1.35 and red > blue * 1.18


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    result = Image.new("RGBA", source.size, (0, 0, 0, 0))

    converted_pixels: list[tuple[int, int, int, int]] = []
    for red, green, blue, alpha in source.get_flattened_data():
        if alpha <= 8:
            converted_pixels.append((0, 0, 0, 0))
        elif is_brand_red(red, green, blue):
            converted_pixels.append((max(red, 220), min(green, 32), min(blue, 44), alpha))
        else:
            converted_pixels.append((245, 248, 252, alpha))

    result.putdata(converted_pixels)
    result.save(OUTPUT, optimize=True)
    print(f"Logo claro generado: {OUTPUT}")


if __name__ == "__main__":
    main()
