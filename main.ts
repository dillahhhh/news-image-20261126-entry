// The World in One Day — 26 November 2026.
// A make.fun news-image entry. Draws a 1024x1024 newspaper front page in
// pure code (Node 22, standard library only) and writes /output/entry.png.
// No network, no external assets, deterministic: two runs are byte-identical.
//
// v3 (26 Nov afternoon): full-day news. Brent corrected to the Wed settled
// close ($94.61, +3.5%); Hormuz now 3 tankers; Gaza toll updated (10 dead
// Wed); two new stories — US tariffs on 14 partners, FCC clears SpaceX
// "Starmind" 1M orbital data-center satellites. Riyadh + Pakistan space cut
// for breadth. Tanker redrawn bold so it reads at 300px.
//
// v7 (28 Nov ~01:00 WIB): v4 basis, NON-FONT changes only. All 13 scenes
// redrawn as bright flat-vector illustrations (pale skies, big subjects,
// no black smoke blobs); big-3 scenes taller (102px); stats strip taller
// (54px) with shortened labels and full-height dividers; tabs 5px gaps;
// timeline labels given air; ALSO rows 18px and DATE CHECK / HOW SURE
// lines 18px so no two text lines touch. Pixel 5x8 font everywhere,
// palette, facts, story count and page structure unchanged from v4.
// (v5 serif + v6 serif display reverted: 0.9486 / 0.9665 < v4 0.9772.)
//
// Layout: masthead with the date, a Brent crude stats strip, a lead story
// (Ras Tanura) with a large illustration, then five more stories in a grid
// plus a date-check box, and a sources footer.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';
import { drawRefinery, drawTanker, drawGaza, drawIndia, drawTariffs, drawSatellites } from './art.ts';

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
// 5x8 bitmap font. Glyphs are 8 rows of 5 bits ('1' = ink).
// Taller than the v1 5x7: the extra row gives cleaner curves
// (S, C, G, O, Q, 4, 9) and a more even, newspaper-like texture.
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

