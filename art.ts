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

  // Two small grey smoke puffs (the big black blobs read as mush at 300px).
  g.circle(x + Math.floor(w * 0.72), y + Math.floor(h * 0.24), Math.floor(w * 0.06), GREY);
  g.circle(x + Math.floor(w * 0.84), y + Math.floor(h * 0.14), Math.floor(w * 0.07), GREY);

  // Flame at the base of the tallest tower.
  const fx = x + Math.floor(w * 0.60) + Math.floor(w * 0.028);
  g.circle(fx, baseY - Math.floor(h * 0.03), Math.floor(w * 0.045), ORANGE);
  g.circle(fx, baseY - Math.floor(h * 0.055), Math.floor(w * 0.028), YELLOW);

}

// ---------------------------------------------------------------------------
// 2. Oil tanker on fire at sea, night/dusk. REDRAWN for v3: the v2 hull was
// a thin line that read as a smear at 300px. Now the hull is tall and long,
// the superstructure is big, and the flames are the largest shapes in the
// box, so the cell reads as "burning tanker" even thumbnail-small.
// ---------------------------------------------------------------------------
// 2. (v11) Oil tanker at dusk — sun, hull, flame. The superstructure,
// funnel and wave lines are gone; the hull + red waterline + one flame
// are the whole story now.
// ---------------------------------------------------------------------------
export function drawTanker(g, x, y, w, h) {
  // Deep blue dusk sky, top half; dark blue sea, bottom half.
  g.rect(x, y, w, Math.floor(h * 0.50), DARKBLUE);
  g.rect(x, y + Math.floor(h * 0.50), w, h - Math.floor(h * 0.50), [18, 48, 92]);
  // Orange sun, top-left.
  g.circle(x + Math.floor(w * 0.16), y + Math.floor(h * 0.22), Math.floor(w * 0.09), ORANGE);
  // Flames from the mid-ship engine room (drawn before the hull).
  const fx = x + Math.floor(w * 0.58);
  const hullY = y + Math.floor(h * 0.48);
  g.circle(fx, hullY - Math.floor(h * 0.02), Math.floor(w * 0.065), ORANGE);
  g.circle(fx + Math.floor(w * 0.05), hullY + Math.floor(h * 0.02), Math.floor(w * 0.05), YELLOW);
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
}


