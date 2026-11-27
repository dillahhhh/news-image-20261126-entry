// The World in One Day - 26 November 2026. v13.1: fix pass on v13.
// A make.fun news-image entry. Draws a 1024x1024 newspaper front page in
// pure code (Node 22, standard library only) and writes /output/entry.png.
// No network, no external assets, deterministic: two runs are byte-identical.
//
// v13 (28 Nov ~03:45 WIB): bos drew his OWN layout (2 AI images, the 2nd —
// 03:28 WIB - is the main one) and said "Coba rapihin": rebuild THAT layout
// in code, text correct throughout, no garble, no watermark.
// v13.1 (28 Nov ~04:15 WIB): bos said "Sub", then "Yauda bnerin dlu" +
// "Cari sampe terverifikasi". Fix pass, verified by searching:
//   - Card 1 Kuwait "2 OTHERS INJURED": VERIFIED (Reuters 26 Nov: Tajani
//     "Two other people were injured: a Pakistani national and a captain
//     in the Kuwaiti army"; Kuwait Defence Ministry confirms). KEPT.
//   - Card 2 Gaza "8-10 PALESTINIANS": VERIFIED as a number (AP/BBC: 8
//     killed in 3 overnight strikes 26 Nov; Reuters: at least 9). BUT
//     "ABUELOUF KILLED" is WRONG-DATED: Mohammed Abu al-Ouf died WED
//     25 Nov (wife + 2 daughters, Shati camp). The 26 Nov dead name is
//     KHALED ABU NADA (Hamas deputy education minister) + wife Abeer,
//     killed at dawn in Deir al-Balah; Netanyahu confirmed 26 Nov.
//     (Likely origin: bos's AI image garbled BBC byline "Rushdi Abu
//     Alouf" into "Abuelouf killed".) Card 2 now reads "AIRSTRIKE KILLS
//     8-10 / PALESTINIANS DEAD; ABU NADA KILLED".
//   - Macy's 100th parade postponed (first time in 100 years, 26 Nov ->
//     Sat 28 Nov 08:30, ~900,000-960,000 without power) + Nairobi court
//     halts Ebola site (High Court Kenya 26 Nov, Judge Patricia Nyaundi)
//     RESTORED as small cards 14 + 15. Now 15 stories, all verified.
//   - Timeline clock times DROPPED: v12's times were never verified one
//     by one. Labels only (KOREA / EBOLA / GAZA / BISSAU / EU).
//   - Lead scene drawKuwait recomposed (radar dish + launcher +
//     explosion + smoke + 2 small drones) — the two flat discs did not
//     read as a drone attack at 300px. New drawCourt scene for Nairobi.
//   - Footer line corrected: "ALL 15 STORIES VERIFIED 26 NOV 2026"
//     (the old "EVERY STORY FROM V12 VERIFIED 37 - NO NEW CLAIMS" is
//     false now that Abu Nada is a new claim vs v12's 37 — verified,
//     but new).
// Layout: masthead date + red rule + gold bars flanking WORLD NEWS
// SUMMARY, THE DAY IN UTC timeline strip, 3 big stories on top, 12 small
// stories in 2 rows of 6, then a full-width dotted world map with
// numbered pins and an IN THIS EDITION index on the right, sources
// footer. NO "Dola AI" watermark, NO garbled text.
// DO NOT SUBMIT. Entry quota is exhausted (6/6 used); bos must approve
// the render first, then the retry cron submits when the cap reopens.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';
import { drawRefinery, drawTanker, drawGaza, drawIndia, drawTariffs, drawSatellites } from './art.ts';
import { SERIF, SERIFC, SANS, fontWidth, drawFont } from './fonts.ts';

const W = 1024;
const H = 1024;

// Palette
const PAPER = [247, 243, 234];
const INK = [16, 35, 63];
const NAVY = [16, 35, 63];
const RED = [179, 32, 44];
const GOLD = [232, 182, 76];
const GOLD_DARK = [180, 134, 38];
const WHITE = [255, 255, 255];
const GREY = [90, 96, 104];
const CARD = [255, 255, 255];

