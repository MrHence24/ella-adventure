import { findCatalogItem } from './catalog.js';

export function drawCharacter(ctx, character, options = {}) {
  const {
    x = 0,
    y = 0,
    scale = 1,
    pose = 'idle', // 'idle' | 'run' | 'jump' | 'slide' | 'celebrate'
    time = 0,
    facing = 1,
  } = options;

  const dress = findCatalogItem('dress', character.dress);
  const top = findCatalogItem('top', character.top);
  const bottom = findCatalogItem('bottom', character.bottom);
  const shoes = findCatalogItem('shoes', character.shoes);
  const hat = findCatalogItem('hat', character.hat);
  const accessory = findCatalogItem('accessory', character.accessory);

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * scale, scale);

  const isRunning = pose === 'run';
  const isJumping = pose === 'jump';
  const isSliding = pose === 'slide';
  const isCelebrate = pose === 'celebrate';

  const bob = isRunning
    ? Math.abs(Math.sin(time * 12)) * -7
    : isCelebrate
    ? Math.abs(Math.sin(time * 8)) * -10
    : Math.sin(time * 3.2) * 3;

  const legSwing = isRunning ? Math.sin(time * 12) * 0.65 : isJumping ? 0.4 : 0;
  const armSwing = isRunning ? Math.cos(time * 12) * 0.65 : isCelebrate ? -2.2 + Math.sin(time * 10) * 0.3 : Math.sin(time * 3.2) * 0.08;

  if (isSliding) {
    ctx.translate(0, 26);
    ctx.rotate(-0.35);
  } else {
    ctx.translate(0, bob);
  }

  // --- BACK ACCESSORIES (Cape, Wings, Backpack) ---
  if (accessory && accessory.id === 'acc_hero_cape') {
    const wave = Math.sin(time * (isRunning ? 14 : 4)) * 6;
    ctx.fillStyle = accessory.primary;
    ctx.beginPath();
    ctx.moveTo(-10, -45);
    ctx.quadraticCurveTo(-48, -20 + wave, -44, 24 + wave);
    ctx.lineTo(-10, 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = accessory.secondary;
    ctx.lineWidth = 3;
    ctx.stroke();
  } else if (accessory && accessory.id === 'acc_butterfly_wings') {
    const flap = Math.sin(time * (isRunning ? 14 : 5)) * 0.15;
    ctx.save();
    ctx.translate(-14, -30);
    ctx.rotate(flap);
    ctx.fillStyle = accessory.primary;
    ctx.beginPath();
    ctx.ellipse(-18, -14, 22, 15, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accessory.secondary;
    ctx.beginPath();
    ctx.ellipse(-14, 8, 16, 11, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  } else if (accessory && accessory.id === 'acc_star_pack') {
    ctx.fillStyle = accessory.secondary;
    roundRect(ctx, -28, -42, 18, 28, 7);
    ctx.fill();
    ctx.fillStyle = accessory.primary;
    drawStarShape(ctx, -19, -28, 5, 6, 3);
  }

  // --- BACK HAIR ---
  drawBackHair(ctx, character.hairStyle, character.hairColor, time, isRunning);

  // --- BACK LEG & SHOE ---
  drawLegAndShoe(ctx, -6, 8, -legSwing, shoes, character.bodyColor, character.outfitMode === 'separates' ? bottom : null);

  // --- BACK ARM ---
  drawArm(ctx, -10, -40, -armSwing, character.bodyColor, character.outfitMode === 'dress' ? dress : top);

  // --- TORSO / OUTFIT ---
  if (character.outfitMode === 'dress' && dress) {
    drawDressBody(ctx, dress, character.bodyColor);
  } else {
    drawSeparatesBody(ctx, top, bottom, character.bodyColor);
  }

  // --- FRONT LEG & SHOE ---
  drawLegAndShoe(ctx, 6, 8, legSwing, shoes, character.bodyColor, character.outfitMode === 'separates' ? bottom : null);

  // --- RAINBOW SCARF ---
  if (accessory && accessory.id === 'acc_rainbow_scarf') {
    ctx.fillStyle = '#ff80ab';
    roundRect(ctx, -15, -48, 30, 9, 4);
    ctx.fill();
    ctx.fillStyle = '#4fc3f7';
    roundRect(ctx, -24, -44, 14, 8, 4);
    ctx.fill();
  }

  // --- HEAD ---
  ctx.save();
  ctx.translate(0, -68);

  // Cute round head
  ctx.fillStyle = character.bodyColor;
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.stroke();

  // Rosy cheeks
  ctx.fillStyle = 'rgba(255, 118, 168, 0.45)';
  ctx.beginPath();
  ctx.ellipse(12, 6, 5, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(-6, 6, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Expressive Eyes (blink occasionally)
  const isBlinking = Math.sin(time * 1.9) > 0.96;
  if (isBlinking) {
    ctx.strokeStyle = '#1a237e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(4, -2);
    ctx.lineTo(12, -2);
    ctx.stroke();
  } else {
    // Eye white
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(9, -3, 6, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Iris
    ctx.fillStyle = '#1565c0';
    ctx.beginPath();
    ctx.ellipse(10.5, -2.5, 3.8, 5.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Sparkle highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(11.8, -5, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cheerful smile
  ctx.strokeStyle = '#4a148c';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(8, 5, 5.5, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Heart Shades accessory
  if (accessory && accessory.id === 'acc_heart_shades') {
    ctx.fillStyle = accessory.primary;
    roundRect(ctx, 0, -10, 18, 11, 4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(3, -8, 6, 3);
  }

  // --- FRONT HAIR ---
  drawFrontHair(ctx, character.hairStyle, character.hairColor, time, isRunning);

  // --- HAT / HEADBAND ---
  if (hat && hat.id !== 'hat_none') {
    drawHat(ctx, hat);
  }

  ctx.restore(); // end head

  // --- FRONT ARM ---
  drawArm(ctx, 8, -40, armSwing, character.bodyColor, character.outfitMode === 'dress' ? dress : top);

  ctx.restore();
}

function drawLegAndShoe(ctx, ox, oy, angle, shoes, bodyColor, bottom) {
  ctx.save();
  ctx.translate(ox, oy);
  ctx.rotate(angle);

  // Leg
  const legColor = bottom && bottom.style === 'pants' ? bottom.primary : bodyColor;
  ctx.fillStyle = legColor;
  roundRect(ctx, -5, 0, 10, 22, 5);
  ctx.fill();

  // Shoe
  const shoeMain = shoes ? shoes.primary : '#1e88e5';
  const shoeTrim = shoes ? shoes.secondary : '#ffffff';
  const shoeAccent = shoes ? shoes.accent : '#ffd54f';

  ctx.fillStyle = shoeMain;
  roundRect(ctx, -6, 17, 19, 11, 5);
  ctx.fill();

  ctx.fillStyle = shoeTrim;
  roundRect(ctx, -5, 24, 17, 4, 2);
  ctx.fill();

  ctx.fillStyle = shoeAccent;
  ctx.beginPath();
  ctx.arc(7, 21, 2.5, 0, Math.PI * 2);
  ctx.fill();

  if (shoes && shoes.id === 'shoes_cloud_wings') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-7, 20, 6, 3.5, -0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawArm(ctx, ox, oy, angle, bodyColor, garment) {
  ctx.save();
  ctx.translate(ox, oy);
  ctx.rotate(angle);

  ctx.fillStyle = garment ? garment.primary : bodyColor;
  roundRect(ctx, -4.5, 0, 9, 14, 4.5);
  ctx.fill();

  ctx.fillStyle = bodyColor;
  roundRect(ctx, -4, 11, 8, 12, 4);
  ctx.fill();

  // Cute gloved/bright hand
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 23, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawDressBody(ctx, dress, bodyColor) {
  // Torso
  ctx.fillStyle = dress.primary;
  roundRect(ctx, -14, -46, 28, 34, 9);
  ctx.fill();

  // Skirt / Gown flare
  ctx.fillStyle = dress.primary;
  ctx.beginPath();
  ctx.moveTo(-13, -18);
  const flare = dress.style === 'gown' ? 28 : dress.style === 'tutu' ? 25 : 20;
  ctx.lineTo(-flare, 12);
  ctx.quadraticCurveTo(0, 18, flare, 12);
  ctx.lineTo(13, -18);
  ctx.closePath();
  ctx.fill();

  // Waistband / Trim
  ctx.fillStyle = dress.secondary;
  roundRect(ctx, -14, -22, 28, 6, 3);
  ctx.fill();

  // Special details
  if (dress.style === 'hero') {
    ctx.fillStyle = dress.accent;
    drawStarShape(ctx, 2, -33, 5, 7, 3.2);
  } else if (dress.style === 'giraffe') {
    ctx.fillStyle = dress.secondary;
    ctx.beginPath();
    ctx.arc(-5, -34, 4, 0, Math.PI * 2);
    ctx.arc(6, -26, 3.5, 0, Math.PI * 2);
    ctx.arc(-7, -4, 4.5, 0, Math.PI * 2);
    ctx.arc(7, 2, 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = dress.accent;
    ctx.beginPath();
    ctx.arc(0, -33, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSeparatesBody(ctx, top, bottom, bodyColor) {
  const topColor = top ? top.primary : '#1e88e5';
  const topAccent = top ? top.secondary : '#90caf9';
  const botColor = bottom ? bottom.primary : '#1565c0';

  // Top
  ctx.fillStyle = topColor;
  roundRect(ctx, -14, -46, 28, 28, 8);
  ctx.fill();

  ctx.fillStyle = topAccent;
  ctx.beginPath();
  ctx.arc(1, -33, 5, 0, Math.PI * 2);
  ctx.fill();

  // Bottom
  ctx.fillStyle = botColor;
  if (bottom && bottom.style === 'skirt') {
    ctx.beginPath();
    ctx.moveTo(-13, -20);
    ctx.lineTo(-22, 8);
    ctx.quadraticCurveTo(0, 14, 22, 8);
    ctx.lineTo(13, -20);
    ctx.closePath();
    ctx.fill();
  } else {
    roundRect(ctx, -14, -20, 28, 26, 6);
    ctx.fill();
  }
}

function drawBackHair(ctx, style, color, time, isRunning) {
  const sway = Math.sin(time * (isRunning ? 12 : 3)) * 5;
  ctx.fillStyle = color;

  if (style === 'twintails') {
    ctx.beginPath();
    ctx.ellipse(-24, -56 + sway * 0.5, 10, 22, 0.35, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'waves') {
    ctx.beginPath();
    ctx.ellipse(-10, -48 + sway * 0.4, 20, 28, 0.15, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'ponytail') {
    ctx.beginPath();
    ctx.ellipse(-26, -64 + sway * 0.7, 16, 9, -0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'puffs') {
    ctx.beginPath();
    ctx.arc(-22, -78, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFrontHair(ctx, style, color, time, isRunning) {
  ctx.fillStyle = color;
  // Top hair cap + swooping bangs
  ctx.beginPath();
  ctx.arc(0, -4, 25, Math.PI * 0.95, Math.PI * 2.08);
  ctx.quadraticCurveTo(10, -14, -4, -10);
  ctx.quadraticCurveTo(-16, -6, -24, 4);
  ctx.closePath();
  ctx.fill();

  if (style === 'puffs') {
    ctx.beginPath();
    ctx.arc(14, -20, 11, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'braid') {
    ctx.beginPath();
    ctx.ellipse(-18, 6, 6, 14, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHat(ctx, hat) {
  if (hat.id === 'hat_blue_bow' || hat.id === 'hat_pink_hearts') {
    ctx.fillStyle = hat.primary;
    ctx.beginPath();
    ctx.ellipse(-10, -24, 10, 6, -0.3, 0, Math.PI * 2);
    ctx.ellipse(6, -24, 10, 6, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hat.secondary;
    ctx.beginPath();
    ctx.arc(-2, -24, 4.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (hat.id === 'hat_tiara') {
    ctx.fillStyle = hat.primary;
    ctx.beginPath();
    ctx.moveTo(-14, -20);
    ctx.lineTo(-10, -34);
    ctx.lineTo(-3, -25);
    ctx.lineTo(2, -37);
    ctx.lineTo(8, -25);
    ctx.lineTo(14, -33);
    ctx.lineTo(15, -20);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = hat.secondary;
    ctx.beginPath();
    ctx.arc(2, -27, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (hat.id === 'hat_safari') {
    ctx.fillStyle = hat.primary;
    ctx.beginPath();
    ctx.ellipse(0, -19, 28, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    roundRect(ctx, -15, -33, 30, 15, 7);
    ctx.fill();
    ctx.fillStyle = hat.secondary;
    ctx.fillRect(-15, -24, 30, 4);
  } else if (hat.id === 'hat_giraffe_ears') {
    ctx.fillStyle = hat.primary;
    // Ossicones (giraffe horns!)
    roundRect(ctx, -10, -38, 5, 16, 2);
    roundRect(ctx, 5, -38, 5, 16, 2);
    ctx.fill();
    ctx.fillStyle = hat.secondary;
    ctx.beginPath();
    ctx.arc(-7.5, -39, 4, 0, Math.PI * 2);
    ctx.arc(7.5, -39, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawStarShape(ctx, cx, cy, spikes, outerR, innerR) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i += 1) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.closePath();
  ctx.fill();
}
