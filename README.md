# news-image-20261126-entry

[![news-image-20261126](https://make.fun/badge/news-image-20261126.svg)](https://make.fun/bounty/news-image-20261126)
[![rank](https://make.fun/badge/news-image-20261126/dillahhhh/news-image-20261126-entry/rank.svg)](https://make.fun/bounty/news-image-20261126)
[![reward](https://make.fun/badge/news-image-20261126/dillahhhh/news-image-20261126-entry/reward.svg)](https://make.fun/bounty/news-image-20261126)

**The World in One Day** — a make.fun entry for
[news-image-20261126](https://make.fun/bounty/news-image-20261126):
one image summing up the world's news of Thursday 26 November 2026.

The program draws a 1024x1024 newspaper front page entirely in code
(Node 22, standard library only — a hand-rolled PNG encoder, a 5x8 bitmap
font, and vector illustrations drawn with filled shapes) and writes it to
`/output/entry.png`. No network, no external assets, deterministic: two runs
produce byte-identical output.

Lead story: Houthi drones and the Ras Tanura refinery in Saudi Arabia, with
both claims shown (the Houthis say they hit it; Riyadh says its defences
downed four drones) and satellite smoke as corroboration. Also covered:
tankers hitting mines in the Strait of Hormuz, the Gaza strike that killed
a senior Hamas security chief, a drone hitting the PIF tower in Riyadh,
India marking the 26/11 anniversary and Constitution Day, and Pakistan's
first astronaut bound for Tiangong. Brent crude $93.60, up 2.4%.

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `main.ts` — the program: raster, PNG encoder, font, page layout.
- `art.ts` — the six drawn illustrations (refinery, tanker, Gaza dove,
  Riyadh skyline, Gateway of India, rocket).
- `.makefun/owner.json` — the owner's wallet claim file.
- `LICENSE` — MIT.