// ---------------------------------------------------------------------------
// Raster: a plain RGB framebuffer with filled-shape primitives.
// ---------------------------------------------------------------------------
class Raster {
  constructor(w, h, bg) {
    this.w = w;
    this.h = h;
    this.clip = null; // [x0, y0, x1, y1] or null
    this.buf = Buffer.alloc(w * h * 3);
    for (let i = 0; i < w * h; i++) {
      this.buf[i * 3] = bg[0];
      this.buf[i * 3 + 1] = bg[1];
      this.buf[i * 3 + 2] = bg[2];
    }
  }
  setClip(x, y, w, h) { this.clip = [x, y, x + w, y + h]; }
  clearClip() { this.clip = null; }
  // Blend one pixel of colour c with coverage a (0-255) over the pixel
  // already there. Used by drawFont for anti-aliased type.
  blend(x, y, c, a) {
    x |= 0; y |= 0;
    if (a <= 0) return;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    if (this.clip && (x < this.clip[0] || y < this.clip[1] || x >= this.clip[2] || y >= this.clip[3])) return;
    const o = (y * this.w + x) * 3;
    if (a >= 255) {
      this.buf[o] = c[0]; this.buf[o + 1] = c[1]; this.buf[o + 2] = c[2];
      return;
    }
    const inv = 255 - a;
    this.buf[o] = ((c[0] * a + this.buf[o] * inv + 127) / 255) | 0;
    this.buf[o + 1] = ((c[1] * a + this.buf[o + 1] * inv + 127) / 255) | 0;
    this.buf[o + 2] = ((c[2] * a + this.buf[o + 2] * inv + 127) / 255) | 0;
  }
  px(x, y, c) {
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    if (this.clip && (x < this.clip[0] || y < this.clip[1] || x >= this.clip[2] || y >= this.clip[3])) return;
    const o = (y * this.w + x) * 3;
    this.buf[o] = c[0]; this.buf[o + 1] = c[1]; this.buf[o + 2] = c[2];
  }
  rect(x, y, w, h, c) {
    x |= 0; y |= 0; w |= 0; h |= 0;
    let x0 = Math.max(0, x), y0 = Math.max(0, y);
    let x1 = Math.min(this.w, x + w), y1 = Math.min(this.h, y + h);
    if (this.clip) {
      x0 = Math.max(x0, this.clip[0]); y0 = Math.max(y0, this.clip[1]);
      x1 = Math.min(x1, this.clip[2]); y1 = Math.min(y1, this.clip[3]);
    }
    for (let yy = y0; yy < y1; yy++) {
      let o = (yy * this.w + x0) * 3;
      for (let xx = x0; xx < x1; xx++) {
        this.buf[o] = c[0]; this.buf[o + 1] = c[1]; this.buf[o + 2] = c[2];
        o += 3;
      }
    }
  }
  circle(cx, cy, r, c) {
    cx |= 0; cy |= 0; r |= 0;
    for (let dy = -r; dy <= r; dy++) {
      const dx = Math.floor(Math.sqrt(r * r - dy * dy));
      this.rect(cx - dx, cy + dy, dx * 2 + 1, 1, c);
    }
  }
  tri(x1, y1, x2, y2, x3, y3, c) {
    const minX = Math.max(0, Math.min(x1, x2, x3) | 0);
    const maxX = Math.min(this.w - 1, Math.max(x1, x2, x3) | 0);
    const minY = Math.max(0, Math.min(y1, y2, y3) | 0);
    const maxY = Math.min(this.h - 1, Math.max(y1, y2, y3) | 0);
    const d = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
    if (d === 0) return;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const a = ((x2 - x) * (y3 - y) - (y2 - y) * (x3 - x)) / d;
        const b = ((x3 - x) * (y1 - y) - (y3 - y) * (x1 - x)) / d;
        const cc = 1 - a - b;
        if (a >= 0 && b >= 0 && cc >= 0) this.px(x, y, c);
      }
    }
  }
  line(x1, y1, x2, y2, c, w) {
    const dx = x2 - x1, dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    const r = Math.max(1, Math.floor(w / 2));
    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      this.circle(Math.round(x1 + dx * t), Math.round(y1 + dy * t), r, c);
    }
  }
}

