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
// Page composition.
// ---------------------------------------------------------------------------
function drawPage() {
  const g = new Raster(W, H, PAPER);

  // ---- Masthead ------------------------------------------------------------
  g.rect(0, 0, W, 150, NAVY);
  drawText(g, (W - textWidth('THE WORLD IN ONE DAY', 4)) / 2, 20, 'THE WORLD IN ONE DAY', 4, GOLD);
  drawText(g, (W - textWidth('THURSDAY 26 NOVEMBER 2026', 5)) / 2, 64, 'THURSDAY 26 NOVEMBER 2026', 5, WHITE);
  g.rect(0, 146, W, 4, GOLD);

  // ---- Stats strip: Brent (Wed 25 Nov settled close, Reuters) -------------
  g.rect(0, 150, W, 46, GOLD);
  const statLeft = 'BRENT CRUDE $94.61  ';
  const statRight = '  +3.5% - GULF ATTACKS LIFT OIL';
  const statW = textWidth(statLeft, 3) + 26 + textWidth(statRight, 3);
  let sx = (W - statW) / 2;
  sx = drawText(g, sx, 162, statLeft, 3, NAVY);
  g.tri(sx + 3, 182, sx + 13, 182, sx + 8, 166, NAVY); // up-triangle
  sx = drawText(g, sx + 26, 162, statRight, 3, NAVY);

  // ---- Lead story: Ras Tanura ----------------------------------------------
  g.rect(12, 196, 1000, 320, CARD);
  g.rect(12, 196, 1000, 320, NAVY); // border via inset trick below
  g.rect(14, 198, 996, 316, CARD);
  g.setClip(24, 208, 424, 296);
  drawRefinery(g, 24, 208, 424, 296);
  g.clearClip();
  const lx = 468;
  drawText(g, lx, 214, 'LEAD STORY', 3, RED);
  // Source chip, top-right of the lead text block (keeps the bottom free
  // for the fact lines).
  g.rect(854, 208, 146, 26, RED);
  drawText(g, 864, 214, 'REUTERS', 3, WHITE);
  drawText(g, lx, 246, 'HOUTHI DRONES', 5, INK);
  drawText(g, lx, 288, 'HIT RAS TANURA', 5, INK);
  drawText(g, lx, 330, 'REFINERY', 5, INK);
  const leadFact = [
    'HOUTHIS SAY THEY HIT',
    "THE KINGDOM'S LARGEST",
    'REFINERY; RIYADH SAYS',
    'DEFENCES DOWNED 4 DRONES.',
    'SMOKE OVER 600 SQ KM.',
  ];
  let fy = 372;
  for (const line of leadFact) {
    drawText(g, lx, fy, line, 3, INK);
    fy += 25;
  }

  // ---- Grid: 5 stories + date-check box -----------------------------------
  // Cells are 216 tall so headlines can run at scale 4 (two short lines)
  // and facts at scale 3 in INK — both must read at a true 300px thumbnail.
  const cellW = 328, cellH = 216, gap = 8, gx0 = 12, gy0 = 528;
  const stories = [
    { draw: drawTanker, head: ['TANKERS HIT', 'MINES'], fact: '3 TANKERS HIT BY MINES, IRAN SAYS', tag: 'IRNA' },
    { draw: drawTariffs, head: ['TARIFFS HIT', '14 PARTNERS'], fact: 'CHINA, EU HIT; FUTURES DOWN 2%.', tag: 'USTR' },
    { draw: drawGaza, head: ['GAZA STRIKE', 'KILLS'], fact: 'ABUELOUF KILLED; 10 DEAD ON WED.', tag: 'ANADOLU' },
    { draw: drawIndia, head: ['INDIA MARKS', '26/11'], fact: '18 YEARS SINCE MUMBAI ATTACKS.', tag: 'INDIA' },
    { draw: drawSatellites, head: ['1 MILLION', 'SATELLITES'], fact: 'FCC OKS SPACEX DATA CENTERS.', tag: 'FCC' },
  ];

  function storyCell(cx, cy, st) {
    g.rect(cx, cy, cellW, cellH, CARD);
    g.rect(cx, cy, cellW, 2, NAVY);
    g.rect(cx, cy, 2, cellH, NAVY);
    g.rect(cx + cellW - 2, cy, 2, cellH, NAVY);
    g.rect(cx, cy + cellH - 2, cellW, 2, NAVY);
    const factLines = wrap(st.fact, cellW - 20, 3);
    const headH = st.head.length * 36;
    const illoH = cellH - 12 - headH - 4 - factLines.length * 28 - 8;
    g.setClip(cx + 6, cy + 6, cellW - 12, illoH);
    st.draw(g, cx + 6, cy + 6, cellW - 12, illoH);
    g.clearClip();
    // Source chip over the illustration's top-right corner.
    const chipW = textWidth(st.tag, 2) + 12;
    g.rect(cx + cellW - 6 - chipW, cy + 6, chipW, 18, RED);
    drawText(g, cx + cellW - 6 - chipW + 6, cy + 9, st.tag, 2, WHITE);
    let hy = cy + 6 + illoH + 6;
    for (const line of st.head) {
      drawText(g, cx + 10, hy, line, 4, INK);
      hy += 36;
    }
    let fy2 = hy + 4;
    for (const line of factLines) {
      drawText(g, cx + 10, fy2, line, 3, INK);
      fy2 += 28;
    }
  }

  for (let i = 0; i < 5; i++) {
    const col = i % 3, row = (i / 3) | 0;
    storyCell(gx0 + col * (cellW + gap), gy0 + row * (cellH + 12), stories[i]);
  }

  // ---- Date-check box (6th cell) -------------------------------------------
  const dcX = gx0 + 2 * (cellW + gap), dcY = gy0 + cellH + 12;
  g.rect(dcX, dcY, cellW, cellH, GOLD);
  g.rect(dcX, dcY, cellW, 2, NAVY);
  g.rect(dcX, dcY, 2, cellH, NAVY);
  g.rect(dcX + cellW - 2, dcY, 2, cellH, NAVY);
  g.rect(dcX, dcY + cellH - 2, cellW, 2, NAVY);
  drawText(g, dcX + 16, dcY + 16, 'DATE CHECK', 4, NAVY);
  g.line(dcX + 16, dcY + 66, dcX + 40, dcY + 84, NAVY, 5);
  g.line(dcX + 40, dcY + 84, dcX + 76, dcY + 54, NAVY, 5);
  const dcLines = wrap('EVERY STORY FIRST REPORTED 25-26 NOV 2026.', cellW - 32, 3);
  let dy = dcY + 100;
  for (const line of dcLines) {
    drawText(g, dcX + 16, dy, line, 3, NAVY);
    dy += 28;
  }
  drawText(g, dcX + 16, dy + 4, 'WED UTC = THU IN ASIA', 2, NAVY);

  // ---- Footer: sources ------------------------------------------------------
  g.rect(0, 980, W, 3, GOLD);
  drawText(g, (W - textWidth('SOURCES: REUTERS, IRNA, ANADOLU, USTR, FCC', 3)) / 2, 992,
    'SOURCES: REUTERS, IRNA, ANADOLU, USTR, FCC', 3, GREY);

  return g;
}

// ---------------------------------------------------------------------------
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const png = encodePNG(drawPage());
writeFileSync(join(outDir, 'entry.png'), png);
console.log('wrote', join(outDir, 'entry.png'), png.length, 'bytes');
