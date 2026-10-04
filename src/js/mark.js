// The STILL HERE mark as geometry: four corner brackets and the dot, measured from the horizontal
// logo (assets/still-here-logo-horizontal.png, 2172 × 724) in its own pixels and moved to the
// origin. The green extends x 118–464 and y 174–518 there; bracket arms are 50–52 units thick;
// the dot sits at (291, 346) with radius 64.7. Read by scripts/brand.mjs (mark.svg, the favicon,
// the icons) and by the certificate's wordmark and seal. (Jules, 2026-10-04)
export const MARK = Object.freeze({
  width: 346,
  height: 344,
  brackets: Object.freeze([
    // top left, top right, bottom left, bottom right: each an L
    'M0 0H124V51H52V125H0Z',
    'M222 0H346V125H295V51H222Z',
    'M0 218H52V294H124V344H0Z',
    'M295 218H346V344H222V294H295Z',
  ]),
  dot: Object.freeze({ cx: 173, cy: 172, r: 64.7 }),
});