// ---------------------------------------------------------------------------
// PNG encoder (filter 0, zlib level 9). Deterministic.
// ---------------------------------------------------------------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function encodePNG(raster) {
  const raw = Buffer.alloc((raster.w * 3 + 1) * raster.h);
  for (let y = 0; y < raster.h; y++) {
    raw[y * (raster.w * 3 + 1)] = 0;
    raster.buf.copy(raw, y * (raster.w * 3 + 1) + 1, y * raster.w * 3, (y + 1) * raster.w * 3);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(raster.w, 0);
  ihdr.writeUInt32BE(raster.h, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------------------------------------------------------------------------
// Page composition - v13.1: bos's layout. 3 big + 12 small + full-width map.
// ---------------------------------------------------------------------------
import { drawKuwait, drawEU, drawEbola, drawGizaTruck, drawKorea, drawBangkok, drawBallot, drawParade, drawCourt } from './art.ts';

const GREEN = [34, 120, 60];
const MIDBLUE = [36, 68, 120];
const PURPLE = [120, 60, 120];
const TEAL = [0, 128, 128];
const ORANGEBROWN = [200, 90, 40];
const LIGHTBLUE = [90, 140, 180];

const REGION_COLORS = {
  'MID EAST': RED,
  'N AMERICA': NAVY,
  'EUROPE': MIDBLUE,
  'AFRICA': GREEN,
  'S ASIA': GOLD_DARK,
  'E ASIA': PURPLE,
  'SE ASIA': TEAL,
};

const STATUS_COLORS = {
  'OFFICIAL': GREEN,
  'CONFIRMED': NAVY,
  'REPORTED': GOLD_DARK,
  'CLAIM': RED,
};

// Dotted world map: land cells as [c0, c1] column ranges per row.
// 60 cols (lon -170..+170), 26 rows (lat ~77..-52). Cell = 5px. (v12 rows.)
const MAP_ROWS = [
  [[1, 5], [9, 16], [19, 25], [33, 33], [42, 59]],
  [[1, 7], [9, 17], [20, 26], [40, 59]],
  [[2, 8], [9, 19], [27, 27], [31, 35], [37, 59]],
  [[6, 9], [9, 21], [31, 34], [35, 59]],
  [[7, 21], [29, 30], [31, 34], [36, 58]],
  [[8, 21], [29, 36], [38, 50], [51, 55]],
  [[8, 18], [28, 35], [37, 41], [46, 54], [55, 56]],
  [[8, 18], [28, 35], [35, 38], [40, 42], [46, 53], [54, 56]],
  [[9, 18], [28, 36], [37, 41], [42, 46], [47, 51], [54, 54]],
  [[9, 15], [14, 18], [28, 35], [38, 41], [42, 46], [48, 51]],
  [[10, 14], [28, 36], [38, 40], [43, 45], [48, 52]],
  [[11, 15], [28, 32], [34, 38], [48, 52]],
  [[13, 16], [29, 38], [49, 53]],
  [[17, 19], [30, 38], [50, 56]],
  [[17, 21], [31, 38], [51, 56]],
  [[17, 22], [32, 38], [52, 57]],
  [[18, 23], [32, 38], [53, 56]],
  [[18, 24], [32, 38], [38, 39], [50, 55]],
  [[19, 24], [32, 38], [38, 38], [49, 56]],
  [[19, 24], [32, 37], [38, 38], [49, 56]],
  [[19, 24], [32, 37], [49, 56]],
  [[20, 24], [33, 36], [50, 55], [56, 57]],
  [[20, 23], [33, 35], [50, 54], [56, 56]],
  [[20, 22], [56, 56]],
  [[20, 22]],
  [[20, 21]],
];

// Map pins: [story number, col, row, region key]. v13.1 numbering (15).
const MAP_PINS = [
  [1, 38, 6, 'MID EAST'],
  [2, 33, 9, 'MID EAST'],
  [3, 45, 9, 'MID EAST'],
  [4, 42, 13, 'MID EAST'],
  [5, 31, 5, 'EUROPE'],
  [6, 27, 12, 'AFRICA'],
  [7, 19, 9, 'N AMERICA'],
  [8, 52, 8, 'E ASIA'],
  [9, 32, 12, 'AFRICA'],
  [10, 52, 13, 'SE ASIA'],
  [11, 46, 12, 'S ASIA'],
  [12, 14, 9, 'N AMERICA'],
  [13, 33, 16, 'AFRICA'],
  [14, 18, 6, 'N AMERICA'],
  [15, 36, 13, 'AFRICA'],
];

// The 3 big stories: [n, draw, kicker, headline lines, summary lines,
// source, status, region key]. Lead uses SERIF 44, the other two SERIF 24.
const BIG = [
  { n: 1, draw: drawKuwait, kick: 'LEAD STORY • KUWAIT',
    head: ['DRONE ATTACK', 'KILLS 2 ITALIANS'],
    sum: ['2 TECHNICIANS DEAD;', '2 OTHERS INJURED.'],
    src: 'REUTERS', status: 'CONFIRMED', region: 'MID EAST', lead: true },
  { n: 2, draw: drawGaza, kick: 'GAZA • MID EAST',
    head: ['AIRSTRIKE', 'KILLS 8-10'],
    sum: ['PALESTINIANS DEAD;', 'ABU NADA KILLED'],
    src: 'REUTERS', status: 'CONFIRMED', region: 'MID EAST', lead: false },
  { n: 3, draw: drawTanker, kick: 'PERSIAN GULF • HORMUZ',
    head: ['TANKER REPORTS', 'PROJECTILE BLAST'],
    sum: ['NEAR STRAIT', 'OF HORMUZ.'],
    src: 'IRNA', status: 'CLAIM', region: 'MID EAST', lead: false },
];

const SMALL = [
  { n: 4, draw: drawRefinery, kick: 'RAS TANURA', head: ['DRONES HIT', 'RAS TANURA'], sum: ['SAUDI ARABIA'], src: 'REUTERS', status: 'CLAIM', region: 'MID EAST' },
  { n: 5, draw: drawEU, kick: 'BRUSSELS', head: ['EU SUMMIT', 'NO DEAL'], sum: ['DE COS TO RUN ECB'], src: 'REUTERS', status: 'OFFICIAL', region: 'EUROPE' },
  { n: 6, draw: drawBallot, kick: 'BISSAU', head: ['MILITARY', 'DELAYS VOTE'], sum: ['ELECTION TO 2028'], src: 'AP', status: 'OFFICIAL', region: 'AFRICA' },
  { n: 7, draw: drawSatellites, kick: 'WASHINGTON', head: ['FCC APPROVES', 'SPACEX'], sum: ['1M SATELLITES'], src: 'FCC', status: 'OFFICIAL', region: 'N AMERICA' },
  { n: 8, draw: drawKorea, kick: 'SEOUL', head: ['KOREA HIKES', 'RATE TO 3.25%'], sum: ['3RD HIKE THIS YEAR'], src: 'YONHAP', status: 'OFFICIAL', region: 'E ASIA' },
  { n: 9, draw: drawGizaTruck, kick: 'GIZA', head: ['TANKER FIRE', 'KILLS 31'], sum: ['DRIVER HELD'], src: 'AP', status: 'OFFICIAL', region: 'AFRICA' },
  { n: 10, draw: drawBangkok, kick: 'BANGKOK', head: ['REFINERY', 'BLAST'], sum: ['INJURES NINE'], src: 'AP', status: 'CONFIRMED', region: 'SE ASIA' },
  { n: 11, draw: drawIndia, kick: 'MUMBAI', head: ['INDIA MARKS', '26/11'], sum: ['TRIBUTES PAID'], src: 'INDIA', status: 'OFFICIAL', region: 'S ASIA' },
  { n: 12, draw: drawTariffs, kick: 'WASHINGTON', head: ['TARIFFS ON', '14 PARTNERS'], sum: ['UP TO 20% PROPOSED'], src: 'USTR', status: 'OFFICIAL', region: 'N AMERICA' },
  { n: 13, draw: drawEbola, kick: 'DR CONGO', head: ['EBOLA PASSES', '12,021 CASES'], sum: ['5,904 DEAD'], src: 'REUTERS', status: 'OFFICIAL', region: 'AFRICA' },
  { n: 14, draw: drawParade, kick: 'NEW YORK', head: ["MACY'S", 'POSTPONED'], sum: ['100TH • SATURDAY'], src: 'USA TODAY', status: 'OFFICIAL', region: 'N AMERICA' },
  { n: 15, draw: drawCourt, kick: 'NAIROBI', head: ['COURT HALTS', 'EBOLA SITE'], sum: ['LAIKIPIA STOPPED'], src: 'CITIZEN TV', status: 'OFFICIAL', region: 'AFRICA' },
];

// Index panel (right of the map): [number, short label, region key].
const INDEX = [
  [1, 'KUWAIT - DRONE ATTACK', 'MID EAST'],
  [2, 'GAZA - AIRSTRIKE', 'MID EAST'],
  [3, 'HORMUZ - TANKER BLAST', 'MID EAST'],
  [4, 'RAS TANURA - DRONES HIT', 'MID EAST'],
  [5, 'EU - SUMMIT, NO DEAL', 'EUROPE'],
  [6, 'BISSAU - VOTE DELAYED', 'AFRICA'],
  [7, 'FCC - SPACEX APPROVED', 'N AMERICA'],
  [8, 'SEOUL - RATE TO 3.25%', 'E ASIA'],
  [9, 'GIZA - TANKER FIRE', 'AFRICA'],
  [10, 'BANGKOK - REFINERY BLAST', 'SE ASIA'],
  [11, 'MUMBAI - 26/11 MARKED', 'S ASIA'],
  [12, 'TARIFFS - 14 PARTNERS', 'N AMERICA'],
  [13, 'CONGO - EBOLA CASES', 'AFRICA'],
  [14, 'NEW YORK - PARADE POSTPONED', 'N AMERICA'],
  [15, 'NAIROBI - COURT HALTS EBOLA SITE', 'AFRICA'],
];

// Region key: [label, region key]. Counts: ME 4, AFRICA 4, N AMERICA 3,
// EUROPE 1, E ASIA 1, SE ASIA 1, S ASIA 1 (= 15).
const KEY = [
  ['MID EAST 4', 'MID EAST'],
  ['AFRICA 4', 'AFRICA'],
  ['N AMERICA 3', 'N AMERICA'],
  ['EUROPE 1', 'EUROPE'],
  ['E ASIA 1', 'E ASIA'],
  ['SE ASIA 1', 'SE ASIA'],
  ['S ASIA 1', 'S ASIA'],
];

// UTC timeline: labels only (v13.1). v12's clock times were never verified
// one by one, so no precise times are printed — only the region labels.
const TIMELINE = [
  ['KOREA', true],
  ['EBOLA', false],
  ['GAZA', true],
  ['BISSAU', false],
  ['EU', true],
];

function drawPage() {
  const g = new Raster(W, H, PAPER);

  // ---- Top navy bar --------------------------------------------------------
  g.rect(0, 0, W, 14, NAVY);

  // ---- Masthead date -------------------------------------------------------
  drawFont(g, (W - fontWidth(SERIF[60], 'THURSDAY 26 NOVEMBER 2026')) / 2, 78,
    SERIF[60], 'THURSDAY 26 NOVEMBER 2026', INK);
  g.rect(0, 88, W, 6, RED);

  // ---- WORLD NEWS SUMMARY, gold bars flanking ------------------------------
  const title = 'WORLD NEWS SUMMARY';
  const tw = fontWidth(SERIF[44], title);
  const barW = (W - tw) / 2 - 16;
  g.rect(0, 96, barW, 40, GOLD);
  g.rect(W - barW, 96, barW, 40, GOLD);
  drawFont(g, (W - tw) / 2, 132, SERIF[44], title, INK);

  // ---- Timeline: THE DAY IN UTC --------------------------------------------
  g.rect(0, 148, 190, 30, NAVY);
  drawFont(g, (190 - fontWidth(SANS[15], 'THE DAY IN UTC')) / 2, 168, SANS[15], 'THE DAY IN UTC', WHITE);
  const tlY = 163;
  g.rect(205, tlY, 807, 2, NAVY);
  const dotXs = [280, 430, 580, 730, 890];
  for (let i = 0; i < TIMELINE.length; i++) {
    const dx = dotXs[i];
    g.circle(dx, tlY + 1, 5, RED);
    g.circle(dx, tlY + 1, 2, WHITE);
    const label = TIMELINE[i][0];
    const lw = fontWidth(SANS[15], label);
    let lx = dx - lw / 2;
    if (lx < 205) lx = 205;
    if (lx + lw > W - 4) lx = W - 4 - lw;
    drawFont(g, lx, TIMELINE[i][1] ? 157 : 183, SANS[15], label, INK);
  }

  // ---- Helpers for story cells ---------------------------------------------
  function chip(x, y, label, bg) {
    const w = fontWidth(SANS[14], label) + 10;
    g.rect(x, y, w, 16, bg);
    drawFont(g, x + 5, y + 12, SANS[14], label, WHITE);
    return w;
  }
  function badge(cx, cy, n, big) {
    g.circle(cx, cy, big ? 13 : 9, RED);
    const s = String(n);
    const tab = big ? SANS[14] : SANS[12];
    drawFont(g, cx - fontWidth(tab, s) / 2, cy + (big ? 5 : 4), tab, s, WHITE);
  }

  // ---- Big 3 ---------------------------------------------------------------
  const bigY = 190, bigH = 236;
  const bigCols = [
    { x: 12, w: 496 },
    { x: 516, w: 244 },
    { x: 768, w: 244 },
  ];
  for (let i = 0; i < 3; i++) {
    const st = BIG[i];
    const bx = bigCols[i].x, bw = bigCols[i].w;
    const bigIlloH = st.lead ? 88 : 100;
    g.rect(bx, bigY, bw, bigH, CARD);
    g.rect(bx, bigY, bw, 2, NAVY);
    g.rect(bx, bigY, 2, bigH, NAVY);
    g.rect(bx + bw - 2, bigY, 2, bigH, NAVY);
    g.rect(bx, bigY + bigH - 2, bw, 2, NAVY);
    g.setClip(bx + 2, bigY + 2, bw - 4, bigIlloH);
    st.draw(g, bx + 2, bigY + 2, bw - 4, bigIlloH);
    g.clearClip();
    badge(bx + 18, bigY + 18, st.n, true);
    const srcW = fontWidth(SANS[14], st.src) + 10;
    chip(bx + bw - 8 - srcW, bigY + 8, st.src, RED);
    const stW = fontWidth(SANS[14], st.status) + 10;
    chip(bx + bw - 8 - stW, bigY + 2 + bigIlloH - 22, st.status, STATUS_COLORS[st.status]);
    const tx0 = bx + 12;
    const kBase = bigY + bigIlloH + 20;
    drawFont(g, tx0, kBase, SANS[16], st.kick, RED);
    const htab = st.lead ? SERIF[44] : SERIF[24];
    const hlh = st.lead ? 38 : 24;
    let hy = kBase + hlh;
    for (const line of st.head) {
      drawFont(g, tx0, hy, htab, line, INK);
      hy += hlh;
    }
    let sy = hy - hlh + 22;
    for (const line of st.sum) {
      drawFont(g, tx0, sy, SANS[17], line, INK);
      sy += 20;
    }
  }

  // ---- Small 12: two rows of six -------------------------------------------
  const smY0 = 430, smH = 128, smW = 160, smGap = 8, smIlloH = 40;
  for (let i = 0; i < 12; i++) {
    const st = SMALL[i];
    const col = i % 6, row = (i / 6) | 0;
    const cx = 12 + col * (smW + smGap);
    const cy = smY0 + row * (smH + 6);
    g.rect(cx, cy, smW, smH, CARD);
    g.rect(cx, cy, smW, 2, NAVY);
    g.rect(cx, cy, 2, smH, NAVY);
    g.rect(cx + smW - 2, cy, 2, smH, NAVY);
    g.rect(cx, cy + smH - 2, smW, 2, NAVY);
    g.setClip(cx + 2, cy + 2, smW - 4, smIlloH);
    st.draw(g, cx + 2, cy + 2, smW - 4, smIlloH);
    g.clearClip();
    badge(cx + 14, cy + 14, st.n, false);
    const sSrcW = fontWidth(SANS[14], st.src) + 10;
    chip(cx + smW - 6 - sSrcW, cy + 6, st.src, RED);
    const sStW = fontWidth(SANS[14], st.status) + 10;
    chip(cx + smW - 6 - sStW, cy + 2 + smIlloH - 20, st.status, STATUS_COLORS[st.status]);
    drawFont(g, cx + 6, cy + smIlloH + 14, SANS[14], st.kick, RED);
    let hy = cy + smIlloH + 14 + 22;
    for (const line of st.head) {
      drawFont(g, cx + 6, hy, SERIFC[22], line, INK);
      hy += 22;
    }
    drawFont(g, cx + 6, hy - 4, SANS[13], st.sum[0], GREY);
  }

  // ---- Section header: map + index -----------------------------------------
  drawFont(g, 12, 712, SANS[18], 'WHERE IT HAPPENED • PINS ARE PICTURE NUMBERS', RED);
  const idxHead = 'IN THIS EDITION • 15 STORIES';
  drawFont(g, W - 12 - fontWidth(SANS[18], idxHead), 712, SANS[18], idxHead, RED);

  // ---- Map box (full width) ------------------------------------------------
  const boxY = 720, boxH = 272;
  g.rect(12, boxY, 1000, boxH, CARD);
  g.rect(12, boxY, 1000, 2, NAVY);
  g.rect(12, boxY, 2, boxH, NAVY);
  g.rect(12 + 1000 - 2, boxY, 2, boxH, NAVY);
  g.rect(12, boxY + boxH - 2, 1000, 2, NAVY);

  // Dotted world map, left.
  const mapX = 36, mapY = boxY + 16, cell = 5;
  for (let r = 0; r < MAP_ROWS.length; r++) {
    for (const seg of MAP_ROWS[r]) {
      for (let c = seg[0]; c <= seg[1]; c++) {
        g.circle(mapX + c * cell + 2, mapY + r * cell + 2, 2, GREY);
      }
    }
  }
  for (const pin of MAP_PINS) {
    const px = mapX + pin[1] * cell + 2;
    const py = mapY + pin[2] * cell + 2;
    const s = String(pin[0]);
    const bw2 = fontWidth(SANS[12], s) + 8;
    g.rect(px - bw2 / 2 - 1, py - 7, bw2 + 2, 14, WHITE);
    g.rect(px - bw2 / 2, py - 6, bw2, 12, REGION_COLORS[pin[3]]);
    drawFont(g, px - fontWidth(SANS[12], s) / 2, py + 4, SANS[12], s, WHITE);
  }
  drawFont(g, 36, boxY + 168, SANS[14], 'PINS COLOURED BY REGION', GREY);
  drawFont(g, 36, boxY + 188, SANS[14], '15 STORIES • 26 NOV 2026', GREY);

  // Index panel, right: two columns of short labels (8 + 7).
  const idxCols = [372, 700];
  for (let i = 0; i < INDEX.length; i++) {
    const col = i < 8 ? 0 : 1;
    const row = col === 0 ? i % 8 : i - 8;
    const lx = idxCols[col];
    const ly = boxY + 24 + row * 20;
    const num = String(INDEX[i][0]);
    drawFont(g, lx, ly, SANS[15], num, REGION_COLORS[INDEX[i][2]]);
    drawFont(g, lx + fontWidth(SANS[15], num) + 6, ly, SANS[15], INDEX[i][1], INK);
  }
  drawFont(g, 372, boxY + 248, SANS[13], 'ALL 15 STORIES VERIFIED 26 NOV 2026', GREY);
  // Region key, bottom of the panel: two rows (4 + 3).
  const keyRows = [KEY.slice(0, 4), KEY.slice(4)];
  for (let r = 0; r < keyRows.length; r++) {
    let kx = 372;
    const keyY = boxY + 186 + r * 20;
    for (let i = 0; i < keyRows[r].length; i++) {
      g.rect(kx, keyY - 10, 10, 10, REGION_COLORS[keyRows[r][i][1]]);
      drawFont(g, kx + 14, keyY, SANS[13], keyRows[r][i][0], INK);
      kx += 14 + fontWidth(SANS[13], keyRows[r][i][0]) + 18;
    }
  }

  // ---- Footer ---------------------------------------------------------------
  g.rect(0, 1002, W, 2, GOLD);
  const foot = 'SOURCES: REUTERS, BBC, AP, EURONEWS, LOCAL REPORTS';
  drawFont(g, (W - fontWidth(SANS[13], foot)) / 2, 1019, SANS[13], foot, GREY);

  return g;
}

// ---------------------------------------------------------------------------
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const png = encodePNG(drawPage());
writeFileSync(join(outDir, 'entry.png'), png);
console.log('wrote', join(outDir, 'entry.png'), png.length, 'bytes');
