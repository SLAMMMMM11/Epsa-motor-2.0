"""Convierte a WebP las fotografías que se estaban sirviendo como PNG.

Seis fotos en PNG sumaban 11,9 MB de los 17,9 MB de public/assets, y se
renderizan en tarjetas de unos 400 px de ancho. Redimensionar y pasar a WebP
recorta ~95% del peso sin diferencia visible a ese tamaño.

Dos de las conversiones reutilizan a propósito el nombre de archivos que se
borraron del repositorio pero que el código sigue pidiendo
(benefit-asesoria-whatsapp.webp y benefit-credito-directo.webp), de modo que
la conversión repara además esas referencias rotas.

Uso:  python scripts/optimize_images.py
"""

from pathlib import Path

from PIL import Image

IMAGES = Path(__file__).resolve().parent.parent / "public" / "assets" / "media" / "images"

# (origen, destino, ancho objetivo, calidad)
# destino None = mismo nombre con extensión .webp
CONVERSIONS = [
    ("nosotros-respaldo-comercial.png", None, 1100, 76),
    ("nosotros-atencion-humana.png", None, 1100, 76),
    ("nosotros-atencion-comercial.png", None, 1100, 76),
    ("benefit-tramite-placa-modelo-real-v2.png", None, 1100, 76),
    # Estos dos recuperan el nombre que el código sigue referenciando.
    ("benefit-credito-directo-modelo-real.png", "benefit-credito-directo.webp", 1100, 76),
    ("benefit-asesoria-whatsapp-modelo-real.png", "benefit-asesoria-whatsapp.webp", 1100, 76),
    # Recortes con transparencia: se conserva el canal alfa.
    ("contacto-chico.png", None, 595, 80),
    ("epsa-motor-logo-transparente.png", None, None, 85),
]


def convertir(nombre_origen, nombre_destino, ancho, calidad):
    origen = IMAGES / nombre_origen
    if not origen.exists():
        print(f"  omitido   {nombre_origen} (no existe)")
        return 0, 0

    destino = IMAGES / (nombre_destino or origen.with_suffix(".webp").name)
    imagen = Image.open(origen)

    # Las fotos opacas van en RGB; los recortes conservan alfa para no acabar
    # con un rectángulo negro detrás del sujeto.
    tiene_alfa = imagen.mode in ("RGBA", "LA") or "transparency" in imagen.info
    imagen = imagen.convert("RGBA" if tiene_alfa else "RGB")

    if ancho and imagen.width > ancho:
        alto = round(imagen.height * ancho / imagen.width)
        imagen = imagen.resize((ancho, alto), Image.LANCZOS)

    imagen.save(destino, "WEBP", quality=calidad, method=6)

    antes = origen.stat().st_size
    despues = destino.stat().st_size
    print(
        f"  {origen.name}\n"
        f"     -> {destino.name}  {imagen.width}x{imagen.height}"
        f"  {antes / 1024:.0f} KB -> {despues / 1024:.0f} KB"
        f"  (-{100 - despues * 100 / antes:.0f}%)"
    )
    return antes, despues


def main():
    print(f"Optimizando imágenes en {IMAGES}\n")
    total_antes = total_despues = 0
    for nombre_origen, nombre_destino, ancho, calidad in CONVERSIONS:
        antes, despues = convertir(nombre_origen, nombre_destino, ancho, calidad)
        total_antes += antes
        total_despues += despues

    if total_antes:
        print(
            f"\nTotal: {total_antes / 1048576:.2f} MB -> {total_despues / 1048576:.2f} MB"
            f"  (-{(total_antes - total_despues) / 1048576:.2f} MB,"
            f" -{100 - total_despues * 100 / total_antes:.0f}%)"
        )
    print("\nLos PNG de origen no se borran automáticamente: revisa el resultado")
    print("y elimínalos después de comprobar que las referencias apuntan al WebP.")


if __name__ == "__main__":
    main()
