// art.ts — illustrations for news-image-20261126 entry.
// Plain JavaScript (type-stripped .ts), no imports, no randomness.
// Every function draws ONLY inside its (x, y, w, h) box.
// g API: px(x,y,c) rect(x,y,w,h,c) circle(cx,cy,r,c) tri(x1,y1,x2,y2,x3,y3,c)
//        line(x1,y1,x2,y2,c,w).  Colors are [r,g,b] arrays. Origin top-left.

const BLACK = [18, 18, 20];
const DARK = [38, 38, 44];
const GREY = [90, 90, 96];
const LIGHTGREY = [150, 150, 155];
const WHITE = [245, 244, 238];
const ORANGE = [255, 122, 26];
const YELLOW = [255, 196, 66];
const RED = [214, 48, 32];
const DARKBLUE = [16, 34, 68];
const MIDBLUE = [36, 68, 120];
const LIGHTBLUE = [96, 140, 190];
const SKYBLUE = [150, 190, 220];
const GREEN = [74, 140, 60];
const SAND = [214, 164, 96];
const SANDDARK = [178, 128, 70];
const STEEL = [88, 104, 126];
const STEELLIGHT = [140, 158, 182];

// ---------------------------------------------------------------------------
// 1. LEAD — Saudi Ras Tanura refinery at dusk, on fire, black smoke.
// ---------------------------------------------------------------------------
export function drawRefinery(g, x, y, w, h) {
  // Sandy-orange dusk sky: horizontal bands, darker toward the top.
  const bands = 6;
  for (let i = 0; i < bands; i++) {
    const t = i / (bands - 1); // 0 top -> 1 bottom
    const c = [
      Math.round(120 + 135 * t),
      Math.round(62 + 78 * t),
      Math.round(30 + 38 * t),
    ];
    g.rect(x, y + Math.floor((i * h) / bands), w, Math.ceil(h / bands) + 1, c);
  }
  // Ground strip.
  g.rect(x, y + Math.floor(h * 0.82), w, h - Math.floor(h * 0.82), [52, 36, 26]);

  // Two round storage tanks, left side.
  const tankY = y + Math.floor(h * 0.60);
  g.rect(x + Math.floor(w * 0.04), tankY, Math.floor(w * 0.20), Math.floor(h * 0.22), LIGHTGREY);
  g.circle(x + Math.floor(w * 0.14), tankY, Math.floor(w * 0.10), LIGHTGREY);
  g.rect(x + Math.floor(w * 0.27), tankY + Math.floor(h * 0.04), Math.floor(w * 0.16), Math.floor(h * 0.18), GREY);
  g.circle(x + Math.floor(w * 0.35), tankY + Math.floor(h * 0.04), Math.floor(w * 0.08), GREY);

  // Distillation towers (tall thin rectangles + platforms), mid-right.
  const baseY = y + Math.floor(h * 0.82);
  const towers = [
    [0.50, 0.10, 0.52],
    [0.60, 0.16, 0.62],
    [0.70, 0.12, 0.66],
  ];
  for (let i = 0; i < towers.length; i++) {
    const tx = x + Math.floor(w * towers[i][0]);
    const tw = Math.floor(w * 0.055);
    const th = Math.floor(h * towers[i][1]);
    const ty = baseY - th;
    g.rect(tx, ty, tw, th, STEEL);
    // Small platforms sticking out.
    g.rect(tx - Math.floor(w * 0.02), ty + Math.floor(th * 0.3), tw + Math.floor(w * 0.04), Math.floor(h * 0.02), STEELLIGHT);
    g.rect(tx - Math.floor(w * 0.02), ty + Math.floor(th * 0.62), tw + Math.floor(w * 0.04), Math.floor(h * 0.02), STEELLIGHT);
    // Pipe stack on top of each tower.
    g.rect(tx + Math.floor(tw / 3), ty - Math.floor(h * 0.05), Math.floor(tw / 3), Math.floor(h * 0.05), DARK);
  }

  // Pipes along the bottom.
  g.rect(x, baseY - Math.floor(h * 0.05), w, Math.floor(h * 0.02), STEELLIGHT);
  g.rect(x, baseY - Math.floor(h * 0.02), w, Math.floor(h * 0.02), STEEL);

  // Flame at the base of the tallest tower.
  const fx = x + Math.floor(w * 0.60) + Math.floor(w * 0.028);
  g.circle(fx, baseY - Math.floor(h * 0.03), Math.floor(w * 0.045), ORANGE);
  g.circle(fx, baseY - Math.floor(h * 0.055), Math.floor(w * 0.028), YELLOW);

  // BIG thick black smoke: overlapping circles growing toward top-right.
  const smoke = [
    [0.62, 0.46, 0.055, BLACK],
    [0.68, 0.38, 0.075, BLACK],
    [0.76, 0.30, 0.095, DARK],
    [0.84, 0.22, 0.115, BLACK],
    [0.92, 0.14, 0.13, DARK],
    [0.97, 0.06, 0.14, BLACK],
    [0.72, 0.24, 0.06, GREY],
    [0.88, 0.10, 0.07, GREY],
  ];
  for (let i = 0; i < smoke.length; i++) {
    g.circle(
      x + Math.floor(w * smoke[i][0]),
      y + Math.floor(h * smoke[i][1]),
      Math.floor(w * smoke[i][2]),
      smoke[i][3]
    );
  }
}

