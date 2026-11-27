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
// 1. LEAD — Saudi Ras Tanura refinery, BRIGHT day. (v7: was a dark dusk
// gradient drowned by giant black smoke circles — at 300px it read as
// grey blobs on brown. Now: pale cream sky, two BIG pale storage tanks,
// three tall steel towers with gold bands, one big flame, and only small
// light-grey smoke wisps. The refinery is the picture, not the smoke.)
// ---------------------------------------------------------------------------
export function drawRefinery(g, x, y, w, h) {
  // Pale cream sky, bright all the way down.
  g.rect(x, y, w, h, [242, 232, 204]);
  // Gold sun disc, top-RIGHT — a bright anchor, clear of the badge (left)
  // and the flare stack (0.85w).
  g.circle(x + Math.floor(w * 0.94), y + Math.floor(h * 0.22), Math.floor(w * 0.045), [232, 182, 76]);
  g.circle(x + Math.floor(w * 0.94), y + Math.floor(h * 0.22), Math.floor(w * 0.030), [245, 205, 110]);
  // Sand ground strip.
  const baseY = y + Math.floor(h * 0.84);
  g.rect(x, baseY, w, h - Math.floor(h * 0.84), [214, 164, 96]);

  // Two BIG FLAT-TOP storage tanks, left: flat tops read as industrial
  // tanks in a wide-short box (domes read as hills). Dark top band +
  // white highlight stripe for definition.
  const tankY = y + Math.floor(h * 0.52);
  const tankH = baseY - tankY;
  const tanks = [
    [0.03, 0.19], [0.25, 0.15],
  ];
  for (let i = 0; i < tanks.length; i++) {
    const tx = x + Math.floor(w * tanks[i][0]);
    const tw = Math.floor(w * tanks[i][1]);
    g.rect(tx, tankY, tw, tankH, LIGHTGREY);
    // Dark top band + white highlight stripe.
    g.rect(tx, tankY, tw, 4, GREY);
    g.rect(tx + Math.floor(tw * 0.18), tankY + 4, Math.floor(tw * 0.10), tankH - 4, WHITE);
    // Horizontal band + vertical seam.
    g.rect(tx, tankY + Math.floor(tankH * 0.5), tw, 2, GREY);
    g.rect(tx + Math.floor(tw / 2) - 1, tankY, 2, tankH, GREY);
  }

  // Four tall distillation towers, centre — dark steel with gold bands
  // and gold caps, varying heights, the verticals that say "refinery".
  const towers = [
    [0.46, 0.060, 0.58],
    [0.55, 0.070, 0.72],
    [0.64, 0.060, 0.64],
    [0.72, 0.070, 0.78],
  ];
  for (let i = 0; i < towers.length; i++) {
    const tx = x + Math.floor(w * towers[i][0]);
    const tw = Math.floor(w * towers[i][1]);
    const th = Math.floor(h * towers[i][2]);
    const ty = baseY - th;
    g.rect(tx, ty, tw, th, [58, 74, 96]);
    // Gold platform bands + gold cap.
    g.rect(tx - 2, ty + Math.floor(th * 0.30), tw + 4, 4, [232, 182, 76]);
    g.rect(tx - 2, ty + Math.floor(th * 0.62), tw + 4, 4, [232, 182, 76]);
    g.rect(tx, ty - 3, tw, 4, [232, 182, 76]);
    // Pipe stack on top.
    g.rect(tx + Math.floor(tw / 3), ty - Math.floor(h * 0.06), Math.floor(tw / 3), Math.floor(h * 0.06), DARK);
  }
  // Connecting pipe between the two tallest towers, mid-height.
  g.rect(x + Math.floor(w * 0.55), baseY - Math.floor(h * 0.42), Math.floor(w * 0.17), 3, STEELLIGHT);

  // Flare stack, right: thin tall stack with the flame ON TOP — the
  // classic refinery image, and the flame reads at thumbnail size.
  // (Flame centre sits at 0.20h so the whole fireball stays in the box.)
  const flx = x + Math.floor(w * 0.85);
  g.rect(flx, baseY - Math.floor(h * 0.60), 5, Math.floor(h * 0.60), DARK);
  g.rect(flx, baseY - Math.floor(h * 0.60), 5, Math.floor(h * 0.08), RED);
  g.circle(flx + 2, baseY - Math.floor(h * 0.64), Math.floor(w * 0.035), ORANGE);
  g.circle(flx + 2, baseY - Math.floor(h * 0.64), Math.floor(w * 0.020), YELLOW);

  // Pipes along the ground.
  g.rect(x, baseY - Math.floor(h * 0.06), w, 3, STEELLIGHT);
  g.rect(x, baseY - Math.floor(h * 0.02), w, 3, STEEL);
}