// Word-wrap plain text to a pixel width. Returns array of lines.
function wrap(s, maxW, scale) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const trial = cur ? cur + ' ' + w : w;
    if (textWidth(trial, scale) <= maxW || !cur) {
      cur = trial;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Page composition — v4 (27 Nov): structural rebuild modelled on the
// leaders (rank 1 "Hopeful Palette" 0.991711, rank 2, rank 3), but with OUR
// lead (Ras Tanura, not the Thanksgiving storm) and our own identity
// (5x8 pixel font, cream + navy + red + gold paper).
//
// 37 stories, 9 regions, 13 drawn scenes + dotted world map + UTC
// timeline + stats strip + region tabs + DATE CHECK + HOW SURE + sources.
// ---------------------------------------------------------------------------
import { drawKuwait, drawEU, drawEbola, drawGizaTruck, drawKorea, drawStorm, drawBangkok } from './art.ts';

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

// The 13 pictured stories: [n, draw, kicker, headline lines, summary lines,
// source, status, region key]. Big cells use headline scale 3 (lead: 4).
const BIG = [
  { n: 1, draw: drawRefinery, kick: 'LEAD STORY - RAS TANURA, SAUDI ARABIA',
    head: ['HOUTHI DRONES HIT', 'RAS TANURA REFINERY'],
    sum: ['HOUTHIS SAY THEY HIT IT; RIYADH SAYS', '4 DRONES DOWNED. SMOKE OVER 600 SQ KM.'],
    src: 'REUTERS', status: 'CLAIM', region: 'MID EAST', lead: true },
  { n: 2, draw: drawKuwait, kick: 'KUWAIT - MID EAST',
    head: ['DRONES KILL', '2 ITALIANS'],
    sum: ['ITALY BLAMES IRAN;', 'TEHRAN DENIES IT'],
    src: 'REUTERS', status: 'CONFIRMED', region: 'MID EAST', lead: false },
  { n: 3, draw: drawTariffs, kick: 'WASHINGTON - TRADE',
    head: ['TARIFFS ON', '14 PARTNERS'],
    sum: ['UP TO 20% PROPOSED', 'CHINA, EU OBJECT'],
    src: 'USTR', status: 'OFFICIAL', region: 'N AMERICA', lead: false },
];

const SMALL = [
  { n: 4, draw: drawTanker, kick: 'HORMUZ', head: ['3 TANKERS HIT', 'MINES IN HORMUZ'], sum: ['IRAN SAYS'], src: 'IRNA', status: 'CLAIM', region: 'MID EAST' },
  { n: 5, draw: drawEU, kick: 'BRUSSELS', head: ['EU SUMMIT ENDS', 'WITH NO DEAL'], sum: ['DE COS GETS ECB'], src: 'REUTERS', status: 'OFFICIAL', region: 'EUROPE' },
  { n: 6, draw: drawGaza, kick: 'GAZA', head: ['GAZA STRIKE', 'KILLS TOP HAMAS'], sum: ['ABUELOUF KILLED'], src: 'REUTERS', status: 'OFFICIAL', region: 'MID EAST' },
  { n: 7, draw: drawEbola, kick: 'DR CONGO', head: ['EBOLA PASSES', '12,021 CASES'], sum: ['5,904 DEAD'], src: 'REUTERS', status: 'OFFICIAL', region: 'AFRICA' },
  { n: 8, draw: drawGizaTruck, kick: 'GIZA', head: ['TANKER FIRE', 'KILLS 31'], sum: ['DRIVER HELD'], src: 'AP', status: 'OFFICIAL', region: 'AFRICA' },
  { n: 9, draw: drawBangkok, kick: 'BANGKOK', head: ['REFINERY BLAST', 'INJURES NINE'], sum: ['3 CRITICAL'], src: 'AP', status: 'CONFIRMED', region: 'SE ASIA' },
  { n: 10, draw: drawKorea, kick: 'SEOUL', head: ['KOREA HIKES', 'RATE TO 3.25%'], sum: ['3RD HIKE IN ROW'], src: 'YONHAP', status: 'OFFICIAL', region: 'E ASIA' },
  { n: 11, draw: drawSatellites, kick: 'WASHINGTON', head: ['FCC CLEARS 1M', 'SATELLITES'], sum: ['STARMIND OK'], src: 'FCC', status: 'OFFICIAL', region: 'N AMERICA' },
  { n: 12, draw: drawStorm, kick: 'NEW YORK', head: ['STORM GROUNDS', "MACY'S PARADE"], sum: ['900,000 DARK'], src: 'AP', status: 'CONFIRMED', region: 'N AMERICA' },
  { n: 13, draw: drawIndia, kick: 'MUMBAI', head: ['INDIA MARKS 18', 'SINCE 26/11'], sum: ['TRIBUTES PAID'], src: 'INDIA', status: 'OFFICIAL', region: 'S ASIA' },
];

// ALSO list (24 more stories, numbered 14-37): [text, region key].
const ALSO = [
  ['14 RIYADH: PIF TOWER HIT', 'MID EAST'],
  ['15 JAZAN: NEPALI KILLED', 'MID EAST'],
  ['16 ODESA: GRAIN SHIPS HIT', 'EUROPE'],
  ['17 PYONGYANG: MORE NUKES', 'E ASIA'],
  ['18 HONG KONG: 168 REMEMBERED', 'E ASIA'],
  ['19 NAIROBI: EBOLA SITE HALTED', 'AFRICA'],
  ['20 BISSAU: VOTE TO 2028', 'AFRICA'],
  ['21 DHAKA: 400 FACTORIES SHUT', 'S ASIA'],
  ['22 KATHMANDU: 4,000 DEAD', 'S ASIA'],
  ['23 BOGOR: MINE FLOOD KILLS 13', 'SE ASIA'],
  ['24 NVIDIA HALTS AI SERVERS', 'SE ASIA'],
  ['25 CALIFORNIA: KING TIDES', 'N AMERICA'],
  ['26 OTTAWA: STUDENT CAPS', 'N AMERICA'],
  ['27 LONDON: MIGRATION 77,000', 'EUROPE'],
  ['28 PARIS: DEPARDIEU TRIAL', 'EUROPE'],
  ['29 STOCKHOLM: CENTRE BACKS PM', 'EUROPE'],
  ['30 MADRID: DE COS TO RUN ECB', 'EUROPE'],
  ['31 BUENOS AIRES: RECESSION', 'LATIN AM'],
  ['32 ARGENTINA: PRINTING HALT', 'LATIN AM'],
  ['33 MEXICO: SPACEX TALKS', 'LATIN AM'],
  ['34 SINNER OUT OF AUS OPEN', 'OCEANIA'],
  ['35 CANBERRA: 2035 TARGET MISS', 'OCEANIA'],
  ['36 TRUMP: PUTIN, PULL BACK', 'N AMERICA'],
  ['37 KATZ: DISPLACE 1M GAZANS', 'MID EAST'],
];

// Region tabs: [label, count, region key].
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

// UTC timeline: [time + label, above?].
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

  // ---- Top strip -----------------------------------------------------------
  g.rect(0, 0, W, 20, NAVY);
  drawText(g, 12, 2, 'THE WORLD IN ONE DAY', 2, GOLD);
  const topRight = '37 STORIES - 9 REGIONS - ALL FROM THU 26 NOV 2026';
  drawText(g, W - 12 - textWidth(topRight, 2), 2, topRight, 2, WHITE);

  // ---- Masthead ------------------------------------------------------------
  // v7: pixel 5x8, unchanged face — zone tightened (text y 24, rule at 78)
  // to free vertical room for the scenes and the ALSO list below.
  drawText(g, (W - textWidth('THURSDAY 26 NOVEMBER 2026', 6)) / 2, 24,
    'THURSDAY 26 NOVEMBER 2026', 6, INK);
  g.rect(0, 78, W, 4, GOLD);

  // ---- Ticker --------------------------------------------------------------
  g.rect(0, 82, W, 18, RED);
  const tick = 'BRENT $94.61 +3.5% - RAS TANURA HIT - 3 TANKERS MINED - TARIFFS ON 14';
  drawText(g, (W - textWidth(tick, 2)) / 2, 84, tick, 2, WHITE);

  // ---- Stats strip (gold) --------------------------------------------------
  // v7: taller (54px), dividers full height, labels shortened so the
  // number and its label stop crowding each other.
  g.rect(0, 100, W, 54, GOLD);
  const stats = [
    ['$94.61', 'BRENT'],
    ['3', 'TANKERS'],
    ['12,021', 'EBOLA'],
    ['3.25%', 'KOREA RATE'],
    ['31', 'GIZA'],
    ['900,000', 'NO POWER'],
  ];
  for (let i = 0; i < 6; i++) {
    const cx0 = 2 + i * 170;
    drawText(g, cx0 + (170 - textWidth(stats[i][0], 3)) / 2, 106, stats[i][0], 3, NAVY);
    drawText(g, cx0 + (170 - textWidth(stats[i][1], 2)) / 2, 136, stats[i][1], 2, NAVY);
    if (i > 0) g.rect(cx0, 106, 2, 44, GOLD_DARK);
  }

  // ---- Region tabs ---------------------------------------------------------
  // v7: 5px gaps + 8px padding (was 3px gaps + 10px padding) — same total
  // width, more air between tabs.
  let tabW = 0;
  for (const t of TABS) tabW += textWidth(t[0], 2) + 8 + 5;
  tabW -= 5;
  let tx = (W - tabW) / 2;
  for (const t of TABS) {
    const w = textWidth(t[0], 2) + 8;
    g.rect(tx, 154, w, 20, REGION_COLORS[t[1]]);
    drawText(g, tx + 4, 157, t[0], 2, WHITE);
    tx += w + 5;
  }

  // ---- Timeline: THE DAY IN UTC --------------------------------------------
  g.rect(0, 176, 184, 38, NAVY);
  drawText(g, 12, 188, 'THE DAY IN UTC', 2, WHITE);
  const tlX0 = 200, tlX1 = 1012, tlY = 195;
  g.rect(tlX0, tlY, tlX1 - tlX0, 2, NAVY);
  // Dots spread so each label sits centred on its dot with clear air
  // to the next label (v4's 120px spacing crowded 130px-wide labels).
  const dotXs = [240, 360, 480, 600, 720, 840, 930];
  for (let i = 0; i < TIMELINE.length; i++) {
    const dx = dotXs[i];
    g.circle(dx, tlY + 1, 5, RED);
    g.circle(dx, tlY + 1, 2, WHITE);
    const label = TIMELINE[i][0];
    const lw = textWidth(label, 2);
    let lx = dx - lw / 2;
    if (lx < tlX0) lx = tlX0;
    if (lx + lw > W - 4) lx = W - 4 - lw;
    drawText(g, lx, TIMELINE[i][1] ? 177 : 198, label, 2, INK);
  }

  // ---- Helpers for story cells ---------------------------------------------
  function chip(x, y, label, bg) {
    const w = textWidth(label, 2) + 10;
    g.rect(x, y, w, 16, bg);
    drawText(g, x + 5, y + 1, label, 2, WHITE);
    return w;
  }
  function badge(cx, cy, n, scale) {
    g.circle(cx, cy, scale === 2 ? 13 : 9, RED);
    const s = String(n);
    drawText(g, cx - textWidth(s, scale) / 2, cy - (scale === 2 ? 8 : 4), s, scale, WHITE);
  }

  // ---- Big 3 ---------------------------------------------------------------
  // v7: taller cells (244) + taller scenes (102) — the lead refinery is
  // the strongest picture on the page. Sum lines at 19px so the second
  // line clears the bottom border.
  const bigY = 214, bigH = 244, bigIlloH = 102;
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
    badge(bx + 18, bigY + 18, st.n, 2);
    chip(bx + bw - 8 - (textWidth(st.src, 2) + 10), bigY + 8, st.src, RED);
    chip(bx + bw - 8 - (textWidth(st.status, 2) + 10), bigY + 2 + bigIlloH - 22, st.status, STATUS_COLORS[st.status]);
    const tx0 = bx + 12;
    drawText(g, tx0, bigY + bigIlloH + 8, st.kick, 2, RED);
    const hs = st.lead ? 4 : 3;
    const lh = st.lead ? 36 : 28;
    let hy = bigY + bigIlloH + 8 + 20;
    for (const line of st.head) {
      drawText(g, tx0, hy, line, hs, INK);
      hy += lh;
    }
    let sy = hy + 4;
    for (const line of st.sum) {
      drawText(g, tx0, sy, line, 2, INK);
      sy += 19;
    }
  }

  // ---- Small 10: two rows of five ------------------------------------------
  // v7: cells 112 tall, scenes 40 — the freed rows fund the ALSO leading
  // below. Kicker +4px from the scene, sum sits on hy so it clears the
  // bottom border.
  const smY0 = 458, smH = 112, smW = 196, smGap = 8, smIlloH = 40;
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
    badge(cx + 14, cy + 14, st.n, 1);
    chip(cx + smW - 6 - (textWidth(st.src, 2) + 10), cy + 6, st.src, RED);
    chip(cx + smW - 6 - (textWidth(st.status, 2) + 10), cy + 2 + smIlloH - 20, st.status, STATUS_COLORS[st.status]);
    drawText(g, cx + 8, cy + smIlloH + 4, st.kick, 2, RED);
    let hy = cy + smIlloH + 4 + 18;
    for (const line of st.head) {
      drawText(g, cx + 8, hy, line, 2, INK);
      hy += 16;
    }
    drawText(g, cx + 8, hy, st.sum[0], 2, GREY);
  }

  // ---- Section header: map + ALSO ------------------------------------------
  drawText(g, 12, 690, 'WHERE IT HAPPENED - PINS ARE PICTURE NUMBERS', 2, RED);
  const alsoHead = 'ALSO ON 26 NOVEMBER - 24 MORE STORIES';
  drawText(g, W - 12 - textWidth(alsoHead, 2), 690, alsoHead, 2, RED);

  // ---- Dotted world map ----------------------------------------------------
  const mapX = 12, mapY = 708 + 30, cell = 5;
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
  drawText(g, 12, 876, 'PINS COLOURED BY REGION', 2, GREY);

  // ---- ALSO list: two columns ----------------------------------------------
  // v7: 18px rows (was 16px with 16px-tall glyphs — zero leading, the
  // wall-of-text effect). The 2px leading is bought from the sections above.
  const listCols = [[324, 12], [672, 12]];
  for (let i = 0; i < ALSO.length; i++) {
    const col = i < 12 ? 0 : 1;
    const row = i % 12;
    const lx = listCols[col][0];
    const ly = 708 + row * 18;
    const entry = ALSO[i][0];
    const sp = entry.indexOf(' ');
    const num = entry.slice(0, sp);
    const rest = entry.slice(sp);
    drawText(g, lx, ly, num, 2, REGION_COLORS[ALSO[i][1]]);
    drawText(g, lx + textWidth(num, 2), ly, rest, 2, INK);
  }

  // ---- DATE CHECK + HOW SURE -----------------------------------------------
  // v7: body lines at 18px spacing (was 16px — touching). Title 930,
  // lines 948 / 966 / 984, last line clears the 1002 footer rule.
  g.rect(12, 924, 620, 78, GOLD);
  g.rect(12, 924, 620, 2, NAVY);
  g.rect(12, 924, 2, 78, NAVY);
  g.rect(12 + 620 - 2, 924, 2, 78, NAVY);
  g.rect(12, 924 + 78 - 2, 620, 2, NAVY);
  drawText(g, 24, 930, 'DATE CHECK', 2, NAVY);
  drawText(g, 24, 948, 'ALL 37 FIRST REPORTED 26 NOV 2026', 2, NAVY);
  drawText(g, 24, 966, 'IN SOME TIME ZONE. WED UTC = THU ASIA.', 2, NAVY);
  drawText(g, 24, 984, 'LEFT OUT: ASTRONAUT, Q3 GDP (25 NOV)', 2, NAVY);

  g.rect(640, 924, 372, 78, CARD);
  g.rect(640, 924, 372, 2, NAVY);
  g.rect(640, 924, 2, 78, NAVY);
  g.rect(640 + 372 - 2, 924, 2, 78, NAVY);
  g.rect(640, 924 + 78 - 2, 372, 2, NAVY);
  drawText(g, 652, 930, 'HOW SURE', 2, NAVY);
  drawText(g, 652, 948, 'OFFICIAL: AUTHORITY', 2, INK);
  drawText(g, 652, 966, 'CONFIRMED: 2+ OUTLETS', 2, INK);
  drawText(g, 652, 984, 'REPORTED: 1 - CLAIM: ONE SIDE', 2, INK);

  // ---- Footer ---------------------------------------------------------------
  g.rect(0, 1002, W, 2, GOLD);
  const foot = 'SOURCES: REUTERS, IRNA, BBC, AP, AFP, EURONEWS, YONHAP - DRAWN SCENES, NOT PHOTOS';
  drawText(g, (W - textWidth(foot, 2)) / 2, 1008, foot, 2, GREY);

  return g;
}

// ---------------------------------------------------------------------------
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const png = encodePNG(drawPage());
writeFileSync(join(outDir, 'entry.png'), png);
console.log('wrote', join(outDir, 'entry.png'), png.length, 'bytes');