// ---------------------------------------------------------------------------
// 2. Oil tanker on fire at sea, night/dusk. REDRAWN for v3: the v2 hull was
// a thin line that read as a smear at 300px. Now the hull is tall and long,
// the superstructure is big, and the flames are the largest shapes in the
// box, so the cell reads as "burning tanker" even thumbnail-small.
// ---------------------------------------------------------------------------
export function drawTanker(g, x, y, w, h) {
  // Deep blue dusk sky, top half.
  g.rect(x, y, w, Math.floor(h * 0.50), DARKBLUE);
  // Dark blue sea, bottom half.
  g.rect(x, y + Math.floor(h * 0.50), w, h - Math.floor(h * 0.50), [18, 48, 92]);
  // Lighter wave lines.
  g.line(x + Math.floor(w * 0.05), y + Math.floor(h * 0.82), x + Math.floor(w * 0.45), y + Math.floor(h * 0.82), LIGHTBLUE, 3);
  g.line(x + Math.floor(w * 0.55), y + Math.floor(h * 0.92), x + Math.floor(w * 0.95), y + Math.floor(h * 0.92), LIGHTBLUE, 3);

  // Big flames + grey smoke from the mid-ship engine room (drawn BEFORE the
  // hull so the fire rises out of the deck, not behind the ship).
  const fx = x + Math.floor(w * 0.58);
  const hullY = y + Math.floor(h * 0.48);
  g.circle(fx, hullY - Math.floor(h * 0.10), Math.floor(w * 0.055), GREY);
  g.circle(fx + Math.floor(w * 0.07), hullY - Math.floor(h * 0.24), Math.floor(w * 0.07), GREY);
  g.circle(fx, hullY - Math.floor(h * 0.02), Math.floor(w * 0.065), ORANGE);
  g.circle(fx + Math.floor(w * 0.05), hullY + Math.floor(h * 0.02), Math.floor(w * 0.05), YELLOW);
  g.circle(fx - Math.floor(w * 0.04), hullY + Math.floor(h * 0.02), Math.floor(w * 0.04), ORANGE);

  // Tall dark hull: long rectangle with raked bow.
  const hullH = Math.floor(h * 0.30);
  g.rect(x + Math.floor(w * 0.04), hullY, Math.floor(w * 0.80), hullH, [24, 24, 30]);
  g.tri(
    x + Math.floor(w * 0.84), hullY,
    x + Math.floor(w * 0.98), hullY + Math.floor(hullH / 2),
    x + Math.floor(w * 0.84), hullY + hullH,
    [24, 24, 30]
  );
  // Red waterline stripe, thick enough to see at thumbnail size.
  g.rect(x + Math.floor(w * 0.04), hullY + hullH - 4, Math.floor(w * 0.82), 4, RED);

  // Superstructure block at the stern (left), white with red top.
  g.rect(x + Math.floor(w * 0.06), hullY - Math.floor(h * 0.26), Math.floor(w * 0.16), Math.floor(h * 0.26), WHITE);
  g.rect(x + Math.floor(w * 0.06), hullY - Math.floor(h * 0.26), Math.floor(w * 0.16), Math.floor(h * 0.06), RED);
  // One tall funnel behind the superstructure.
  g.rect(x + Math.floor(w * 0.26), hullY - Math.floor(h * 0.18), Math.floor(w * 0.07), Math.floor(h * 0.18), DARK);
}