// ---------------------------------------------------------------------------
// 2. Oil tanker on fire at sea. (v7: was a dark-blue night box — at 300px
// a black smear. Now bright day: pale sky, light-blue sea, tall dark hull
// with a red stripe, big white superstructure, and the flame as the
// largest shape in the box.)
// ---------------------------------------------------------------------------
export function drawTanker(g, x, y, w, h) {
  // Pale sky, top half.
  g.rect(x, y, w, Math.floor(h * 0.48), [180, 210, 230]);
  // Light-blue sea, bottom half.
  g.rect(x, y + Math.floor(h * 0.48), w, h - Math.floor(h * 0.48), [80, 130, 185]);
  // White wave lines.
  g.line(x + Math.floor(w * 0.05), y + Math.floor(h * 0.85), x + Math.floor(w * 0.45), y + Math.floor(h * 0.85), WHITE, 3);
  g.line(x + Math.floor(w * 0.55), y + Math.floor(h * 0.94), x + Math.floor(w * 0.95), y + Math.floor(h * 0.94), WHITE, 3);

  // BIG flames + light smoke from mid-ship (drawn BEFORE the hull so the
  // fire rises out of the deck).
  const fx = x + Math.floor(w * 0.58);
  const hullY = y + Math.floor(h * 0.46);
  g.circle(fx + Math.floor(w * 0.07), hullY - Math.floor(h * 0.28), Math.floor(w * 0.06), LIGHTGREY);
  g.circle(fx, hullY - Math.floor(h * 0.06), Math.floor(w * 0.075), ORANGE);
  g.circle(fx + Math.floor(w * 0.05), hullY - Math.floor(h * 0.02), Math.floor(w * 0.055), YELLOW);
  g.circle(fx - Math.floor(w * 0.05), hullY - Math.floor(h * 0.02), Math.floor(w * 0.05), ORANGE);

  // Tall dark hull: long rectangle with raked bow.
  const hullH = Math.floor(h * 0.34);
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
  g.rect(x + Math.floor(w * 0.06), hullY - Math.floor(h * 0.30), Math.floor(w * 0.16), Math.floor(h * 0.30), WHITE);
  g.rect(x + Math.floor(w * 0.06), hullY - Math.floor(h * 0.30), Math.floor(w * 0.16), Math.floor(h * 0.07), RED);
  // One tall funnel behind the superstructure.
  g.rect(x + Math.floor(w * 0.26), hullY - Math.floor(h * 0.20), Math.floor(w * 0.07), Math.floor(h * 0.20), DARK);
}