// ---------------------------------------------------------------------------
// 3. Dove over a ruined city — ceasefire under strain. Tasteful, no gore.
// ---------------------------------------------------------------------------
// 3. (v11) Dove over a plain dusty sky — the ruined skyline, leaning slab
// and rubble are gone. Eight dark buildings behind a white dove turned
// the cell into noise; the dove alone reads as peace.
// ---------------------------------------------------------------------------
export function drawGaza(g, x, y, w, h) {
  // Dusty orange-grey sky, plain.
  g.rect(x, y, w, h, [196, 158, 118]);
  g.rect(x, y, w, Math.floor(h * 0.30), [214, 178, 138]);

  // Dove in flight — big simple white shapes only: a fat body, a tall
  // swept wing, a fanned tail, a distinct head with beak and eye.
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
  // Beak + eye, drawn once, on top.
  const beak = [F(0.66, 0.38), F(0.72, 0.41), F(0.66, 0.44)];
  g.tri(beak[0][0], beak[0][1], beak[1][0], beak[1][1], beak[2][0], beak[2][1], ORANGE);
  const eye = F(0.64, 0.38);
  g.circle(eye[0], eye[1], 2, DARKBLUE);
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
// 3. (v11) Tariffs — a row of bright trade bars over a dark band. The
// container ship + 7 boxes + % badge were too much small detail; four
// big blocks + one band say "trade" at any size.
// ---------------------------------------------------------------------------
export function drawTariffs(g, x, y, w, h) {
  // Pale blue sky.
  g.rect(x, y, w, h, [168, 196, 220]);
  // Row of bright blocks (trade bars): red, yellow, blue, green.
  const blocks = [
    [0.06, 0.30, 0.16, RED], [0.26, 0.18, 0.16, YELLOW],
    [0.46, 0.36, 0.16, MIDBLUE], [0.66, 0.22, 0.16, GREEN],
  ];
  for (let i = 0; i < blocks.length; i++) {
    const bh = Math.floor(h * blocks[i][1]);
    g.rect(x + Math.floor(w * blocks[i][0]), y + Math.floor(h * 0.55) - bh, Math.floor(w * blocks[i][2]), bh, blocks[i][3]);
  }
  // Dark navy band + thin red line at the bottom.
  g.rect(x, y + Math.floor(h * 0.55), w, h - Math.floor(h * 0.55), DARKBLUE);
  g.rect(x, y + Math.floor(h * 0.55), w, 4, RED);
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


// ---------------------------------------------------------------------------
// 9. (v13.1) Kuwait air-defence site at night — drone attack, RECOMPOSED.
// The v11 two-disc version read as two flat circles at 300px. Now the
// site reads: radar dish (left) + missile launcher (right) + a big
// orange explosion over the centre + smoke + two small drones in the
// sky. If the render still reads as a blob at 300px, drop the smoke
// first, then the launcher — never the explosion.
// ---------------------------------------------------------------------------
export function drawKuwait(g, x, y, w, h) {
  // Night sky, deep blue-black; desert ground below.
  const groundY = y + Math.floor(h * 0.62);
  g.rect(x, y, w, Math.floor(h * 0.62), [12, 18, 40]);
  g.rect(x, groundY, w, h - Math.floor(h * 0.62), [92, 74, 52]);
  // Radar dish, left: pole from the ground up, dish on top.
  const dishX = x + Math.floor(w * 0.16);
  const dishY = y + Math.floor(h * 0.52);
  g.line(dishX, groundY, dishX, dishY, [60, 64, 70], 3);
  g.circle(dishX, dishY, Math.floor(w * 0.07), [60, 64, 70]);
  // Missile launcher, right: base block + angled rail.
  g.rect(x + Math.floor(w * 0.80), groundY - Math.floor(h * 0.10), Math.floor(w * 0.10), Math.floor(h * 0.10), DARK);
  g.line(x + Math.floor(w * 0.82), groundY - Math.floor(h * 0.08), x + Math.floor(w * 0.88), groundY - Math.floor(h * 0.24), [60, 64, 70], 4);
  // Explosion, centre: orange mass + yellow core + red rim.
  const ex = x + Math.floor(w * 0.50), ey = y + Math.floor(h * 0.50);
  g.circle(ex, ey, Math.floor(w * 0.13), ORANGE);
  g.circle(ex, ey, Math.floor(w * 0.07), YELLOW);
  g.circle(ex - Math.floor(w * 0.10), ey, Math.floor(w * 0.04), RED);
  g.circle(ex + Math.floor(w * 0.10), ey, Math.floor(w * 0.04), RED);
  // Smoke above the explosion.
  g.circle(x + Math.floor(w * 0.44), y + Math.floor(h * 0.34), Math.floor(w * 0.05), [120, 120, 125]);
  g.circle(x + Math.floor(w * 0.56), y + Math.floor(h * 0.30), Math.floor(w * 0.06), [120, 120, 125]);
  // Two small drones: grey left, orange right, each with a rotor bar.
  const d1x = x + Math.floor(w * 0.28), d1y = y + Math.floor(h * 0.22);
  g.circle(d1x, d1y, Math.floor(w * 0.07), [150, 150, 155]);
  g.line(d1x - Math.floor(w * 0.09), d1y - Math.floor(h * 0.06), d1x + Math.floor(w * 0.09), d1y - Math.floor(h * 0.06), [150, 150, 155], 3);
  const d2x = x + Math.floor(w * 0.72), d2y = y + Math.floor(h * 0.20);
  g.circle(d2x, d2y, Math.floor(w * 0.075), ORANGE);
  g.line(d2x - Math.floor(w * 0.09), d2y - Math.floor(h * 0.06), d2x + Math.floor(w * 0.09), d2y - Math.floor(h * 0.06), [150, 150, 155], 3);
}


// ---------------------------------------------------------------------------
// 10. (v4) EU summit — circle of gold stars on EU blue, one star dimmed.
// The dimmed star + the dark table line say "no deal" without words.
// ---------------------------------------------------------------------------
// 10. (v11) EU summit — circle of gold stars on EU blue, one star dimmed.
// The table line and flags are gone; the star circle alone says it.
// ---------------------------------------------------------------------------
export function drawEU(g, x, y, w, h) {
  g.rect(x, y, w, h, [0, 44, 110]);
  // Subtle lighter arc behind the stars.
  g.circle(x + Math.floor(w * 0.50), y + Math.floor(h * 0.52), Math.floor(w * 0.34), [16, 66, 140]);
  // Circle of 12 gold stars; the bottom one is dimmed (grey).
  const cx = x + Math.floor(w * 0.50);
  const cy = y + Math.floor(h * 0.46);
  const rad = Math.floor(w * 0.26);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const sx = cx + Math.round(rad * Math.cos(a));
    const sy = cy + Math.round(rad * Math.sin(a) * 0.9);
    const col = i === 6 ? GREY : YELLOW;
    g.circle(sx, sy, Math.max(3, Math.floor(w * 0.028)), col);
  }
}


// ---------------------------------------------------------------------------
// 11. (v4) Ebola clinic — white building with a big red cross, green tent,
// red dots (the virus) kept small and abstract. Tasteful, no patients.
// ---------------------------------------------------------------------------
// 11. (v11) Ebola clinic — white building with a big red cross, green
// tent. The red virus dots are gone (they read as dirt at 300px).
// ---------------------------------------------------------------------------
export function drawEbola(g, x, y, w, h) {
  // Pale sky, green ground.
  g.rect(x, y, w, Math.floor(h * 0.68), [196, 214, 196]);
  g.rect(x, y + Math.floor(h * 0.68), w, h - Math.floor(h * 0.68), [90, 140, 80]);
  const baseY = y + Math.floor(h * 0.68);

  // Clinic building, left-centre: white block + red cross sign.
  const bx = x + Math.floor(w * 0.10);
  const bw = Math.floor(w * 0.44);
  const bh = Math.floor(h * 0.42);
  g.rect(bx, baseY - bh, bw, bh, WHITE);
  g.rect(bx, baseY - bh - Math.floor(h * 0.05), bw, Math.floor(h * 0.05), RED);
  // Red cross on the wall.
  const cx = bx + Math.floor(bw / 2);
  const cy = baseY - Math.floor(bh * 0.55);
  g.rect(cx - 3, cy - Math.floor(h * 0.09), 6, Math.floor(h * 0.18), RED);
  g.rect(cx - Math.floor(w * 0.05), cy - 3, Math.floor(w * 0.10), 6, RED);
  // Door + window.
  g.rect(bx + Math.floor(bw * 0.12), baseY - Math.floor(h * 0.14), Math.floor(w * 0.07), Math.floor(h * 0.14), DARKBLUE);
  g.rect(bx + Math.floor(bw * 0.62), baseY - Math.floor(h * 0.26), Math.floor(w * 0.10), Math.floor(h * 0.10), LIGHTBLUE);

  // Green medical tent, right — one big triangle + dark door.
  const tx = x + Math.floor(w * 0.62);
  g.tri(tx, baseY - Math.floor(h * 0.30), tx + Math.floor(w * 0.30), baseY - Math.floor(h * 0.30), tx + Math.floor(w * 0.15), baseY, [52, 110, 70]);
  g.rect(tx + Math.floor(w * 0.11), baseY - Math.floor(h * 0.12), Math.floor(w * 0.08), Math.floor(h * 0.12), DARK);
}


// ---------------------------------------------------------------------------
// 12. (v4) Giza fuel tanker on fire — road, tanker truck with a long
// cylinder tank, big flames and black smoke. The truck is the whole box.
// ---------------------------------------------------------------------------
// 12. (v11) Giza fuel tanker on fire — road, tanker truck, flames. The
// grey smoke puffs are gone; the truck + fire are the whole box.
// ---------------------------------------------------------------------------
export function drawGizaTruck(g, x, y, w, h) {
  // Dusty orange-grey sky.
  g.rect(x, y, w, Math.floor(h * 0.55), [196, 158, 118]);
  g.rect(x, y + Math.floor(h * 0.55), w, h - Math.floor(h * 0.55), [214, 178, 138]);
  // Road band.
  const roadY = y + Math.floor(h * 0.68);
  g.rect(x, roadY, w, h - Math.floor(h * 0.68), [52, 52, 56]);
  g.line(x + Math.floor(w * 0.04), roadY + Math.floor(h * 0.16), x + Math.floor(w * 0.96), roadY + Math.floor(h * 0.16), [220, 200, 90], 3);

  // Flames rising from the middle of the tank.
  const fx = x + Math.floor(w * 0.55);
  g.circle(fx + Math.floor(w * 0.02), roadY - Math.floor(h * 0.02), Math.floor(w * 0.07), ORANGE);
  g.circle(fx + Math.floor(w * 0.07), roadY - Math.floor(h * 0.06), Math.floor(w * 0.05), YELLOW);
  g.circle(fx - Math.floor(w * 0.05), roadY - Math.floor(h * 0.04), Math.floor(w * 0.045), ORANGE);

  // Tanker truck: long silver cylinder tank + red cab, big and low.
  const tankY = roadY - Math.floor(h * 0.30);
  const tankH = Math.floor(h * 0.26);
  g.rect(x + Math.floor(w * 0.06), tankY, Math.floor(w * 0.58), tankH, LIGHTGREY);
  g.circle(x + Math.floor(w * 0.06), tankY + Math.floor(tankH / 2), Math.floor(tankH / 2), LIGHTGREY);
  g.circle(x + Math.floor(w * 0.64), tankY + Math.floor(tankH / 2), Math.floor(tankH / 2), GREY);
  // Cab, right.
  g.rect(x + Math.floor(w * 0.68), tankY + Math.floor(h * 0.04), Math.floor(w * 0.20), tankH - Math.floor(h * 0.04), RED);
  g.rect(x + Math.floor(w * 0.74), tankY + Math.floor(h * 0.07), Math.floor(w * 0.08), Math.floor(h * 0.08), LIGHTBLUE);
  // Wheels.
  for (const wx of [0.14, 0.30, 0.48, 0.76]) {
    g.circle(x + Math.floor(w * wx), roadY + 2, Math.floor(w * 0.045), BLACK);
    g.circle(x + Math.floor(w * wx), roadY + 2, 2, GREY);
  }
}


// ---------------------------------------------------------------------------
// 13. (v4) Bank of Korea — grey bank with columns and pediment, big red
// up-arrow on the right, gold coins at the base. Reads as "rate hike".
// ---------------------------------------------------------------------------
export function drawKorea(g, x, y, w, h) {
  // Pale blue sky.
  g.rect(x, y, w, h, [178, 205, 226]);
  // Ground.
  g.rect(x, y + Math.floor(h * 0.86), w, h - Math.floor(h * 0.86), [90, 96, 104]);
  const baseY = y + Math.floor(h * 0.86);

  // Bank building, left two-thirds: body + pediment + columns.
  const bx = x + Math.floor(w * 0.06);
  const bw = Math.floor(w * 0.52);
  g.rect(bx, baseY - Math.floor(h * 0.52), bw, Math.floor(h * 0.52), [210, 208, 200]);
  g.tri(bx, baseY - Math.floor(h * 0.52), bx + bw, baseY - Math.floor(h * 0.52), bx + Math.floor(bw / 2), baseY - Math.floor(h * 0.68), [180, 178, 170]);
  for (let i = 0; i < 4; i++) {
    const cx = bx + Math.floor(bw * (0.14 + i * 0.24));
    g.rect(cx, baseY - Math.floor(h * 0.48), Math.floor(w * 0.035), Math.floor(h * 0.48), [120, 118, 112]);
  }
  // Steps.
  g.rect(bx - Math.floor(w * 0.02), baseY - Math.floor(h * 0.05), bw + Math.floor(w * 0.04), Math.floor(h * 0.05), [150, 148, 142]);

  // Big red up-arrow, right side.
  const ax = x + Math.floor(w * 0.78);
  const ayTop = y + Math.floor(h * 0.16);
  const ayBot = y + Math.floor(h * 0.72);
  g.tri(ax - Math.floor(w * 0.10), ayTop + Math.floor(h * 0.14), ax + Math.floor(w * 0.10), ayTop + Math.floor(h * 0.14), ax, ayTop, RED);
  g.rect(ax - Math.floor(w * 0.035), ayTop + Math.floor(h * 0.14), Math.floor(w * 0.07), ayBot - (ayTop + Math.floor(h * 0.14)), RED);

}

// ---------------------------------------------------------------------------
// 14. (v4) Thanksgiving storm — dark clouds, rain, lightning over dark
// houses. One lit window keeps it from reading as pure black.
// ---------------------------------------------------------------------------
export function drawStorm(g, x, y, w, h) {
  // Storm sky: dark grey-blue.
  g.rect(x, y, w, Math.floor(h * 0.58), [52, 60, 78]);
  // Cloud blobs, darker.
  const clouds = [[0.18, 0.16, 0.14], [0.42, 0.10, 0.17], [0.68, 0.18, 0.15], [0.88, 0.10, 0.11], [0.30, 0.30, 0.12], [0.58, 0.32, 0.13]];
  for (let i = 0; i < clouds.length; i++) {
    g.circle(x + Math.floor(w * clouds[i][0]), y + Math.floor(h * clouds[i][1]), Math.floor(w * clouds[i][2]), [34, 40, 56]);
  }
  // Rain: diagonal light-blue lines.
  for (let i = 0; i < 7; i++) {
    const rx = x + Math.floor(w * (0.08 + i * 0.13));
    g.line(rx, y + Math.floor(h * 0.42), rx + Math.floor(w * 0.03), y + Math.floor(h * 0.56), LIGHTBLUE, 2);
  }
  // Lightning bolt: yellow zigzag (two triangles + line).
  const bx = x + Math.floor(w * 0.62);
  g.line(bx, y + Math.floor(h * 0.30), bx - Math.floor(w * 0.05), y + Math.floor(h * 0.44), YELLOW, 4);
  g.line(bx - Math.floor(w * 0.05), y + Math.floor(h * 0.44), bx + Math.floor(w * 0.03), y + Math.floor(h * 0.44), YELLOW, 4);
  g.line(bx + Math.floor(w * 0.03), y + Math.floor(h * 0.44), bx - Math.floor(w * 0.02), y + Math.floor(h * 0.58), YELLOW, 4);

  // Dark houses along the bottom.
  const baseY = y + h;
  const houses = [[0.02, 0.30], [0.20, 0.38], [0.40, 0.28], [0.60, 0.36], [0.80, 0.30]];
  for (let i = 0; i < houses.length; i++) {
    const hx = x + Math.floor(w * houses[i][0]);
    const hw = Math.floor(w * 0.16);
    const hh = Math.floor(h * houses[i][1]);
    g.rect(hx, baseY - hh, hw, hh, [22, 24, 34]);
    g.tri(hx - 2, baseY - hh, hx + hw + 2, baseY - hh, hx + Math.floor(hw / 2), baseY - hh - Math.floor(h * 0.08), [16, 18, 26]);
  }
  // One lit window (yellow) — the only light in the street.
  g.rect(x + Math.floor(w * 0.45), baseY - Math.floor(h * 0.18), Math.floor(w * 0.05), Math.floor(h * 0.09), YELLOW);
  // Leaning tree, right.
  g.line(x + Math.floor(w * 0.92), baseY, x + Math.floor(w * 0.86), baseY - Math.floor(h * 0.30), DARK, 4);
  g.circle(x + Math.floor(w * 0.85), baseY - Math.floor(h * 0.34), Math.floor(w * 0.05), [30, 60, 40]);
}


// ---------------------------------------------------------------------------
// 16. (v9) LEAD — Macy's 100th Thanksgiving Day Parade grounded by the
// nor'easter: giant balloons over a Manhattan skyline in the rain.
// Why this scene: rank 1 (0.991711) AND rank 3 (0.991557) both lead with
// the storm; rank 10 has it #2, rank 50 leads with the parade balloons.
// It is the day's most visual, most human story (100th parade, first
// postponement in 100 years, ~1m without power) and pixel art is MADE
// for it — big chunky balloons + skyline + rain read at any size, where
// the old lead (refinery: grey tanks + black smoke blobs) never did.
// Balloons are the largest shapes in the box, high-contrast against the
// dark storm sky, with lit windows in the skyline for scale.
// ---------------------------------------------------------------------------
// 15. (v11) Bangkok refinery blast — one big explosion cloud + two smoke
// puffs over a plain ground line. Factory blocks and chimney are gone.
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
export function drawParade(g, x, y, w, h) {
  // Dusk storm sky: flat blue bands, clearly lighter than v9's near-black
  // navy so the lead cell reads at thumbnail size — still night, not day.
  const bands = 4;
  for (let i = 0; i < bands; i++) {
    const t = i / (bands - 1); // 0 top -> 1 bottom
    const c = [
      Math.round(58 + 38 * t),
      Math.round(78 + 44 * t),
      Math.round(130 + 40 * t),
    ];
    g.rect(x, y + Math.floor((i * h) / bands), w, Math.ceil(h / bands) + 1, c);
  }
  // Horizon glow band behind the skyline: a lighter slate slab so the
  // dark towers read as a skyline instead of melting into the night sky.
  g.rect(x, y + Math.floor(h * 0.52), w, Math.floor(h * 0.30), [118, 132, 168]);
  // Dark storm clouds, top half — darker than the sky, but not black.
  const clouds = [[0.16, 0.12, 0.10], [0.45, 0.08, 0.12], [0.72, 0.12, 0.10], [0.94, 0.08, 0.08], [0.30, 0.26, 0.08], [0.58, 0.26, 0.09]];
  for (let i = 0; i < clouds.length; i++) {
    g.circle(x + Math.floor(w * clouds[i][0]), y + Math.floor(h * clouds[i][1]), Math.floor(w * clouds[i][2]), [44, 58, 96]);
  }
  // Rain: long diagonal pale streaks across the whole sky, clearly visible.
  for (let i = 0; i < 16; i++) {
    const rx = x + Math.floor(w * (0.02 + i * 0.06));
    g.line(rx, y + Math.floor(h * 0.10), rx + Math.floor(w * 0.04), y + Math.floor(h * 0.58), SKYBLUE, 3);
  }

  // Manhattan skyline: dark slabs of varying height along the bottom,
  // with a few lit windows. Drawn BEFORE the balloons so the balloons
  // float in front of the sky.
  const baseY = y + h;
  const towers = [
    [0.00, 0.10, 0.50], [0.10, 0.08, 0.60], [0.18, 0.12, 0.46],
    [0.30, 0.09, 0.56], [0.39, 0.11, 0.42], [0.50, 0.08, 0.64],
    [0.58, 0.10, 0.48], [0.68, 0.09, 0.58], [0.77, 0.12, 0.44],
    [0.89, 0.11, 0.52],
  ];
  for (let i = 0; i < towers.length; i++) {
    const tx = x + Math.floor(w * towers[i][0]);
    const tw = Math.floor(w * towers[i][1]);
    const th = Math.floor(h * towers[i][2]);
    g.rect(tx, baseY - th, tw, th, [36, 46, 70]);
    // Rooftop antenna on the two tallest.
    if (i === 1 || i === 5) {
      g.rect(tx + Math.floor(tw / 2) - 1, baseY - th - Math.floor(h * 0.10), 3, Math.floor(h * 0.10), [36, 46, 70]);
    }
  }
  // Lit windows: small yellow dots on the towers (fixed positions).
  const windows = [
    [0.03, 0.72], [0.06, 0.80], [0.12, 0.66], [0.15, 0.76], [0.20, 0.70],
    [0.24, 0.82], [0.32, 0.68], [0.36, 0.78], [0.42, 0.72], [0.46, 0.84],
    [0.52, 0.64], [0.55, 0.76], [0.60, 0.70], [0.64, 0.82], [0.70, 0.66],
    [0.74, 0.78], [0.79, 0.72], [0.83, 0.84], [0.91, 0.68], [0.95, 0.78],
    [0.05, 0.58], [0.13, 0.56], [0.22, 0.60], [0.33, 0.54], [0.44, 0.58],
    [0.53, 0.50], [0.62, 0.56], [0.71, 0.54], [0.80, 0.58], [0.92, 0.56],
  ];
  for (let i = 0; i < windows.length; i++) {
    g.rect(x + Math.floor(w * windows[i][0]), y + Math.floor(h * windows[i][1]), 5, 6, YELLOW);
  }

  // Parade balloons, with strings down to the street. MUCH bigger than v9:
  // the balloons are the story of the day, so they dominate the cell.
  // Big red round balloon, left of centre — the hero shape.
  const r1x = x + Math.floor(w * 0.28), r1y = y + Math.floor(h * 0.38);
  const r1r = Math.floor(h * 0.36);
  g.circle(r1x, r1y, r1r, RED);
  g.circle(r1x - Math.floor(r1r * 0.35), r1y - Math.floor(r1r * 0.35), Math.floor(r1r * 0.28), [255, 120, 100]);
  g.line(r1x - 4, r1y + r1r, r1x - 6, baseY - 2, WHITE, 2);
  g.line(r1x + 4, r1y + r1r, r1x + 6, baseY - 2, WHITE, 2);
  // Gold balloon, right of centre.
  const r2x = x + Math.floor(w * 0.60), r2y = y + Math.floor(h * 0.34);
  const r2r = Math.floor(h * 0.28);
  g.circle(r2x, r2y, r2r, YELLOW);
  g.circle(r2x - Math.floor(r2r * 0.35), r2y - Math.floor(r2r * 0.35), Math.floor(r2r * 0.28), [255, 230, 150]);
  g.line(r2x - 3, r2y + r2r, r2x - 5, baseY - 2, WHITE, 2);
  g.line(r2x + 3, r2y + r2r, r2x + 5, baseY - 2, WHITE, 2);
  // Small white balloon, far right.
  const r3x = x + Math.floor(w * 0.84), r3y = y + Math.floor(h * 0.42);
  const r3r = Math.floor(h * 0.20);
  g.circle(r3x, r3y, r3r, WHITE);
  g.line(r3x, r3y + r3r, r3x - 2, baseY - 2, WHITE, 2);
  // Small blue balloon, far left, clear of the number badge.
  const r4x = x + Math.floor(w * 0.12), r4y = y + Math.floor(h * 0.50);
  const r4r = Math.floor(h * 0.17);
  g.circle(r4x, r4y, r4r, MIDBLUE);
  g.line(r4x, r4y + r4r, r4x + 2, baseY - 2, WHITE, 2);
}
export function drawBangkok(g, x, y, w, h) {
  // Pale hazy sky.
  g.rect(x, y, w, h, [206, 196, 172]);
  const baseY = y + Math.floor(h * 0.84);
  g.rect(x, baseY, w, h - Math.floor(h * 0.84), [70, 66, 60]);

  // Huge explosion cloud, centre: orange mass + yellow core + red rim.
  const ex = x + Math.floor(w * 0.48);
  const ey = baseY - Math.floor(h * 0.42);
  g.circle(ex - Math.floor(w * 0.10), ey + Math.floor(h * 0.06), Math.floor(w * 0.09), ORANGE);
  g.circle(ex + Math.floor(w * 0.10), ey + Math.floor(h * 0.06), Math.floor(w * 0.09), ORANGE);
  g.circle(ex, ey - Math.floor(h * 0.06), Math.floor(w * 0.11), ORANGE);
  g.circle(ex, ey, Math.floor(w * 0.07), YELLOW);
  g.circle(ex - Math.floor(w * 0.04), ey + Math.floor(h * 0.10), Math.floor(w * 0.05), RED);
  g.circle(ex + Math.floor(w * 0.05), ey + Math.floor(h * 0.10), Math.floor(w * 0.045), RED);
  // Black smoke above.
  g.circle(ex - Math.floor(w * 0.06), ey - Math.floor(h * 0.24), Math.floor(w * 0.07), DARK);
  g.circle(ex + Math.floor(w * 0.07), ey - Math.floor(h * 0.30), Math.floor(w * 0.08), BLACK);
}

// ---------------------------------------------------------------------------
// 17. (v13) Guinea-Bissau — ballot box. One big navy box, a white ballot
// rising from its slot with a red check, a green seal dot. No figures,
// no fiddly detail — the box + check say "election" at any size.
// ---------------------------------------------------------------------------
export function drawBallot(g, x, y, w, h) {
  // Pale sky, green ground strip.
  g.rect(x, y, w, Math.floor(h * 0.68), [214, 222, 228]);
  g.rect(x, y + Math.floor(h * 0.68), w, h - Math.floor(h * 0.68), [90, 140, 80]);
  const baseY = y + Math.floor(h * 0.68);
  // White ballot paper rising from the slot.
  const bx = x + Math.floor(w * 0.36);
  const bw = Math.floor(w * 0.28);
  g.rect(bx, y + Math.floor(h * 0.06), bw, Math.floor(h * 0.42), WHITE);
  // Red check on the ballot: two thick strokes.
  g.line(bx + Math.floor(bw * 0.18), y + Math.floor(h * 0.30), bx + Math.floor(bw * 0.42), y + Math.floor(h * 0.42), RED, 4);
  g.line(bx + Math.floor(bw * 0.42), y + Math.floor(h * 0.42), bx + Math.floor(bw * 0.86), y + Math.floor(h * 0.12), RED, 4);
  // Navy ballot box with a slot.
  const boxX = x + Math.floor(w * 0.22);
  const boxW = Math.floor(w * 0.56);
  const boxH = Math.floor(h * 0.34);
  g.rect(boxX, baseY - boxH, boxW, boxH, DARKBLUE);
  g.rect(boxX + Math.floor(boxW * 0.30), baseY - boxH - 2, Math.floor(boxW * 0.40), 4, [10, 10, 16]);
  // Green seal dot on the box front.
  g.circle(boxX + Math.floor(boxW * 0.50), baseY - Math.floor(boxH * 0.45), Math.floor(w * 0.05), GREEN);
}

// ---------------------------------------------------------------------------
// 18. (v13.1) Nairobi — courthouse. A pale hall with pediment + columns
// and a red halt bar across it: the court stopped the Ebola facility.
// The bar, not the building, is the story — it must read at any size.
// ---------------------------------------------------------------------------
export function drawCourt(g, x, y, w, h) {
  // Pale sky, grey ground.
  g.rect(x, y, w, h, [200, 208, 216]);
  const baseY = y + Math.floor(h * 0.86);
  g.rect(x, baseY, w, h - Math.floor(h * 0.86), [90, 96, 104]);
  // Courthouse hall: pale block + triangular pediment.
  const hx = x + Math.floor(w * 0.14);
  const hw = Math.floor(w * 0.72);
  g.rect(hx, baseY - Math.floor(h * 0.50), hw, Math.floor(h * 0.50), [228, 226, 220]);
  g.tri(hx, baseY - Math.floor(h * 0.50), hx + hw, baseY - Math.floor(h * 0.50), hx + Math.floor(hw / 2), baseY - Math.floor(h * 0.66), [200, 198, 190]);
  // Three columns.
  for (let i = 0; i < 3; i++) {
    const cx = hx + Math.floor(hw * (0.20 + i * 0.30));
    g.rect(cx, baseY - Math.floor(h * 0.46), Math.floor(w * 0.04), Math.floor(h * 0.46), [150, 148, 142]);
  }
  // Steps at the base.
  g.rect(hx - Math.floor(w * 0.01), baseY - Math.floor(h * 0.06), hw + Math.floor(w * 0.02), Math.floor(h * 0.06), [170, 168, 162]);
  // Red halt bar across the hall (the court stopped the facility).
  const barY = baseY - Math.floor(h * 0.34) - Math.floor(h * 0.035);
  g.rect(hx + Math.floor(hw * 0.06), barY, hw - Math.floor(hw * 0.12), Math.floor(h * 0.07), RED);
}