// ---------------------------------------------------------------------------
// 3. Dove over a ruined city — ceasefire under strain. Tasteful, no gore.
// ---------------------------------------------------------------------------
export function drawGaza(g, x, y, w, h) {
  // Dusty orange-grey sky.
  g.rect(x, y, w, h, [196, 158, 118]);
  g.rect(x, y, w, Math.floor(h * 0.30), [214, 178, 138]);

  // Ruined skyline silhouette: broken dark-grey buildings, uneven heights.
  const baseY = y + h;
  const blds = [
    [0.00, 0.42], [0.13, 0.55], [0.26, 0.34], [0.38, 0.50],
    [0.50, 0.30], [0.63, 0.58], [0.76, 0.40], [0.88, 0.52],
  ];
  for (let i = 0; i < blds.length; i++) {
    const bx = x + Math.floor(w * blds[i][0]);
    const bw = Math.floor(w * 0.12);
    const bh = Math.floor(h * blds[i][1]);
    g.rect(bx, baseY - bh, bw, bh, DARK);
  }
  // One leaning building (triangle slab).
  g.tri(
    x + Math.floor(w * 0.44), baseY - Math.floor(h * 0.30),
    x + Math.floor(w * 0.56), baseY,
    x + Math.floor(w * 0.48), baseY,
    GREY
  );
  // Rubble line at the base.
  g.rect(x, baseY - Math.floor(h * 0.06), w, Math.floor(h * 0.06), GREY);

  // Dove in flight — a classic peace-dove silhouette, sized to fill the
  // box: a fat horizontal body, a tall swept wing rooted on the body,
  // a fanned tail, a distinct head with beak and eye, and an olive
  // branch. A navy drop-shadow keeps the white edges crisp on the pale sky.
  const F = (fx, fy) => [x + Math.round(w * fx), y + Math.round(h * fy)];
  const tris = [
    // raised wing (base sits on the body, tip near the top edge)
    [F(0.38, 0.48), F(0.47, 0.04), F(0.58, 0.46)],
    // tail fan, two feathers
    [F(0.40, 0.46), F(0.22, 0.30), F(0.24, 0.52)],
    [F(0.40, 0.52), F(0.24, 0.58), F(0.22, 0.74)],
    // lower wing, swept down
    [F(0.42, 0.52), F(0.52, 0.92), F(0.58, 0.54)],
  ];
  const circs = [
    [F(0.45, 0.48), Math.floor(w * 0.075)], // body
    [F(0.55, 0.50), Math.floor(w * 0.06)],  // chest
    [F(0.63, 0.40), Math.floor(w * 0.042)], // head
  ];
  for (const pass of [[4, 4, DARKBLUE], [0, 0, WHITE]]) {
    const ox = pass[0], oy = pass[1], col = pass[2];
    for (const t of tris) {
      g.tri(t[0][0] + ox, t[0][1] + oy, t[1][0] + ox, t[1][1] + oy, t[2][0] + ox, t[2][1] + oy, col);
    }
    for (const c of circs) {
      g.circle(c[0][0] + ox, c[0][1] + oy, c[1], col);
    }
  }
  // Beak, eye, olive branch (drawn once, on top).
  const beak = [F(0.66, 0.38), F(0.72, 0.41), F(0.66, 0.44)];
  g.tri(beak[0][0], beak[0][1], beak[1][0], beak[1][1], beak[2][0], beak[2][1], ORANGE);
  const eye = F(0.64, 0.38);
  g.circle(eye[0], eye[1], 2, DARKBLUE);
  const b0 = F(0.70, 0.41), b1 = F(0.86, 0.55);
  g.line(b0[0], b0[1], b1[0], b1[1], GREEN, 3);
  for (const lf of [[0.75, 0.45], [0.80, 0.50], [0.85, 0.55]]) {
    const lp = F(lf[0], lf[1]);
    g.circle(lp[0], lp[1], Math.floor(w * 0.025), GREEN);
  }
}

