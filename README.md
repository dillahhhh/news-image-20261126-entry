# news-image-20261126-entry — v13.1 (bos's layout, fix pass)

**The World in One Day** — v13.1 is the fix pass on v13, which rebuilds
the layout bos drew himself (2 AI images, 2nd / 03:28 WIB is the main
one) in code: masthead date + `WORLD NEWS SUMMARY` between gold bars,
THE DAY IN UTC timeline, 3 big stories, 12 small stories in 2 rows of 6,
full-width dotted world map with numbered pins + IN THIS EDITION index,
sources footer.

No garble, no "Dola AI" watermark. 15 stories, every one verified
against real reporting of 26 Nov 2026:

1. Kuwait — drone attack kills 2 Italian technicians, 2 others injured
   (REUTERS, CONFIRMED). Lead.
2. Gaza — airstrikes kill 8-10 Palestinians; Hamas official Abu Nada
   killed (REUTERS/BBC, CONFIRMED). **Fixed in v13.1:** v13 said
   "ABUELOUF KILLED" — Mohammed Abu al-Ouf died WEDNESDAY 25 Nov, not
   Thursday. The 26 Nov dead name is Khaled Abu Nada (deputy education
   minister) + his wife, killed at dawn in Deir al-Balah; Netanyahu
   confirmed 26 Nov. (Likely origin: bos's AI image garbled BBC byline
   "Rushdi Abu Alouf" into "Abuelouf killed".)
3. Hormuz — tanker reports projectile blast near the Strait (IRNA, CLAIM).
4. Ras Tanura — drones hit the oil facility, Saudi Arabia (REUTERS, CLAIM).
5. Brussels — EU summit ends with no deal; de Cos to run ECB
   (REUTERS, OFFICIAL).
6. Bissau — military govt delays the vote, election to 2028 (AP, OFFICIAL).
7. Washington — FCC approves SpaceX network, 1M satellites (FCC, OFFICIAL).
8. Seoul — Korea hikes rate to 3.25%, 3rd hike this year (YONHAP, OFFICIAL).
9. Giza — tanker fire kills 31, driver held (AP, OFFICIAL).
10. Bangkok — refinery blast injures nine, 3 critical (AP, CONFIRMED).
11. Mumbai — India marks 18 since 26/11, tributes paid (OFFICIAL).
12. Washington — tariffs on 14 partners, up to 20% proposed (USTR, OFFICIAL).
13. DR Congo — Ebola passes 12,021 cases, 5,904 dead (REUTERS, OFFICIAL).
14. New York — Macy's 100th parade postponed to Saturday (USA TODAY,
    OFFICIAL). Restored in v13.1: first postponement in 100 years,
    ~900,000 without power.
15. Nairobi — court halts Ebola site, Laikipia stopped (CITIZEN TV,
    OFFICIAL). Restored in v13.1: High Court Kenya, 26 Nov, Judge
    Patricia Nyaundi.

Other v13.1 fixes: timeline clock times dropped (v12's times were never
verified one by one — labels only now); lead scene redrawn (radar dish +
missile launcher + explosion + smoke + 2 small drones — the two flat
discs did not read as a drone attack at 300px); new courthouse scene
for Nairobi; footer corrected to "ALL 15 STORIES VERIFIED 26 NOV 2026"
(the old "EVERY STORY FROM V12 VERIFIED 37 - NO NEW CLAIMS" is false
now that Abu Nada is a new claim vs v12's 37 — verified, but new).

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Render: `out/entry.png` (155,391 bytes,
sha256 0b61ccc51605441ea3f99120d510887a42afbaa8fb48093267a27134029a25b1,
deterministic across 2 runs). Copy also at
`~/workspace/makefun/news-image-20261126-v13.1-render.png`.

## Status

DO NOT SUBMIT. Entry quota is exhausted (6/6 used); bos must approve
the render first, then the retry cron submits when the reputation cap
reopens. v12 (37 stories, live entry 01a21e47, dev 0.977198) stays the
alternative until bos picks v12 vs v13.1.