// ---------------------------------------------------------------------------
// 3. Dove over a ruined city — ceasefire under strain. Tasteful, no gore.
// (v7: sky lightened, ruined buildings mid-grey instead of near-black,
// dove enlarged so the white bird is the picture at thumbnail size.)
// ---------------------------------------------------------------------------
export function drawGaza(g, x, y, w, h) {
  // Bright dusty sky.
  g.rect(x, y, w, h, [228, 205, 165]);
  g.rect(x, y, w, Math.floor(h * 0.30), [238, 220, 185]);

  // Ruined skyline silhouette: broken MID-GREY buildings, uneven heights.
  const baseY = y + h;
  const blds = [
    [0.00, 0.42], [0.13, 0.55], [0.26, 0.34], [0.38, 0.50],
    [0.50, 0.30], [0.63, 0.58], [0.76, 0.40], [0.88, 0.52],
  ];
  for (let i = 0; i < blds.length; i++) {
    const bx = x + Math.floor(w * blds[i][0]);
    const bw = Math.floor(w * 0.12);
    const bh = Math.floor(h * blds[i][1]);
    g.rect(bx, baseY - bh, bw, bh, GREY);
  }
  // One leaning building (triangle slab).
  g.tri(
    x + Math.floor(w * 0.44), baseY - Math.floor(h * 0.30),
    x + Math.floor(w * 0.56), baseY,
    x + Math.floor(w * 0.48), baseY,
    LIGHTGREY
  );
  // Rubble line at the base.
  g.rect(x, baseY - Math.floor(h * 0.06), w, Math.floor(h * 0.06), LIGHTGREY);

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
// (v7: night sky lightened to mid-blue so the sandstone arch pops;
// candle flame enlarged; stars bigger.)
// ---------------------------------------------------------------------------
export function drawIndia(g, x, y, w, h) {
  // Mid-blue sky — bright enough for the sandstone to read.
  g.rect(x, y, w, h, [70, 100, 160]);
  // Stars.
  g.circle(x + Math.floor(w * 0.12), y + Math.floor(h * 0.10), 3, WHITE);
  g.circle(x + Math.floor(w * 0.86), y + Math.floor(h * 0.14), 3, WHITE);
  g.circle(x + Math.floor(w * 0.70), y + Math.floor(h * 0.06), 3, WHITE);
  // Ground.
  g.rect(x, y + Math.floor(h * 0.86), w, h - Math.floor(h * 0.86), [60, 64, 84]);

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
  // Bigger now — the warm dot that says "remembrance" at thumbnail size.
  const cx = x + Math.floor(w * 0.50);
  g.rect(cx - 3, baseY - Math.floor(h * 0.08), 6, Math.floor(h * 0.08), WHITE);
  g.circle(cx, baseY - Math.floor(h * 0.12), Math.floor(w * 0.035), ORANGE);
  g.circle(cx, baseY - Math.floor(h * 0.15), Math.floor(w * 0.020), YELLOW);
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
// (v7: sea lightened, containers enlarged to two tall rows, badge bigger.)
// ---------------------------------------------------------------------------
export function drawTariffs(g, x, y, w, h) {
  // Pale sky, lighter blue sea.
  g.rect(x, y, w, Math.floor(h * 0.52), [178, 205, 228]);
  g.rect(x, y + Math.floor(h * 0.52), w, h - Math.floor(h * 0.52), [70, 120, 180]);
  g.line(x + Math.floor(w * 0.05), y + Math.floor(h * 0.78), x + Math.floor(w * 0.50), y + Math.floor(h * 0.78), WHITE, 3);
  g.line(x + Math.floor(w * 0.55), y + Math.floor(h * 0.88), x + Math.floor(w * 0.95), y + Math.floor(h * 0.88), WHITE, 3);

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

  // Container stack: two tall rows of BIG bright boxes on the deck.
  const conts = [
    [0.06, 0.42, 0.14, RED], [0.21, 0.42, 0.14, YELLOW], [0.36, 0.42, 0.14, [36, 68, 120]],
    [0.51, 0.42, 0.14, GREEN], [0.13, 0.22, 0.14, [36, 68, 120]], [0.28, 0.22, 0.14, RED],
    [0.43, 0.22, 0.14, YELLOW],
  ];
  for (let i = 0; i < conts.length; i++) {
    g.rect(
      x + Math.floor(w * conts[i][0]),
      hullY - Math.floor(h * conts[i][1]) - Math.floor(h * 0.18),
      Math.floor(w * conts[i][2]),
      Math.floor(h * 0.18),
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
// (v7: space lightened from near-black to deep blue, Earth arc bigger and
// brighter, satellites enlarged — the box no longer reads as a black hole.)
// ---------------------------------------------------------------------------
export function drawSatellites(g, x, y, w, h) {
  // Deep-blue space, not black.
  g.rect(x, y, w, h, [25, 45, 95]);
  const stars = [
    [0.06, 0.08], [0.20, 0.05], [0.36, 0.12], [0.52, 0.06],
    [0.68, 0.14], [0.84, 0.07], [0.94, 0.18], [0.12, 0.30],
    [0.44, 0.28], [0.90, 0.42], [0.26, 0.52], [0.72, 0.55],
  ];
  for (let i = 0; i < stars.length; i++) {
    g.circle(x + Math.floor(w * stars[i][0]), y + Math.floor(h * stars[i][1]), 3, WHITE);
  }

  // Earth: big bright-blue disc rising from the bottom-left corner, with a
  // lighter arc highlight and a green landmass blob.
  const ex = x + Math.floor(w * 0.18), ey = y + h + Math.floor(h * 0.22);
  g.circle(ex, ey, Math.floor(w * 0.38), [56, 110, 185]);
  g.circle(ex - Math.floor(w * 0.06), ey - Math.floor(h * 0.10), Math.floor(w * 0.33), [80, 145, 210]);
  g.circle(ex + Math.floor(w * 0.10), ey - Math.floor(h * 0.02), Math.floor(w * 0.12), GREEN);
  g.circle(ex - Math.floor(w * 0.14), ey - Math.floor(h * 0.16), Math.floor(w * 0.08), GREEN);

  // Dotted orbit arc sweeping across the sky.
  const ocx = x + Math.floor(w * 0.50), ocy = y + Math.floor(h * 1.05);
  const oa = Math.floor(w * 0.52), ob = Math.floor(h * 0.78);
  for (let deg = 200; deg <= 340; deg += 9) {
    const t = (deg * Math.PI) / 180;
    const dx = ocx + Math.round(oa * Math.cos(t));
    const dy = ocy + Math.round(ob * Math.sin(t));
    if (dx >= x && dx < x + w && dy >= y && dy < y + h) g.circle(dx, dy, 2, WHITE);
  }

  // Three BIG satellites on the arc: white body + blue panel wings.
  const sats = [
    [0.22, 0.30, 1], [0.55, 0.14, -1], [0.82, 0.34, 1],
  ];
  for (let i = 0; i < sats.length; i++) {
    const sx = x + Math.floor(w * sats[i][0]);
    const sy = y + Math.floor(h * sats[i][1]);
    const tilt = sats[i][2];
    // Solar panels (blue wings).
    g.rect(sx - 20, sy - 4 + tilt * 2, 15, 9, LIGHTBLUE);
    g.rect(sx + 5, sy - 4 - tilt * 2, 15, 9, LIGHTBLUE);
    // Body.
    g.rect(sx - 6, sy - 6, 12, 12, WHITE);
    g.circle(sx, sy, 3, ORANGE);
  }
}

// ---------------------------------------------------------------------------
// 9. (v4) Kuwait air-defence site — drone attack.
// (v7: was a near-black night box. Now bright day: pale blue sky, light
// sand ground, big white radar dish, missile launcher with a white missile,
// orange burst, drone silhouette. Same elements, readable at 300px.)
// ---------------------------------------------------------------------------
export function drawKuwait(g, x, y, w, h) {
  // Pale blue sky.
  g.rect(x, y, w, Math.floor(h * 0.62), [175, 205, 228]);
  // Sun glint, top-left.
  g.circle(x + Math.floor(w * 0.10), y + Math.floor(h * 0.12), Math.floor(w * 0.035), [255, 230, 150]);
  // Light sand ground.
  g.rect(x, y + Math.floor(h * 0.62), w, h - Math.floor(h * 0.62), [205, 175, 125]);
  const baseY = y + Math.floor(h * 0.62);

  // Radar dish, left: pole + BIG white dish with a dark rim so the disc
  // reads as a dish, not a moon. (No diagonal line across it — that read
  // as a prohibition sign.)
  const rx = x + Math.floor(w * 0.20);
  g.rect(rx - 2, baseY - Math.floor(h * 0.30), 4, Math.floor(h * 0.30), DARK);
  g.circle(rx, baseY - Math.floor(h * 0.34), Math.floor(w * 0.105), GREY);
  g.circle(rx, baseY - Math.floor(h * 0.34), Math.floor(w * 0.09), WHITE);
  // Small feed arm from the dish centre, pointing up-right.
  g.line(rx, baseY - Math.floor(h * 0.34), rx + Math.floor(w * 0.07), baseY - Math.floor(h * 0.44), DARK, 3);
  g.circle(rx + Math.floor(w * 0.07), baseY - Math.floor(h * 0.44), 2, DARK);

  // Missile launcher truck, centre: bed + angled RED missile, dark tip —
  // kept clear of the explosion so the missile stays visible.
  const lx = x + Math.floor(w * 0.44);
  g.rect(lx, baseY - Math.floor(h * 0.10), Math.floor(w * 0.26), Math.floor(h * 0.10), DARK);
  g.circle(lx + Math.floor(w * 0.05), baseY - 3, 4, BLACK);
  g.circle(lx + Math.floor(w * 0.21), baseY - 3, 4, BLACK);
  g.line(lx + Math.floor(w * 0.04), baseY - Math.floor(h * 0.10), lx + Math.floor(w * 0.19), baseY - Math.floor(h * 0.40), RED, 8);
  g.tri(lx + Math.floor(w * 0.19), baseY - Math.floor(h * 0.40), lx + Math.floor(w * 0.23), baseY - Math.floor(h * 0.34), lx + Math.floor(w * 0.15), baseY - Math.floor(h * 0.34), [120, 20, 25]);

  // Ground hit, far right: orange + yellow burst on the sand, clear of
  // the missile and the drone above it.
  const ex = x + Math.floor(w * 0.88);
  const ey = baseY - Math.floor(h * 0.14);
  g.circle(ex, ey, Math.floor(w * 0.09), ORANGE);
  g.circle(ex + Math.floor(w * 0.03), ey - Math.floor(h * 0.05), Math.floor(w * 0.055), YELLOW);
  g.circle(ex - Math.floor(w * 0.04), ey + Math.floor(h * 0.02), Math.floor(w * 0.045), RED);
  // Small light smoke above the ground burst.
  g.circle(ex - Math.floor(w * 0.02), ey - Math.floor(h * 0.22), Math.floor(w * 0.055), LIGHTGREY);

  // Attacking drone: dark cross silhouette with red eye, high over the
  // site's centre-left — the top-right corner is covered by the source
  // chip, so the drone lives where it stays visible.
  const dx = x + Math.floor(w * 0.45);
  const dy = y + Math.floor(h * 0.10);
  g.line(dx - Math.floor(w * 0.06), dy, dx + Math.floor(w * 0.06), dy, BLACK, 3);
  g.line(dx, dy - Math.floor(h * 0.05), dx, dy + Math.floor(h * 0.05), BLACK, 3);
  g.circle(dx, dy, 3, RED);
}

// ---------------------------------------------------------------------------
// 10. (v4) EU summit — circle of gold stars on EU blue, one star dimmed.
// The dimmed star + the dark table line say "no deal" without words.
// (v7: blue lightened so the gold ring pops, stars enlarged, two small
// flags added on white poles — the summit table reads at thumbnail size.)
// ---------------------------------------------------------------------------
export function drawEU(g, x, y, w, h) {
  g.rect(x, y, w, h, [25, 75, 155]);
  // Subtle lighter arc behind the stars.
  g.circle(x + Math.floor(w * 0.50), y + Math.floor(h * 0.52), Math.floor(w * 0.34), [45, 100, 180]);
  // Circle of 12 gold stars; the bottom one is dimmed (grey).
  const cx = x + Math.floor(w * 0.50);
  const cy = y + Math.floor(h * 0.46);
  const rad = Math.floor(w * 0.26);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const sx = cx + Math.round(rad * Math.cos(a));
    const sy = cy + Math.round(rad * Math.sin(a) * 0.9);
    const col = i === 6 ? GREY : YELLOW;
    g.circle(sx, sy, Math.max(4, Math.floor(w * 0.035)), col);
  }
  // Summit table: lighter line across the bottom third + two flags.
  g.rect(x, y + Math.floor(h * 0.82), w, Math.floor(h * 0.04), [60, 115, 195]);
  // Left flag: blue with a gold star dot, on a white pole.
  g.rect(x + Math.floor(w * 0.14), y + Math.floor(h * 0.64), 3, Math.floor(h * 0.18), WHITE);
  g.rect(x + Math.floor(w * 0.14), y + Math.floor(h * 0.64), Math.floor(w * 0.12), Math.floor(h * 0.10), [25, 75, 155]);
  g.circle(x + Math.floor(w * 0.20), y + Math.floor(h * 0.69), 3, YELLOW);
  // Right flag: gold, on a white pole.
  g.rect(x + Math.floor(w * 0.83), y + Math.floor(h * 0.64), 3, Math.floor(h * 0.18), WHITE);
  g.rect(x + Math.floor(w * 0.71), y + Math.floor(h * 0.64), Math.floor(w * 0.12), Math.floor(h * 0.10), YELLOW);
}

// ---------------------------------------------------------------------------
// 11. (v4) Ebola clinic — white building with a big red cross, green tent,
// red dots (the virus) kept small and abstract. Tasteful, no patients.
// ---------------------------------------------------------------------------
export function drawEbola(g, x, y, w, h) {
  // Pale sky, green ground.
  g.rect(x, y, w, Math.floor(h * 0.68), [196, 214, 196]);
  g.rect(x, y + Math.floor(h * 0.68), w, h - Math.floor(h * 0.68), [90, 140, 80]);
  const baseY = y + Math.floor(h * 0.68);

  // Clinic building, left-centre: white block + BIG red cross sign.
  const bx = x + Math.floor(w * 0.10);
  const bw = Math.floor(w * 0.44);
  const bh = Math.floor(h * 0.42);
  g.rect(bx, baseY - bh, bw, bh, WHITE);
  g.rect(bx, baseY - bh - Math.floor(h * 0.05), bw, Math.floor(h * 0.05), RED);
  // Red cross on the wall — larger, the picture's anchor.
  const cx = bx + Math.floor(bw / 2);
  const cy = baseY - Math.floor(bh * 0.55);
  g.rect(cx - 4, cy - Math.floor(h * 0.11), 8, Math.floor(h * 0.22), RED);
  g.rect(cx - Math.floor(w * 0.06), cy - 4, Math.floor(w * 0.12), 8, RED);
  // Door + window.
  g.rect(bx + Math.floor(bw * 0.12), baseY - Math.floor(h * 0.14), Math.floor(w * 0.07), Math.floor(h * 0.14), DARKBLUE);
  g.rect(bx + Math.floor(bw * 0.62), baseY - Math.floor(h * 0.26), Math.floor(w * 0.10), Math.floor(h * 0.10), LIGHTBLUE);

  // Green medical tent, right.
  const tx = x + Math.floor(w * 0.62);
  g.tri(tx, baseY - Math.floor(h * 0.30), tx + Math.floor(w * 0.30), baseY - Math.floor(h * 0.30), tx + Math.floor(w * 0.15), baseY, [52, 110, 70]);
  g.rect(tx + Math.floor(w * 0.11), baseY - Math.floor(h * 0.12), Math.floor(w * 0.08), Math.floor(h * 0.12), DARK);

  // Small red virus dots drifting in the sky (abstract, few).
  const dots = [[0.72, 0.14], [0.86, 0.24], [0.58, 0.10], [0.94, 0.44]];
  for (let i = 0; i < dots.length; i++) {
    g.circle(x + Math.floor(w * dots[i][0]), y + Math.floor(h * dots[i][1]), 3, RED);
  }
}

// ---------------------------------------------------------------------------
// 12. (v4) Giza fuel tanker on fire — road, tanker truck with a long
// cylinder tank, big flames and black smoke. The truck is the whole box.
// (v7: sky brightened, truck enlarged to fill the box, flame bigger,
// smoke light grey — no black plume.)
// ---------------------------------------------------------------------------
export function drawGizaTruck(g, x, y, w, h) {
  // Bright dusty sky.
  g.rect(x, y, w, Math.floor(h * 0.55), [225, 195, 150]);
  g.rect(x, y + Math.floor(h * 0.55), w, h - Math.floor(h * 0.55), [232, 205, 165]);
  // Road band.
  const roadY = y + Math.floor(h * 0.68);
  g.rect(x, roadY, w, h - Math.floor(h * 0.68), [70, 70, 76]);
  g.line(x + Math.floor(w * 0.04), roadY + Math.floor(h * 0.16), x + Math.floor(w * 0.96), roadY + Math.floor(h * 0.16), [220, 200, 90], 3);

  // Flames + light smoke rising from the middle of the tank (drawn first
  // so the tank sits in front of the fire's base).
  const fx = x + Math.floor(w * 0.55);
  g.circle(fx, roadY - Math.floor(h * 0.12), Math.floor(w * 0.07), LIGHTGREY);
  g.circle(fx + Math.floor(w * 0.08), roadY - Math.floor(h * 0.30), Math.floor(w * 0.08), GREY);
  g.circle(fx + Math.floor(w * 0.02), roadY - Math.floor(h * 0.02), Math.floor(w * 0.08), ORANGE);
  g.circle(fx + Math.floor(w * 0.07), roadY - Math.floor(h * 0.06), Math.floor(w * 0.06), YELLOW);
  g.circle(fx - Math.floor(w * 0.05), roadY - Math.floor(h * 0.04), Math.floor(w * 0.05), ORANGE);

  // Tanker truck: long silver cylinder tank + red cab, big and low.
  const tankY = roadY - Math.floor(h * 0.32);
  const tankH = Math.floor(h * 0.28);
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
// (v7: bank widened, columns thicker, arrow thicker and taller, coins
// bigger — the up-arrow is the picture at thumbnail size.)
// ---------------------------------------------------------------------------
export function drawKorea(g, x, y, w, h) {
  // Pale blue sky.
  g.rect(x, y, w, h, [185, 210, 230]);
  // Ground.
  g.rect(x, y + Math.floor(h * 0.86), w, h - Math.floor(h * 0.86), [110, 116, 124]);
  const baseY = y + Math.floor(h * 0.86);

  // Bank building, left two-thirds: body + pediment + columns.
  const bx = x + Math.floor(w * 0.05);
  const bw = Math.floor(w * 0.54);
  g.rect(bx, baseY - Math.floor(h * 0.52), bw, Math.floor(h * 0.52), [215, 213, 205]);
  g.tri(bx, baseY - Math.floor(h * 0.52), bx + bw, baseY - Math.floor(h * 0.52), bx + Math.floor(bw / 2), baseY - Math.floor(h * 0.70), [185, 183, 175]);
  for (let i = 0; i < 4; i++) {
    const cx = bx + Math.floor(bw * (0.14 + i * 0.24));
    g.rect(cx, baseY - Math.floor(h * 0.48), Math.floor(w * 0.045), Math.floor(h * 0.48), [120, 118, 112]);
  }
  // Steps.
  g.rect(bx - Math.floor(w * 0.02), baseY - Math.floor(h * 0.05), bw + Math.floor(w * 0.04), Math.floor(h * 0.05), [150, 148, 142]);

  // BIG red up-arrow, right side — thicker shaft, wider head.
  const ax = x + Math.floor(w * 0.78);
  const ayTop = y + Math.floor(h * 0.12);
  const ayBot = y + Math.floor(h * 0.72);
  g.tri(ax - Math.floor(w * 0.12), ayTop + Math.floor(h * 0.16), ax + Math.floor(w * 0.12), ayTop + Math.floor(h * 0.16), ax, ayTop, RED);
  g.rect(ax - Math.floor(w * 0.045), ayTop + Math.floor(h * 0.16), Math.floor(w * 0.09), ayBot - (ayTop + Math.floor(h * 0.16)), RED);

  // Gold coins at the base of the arrow.
  g.circle(ax - Math.floor(w * 0.07), ayBot + Math.floor(h * 0.06), Math.floor(w * 0.05), YELLOW);
  g.circle(ax + Math.floor(w * 0.06), ayBot + Math.floor(h * 0.05), Math.floor(w * 0.045), [232, 182, 76]);
}

// ---------------------------------------------------------------------------
// 14. (v4) Thanksgiving storm — clouds, rain, lightning over houses.
// (v7: was a near-black box with one lit window. Now mid grey-blue sky,
// lighter clouds, thicker yellow lightning, houses in dark slate (not
// black) with TWO lit windows — stormy but readable.)
// ---------------------------------------------------------------------------
export function drawStorm(g, x, y, w, h) {
  // Storm sky: mid grey-blue, not black.
  g.rect(x, y, w, Math.floor(h * 0.58), [95, 110, 140]);
  // Cloud blobs, a shade darker than the sky.
  const clouds = [[0.18, 0.16, 0.14], [0.42, 0.10, 0.17], [0.68, 0.18, 0.15], [0.88, 0.10, 0.11], [0.30, 0.30, 0.12], [0.58, 0.32, 0.13]];
  for (let i = 0; i < clouds.length; i++) {
    g.circle(x + Math.floor(w * clouds[i][0]), y + Math.floor(h * clouds[i][1]), Math.floor(w * clouds[i][2]), [70, 82, 110]);
  }
  // Rain: diagonal pale lines.
  for (let i = 0; i < 7; i++) {
    const rx = x + Math.floor(w * (0.08 + i * 0.13));
    g.line(rx, y + Math.floor(h * 0.42), rx + Math.floor(w * 0.03), y + Math.floor(h * 0.56), [200, 215, 235], 2);
  }
  // Lightning bolt: THICK yellow zigzag.
  const bx = x + Math.floor(w * 0.62);
  g.line(bx, y + Math.floor(h * 0.28), bx - Math.floor(w * 0.05), y + Math.floor(h * 0.44), YELLOW, 6);
  g.line(bx - Math.floor(w * 0.05), y + Math.floor(h * 0.44), bx + Math.floor(w * 0.03), y + Math.floor(h * 0.44), YELLOW, 6);
  g.line(bx + Math.floor(w * 0.03), y + Math.floor(h * 0.44), bx - Math.floor(w * 0.02), y + Math.floor(h * 0.58), YELLOW, 6);

  // Houses along the bottom, dark slate (not black).
  const baseY = y + h;
  const houses = [[0.02, 0.30], [0.20, 0.38], [0.40, 0.28], [0.60, 0.36], [0.80, 0.30]];
  for (let i = 0; i < houses.length; i++) {
    const hx = x + Math.floor(w * houses[i][0]);
    const hw = Math.floor(w * 0.16);
    const hh = Math.floor(h * houses[i][1]);
    g.rect(hx, baseY - hh, hw, hh, [42, 46, 62]);
    g.tri(hx - 2, baseY - hh, hx + hw + 2, baseY - hh, hx + Math.floor(hw / 2), baseY - hh - Math.floor(h * 0.08), [32, 36, 50]);
  }
  // TWO lit windows (yellow) — the lights in the street.
  g.rect(x + Math.floor(w * 0.25), baseY - Math.floor(h * 0.20), Math.floor(w * 0.05), Math.floor(h * 0.10), YELLOW);
  g.rect(x + Math.floor(w * 0.45), baseY - Math.floor(h * 0.18), Math.floor(w * 0.05), Math.floor(h * 0.09), YELLOW);
  // Leaning tree, right.
  g.line(x + Math.floor(w * 0.92), baseY, x + Math.floor(w * 0.86), baseY - Math.floor(h * 0.30), DARK, 4);
  g.circle(x + Math.floor(w * 0.85), baseY - Math.floor(h * 0.34), Math.floor(w * 0.05), [40, 75, 50]);
}

// ---------------------------------------------------------------------------
// 15. (v4) Bangkok refinery blast — low factory blocks + chimney, one huge
// orange explosion cloud and black smoke. Different composition from the
// lead refinery: horizontal plant, explosion dead centre.
// (v7: sky brightened, explosion enlarged to dominate the box, chimney
// red-banded, smoke light grey — no black plume.)
// ---------------------------------------------------------------------------
export function drawBangkok(g, x, y, w, h) {
  // Bright hazy sky.
  g.rect(x, y, w, h, [220, 210, 185]);
  const baseY = y + Math.floor(h * 0.84);
  g.rect(x, baseY, w, h - Math.floor(h * 0.84), [95, 90, 82]);

  // Factory blocks along the bottom, lighter steel.
  g.rect(x + Math.floor(w * 0.04), baseY - Math.floor(h * 0.22), Math.floor(w * 0.22), Math.floor(h * 0.22), STEELLIGHT);
  g.rect(x + Math.floor(w * 0.72), baseY - Math.floor(h * 0.18), Math.floor(w * 0.24), Math.floor(h * 0.18), LIGHTGREY);
  // Chimney, right, with a red band.
  g.rect(x + Math.floor(w * 0.78), baseY - Math.floor(h * 0.52), Math.floor(w * 0.05), Math.floor(h * 0.52), DARK);
  g.rect(x + Math.floor(w * 0.76), baseY - Math.floor(h * 0.56), Math.floor(w * 0.09), Math.floor(h * 0.04), DARK);
  g.rect(x + Math.floor(w * 0.78), baseY - Math.floor(h * 0.52), Math.floor(w * 0.05), Math.floor(h * 0.06), RED);

  // HUGE explosion cloud, centre: orange mass + yellow core + red rim.
  const ex = x + Math.floor(w * 0.48);
  const ey = baseY - Math.floor(h * 0.44);
  g.circle(ex - Math.floor(w * 0.12), ey + Math.floor(h * 0.06), Math.floor(w * 0.11), ORANGE);
  g.circle(ex + Math.floor(w * 0.12), ey + Math.floor(h * 0.06), Math.floor(w * 0.11), ORANGE);
  g.circle(ex, ey - Math.floor(h * 0.08), Math.floor(w * 0.13), ORANGE);
  g.circle(ex, ey, Math.floor(w * 0.08), YELLOW);
  g.circle(ex - Math.floor(w * 0.05), ey + Math.floor(h * 0.12), Math.floor(w * 0.06), RED);
  g.circle(ex + Math.floor(w * 0.06), ey + Math.floor(h * 0.12), Math.floor(w * 0.05), RED);
  // Light-grey smoke above.
  g.circle(ex - Math.floor(w * 0.07), ey - Math.floor(h * 0.26), Math.floor(w * 0.07), LIGHTGREY);
  g.circle(ex + Math.floor(w * 0.08), ey - Math.floor(h * 0.32), Math.floor(w * 0.08), GREY);
  g.circle(ex + Math.floor(w * 0.16), ey - Math.floor(h * 0.20), Math.floor(w * 0.05), LIGHTGREY);
}