// ---------------------------------------------------------------------------
// 4. Riyadh KAFD towers at dusk, one tower hit, drone above.
// ---------------------------------------------------------------------------
export function drawSkyline(g, x, y, w, h) {
  // Dusk sky: dark blue top fading to warm horizon.
  g.rect(x, y, w, Math.floor(h * 0.60), [30, 38, 74]);
  g.rect(x, y + Math.floor(h * 0.60), w, h - Math.floor(h * 0.60), [110, 78, 88]);
  // Ground.
  g.rect(x, y + Math.floor(h * 0.88), w, h - Math.floor(h * 0.88), DARK);

  // Glass towers: blue-grey rectangles + lighter window grids.
  const towers = [
    [0.02, 0.52, 0.16], [0.20, 0.68, 0.13], [0.35, 0.58, 0.14],
    [0.51, 0.80, 0.15], [0.68, 0.62, 0.13], [0.83, 0.46, 0.14],
  ];
  const baseY = y + Math.floor(h * 0.88);
  for (let i = 0; i < towers.length; i++) {
    const tx = x + Math.floor(w * towers[i][0]);
    const tw = Math.floor(w * towers[i][2]);
    const th = Math.floor(h * towers[i][1]);
    const ty = baseY - th;
    g.rect(tx, ty, tw, th, STEEL);
    // Window grid: small lighter rectangles.
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 2; c++) {
        g.rect(
          tx + Math.floor(tw * (0.2 + c * 0.4)),
          ty + Math.floor(th * (0.12 + r * 0.2)),
          Math.max(2, Math.floor(tw * 0.18)),
          Math.max(2, Math.floor(th * 0.07)),
          STEELLIGHT
        );
      }
    }
  }

  // Tallest twisted tower (PIF Tower): stepped silhouette, centre-right.
  const px = x + Math.floor(w * 0.51);
  const pw = Math.floor(w * 0.15);
  g.rect(px, baseY - Math.floor(h * 0.80), pw, Math.floor(h * 0.80), [70, 86, 110]);
  g.rect(px + Math.floor(w * 0.02), baseY - Math.floor(h * 0.88), pw - Math.floor(w * 0.04), Math.floor(h * 0.08), [70, 86, 110]);

  // Explosion / flame burst near its top.
  const ex = px + Math.floor(pw / 2);
  const ey = baseY - Math.floor(h * 0.72);
  g.circle(ex, ey, Math.floor(w * 0.07), ORANGE);
  g.circle(ex + Math.floor(w * 0.03), ey - Math.floor(h * 0.04), Math.floor(w * 0.045), YELLOW);
  g.circle(ex - Math.floor(w * 0.03), ey + Math.floor(h * 0.03), Math.floor(w * 0.035), RED);

  // Tiny drone silhouette above the tower: small dark cross.
  const dx = ex + Math.floor(w * 0.06);
  const dy = ey - Math.floor(h * 0.18);
  g.line(dx - Math.floor(w * 0.035), dy, dx + Math.floor(w * 0.035), dy, BLACK, 2);
  g.line(dx, dy - Math.floor(h * 0.03), dx, dy + Math.floor(h * 0.03), BLACK, 2);
  g.circle(dx, dy, 2, BLACK);
}

