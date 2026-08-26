# Hero carousel images

Drop 16:9 images in this folder and they are picked up automatically —
`HeroSection` globs this directory at build time, so there is no import to
add and no list to update. Filenames sort alphabetically, and that is the
order they cycle in, which is why they carry a numeric prefix:

    1-hastinapura-gate.webp
    2-hastinapura-aerial.webp
    3-hastinapura-lights.webp

The first image is the one fetched eagerly, so give that slot the lightest
and most open-skied shot.

Guidelines:

- **16:9**, at least 1600px wide.
- **WebP**, and keep each under ~180KB. These load on the homepage's
  largest contentful paint, so weight here is felt directly. Convert with
  `npx sharp-cli -i image.png -o . --format webp --quality 72 resize 1600`
  — that took the three source PNGs from 6.4MB to 385KB.
- **No PNG or JPEG left behind.** The glob matches those too, so a stray
  source file becomes a duplicate slide.
- **Keep the city in the lower half.** The headline and buttons sit in the
  upper middle; a tower behind the word "Decode" reads as clutter.
- Purple/magenta/coral skies suit the palette. A green or blue-grey sky
  will fight it.

With no images here the hero falls back to the drawn Hastinapura skyline,
which is why the folder can safely be empty.
