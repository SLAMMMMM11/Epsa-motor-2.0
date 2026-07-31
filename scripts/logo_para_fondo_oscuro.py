"""Prepara Logo_nuevo_torito_250_GLP para usarlo sobre el hero oscuro.

El archivo original es negro y rojo sobre blanco opaco: pensado para papel o
fondos claros. Sobre el azul marino del hero, el 46% del logo que es negro
quedaria invisible.

Genera dos versiones en WebP con transparencia:

  logo-torito-250-glp.webp          fondo recortado, colores originales
  logo-torito-250-glp-claro.webp    ademas invierte los tonos oscuros a blanco,
                                    conservando los colores saturados de marca
                                    (el rojo y el verde) tal cual

Uso:  python scripts/logo_para_fondo_oscuro.py
"""

from pathlib import Path

from PIL import Image

IMAGES = Path(__file__).resolve().parent.parent / "public" / "assets" / "media" / "images"
ORIGEN = IMAGES / "Logo_nuevo_torito_250_GLP.png"

# Por encima de este brillo se considera fondo; entre los dos umbrales se hace
# una transicion suave para no dejar el borde dentado.
FONDO_OPACO = 250
FONDO_SUAVE = 225

# Diferencia entre canales a partir de la cual un pixel se considera color de
# marca y no un gris: asi el rojo y el verde no se tocan al invertir.
SATURACION = 40

# Por debajo de este brillo, un pixel gris se considera "tinta oscura".
TINTA = 130


def recortar_fondo(imagen):
    """Convierte el blanco del fondo en transparencia, con borde suave."""
    imagen = imagen.convert("RGBA")
    pixeles = imagen.load()
    ancho, alto = imagen.size

    for y in range(alto):
        for x in range(ancho):
            r, g, b, a = pixeles[x, y]
            brillo = (r + g + b) / 3
            if brillo >= FONDO_OPACO:
                pixeles[x, y] = (r, g, b, 0)
            elif brillo > FONDO_SUAVE:
                # Franja de transicion: alfa proporcional al brillo.
                proporcion = (FONDO_OPACO - brillo) / (FONDO_OPACO - FONDO_SUAVE)
                pixeles[x, y] = (r, g, b, int(a * proporcion))
    return imagen


def invertir_tinta(imagen):
    """Pasa la tinta oscura a blanco y deja intactos los colores de marca."""
    imagen = imagen.copy()
    pixeles = imagen.load()
    ancho, alto = imagen.size

    for y in range(alto):
        for x in range(ancho):
            r, g, b, a = pixeles[x, y]
            if a == 0:
                continue
            saturado = max(r, g, b) - min(r, g, b) > SATURACION
            if saturado:
                continue  # rojo y verde de marca: se respetan
            brillo = (r + g + b) / 3
            if brillo < TINTA:
                # Cuanto mas oscuro era, mas blanco queda.
                nivel = int(255 - brillo * 0.35)
                pixeles[x, y] = (nivel, nivel, nivel, a)
    return imagen


def recortar_margenes(imagen):
    """Elimina el aire transparente sobrante para poder escalarlo sin huecos."""
    caja = imagen.getbbox()
    return imagen.crop(caja) if caja else imagen


def main():
    if not ORIGEN.exists():
        print(f"  no se encontro {ORIGEN.name}")
        return

    original = Image.open(ORIGEN)
    print(f"  origen: {ORIGEN.name}  {original.size[0]}x{original.size[1]}"
          f"  {ORIGEN.stat().st_size / 1024:.0f} KB")

    recortado = recortar_margenes(recortar_fondo(original))

    for sufijo, imagen in [
        ("", recortado),
        ("-claro", invertir_tinta(recortado)),
    ]:
        destino = IMAGES / f"logo-torito-250-glp{sufijo}.webp"
        salida = imagen
        if salida.width > 900:
            alto = round(salida.height * 900 / salida.width)
            salida = salida.resize((900, alto), Image.LANCZOS)
        salida.save(destino, "WEBP", quality=88, method=6)
        print(f"  -> {destino.name}  {salida.size[0]}x{salida.size[1]}"
              f"  {destino.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