// ---------------------------------------------------------------------------
// 5. Gateway of India arch, remembrance candle at the base.
// ---------------------------------------------------------------------------
export function drawIndia(g, x, y, w, h) {
  // Deep blue sky.
  g.rect(x, y, w, h, [24, 48, 96]);
  // Stars.
  g.circle(x + Math.floor(w * 0.12), y + Math.floor(h * 0.10), 2, WHITE);
  g.circle(x + Math.floor(w * 0.86), y + Math.floor(h * 0.14), 2, WHITE);
  g.circle(x + Math.floor(w * 0.70), y + Math.floor(h * 0.06), 2, WHITE);
  // Ground.
  g.rect(x, y + Math.floor(h * 0.86), w, h - Math.floor(h * 0.86), [28, 30, 46]);

  // Sandstone-yellow arch monument.
  const mx = x + Math.floor(w * 0.24);
  const mw = Math.floor(w * 0.52);
  const baseY = y + Math.floor(h * 0.86);
  const mh = Math.floor(h * 0.72);
  const my = baseY - mh;
  g.rect(mx, my, mw, mh, SAND);
  // Arched opening cut in background colour: rect + circle top.
  const ax = mx + Math.floor(mw * 0.30);
  const aw = Math.floor(mw * 0.40);
  const archTop = my + Math.floor(mh * 0.18);
  g.rect(ax, archTop + Math.floor(aw / 2), aw, baseY - (archTop + Math.floor(aw / 2)), DARKBLUE);
  g.circle(ax + Math.floor(aw / 2), archTop + Math.floor(aw / 2), Math.floor(aw / 2), DARKBLUE);
  // Frame around the arch.
  g.rect(mx + Math.floor(mw * 0.06), my + Math.floor(mh * 0.10), Math.floor(mw * 0.10), Math.floor(mh * 0.55), SANDDARK);
  g.rect(mx + mw - Math.floor(mw * 0.16), my + Math.floor(mh * 0.10), Math.floor(mw * 0.10), Math.floor(mh * 0.55), SANDDARK);
  // Small windows on the monument.
  g.rect(mx + Math.floor(mw * 0.08), my + Math.floor(mh * 0.30), Math.floor(mw * 0.06), Math.floor(mh * 0.10), DARKBLUE);
  g.rect(mx + mw - Math.floor(mw * 0.14), my + Math.floor(mh * 0.30), Math.floor(mw * 0.06), Math.floor(mh * 0.10), DARKBLUE);
  // Four small domes on top.
  const domeYs = my - Math.floor(h * 0.04);
  for (let i = 0; i < 4; i++) {
    const dcx = mx + Math.floor(mw * (0.12 + i * 0.25));
    g.circle(dcx, domeYs, Math.floor(w * 0.035), SAND);
    g.rect(dcx - 1, domeYs - Math.floor(h * 0.05), 2, Math.floor(h * 0.05), SANDDARK);
  }
  // Plinth step.
  g.rect(mx - Math.floor(w * 0.03), baseY - Math.floor(h * 0.04), mw + Math.floor(w * 0.06), Math.floor(h * 0.04), SANDDARK);

  // Lit candle / remembrance flame at the base, centre of the arch.
  const cx = x + Math.floor(w * 0.50);
  g.rect(cx - 2, baseY - Math.floor(h * 0.07), 4, Math.floor(h * 0.07), WHITE);
  g.circle(cx, baseY - Math.floor(h * 0.10), Math.floor(w * 0.025), ORANGE);
  g.circle(cx, baseY - Math.floor(h * 0.115), Math.floor(w * 0.014), YELLOW);
}

