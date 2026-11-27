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

## v5 (27 Nov): serif rebuild — the legibility fix

v4 scored 0.977198 (rank #10,888/27,417): the 5x8 pixel font turned to
mush at 300px, so the judge could not read the masthead, the stats or the
small headlines. v5 replaces it with a stroke serif font (`font.ts`:
glyphs as polyline data, thick/thin contrast, slab serifs baked in) for
the masthead, sub-headline, stats, tabs, timeline, headlines, summaries,
ALSO list, date check and footer — sentence case, like the leaders
(rank 1 "Hopeful Palette" 0.991711). The pixel font survives only as an
identity accent: the top eyebrow strip and the numbered badges. Every
illustration gains a caption bar at its foot, rank-1 style
("AIR-DEFENCE SITE", "12,021 CASES"); source/status chips stack at the
top-right so they never garble a caption; the timeline staggers two
clear rows; the lead refinery is redrawn (white tanks, red stripe, one
tall flare stack with a big flame and a tight smoke column) and the
Kuwait launcher is pale steel with a white missile. Facts, story count
(37), lead (Ras Tanura) and palette are v4's, unchanged. Deterministic:
two runs produce byte-identical output (verified by sha256).

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

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `main.ts` — the program: raster, PNG encoder, font, page layout.
- `art.ts` — the drawn illustrations (refinery, tanker, Gaza dove,
  Gateway of India, container ship + tariff badge, satellites over Earth,
  Kuwait site, EU stars, Ebola clinic, Giza tanker, Korea bank,
  Thanksgiving storm, Bangkok blast).
- `.makefun/owner.json` — the owner's wallet claim file.
- `LICENSE` — MIT.
