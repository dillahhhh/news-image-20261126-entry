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
// 2. Oil tanker on fire at sea, night/dusk.
// ---------------------------------------------------------------------------
export function drawTanker(g, x, y, w, h) {
  // Deep blue dusk sky, top half.
  g.rect(x, y, w, Math.floor(h * 0.55), DARKBLUE);
  // Dark blue sea, bottom half.
  g.rect(x, y + Math.floor(h * 0.55), w, h - Math.floor(h * 0.55), [18, 48, 92]);
  // Lighter wave lines.
  g.line(x + Math.floor(w * 0.05), y + Math.floor(h * 0.68), x + Math.floor(w * 0.45), y + Math.floor(h * 0.68), LIGHTBLUE, 2);
  g.line(x + Math.floor(w * 0.55), y + Math.floor(h * 0.78), x + Math.floor(w * 0.95), y + Math.floor(h * 0.78), LIGHTBLUE, 2);
  g.line(x + Math.floor(w * 0.15), y + Math.floor(h * 0.88), x + Math.floor(w * 0.60), y + Math.floor(h * 0.88), SKYBLUE, 2);

  // Dark hull: long rectangle with raked bow.
  const hullY = y + Math.floor(h * 0.52);
  const hullH = Math.floor(h * 0.16);
  g.rect(x + Math.floor(w * 0.06), hullY, Math.floor(w * 0.78), hullH, [24, 24, 30]);
  g.tri(
    x + Math.floor(w * 0.84), hullY,
    x + Math.floor(w * 0.97), hullY + Math.floor(hullH / 2),
    x + Math.floor(w * 0.84), hullY + hullH,
    [24, 24, 30]
  );
  // Red waterline stripe.
  g.rect(x + Math.floor(w * 0.06), hullY + hullH - 3, Math.floor(w * 0.80), 3, RED);

  // Superstructure block at the stern (left), white with red top.
  g.rect(x + Math.floor(w * 0.08), hullY - Math.floor(h * 0.20), Math.floor(w * 0.14), Math.floor(h * 0.20), WHITE);
  g.rect(x + Math.floor(w * 0.08), hullY - Math.floor(h * 0.20), Math.floor(w * 0.14), Math.floor(h * 0.05), RED);
  // Two funnels behind the superstructure.
  g.rect(x + Math.floor(w * 0.25), hullY - Math.floor(h * 0.14), Math.floor(w * 0.06), Math.floor(h * 0.14), DARK);
  g.rect(x + Math.floor(w * 0.34), hullY - Math.floor(h * 0.11), Math.floor(w * 0.06), Math.floor(h * 0.11), GREY);

  // Flames + grey smoke from the mid-ship engine room.
  const fx = x + Math.floor(w * 0.55);
  g.circle(fx, hullY - Math.floor(h * 0.04), Math.floor(w * 0.05), ORANGE);
  g.circle(fx + Math.floor(w * 0.06), hullY - Math.floor(h * 0.02), Math.floor(w * 0.035), YELLOW);
  g.circle(fx, hullY - Math.floor(h * 0.18), Math.floor(w * 0.05), GREY);
  g.circle(fx + Math.floor(w * 0.05), hullY - Math.floor(h * 0.26), Math.floor(w * 0.065), GREY);
}