// ---------------------------------------------------------------------------
// 6. Rocket launching to a ringed space station.
// ---------------------------------------------------------------------------
export function drawRocket(g, x, y, w, h) {
  // Dark blue starry sky.
  g.rect(x, y, w, h, [10, 18, 44]);
  const stars = [
    [0.08, 0.10], [0.24, 0.06], [0.40, 0.16], [0.62, 0.08],
    [0.78, 0.20], [0.90, 0.06], [0.14, 0.34], [0.88, 0.40],
    [0.30, 0.28], [0.68, 0.34],
  ];
  for (let i = 0; i < stars.length; i++) {
    g.circle(x + Math.floor(w * stars[i][0]), y + Math.floor(h * stars[i][1]), 2, WHITE);
  }
  // Small ringed planet, top-left — clear of the rocket's path.
  const px0 = x + Math.floor(w * 0.10);
  const py0 = y + Math.floor(h * 0.16);
  g.circle(px0, py0, Math.floor(w * 0.045), LIGHTGREY);
  g.line(px0 - Math.floor(w * 0.09), py0 + Math.floor(h * 0.04), px0 + Math.floor(w * 0.09), py0 - Math.floor(h * 0.04), GREY, 2);
  // Moon, bottom-right.
  g.circle(x + Math.floor(w * 0.88), y + Math.floor(h * 0.68), Math.floor(w * 0.05), [220, 222, 228]);

  // Rocket on a steep diagonal climb: tail bottom-centre, nose top-centre.
  // A thick white body + red nose cone + red fins + orange flame reads
  // as a rocket even when the cell is thumbnail-small.
  const tx = x + Math.floor(w * 0.40);
  const ty = y + Math.floor(h * 0.88);
  const nx = x + Math.floor(w * 0.60);
  const ny = y + Math.floor(h * 0.10);
  const ddx = nx - tx, ddy = ny - ty;
  const len = Math.sqrt(ddx * ddx + ddy * ddy);
  const ux = ddx / len, uy = ddy / len; // along the body, tail -> nose
  const px = -uy, py = ux;              // perpendicular
  const P = (bx, by, along, perp) => [
    Math.round(bx + ux * along + px * perp),
    Math.round(by + uy * along + py * perp),
  ];
  // Flame first (behind the tail).
  const f1 = P(tx, ty, -26, 9), f2 = P(tx, ty, -26, -9);
  g.tri(tx, ty, f1[0], f1[1], f2[0], f2[1], ORANGE);
  const f3 = P(tx, ty, -15, 5), f4 = P(tx, ty, -15, -5);
  g.tri(tx, ty, f3[0], f3[1], f4[0], f4[1], YELLOW);
  // Smoke puffs at the base.
  const s1 = P(tx, ty, -32, 12), s2 = P(tx, ty, -34, -10);
  g.circle(s1[0], s1[1], Math.floor(w * 0.04), GREY);
  g.circle(s2[0], s2[1], Math.floor(w * 0.045), GREY);
  // Fins near the tail.
  const a1 = P(tx, ty, -4, 18), a2 = P(tx, ty, -24, 6);
  g.tri(tx, ty, a1[0], a1[1], a2[0], a2[1], RED);
  const b1 = P(tx, ty, -4, -18), b2 = P(tx, ty, -24, -6);
  g.tri(tx, ty, b1[0], b1[1], b2[0], b2[1], RED);
  // Body: thick white line tail -> nose.
  g.line(tx, ty, nx, ny, WHITE, 16);
  // Red nose cone.
  const c1 = P(nx, ny, -16, 11), c2 = P(nx, ny, -16, -11);
  g.tri(nx, ny, c1[0], c1[1], c2[0], c2[1], RED);
  // Window: light-blue porthole mid-body.
  const mx = Math.round((tx + nx) / 2), my = Math.round((ty + ny) / 2);
  g.circle(mx, my, Math.floor(w * 0.022), LIGHTBLUE);
}

// ---------------------------------------------------------------------------
// 7. (v3) Container ship + tariff badge — US tariffs on 14 partners.
// A stack of bright containers on a dark hull reads as trade at any size;
// the red "%" badge (two dots + diagonal bar, drawn as shapes) says tariff.
// ---------------------------------------------------------------------------
export function drawTariffs(g, x, y, w, h) {
  // Pale sky, blue sea.
  g.rect(x, y, w, Math.floor(h * 0.55), [168, 196, 220]);
  g.rect(x, y + Math.floor(h * 0.55), w, h - Math.floor(h * 0.55), [36, 68, 120]);
  g.line(x + Math.floor(w * 0.05), y + Math.floor(h * 0.78), x + Math.floor(w * 0.50), y + Math.floor(h * 0.78), LIGHTBLUE, 3);
  g.line(x + Math.floor(w * 0.55), y + Math.floor(h * 0.88), x + Math.floor(w * 0.95), y + Math.floor(h * 0.88), LIGHTBLUE, 3);

  // Hull: dark, low, long.
  const hullY = y + Math.floor(h * 0.58);
  const hullH = Math.floor(h * 0.22);
  g.rect(x + Math.floor(w * 0.04), hullY, Math.floor(w * 0.66), hullH, [24, 24, 30]);
  g.tri(
    x + Math.floor(w * 0.70), hullY,
    x + Math.floor(w * 0.82), hullY + Math.floor(hullH / 2),
    x + Math.floor(w * 0.70), hullY + hullH,
    [24, 24, 30]
  );
  g.rect(x + Math.floor(w * 0.04), hullY + hullH - 3, Math.floor(w * 0.70), 3, RED);

  // Container stack: two rows of bright boxes on the deck.
  const conts = [
    [0.06, 0.40, 0.13, RED], [0.20, 0.40, 0.13, YELLOW], [0.34, 0.40, 0.13, [36, 68, 120]],
    [0.48, 0.40, 0.13, GREEN], [0.13, 0.22, 0.13, [36, 68, 120]], [0.27, 0.22, 0.13, RED],
    [0.41, 0.22, 0.13, YELLOW],
  ];
  for (let i = 0; i < conts.length; i++) {
    g.rect(
      x + Math.floor(w * conts[i][0]),
      hullY - Math.floor(h * conts[i][1]) - Math.floor(h * 0.16),
      Math.floor(w * conts[i][2]),
      Math.floor(h * 0.16),
      conts[i][3]
    );
  }

  // Red "%" badge, top-right: circle + two white dots + diagonal bar.
  // Sized big and bold so the % survives a 300px thumbnail.
  const bx = x + Math.floor(w * 0.84), by = y + Math.floor(h * 0.26);
  const br = Math.floor(w * 0.135);
  g.circle(bx, by, br, RED);
  g.circle(bx - Math.floor(br * 0.38), by - Math.floor(br * 0.38), Math.floor(br * 0.30), WHITE);
  g.circle(bx + Math.floor(br * 0.38), by + Math.floor(br * 0.38), Math.floor(br * 0.30), WHITE);
  g.line(bx - Math.floor(br * 0.48), by + Math.floor(br * 0.48), bx + Math.floor(br * 0.48), by - Math.floor(br * 0.48), WHITE, 5);
}

