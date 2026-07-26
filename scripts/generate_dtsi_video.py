"""Generate the silent DTS-i explainer loop used by the homepage hero."""

from __future__ import annotations

import argparse
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

try:
    import imageio_ffmpeg
except ImportError as exc:  # pragma: no cover - asset pipeline dependency
    raise SystemExit(
        "Install imageio-ffmpeg before running this script: "
        "python -m pip install imageio-ffmpeg"
    ) from exc


WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION = 6
SPARK_LEFT = (407, 382)
SPARK_RIGHT = (873, 382)
CHAMBER_CENTER = (640, 430)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "arialbd.ttf" if bold else "arial.ttf"
    path = Path("C:/Windows/Fonts") / name
    return ImageFont.truetype(str(path), size)


def cover(image: Image.Image, zoom: float) -> Image.Image:
    ratio = max(WIDTH / image.width, HEIGHT / image.height) * zoom
    resized = image.resize(
        (round(image.width * ratio), round(image.height * ratio)),
        Image.Resampling.LANCZOS,
    )
    left = max(0, (resized.width - WIDTH) // 2)
    top = max(0, (resized.height - HEIGHT) // 2)
    return resized.crop((left, top, left + WIDTH, top + HEIGHT)).convert("RGBA")


def ease(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3 - 2 * value)


def add_glow(
    frame: Image.Image,
    center: tuple[int, int],
    radius: float,
    color: tuple[int, int, int],
    alpha: float,
) -> Image.Image:
    layer = Image.new("RGBA", frame.size)
    draw = ImageDraw.Draw(layer)
    x, y = center
    draw.ellipse(
        (x - radius, y - radius, x + radius, y + radius),
        fill=(*color, round(255 * alpha)),
    )
    layer = layer.filter(ImageFilter.GaussianBlur(max(4, radius * 0.55)))
    return Image.alpha_composite(frame, layer)


def draw_spark(frame: Image.Image, origin: tuple[int, int], direction: int, power: float) -> Image.Image:
    if power <= 0:
        return frame

    frame = add_glow(frame, origin, 32 + 9 * power, (34, 171, 255), 0.56 * power)
    frame = add_glow(frame, origin, 15 + 7 * power, (255, 177, 32), 0.8 * power)
    layer = Image.new("RGBA", frame.size)
    draw = ImageDraw.Draw(layer)
    x, y = origin
    points = [
        (x, y),
        (x + 10 * direction, y + 10),
        (x + 2 * direction, y + 19),
        (x + 18 * direction, y + 30),
        (x + 8 * direction, y + 44),
    ]
    draw.line(points, fill=(255, 245, 186, round(255 * power)), width=4, joint="curve")
    draw.line(points, fill=(255, 255, 255, round(230 * power)), width=2, joint="curve")
    return Image.alpha_composite(frame, layer)


def draw_combustion(frame: Image.Image, progress: float, envelope: float) -> Image.Image:
    if progress <= 0 or envelope <= 0:
        return frame

    layer = Image.new("RGBA", frame.size)
    draw = ImageDraw.Draw(layer)
    width = 95 + 365 * ease(progress)
    height = 55 + 155 * ease(progress)

    for origin, direction in ((SPARK_LEFT, 1), (SPARK_RIGHT, -1)):
        x, y = origin
        end_x = x + direction * width
        bounds = (
            min(x, end_x) - width * 0.12,
            y - height * 0.48,
            max(x, end_x) + width * 0.12,
            y + height * 0.52,
        )
        draw.ellipse(bounds, fill=(237, 17, 29, round(82 * envelope)))
        inner = (
            min(x, end_x) + width * 0.1,
            y - height * 0.28,
            max(x, end_x) - width * 0.1,
            y + height * 0.32,
        )
        draw.ellipse(inner, fill=(255, 152, 20, round(116 * envelope)))

    layer = layer.filter(ImageFilter.GaussianBlur(18))
    frame = Image.alpha_composite(frame, layer)
    frame = add_glow(
        frame,
        CHAMBER_CENTER,
        42 + 110 * ease(progress),
        (255, 108, 10),
        0.34 * envelope,
    )
    return frame


def draw_pressure(frame: Image.Image, power: float) -> Image.Image:
    if power <= 0:
        return frame

    layer = Image.new("RGBA", frame.size)
    draw = ImageDraw.Draw(layer)
    for offset in (-48, 0, 48):
        x = CHAMBER_CENTER[0] + offset
        start_y = 474
        end_y = 548 + round(16 * power)
        color = (96, 194, 255, round(210 * power))
        draw.line((x, start_y, x, end_y), fill=color, width=4)
        draw.polygon(
            ((x - 8, end_y - 10), (x + 8, end_y - 10), (x, end_y + 3)),
            fill=color,
        )
    layer = layer.filter(ImageFilter.GaussianBlur(0.7))
    return Image.alpha_composite(frame, layer)


def draw_interface(frame: Image.Image, seconds: float) -> Image.Image:
    layer = Image.new("RGBA", frame.size)
    draw = ImageDraw.Draw(layer)
    title_font = font(22, True)
    label_font = font(27, True)
    small_font = font(15, True)

    draw.rounded_rectangle((28, 26, 254, 64), radius=10, fill=(7, 30, 61, 220))
    draw.text((44, 36), "TECNOLOGÍA DTS-i", font=small_font, fill=(255, 255, 255, 255))

    if seconds < 1.65:
        step = 0
        label = "1  ·  DOBLE CHISPA DIGITAL"
    elif seconds < 3.8:
        step = 1
        label = "2  ·  COMBUSTIÓN MÁS RÁPIDA"
    else:
        step = 2
        label = "3  ·  EFICIENCIA Y POTENCIA"

    draw.rounded_rectangle((28, 626, 546, 688), radius=12, fill=(7, 30, 61, 226))
    draw.rectangle((28, 626, 34, 688), fill=(237, 17, 29, 255))
    draw.text((54, 642), label, font=label_font, fill=(255, 255, 255, 255))

    for index in range(3):
        x = 1144 + index * 34
        color = (237, 17, 29, 255) if index == step else (255, 255, 255, 80)
        draw.rounded_rectangle((x, 42, x + 22, 48), radius=3, fill=color)

    # A subtle explanatory footer keeps the frame useful when paused.
    draw.text(
        (1000, 660),
        "ENCENDIDO COORDINADO",
        font=title_font,
        fill=(220, 233, 248, 220),
        anchor="mm",
    )
    return Image.alpha_composite(frame, layer)


def render_frame(base: Image.Image, frame_index: int) -> Image.Image:
    seconds = frame_index / FPS
    loop_wave = 0.5 - 0.5 * math.cos(2 * math.pi * seconds / DURATION)
    frame = cover(base, 1 + 0.018 * loop_wave)

    spark_cycle = max(0.0, math.sin((seconds - 0.35) * math.pi * 2.4))
    spark_envelope = ease(min(seconds / 0.65, (DURATION - seconds) / 0.65))
    spark_power = spark_cycle * spark_envelope
    frame = draw_spark(frame, SPARK_LEFT, 1, spark_power)
    frame = draw_spark(frame, SPARK_RIGHT, -1, spark_power)

    combustion_progress = ease((seconds - 1.05) / 2.3)
    combustion_fade = ease((DURATION - seconds) / 1.05)
    frame = draw_combustion(frame, combustion_progress, combustion_fade)
    pressure_power = ease((seconds - 3.45) / 0.8) * ease((DURATION - seconds) / 0.8)
    frame = draw_pressure(frame, pressure_power)
    return draw_interface(frame, seconds).convert("RGB")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--poster", required=True, type=Path)
    args = parser.parse_args()

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.poster.parent.mkdir(parents=True, exist_ok=True)
    base = Image.open(args.input).convert("RGB")
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    command = [
        ffmpeg,
        "-y",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{WIDTH}x{HEIGHT}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(args.output),
    ]

    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    assert process.stdin is not None
    poster_frame = None
    for frame_index in range(FPS * DURATION):
        frame = render_frame(base, frame_index)
        if frame_index == FPS * 2:
            poster_frame = frame.copy()
        process.stdin.write(frame.tobytes())
    process.stdin.close()
    return_code = process.wait()
    if return_code != 0:
        raise SystemExit(f"FFmpeg failed with exit code {return_code}")

    assert poster_frame is not None
    poster_frame.save(args.poster, "WEBP", quality=88, method=6)


if __name__ == "__main__":
    main()