// ---------------------------------------------------------------------------
// 3. Dove over a ruined city — ceasefire under strain. Tasteful, no gore.
// ---------------------------------------------------------------------------
export function drawGaza(g, x, y, w, h) {
  // Dusty orange-grey sky.
  g.rect(x, y, w, h, [196, 158, 118]);
  g.rect(x, y, w, Math.floor(h * 0.30), [214, 178, 138]);
  // Pale sun.
  g.circle(x + Math.floor(w * 0.82), y + Math.floor(h * 0.18), Math.floor(w * 0.09), [245, 224, 180]);

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

  // Dove in flight: white body (circles), swept wings (triangles).
  const dx = x + Math.floor(w * 0.42);
  const dy = y + Math.floor(h * 0.28);
  // Raised wing.
  g.tri(dx - Math.floor(w * 0.02), dy, dx + Math.floor(w * 0.10), dy - Math.floor(h * 0.22), dx + Math.floor(w * 0.16), dy - Math.floor(h * 0.05), WHITE);
  // Body.
  g.circle(dx, dy, Math.floor(w * 0.075), WHITE);
  g.circle(dx + Math.floor(w * 0.08), dy + Math.floor(h * 0.01), Math.floor(w * 0.05), WHITE);
  // Head + beak.
  g.circle(dx + Math.floor(w * 0.15), dy - Math.floor(h * 0.02), Math.floor(w * 0.035), WHITE);
  g.tri(
    dx + Math.floor(w * 0.18), dy - Math.floor(h * 0.03),
    dx + Math.floor(w * 0.23), dy - Math.floor(h * 0.01),
    dx + Math.floor(w * 0.18), dy + Math.floor(h * 0.01),
    ORANGE
  );
  // Tail.
  g.tri(dx - Math.floor(w * 0.06), dy, dx - Math.floor(w * 0.16), dy - Math.floor(h * 0.06), dx - Math.floor(w * 0.16), dy + Math.floor(h * 0.05), WHITE);
  // Lower wing, swept down.
  g.tri(dx - Math.floor(w * 0.01), dy + Math.floor(h * 0.02), dx + Math.floor(w * 0.08), dy + Math.floor(h * 0.16), dx + Math.floor(w * 0.14), dy + Math.floor(h * 0.03), WHITE);

  // Olive branch in the beak: green stem + 3 leaves.
  const bx0 = dx + Math.floor(w * 0.20);
  const by0 = dy - Math.floor(h * 0.01);
  g.line(bx0, by0, bx0 + Math.floor(w * 0.14), by0 + Math.floor(h * 0.08), GREEN, 2);
  g.circle(bx0 + Math.floor(w * 0.05), by0 + Math.floor(h * 0.03), Math.floor(w * 0.022), GREEN);
  g.circle(bx0 + Math.floor(w * 0.10), by0 + Math.floor(h * 0.05), Math.floor(w * 0.022), GREEN);
  g.circle(bx0 + Math.floor(w * 0.14), by0 + Math.floor(h * 0.08), Math.floor(w * 0.022), GREEN);
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
  // Moon.
  g.circle(x + Math.floor(w * 0.86), y + Math.floor(h * 0.62), Math.floor(w * 0.06), [220, 222, 228]);

  // Ringed space station in the top corner.
  const sx = x + Math.floor(w * 0.78);
  const sy = y + Math.floor(h * 0.16);
  g.circle(sx, sy, Math.floor(w * 0.07), LIGHTGREY);
  g.line(sx - Math.floor(w * 0.13), sy + Math.floor(h * 0.03), sx + Math.floor(w * 0.13), sy - Math.floor(h * 0.03), GREY, 3);
  g.circle(sx, sy, Math.floor(w * 0.03), STEEL);

  // Rocket: white body, red tip, fins, launching upward (left-centre).
  const rx = x + Math.floor(w * 0.38);
  const rw = Math.floor(w * 0.14);
  const bodyTop = y + Math.floor(h * 0.34);
  const bodyH = Math.floor(h * 0.32);
  // Body.
  g.rect(rx, bodyTop, rw, bodyH, WHITE);
  // Red tip (triangle).
  g.tri(rx, bodyTop, rx + rw, bodyTop, rx + Math.floor(rw / 2), bodyTop - Math.floor(h * 0.14), RED);
  // Window.
  g.circle(rx + Math.floor(rw / 2), bodyTop + Math.floor(bodyH * 0.28), Math.floor(w * 0.025), LIGHTBLUE);
  // Fins.
  g.tri(rx, bodyTop + bodyH - Math.floor(h * 0.06), rx - Math.floor(w * 0.07), bodyTop + bodyH + Math.floor(h * 0.06), rx, bodyTop + bodyH, RED);
  g.tri(rx + rw, bodyTop + bodyH - Math.floor(h * 0.06), rx + rw + Math.floor(w * 0.07), bodyTop + bodyH + Math.floor(h * 0.06), rx + rw, bodyTop + bodyH, RED);
  // Flame plume below.
  const fy = bodyTop + bodyH;
  g.tri(rx + Math.floor(rw * 0.2), fy, rx + Math.floor(rw * 0.8), fy, rx + Math.floor(rw / 2), fy + Math.floor(h * 0.16), ORANGE);
  g.tri(rx + Math.floor(rw * 0.35), fy, rx + Math.floor(rw * 0.65), fy, rx + Math.floor(rw / 2), fy + Math.floor(h * 0.10), YELLOW);
  // Smoke puffs at the base.
  g.circle(rx - Math.floor(w * 0.05), fy + Math.floor(h * 0.16), Math.floor(w * 0.045), GREY);
  g.circle(rx + rw + Math.floor(w * 0.05), fy + Math.floor(h * 0.17), Math.floor(w * 0.05), GREY);
}