// ---------------------------------------------------------------------------
// 8. (v3) Satellites over Earth — FCC clears SpaceX "Starmind", 1 million
// orbital data-center satellites. Big blue Earth arc at the bottom, three
// satellites (white body + blue panel wings) on a dotted orbit arc.
// ---------------------------------------------------------------------------
export function drawSatellites(g, x, y, w, h) {
  // Starry black-blue space.
  g.rect(x, y, w, h, [8, 14, 38]);
  const stars = [
    [0.06, 0.08], [0.20, 0.05], [0.36, 0.12], [0.52, 0.06],
    [0.68, 0.14], [0.84, 0.07], [0.94, 0.18], [0.12, 0.30],
    [0.44, 0.28], [0.90, 0.42], [0.26, 0.52], [0.72, 0.55],
  ];
  for (let i = 0; i < stars.length; i++) {
    g.circle(x + Math.floor(w * stars[i][0]), y + Math.floor(h * stars[i][1]), 2, WHITE);
  }

  // Earth: big blue disc rising from the bottom-left corner, with a lighter
  // arc highlight and a green landmass blob.
  const ex = x + Math.floor(w * 0.18), ey = y + h + Math.floor(h * 0.28);
  g.circle(ex, ey, Math.floor(w * 0.34), [36, 68, 120]);
  g.circle(ex - Math.floor(w * 0.06), ey - Math.floor(h * 0.10), Math.floor(w * 0.30), [56, 110, 180]);
  g.circle(ex + Math.floor(w * 0.10), ey - Math.floor(h * 0.02), Math.floor(w * 0.10), GREEN);
  g.circle(ex - Math.floor(w * 0.14), ey - Math.floor(h * 0.16), Math.floor(w * 0.07), GREEN);

  // Dotted orbit arc sweeping across the sky.
  const ocx = x + Math.floor(w * 0.50), ocy = y + Math.floor(h * 1.05);
  const oa = Math.floor(w * 0.52), ob = Math.floor(h * 0.78);
  for (let deg = 200; deg <= 340; deg += 9) {
    const t = (deg * Math.PI) / 180;
    const dx = ocx + Math.round(oa * Math.cos(t));
    const dy = ocy + Math.round(ob * Math.sin(t));
    if (dx >= x && dx < x + w && dy >= y && dy < y + h) g.circle(dx, dy, 2, LIGHTGREY);
  }

  // Three satellites on the arc: white body + blue panel wings.
  const sats = [
    [0.22, 0.30, 1], [0.55, 0.14, -1], [0.82, 0.34, 1],
  ];
  for (let i = 0; i < sats.length; i++) {
    const sx = x + Math.floor(w * sats[i][0]);
    const sy = y + Math.floor(h * sats[i][1]);
    const tilt = sats[i][2];
    // Solar panels (blue wings).
    g.rect(sx - 16, sy - 3 + tilt * 2, 12, 7, LIGHTBLUE);
    g.rect(sx + 4, sy - 3 - tilt * 2, 12, 7, LIGHTBLUE);
    // Body.
    g.rect(sx - 5, sy - 5, 10, 10, WHITE);
    g.circle(sx, sy, 2, ORANGE);
  }
}
