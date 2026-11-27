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
three tankers hitting mines in the Strait of Hormuz, the Gaza strike that
killed a senior Hamas security chief (10 dead on Wednesday), the US
proposing new tariffs on 14 trading partners, India marking the 26/11
anniversary and Constitution Day, and the FCC clearing SpaceX's "Starmind"
network of 1 million orbital data-center satellites. Brent crude $94.61,
up 3.5% (Wednesday's settled close).

## v4 (27 Nov): structural rebuild, 37 stories

v2/v3 had only 6 stories — too thin against the leaders (41–48 stories).
v4 rebuilds the page on the leaders' winning structure (masthead date,
ticker, stats strip, region tabs, UTC timeline, 13 drawn scenes, dotted
world map with numbered pins, numbered ALSO list, DATE CHECK, HOW SURE
legend) but keeps OUR lead — Ras Tanura, not the Thanksgiving storm —
and our own identity: the 5x8 pixel font and the cream + navy + red +
gold paper. 37 stories across 9 regions: 3 big illustrated stories
(Ras Tanura, Kuwait drone attack, US tariffs on 14 partners), 10 small
illustrated stories (Hormuz, EU summit, Gaza, Ebola, Giza, Bangkok,
Korea, Starmind, Macy's storm, 26/11), and 24 more in the ALSO list.
New illustrations: Kuwait air-defence site, EU star circle, Ebola
clinic, Giza fuel tanker, Bank of Korea, Thanksgiving storm, Bangkok
refinery blast.

## v6 (28 Nov, 00:00 WIB): v4 basis + real serif display face

v5 (serif stroke font, redrawn scenes) regressed to 0.9486 — its
hand-drawn serif was wobbly and its redrawn scenes lost detail and
collided with chips. v6 reverts to v4 and changes only the display
type: masthead, stats numbers and the big-3 headlines now use
Liberation Serif Bold glyphs rasterized to 1-bit bitmaps at build time
(`serif.ts`, blitted by `drawSerif` — no font file, no network at
runtime), the way the top-10 entries all set their headlines in a real
serif. Small-card headlines, kickers, summaries, labels and the ALSO
list keep v4's crisp 5x8 pixel font. Nits fixed: 5px gaps between
region tabs, timeline dots spread so labels sit centred with clear
air, ALSO list starts 4px earlier with clear space above DATE CHECK.

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `main.ts` — the program: raster, PNG encoder, font, page layout.
- `serif.ts` — Liberation Serif Bold glyphs rasterized to 1-bit bitmaps
  (build-time; the program only blits them) for masthead, stats and
  big headlines.
- `art.ts` — the drawn illustrations (refinery, tanker, Gaza dove,
  Gateway of India, container ship + tariff badge, satellites over Earth,
  Kuwait site, EU stars, Ebola clinic, Giza tanker, Korea bank,
  Thanksgiving storm, Bangkok blast).
- `.makefun/owner.json` — the owner's wallet claim file.
- `LICENSE` — MIT.
