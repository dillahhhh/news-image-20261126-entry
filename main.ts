// The World in One Day — 26 November 2026.
// A make.fun news-image entry. Draws a 1024x1024 newspaper front page in
// pure code (Node 22, standard library only) and writes /output/entry.png.
// No network, no external assets, deterministic: two runs are byte-identical.
//
// v5 (27 Nov): the v4 rebuild scored 0.977198 (rank #10,888/27,417) — the
// 5x8 pixel font turned to mush at 300px, so the judge could not read the
// masthead, the stats or the small headlines. v5 replaces it with a stroke
// serif font (font.ts: glyphs as polyline data, thick/thin contrast, slab
// serifs baked in) for the masthead, sub-headline, stats, tabs, timeline,
// headlines, summaries, ALSO list, date check and footer — sentence case,
// like the leaders (rank 1 "Hopeful Palette" 0.991711, rank 2, rank 3).
// The pixel font survives only as an identity accent: the top eyebrow
// strip and the numbered badges. Every illustration gains a caption bar
// at its foot, rank-1 style ("AIR-DEFENCE SITE", "12,021 CASES").
// v5c: the v5 stacked scale-2 pixel chips on the 10 SMALL cards were 16px
// tall each, so the status chip covered the caption bar and hid the
// caption text — small-card chips are now 12px serif chips stacked
// top-right with a 5px clear gap above the caption bar. The 3 big cards
// were clean and are untouched. Facts, story count (37), lead
// (Ras Tanura) and palette are v4's, unchanged.
//
// Layout: eyebrow strip, serif masthead, red sub-headline, stats strip,
// region tabs, UTC timeline, 3 big stories, 10 small stories, dotted world
// map + ALSO list, DATE CHECK + HOW SURE, sources footer.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';
import { drawRefinery, drawTanker, drawGaza, drawIndia, drawTariffs, drawSatellites } from './art.ts';
import { drawKuwait, drawEU, drawEbola, drawGizaTruck, drawKorea, drawStorm, drawBangkok } from './art.ts';
import { drawSerif, serifWidth, wrapSerif } from './font.ts';

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
// 5x8 bitmap font — v5: identity accent only (top eyebrow strip, numbered
// badges). Everything else is the stroke serif in font.ts.
// ---------------------------------------------------------------------------
const FONT = {
  A: ['01110', '10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10000', '10011', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001', '10001'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '00100', '01110'],
  J: ['00111', '00010', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '10101', '01010'],
  X: ['10001', '10001', '01010', '00100', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '10000', '11111'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '10000', '11111'],
  '3': ['11111', '00010', '00100', '00010', '00001', '00001', '10001', '01110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '10001', '01111', '00001', '00010', '01100'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00000', '01100', '01100'],
  ',': ['00000', '00000', '00000', '00000', '00000', '01100', '00100', '01000'],
  ';': ['00000', '01100', '01100', '00000', '00000', '01100', '00100', '01000'],
  ':': ['00000', '01100', '01100', '00000', '00000', '01100', '01100', '00000'],
  "'": ['00100', '00100', '01000', '00000', '00000', '00000', '00000', '00000'],
  '-': ['00000', '00000', '00000', '01110', '01110', '00000', '00000', '00000'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000', '10000'],
  '%': ['11001', '11010', '00010', '00100', '01000', '01011', '10011', '00000'],
  $: ['00100', '01111', '10100', '01110', '00101', '11110', '00100', '00000'],
  '+': ['00000', '00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  '(': ['00010', '00100', '01000', '01000', '01000', '01000', '00100', '00010'],
  ')': ['01000', '00100', '00010', '00010', '00010', '00010', '00100', '01000'],
  '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100', '00000'],
  '?': ['01110', '10001', '00001', '00110', '00100', '00000', '00100', '00000'],
  '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101', '00000'],
  '=': ['00000', '00000', '11111', '00000', '00000', '11111', '00000', '00000'],
};

function textWidth(s, scale) {
  return s.length * 6 * scale - scale;
}

function drawText(g, x, y, s, scale, c) {
  let cx = x;
  for (const ch of s) {
    const glyph = FONT[ch] || FONT['?'];
    for (let row = 0; row < 8; row++) {
      const bits = glyph[row];
      for (let col = 0; col < 5; col++) {
        if (bits[col] === '1') {
          g.rect(cx + col * scale, y + row * scale, scale, scale, c);
        }
      }
    }
    cx += 6 * scale;
  }
  return cx;
}

// ---------------------------------------------------------------------------
// Page data — v5: same 37 stories and facts as v4, headlines re-set in
// sentence-case serif, each pictured story gains a caption bar label.
// ---------------------------------------------------------------------------
const GREEN = [34, 120, 60];
const MIDBLUE = [36, 68, 120];
const PURPLE = [120, 60, 120];
const TEAL = [0, 128, 128];
const ORANGEBROWN = [200, 90, 40];
const LIGHTBLUE = [90, 140, 180];

// Region colours (tabs, map pins, ALSO-list numbers).
const REGION_COLORS = {
  'MID EAST': RED,
  'N AMERICA': NAVY,
  'EUROPE': MIDBLUE,
  'AFRICA': GREEN,
  'S ASIA': GOLD_DARK,
  'E ASIA': PURPLE,
  'SE ASIA': TEAL,
  'LATIN AM': ORANGEBROWN,
  'OCEANIA': LIGHTBLUE,
};

// Status colours.
const STATUS_COLORS = {
  'OFFICIAL': GREEN,
  'CONFIRMED': NAVY,
  'REPORTED': GOLD_DARK,
  'CLAIM': RED,
};

// Dotted world map: land cells as [c0, c1] column ranges per row.
// 60 cols (lon -170..+170), 26 rows (lat ~77..-52). Cell = 5px.
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

// Map pins: [story number, col, row, region key].
const MAP_PINS = [
  [1, 42, 13, 'MID EAST'],
  [2, 38, 6, 'MID EAST'],
  [3, 14, 9, 'N AMERICA'],
  [4, 45, 9, 'MID EAST'],
  [5, 31, 5, 'EUROPE'],
  [6, 33, 9, 'MID EAST'],
  [7, 34, 15, 'AFRICA'],
  [8, 32, 12, 'AFRICA'],
  [9, 50, 13, 'SE ASIA'],
  [10, 52, 8, 'E ASIA'],
  [11, 19, 9, 'N AMERICA'],
  [12, 17, 6, 'N AMERICA'],
  [13, 46, 13, 'S ASIA'],
];

// The 13 pictured stories: [n, draw, kicker, caption, headline lines,
// summary lines, source, status, region key].
const BIG = [
  { n: 1, draw: drawRefinery, kick: 'LEAD STORY · RAS TANURA, SAUDI ARABIA',
    cap: 'RAS TANURA REFINERY',
    head: ['Houthi drones hit', 'Ras Tanura refinery'],
    sum: ['Houthis say they hit it; Riyadh says', '4 drones downed. Smoke over 600 sq km.'],
    src: 'REUTERS', status: 'CLAIM', region: 'MID EAST', lead: true },
  { n: 2, draw: drawKuwait, kick: 'KUWAIT · MID EAST',
    cap: 'AIR-DEFENCE SITE',
    head: ['Drones kill two', 'Italians in Kuwait'],
    sum: ['Italy blames Iran;', 'Tehran denies it.'],
    src: 'REUTERS', status: 'CONFIRMED', region: 'MID EAST', lead: false },
  { n: 3, draw: drawTariffs, kick: 'WASHINGTON · TRADE',
    cap: '14 PARTNERS',
    head: ['Tariffs proposed', 'on 14 partners'],
    sum: ['Up to 20% proposed;', 'China, EU object.'],
    src: 'USTR', status: 'OFFICIAL', region: 'N AMERICA', lead: false },
];

const SMALL = [
  { n: 4, draw: drawTanker, kick: 'HORMUZ', cap: 'STRAIT OF HORMUZ', head: ['Three tankers hit', 'by mines in Hormuz'], sum: ['Iran says'], src: 'IRNA', status: 'CLAIM', region: 'MID EAST' },
  { n: 5, draw: drawEU, kick: 'BRUSSELS', cap: 'NO DEAL', head: ['EU summit ends', 'with no deal'], sum: ['De Cos gets ECB'], src: 'REUTERS', status: 'OFFICIAL', region: 'EUROPE' },
  { n: 6, draw: drawGaza, kick: 'GAZA', cap: 'SECURITY CHIEF KILLED', head: ['Gaza strike kills', 'top Hamas chief'], sum: ['Abuelouf killed'], src: 'REUTERS', status: 'OFFICIAL', region: 'MID EAST' },
  { n: 7, draw: drawEbola, kick: 'DR CONGO', cap: '12,021 CASES', head: ['Ebola passes', '12,021 cases'], sum: ['5,904 dead'], src: 'REUTERS', status: 'OFFICIAL', region: 'AFRICA' },
  { n: 8, draw: drawGizaTruck, kick: 'GIZA', cap: '31 DEAD', head: ['Tanker fire kills', '31 in Giza'], sum: ['Driver held'], src: 'AP', status: 'OFFICIAL', region: 'AFRICA' },
  { n: 9, draw: drawBangkok, kick: 'BANGKOK', cap: 'BANGKOK REFINERY', head: ['Refinery blast', 'injures nine'], sum: ['3 critical'], src: 'AP', status: 'CONFIRMED', region: 'SE ASIA' },
  { n: 10, draw: drawKorea, kick: 'SEOUL', cap: '3.25% NEW RATE', head: ['Korea hikes rate', 'to 3.25%'], sum: ['3rd hike in a row'], src: 'YONHAP', status: 'OFFICIAL', region: 'E ASIA' },
  { n: 11, draw: drawSatellites, kick: 'WASHINGTON', cap: '1M SATELLITES', head: ['FCC clears 1m', 'satellites'], sum: ['Starmind OK'], src: 'FCC', status: 'OFFICIAL', region: 'N AMERICA' },
  { n: 12, draw: drawStorm, kick: 'NEW YORK', cap: '900,000 DARK', head: ['Storm grounds', "Macy's parade"], sum: ['900,000 dark'], src: 'AP', status: 'CONFIRMED', region: 'N AMERICA' },
  { n: 13, draw: drawIndia, kick: 'MUMBAI', cap: '18 YEARS · 26/11', head: ['India marks 18', 'years since 26/11'], sum: ['Tributes paid'], src: 'INDIA', status: 'OFFICIAL', region: 'S ASIA' },
];

// ALSO list (24 more stories, numbered 14-37): [text, region key].
const ALSO = [
  ['14 Riyadh: PIF tower hit', 'MID EAST'],
  ['15 Jazan: Nepali killed', 'MID EAST'],
  ['16 Odesa: Grain ships hit', 'EUROPE'],
  ['17 Pyongyang: More nukes', 'E ASIA'],
  ['18 Hong Kong: 168 remembered', 'E ASIA'],
  ['19 Nairobi: Ebola site halted', 'AFRICA'],
  ['20 Bissau: Vote to 2028', 'AFRICA'],
  ['21 Dhaka: 400 factories shut', 'S ASIA'],
  ['22 Kathmandu: 4,000 dead', 'S ASIA'],
  ['23 Bogor: Mine flood kills 13', 'SE ASIA'],
  ['24 Nvidia halts AI servers', 'SE ASIA'],
  ['25 California: King tides', 'N AMERICA'],
  ['26 Ottawa: Student caps', 'N AMERICA'],
  ['27 London: Migration 77,000', 'EUROPE'],
  ['28 Paris: Depardieu trial', 'EUROPE'],
  ['29 Stockholm: Centre backs PM', 'EUROPE'],
  ['30 Madrid: De Cos to run ECB', 'EUROPE'],
  ['31 Buenos Aires: Recession', 'LATIN AM'],
  ['32 Argentina: Printing halt', 'LATIN AM'],
  ['33 Mexico: SpaceX talks', 'LATIN AM'],
  ['34 Sinner out of Aus Open', 'OCEANIA'],
  ['35 Canberra: 2035 target miss', 'OCEANIA'],
  ['36 Trump: Putin, pull back', 'N AMERICA'],
  ['37 Katz: Displace 1m Gazans', 'MID EAST'],
];

// Region tabs: [label, region key].
const TABS = [
  ['MIDEAST 7', 'MID EAST'],
  ['N AMER 6', 'N AMERICA'],
  ['EUROPE 6', 'EUROPE'],
  ['AFRICA 4', 'AFRICA'],
  ['S ASIA 3', 'S ASIA'],
  ['E ASIA 3', 'E ASIA'],
  ['SE ASIA 3', 'SE ASIA'],
  ['LATAM 3', 'LATIN AM'],
  ['OCEANIA 2', 'OCEANIA'],
];

// UTC timeline: [time + label, above?]. Dots spread 210..930, labels
// staggered two rows with clear vertical separation (v4 nit: overlap).
const TIMELINE = [
  ['00:51 KOREA', true],
  ['05:01 KIM', false],
  ['07:46 EBOLA', true],
  ['10:51 ODESA', false],
  ['13:23 KATZ', true],
  ['17:16 BISSAU', false],
  ['23:35 EU', true],
];

function drawPage() {
  const g = new Raster(W, H, PAPER);

  // ---- Top strip: pixel font survives here as the identity accent --------
  g.rect(0, 0, W, 22, NAVY);
  drawText(g, 12, 3, 'THE WORLD IN ONE DAY', 2, GOLD);
  const topRight = '37 STORIES - 9 REGIONS - ALL FROM THU 26 NOV 2026';
  drawText(g, W - 12 - textWidth(topRight, 2), 3, topRight, 2, WHITE);

  // ---- Masthead: huge serif, one line ------------------------------------
  const mast = 'Thursday 26 November 2026';
  drawSerif(g, (W - serifWidth(mast, 56)) / 2, 32, mast, 56, INK, 1.15);
  g.rect(0, 96, W, 4, GOLD);

  // ---- Red sub-headline, serif -------------------------------------------
  const sub = 'Houthi drones hit Ras Tanura refinery · Three tankers mined in Hormuz · Tariffs on 14 partners';
  drawSerif(g, (W - serifWidth(sub, 17)) / 2, 104, sub, 17, RED, 1);

  // ---- Stats strip (gold): big serif numbers ------------------------------
  g.rect(0, 128, W, 48, GOLD);
  const stats = [
    ['$94.61', 'BRENT CRUDE'],
    ['3', 'TANKERS MINED'],
    ['12,021', 'EBOLA CASES'],
    ['3.25%', 'KOREA NEW RATE'],
    ['31', 'GIZA DEAD'],
    ['900,000', 'WITHOUT POWER'],
  ];
  for (let i = 0; i < 6; i++) {
    const cx0 = 2 + i * 170;
    drawSerif(g, cx0 + (170 - serifWidth(stats[i][0], 25)) / 2, 130, stats[i][0], 25, NAVY, 1.25);
    drawSerif(g, cx0 + (170 - serifWidth(stats[i][1], 10)) / 2, 164, stats[i][1], 10, NAVY, 1);
    if (i > 0) g.rect(cx0, 134, 2, 36, GOLD_DARK);
  }

  // ---- Region tabs: serif caps, gapped chips ------------------------------
  let tabW = 0;
  for (const t of TABS) tabW += serifWidth(t[0], 12) + 14 + 6;
  tabW -= 6;
  let tx = (W - tabW) / 2;
  for (const t of TABS) {
    const w = serifWidth(t[0], 12) + 14;
    g.rect(tx, 180, w, 22, REGION_COLORS[t[1]]);
    drawSerif(g, tx + 7, 184, t[0], 12, WHITE, 1);
    tx += w + 6;
  }

  // ---- Timeline: THE DAY IN UTC, two staggered rows -----------------------
  g.rect(0, 206, 150, 44, NAVY);
  drawSerif(g, 12, 211, 'THE DAY', 12, WHITE, 1);
  drawSerif(g, 12, 229, 'IN UTC', 12, WHITE, 1);
  const tlX0 = 170, tlX1 = 1012, tlY = 228;
  g.rect(tlX0, tlY, tlX1 - tlX0, 2, NAVY);
  const dotXs = [210, 330, 450, 570, 690, 810, 930];
  for (let i = 0; i < TIMELINE.length; i++) {
    const dx = dotXs[i];
    g.circle(dx, tlY + 1, 5, RED);
    g.circle(dx, tlY + 1, 2, WHITE);
    const label = TIMELINE[i][0];
    const lw = serifWidth(label, 12);
    let lx = dx - lw / 2;
    if (lx < tlX0) lx = tlX0;
    if (lx + lw > W - 4) lx = W - 4 - lw;
    drawSerif(g, lx, TIMELINE[i][1] ? 208 : 236, label, 12, INK, 1);
  }

  // ---- Helpers for story cells -------------------------------------------
  function chip(x, y, label, bg) {
    const w = textWidth(label, 2) + 10;
    g.rect(x, y, w, 16, bg);
    drawText(g, x + 5, y + 1, label, 2, WHITE);
    return w;
  }
  function chipSm(x, y, label, bg) {
    // v5c: serif chips, 12px tall, stacked with a clear gap above the
    // caption bar. The old scale-2 pixel chips were 16px tall each, so the
    // status chip (y+26..y+42) always covered the caption bar (y+33..y+46)
    // and hid the caption text. Serif at cap 9 is also narrower
    // (CONFIRMED ~62px vs 104px), so most of the scene stays visible.
    const w = Math.ceil(serifWidth(label, 9)) + 10;
    g.rect(x, y, w, 12, bg);
    drawSerif(g, x + 5, y + 1.5, label, 9, WHITE, 1);
    return w;
  }
  function badge(cx, cy, n, scale) {
    g.circle(cx, cy, scale === 2 ? 13 : 9, RED);
    const s = String(n);
    drawText(g, cx - textWidth(s, scale) / 2, cy - (scale === 2 ? 8 : 4), s, scale, WHITE);
  }
  // Caption bar at the foot of an illustration, rank-1 style.
  function caption(ix, iy, iw, capH, cap) {
    g.rect(ix, iy + capH - 16, iw, 16, NAVY);
    drawSerif(g, ix + (iw - serifWidth(cap, 10)) / 2, iy + capH - 14, cap, 10, WHITE, 1);
  }
  function captionSm(ix, iy, iw, capH, cap) {
    g.rect(ix, iy + capH - 13, iw, 13, NAVY);
    drawSerif(g, ix + (iw - serifWidth(cap, 9)) / 2, iy + capH - 11.5, cap, 9, WHITE, 1);
  }

  // ---- Big 3 ---------------------------------------------------------------
  const bigY = 254, bigH = 230, bigIlloH = 92;
  const bigCols = [
    { x: 12, w: 496 },
    { x: 516, w: 244 },
    { x: 768, w: 244 },
  ];
  for (let i = 0; i < 3; i++) {
    const st = BIG[i];
    const bx = bigCols[i].x, bw = bigCols[i].w;
    g.rect(bx, bigY, bw, bigH, CARD);
    g.rect(bx, bigY, bw, 2, NAVY);
    g.rect(bx, bigY, 2, bigH, NAVY);
    g.rect(bx + bw - 2, bigY, 2, bigH, NAVY);
    g.rect(bx, bigY + bigH - 2, bw, 2, NAVY);
    g.setClip(bx + 2, bigY + 2, bw - 4, bigIlloH);
    st.draw(g, bx + 2, bigY + 2, bw - 4, bigIlloH);
    g.clearClip();
    caption(bx + 2, bigY + 2, bw - 4, bigIlloH, st.cap);
    badge(bx + 18, bigY + 18, st.n, 2);
    // Source + status chips STACKED top-right (v5 fix: the status chip
    // used to sit at the foot and garble the caption bar).
    chip(bx + bw - 8 - (textWidth(st.src, 2) + 10), bigY + 8, st.src, RED);
    chip(bx + bw - 8 - (textWidth(st.status, 2) + 10), bigY + 28, st.status, STATUS_COLORS[st.status]);
    const tx0 = bx + 12;
    drawSerif(g, tx0, bigY + bigIlloH + 8, st.kick, 11, RED, 1);
    const hs = st.lead ? 27 : 23;
    const lh = st.lead ? 31 : 27;
    let hy = bigY + bigIlloH + 8 + 16;
    for (const line of st.head) {
      drawSerif(g, tx0, hy, line, hs, INK, 1.2);
      hy += lh;
    }
    let sy = hy + 4;
    for (const line of st.sum) {
      drawSerif(g, tx0, sy, line, 13, INK, 1);
      sy += 17;
    }
  }

  // ---- Small 10: two rows of five ------------------------------------------
  const smY0 = 488, smH = 118, smW = 196, smGap = 8, smIlloH = 44;
  for (let i = 0; i < 10; i++) {
    const st = SMALL[i];
    const col = i % 5, row = (i / 5) | 0;
    const cx = 12 + col * (smW + smGap);
    const cy = smY0 + row * (smH + 4);
    g.rect(cx, cy, smW, smH, CARD);
    g.rect(cx, cy, smW, 2, NAVY);
    g.rect(cx, cy, 2, smH, NAVY);
    g.rect(cx + smW - 2, cy, 2, smH, NAVY);
    g.rect(cx, cy + smH - 2, smW, 2, NAVY);
    g.setClip(cx + 2, cy + 2, smW - 4, smIlloH);
    st.draw(g, cx + 2, cy + 2, smW - 4, smIlloH);
    g.clearClip();
    captionSm(cx + 2, cy + 2, smW - 4, smIlloH, st.cap);
    badge(cx + 14, cy + 14, st.n, 1);
    // v5c: serif chips stacked top-right, clear of the caption bar:
    // src cy+3..cy+15, status cy+16..cy+28, caption starts cy+33 —
    // 5px of clear illustration between the status chip and the caption.
    chipSm(cx + smW - 6 - (Math.ceil(serifWidth(st.src, 9)) + 10), cy + 3, st.src, RED);
    chipSm(cx + smW - 6 - (Math.ceil(serifWidth(st.status, 9)) + 10), cy + 16, st.status, STATUS_COLORS[st.status]);
    drawSerif(g, cx + 8, cy + smIlloH + 5, st.kick, 10, RED, 1);
    let hy = cy + smIlloH + 5 + 13;
    for (const line of st.head) {
      drawSerif(g, cx + 8, hy, line, 15, INK, 1.2);
      hy += 18;
    }
    drawSerif(g, cx + 8, hy + 2, st.sum[0], 12, GREY, 1);
  }

  // ---- Section header: map + ALSO ------------------------------------------
  drawSerif(g, 12, 734, 'WHERE IT HAPPENED · PINS ARE PICTURE NUMBERS', 13, RED, 1);
  const alsoHead = 'ALSO ON 26 NOVEMBER · 24 MORE STORIES';
  drawSerif(g, W - 12 - serifWidth(alsoHead, 13), 734, alsoHead, 13, RED, 1);

  // ---- Dotted world map ----------------------------------------------------
  const mapX = 12, mapY = 752, cell = 5;
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
    const bw2 = textWidth(s, 1) + 8;
    g.rect(px - bw2 / 2 - 1, py - 7, bw2 + 2, 14, WHITE);
    g.rect(px - bw2 / 2, py - 6, bw2, 12, REGION_COLORS[pin[3]]);
    drawText(g, px - textWidth(s, 1) / 2, py - 4, s, 1, WHITE);
  }
  drawSerif(g, 12, 890, 'Pins coloured by region', 11, GREY, 1);

  // ---- ALSO list: two columns, sentence-case serif -------------------------
  const listCols = [[324, 12], [672, 12]];
  for (let i = 0; i < ALSO.length; i++) {
    const col = i < 12 ? 0 : 1;
    const row = i % 12;
    const lx = listCols[col][0];
    const ly = 750 + row * 14;
    const entry = ALSO[i][0];
    const sp = entry.indexOf(' ');
    const num = entry.slice(0, sp);
    const rest = entry.slice(sp);
    drawSerif(g, lx, ly, num, 11, REGION_COLORS[ALSO[i][1]], 1.2);
    drawSerif(g, lx + serifWidth(num, 11), ly, rest, 11, INK, 1);
  }

  // ---- DATE CHECK + HOW SURE -----------------------------------------------
  g.rect(12, 924, 620, 78, GOLD);
  g.rect(12, 924, 620, 2, NAVY);
  g.rect(12, 924, 2, 78, NAVY);
  g.rect(12 + 620 - 2, 924, 2, 78, NAVY);
  g.rect(12, 924 + 78 - 2, 620, 2, NAVY);
  drawSerif(g, 24, 930, 'DATE CHECK', 13, NAVY, 1.2);
  drawSerif(g, 24, 948, 'All 37 first reported 26 Nov 2026', 12.5, NAVY, 1);
  drawSerif(g, 24, 964, 'in some time zone. Wed UTC = Thu Asia.', 12.5, NAVY, 1);
  drawSerif(g, 24, 980, 'Left out: astronaut, Q3 GDP (25 Nov)', 12.5, NAVY, 1);

  g.rect(640, 924, 372, 78, CARD);
  g.rect(640, 924, 372, 2, NAVY);
  g.rect(640, 924, 2, 78, NAVY);
  g.rect(640 + 372 - 2, 924, 2, 78, NAVY);
  g.rect(640, 924 + 78 - 2, 372, 2, NAVY);
  drawSerif(g, 652, 930, 'HOW SURE', 13, NAVY, 1.2);
  drawSerif(g, 652, 948, 'Official: authority', 12.5, INK, 1);
  drawSerif(g, 652, 964, 'Confirmed: 2+ outlets', 12.5, INK, 1);
  drawSerif(g, 652, 980, 'Reported: 1 · Claim: one side', 12.5, INK, 1);

  // ---- Footer ---------------------------------------------------------------
  g.rect(0, 1002, W, 2, GOLD);
  const foot = 'Sources: Reuters, Irna, BBC, AP, AFP, Euronews, Yonhap · Drawn scenes, not photos';
  drawSerif(g, (W - serifWidth(foot, 11)) / 2, 1008, foot, 11, GREY, 1);

  return g;
}

// ---------------------------------------------------------------------------
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const png = encodePNG(drawPage());
writeFileSync(join(outDir, 'entry.png'), png);
console.log('wrote', join(outDir, 'entry.png'), png.length, 'bytes');
