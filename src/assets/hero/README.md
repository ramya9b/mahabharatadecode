# Hero carousel images

Drop 16:9 images in this folder and they are picked up automatically —
`HeroSection` globs this directory at build time, so there is no import to
add and no list to update. Filenames sort alphabetically, and that is the
order they cycle in.

    hastinapura-gate.webp
    hastinapura-aerial.webp

Guidelines:

- **16:9**, at least 1600px wide.
- **WebP**, and keep each under ~180KB. These load on the homepage's
  largest contentful paint, so weight here is felt directly. Convert with
  `npx @squoosh/cli --webp '{"quality":72}' image.png`.
- **Keep the city in the lower half.** The headline and buttons sit in the
  upper middle; a tower behind the word "Decode" reads as clutter.
- Purple/magenta/coral skies suit the palette. A green or blue-grey sky
  will fight it.

With no images here the hero falls back to the drawn Hastinapura skyline,
which is why the folder can safely be empty.
