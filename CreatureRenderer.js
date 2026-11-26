import { drawStarShape, roundRect } from '../customization/CharacterRenderer.js';

export function drawCreature(ctx, creature, x, y, scale = 1, time = 0, discovered = true) {
  ctx.save();
  ctx.translate(x, y + Math.sin(time * 4 + x * 0.01) * 4);
  ctx.scale(scale, scale);

  if (!discovered) {
    ctx.globalAlpha = 0.25;
  }

  const p = creature.primary;
  const s = creature.secondary;
  const a = creature.accent;

  // Soft shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.ellipse(0, 22, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  switch (creature.type) {
    case 'bunny': {
      // Long floppy ears
      ctx.fillStyle = p;
      ctx.beginPath();
      ctx.ellipse(-9, -24, 6, 16, -0.2, 0, Math.PI * 2);
      ctx.ellipse(9, -24, 6, 16, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = a;
      ctx.beginPath();
      ctx.ellipse(-9, -24, 3, 10, -0.2, 0, Math.PI * 2);
      ctx.ellipse(9, -24, 3, 10, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Round fluffy body
      ctx.fillStyle = p;
      ctx.beginPath();
      ctx.arc(0, 2, 19, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = s;
      ctx.beginPath();
      ctx.ellipse(0, 8, 11, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'giraffe_calf': {
      // Cute baby giraffe
      ctx.fillStyle = p;
      roundRect(ctx, -12, 0, 24, 18, 8);
      ctx.fill();
      // Long neck
      roundRect(ctx, -5, -24, 10, 28, 5);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.arc(2, -25, 11, 0, Math.PI * 2);
      ctx.fill();
      // Ossicones
      ctx.fillStyle = s;
      ctx.fillRect(-3, -40, 3, 8);
      ctx.fillRect(4, -40, 3, 8);
      ctx.beginPath();
      ctx.arc(-1.5, -40, 3, 0, Math.PI * 2);
      ctx.arc(5.5, -40, 3, 0, Math.PI * 2);
      ctx.fill();
      // Spots
      ctx.beginPath();
      ctx.arc(-4, 7, 3.5, 0, Math.PI * 2);
      ctx.arc(5, 10, 3, 0, Math.PI * 2);
      ctx.arc(0, -10, 2.5, 0, Math.PI * 2);
      ctx.fill();
      drawCuteEyes(ctx, 2, -25, 3.5);
      ctx.restore();
      return;
    }
    case 'fox':
    case 'gazelle': {
      // Fluffy tail
      ctx.fillStyle = a;
      ctx.beginPath();
      ctx.ellipse(-19, 4, 10, 6, -0.4, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.fillStyle = p;
      ctx.beginPath();
      ctx.arc(0, 2, 18, 0, Math.PI * 2);
      ctx.fill();
      // Pointed ears
      ctx.beginPath();
      ctx.moveTo(-14, -10);
      ctx.lineTo(-10, -26);
      ctx.lineTo(-2, -14);
      ctx.moveTo(14, -10);
      ctx.lineTo(10, -26);
      ctx.lineTo(2, -14);
      ctx.fill();
      ctx.fillStyle = s;
      ctx.beginPath();
      ctx.ellipse(0, 8, 12, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'bird':
    case 'owl':
    case 'bat': {
      const flap = Math.sin(time * 10) * 8;
      // Wings
      ctx.fillStyle = s;
      ctx.beginPath();
      ctx.ellipse(-18, -2 + flap * 0.4, 12, 7, -0.3, 0, Math.PI * 2);
      ctx.ellipse(18, -2 + flap * 0.4, 12, 7, 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.fillStyle = p;
      ctx.beginPath();
      ctx.arc(0, 0, 17, 0, Math.PI * 2);
      ctx.fill();
      // Cute beak or crest
      ctx.fillStyle = a;
      ctx.beginPath();
      ctx.moveTo(-4, 3);
      ctx.lineTo(4, 3);
      ctx.lineTo(0, 9);
      ctx.closePath();
      ctx.fill();
      if (creature.type === 'owl') {
        drawStarShape(ctx, 0, -20, 5, 6, 3);
      }
      break;
    }
    case 'cloud': {
      ctx.fillStyle = p;
      ctx.beginPath();
      ctx.arc(-12, 4, 12, 0, Math.PI * 2);
      ctx.arc(12, 4, 12, 0, Math.PI * 2);
      ctx.arc(0, -5, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = a;
      ctx.beginPath();
      ctx.arc(-10, 6, 3, 0, Math.PI * 2);
      ctx.arc(10, 6, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    default: {
      // Sprite / Slime
      ctx.fillStyle = p;
      ctx.beginPath();
      ctx.arc(0, 3, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = a;
      ctx.beginPath();
      ctx.arc(-12, -14, 7, 0, Math.PI * 2);
      ctx.arc(12, -14, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = s;
      ctx.beginPath();
      ctx.arc(-5, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  drawCuteEyes(ctx, 0, 0, 5);
  ctx.restore();
}

function drawCuteEyes(ctx, ox, oy, spread) {
  ctx.fillStyle = '#1a237e';
  ctx.beginPath();
  ctx.arc(ox - spread, oy - 2, 2.8, 0, Math.PI * 2);
  ctx.arc(ox + spread, oy - 2, 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ox - spread + 1, oy - 3, 1.1, 0, Math.PI * 2);
  ctx.arc(ox + spread + 1, oy - 3, 1.1, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#1a237e';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(ox, oy + 2, 3.5, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
}

export function drawGiraffe(ctx, giraffe, x, groundY, time) {
  ctx.save();
  ctx.translate(x, groundY);

  // Acacia tree behind giraffe
  ctx.fillStyle = '#795548';
  roundRect(ctx, 48, -195, 18, 195, 6);
  ctx.fill();
  ctx.fillStyle = '#558b2f';
  ctx.beginPath();
  ctx.ellipse(57, -205, 64, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7cb342';
  ctx.beginPath();
  ctx.ellipse(45, -215, 42, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Giraffe legs
  ctx.fillStyle = '#ffca28';
  roundRect(ctx, -26, -68, 11, 68, 5);
  roundRect(ctx, -8, -68, 11, 68, 5);
  roundRect(ctx, 14, -68, 11, 68, 5);
  roundRect(ctx, 30, -68, 11, 68, 5);
  ctx.fill();

  // Hooves
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(-26, -7, 11, 7);
  ctx.fillRect(-8, -7, 11, 7);
  ctx.fillRect(14, -7, 11, 7);
  ctx.fillRect(30, -7, 11, 7);

  // Body
  ctx.fillStyle = '#ffca28';
  ctx.beginPath();
  ctx.ellipse(8, -78, 38, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body spots
  ctx.fillStyle = '#8d6e63';
  [[-10, -82, 7], [6, -74, 8], [22, -84, 6], [16, -69, 5]].forEach(([sx, sy, r]) => {
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Long Neck! (Bends down cheerfully when eating!)
  const eatProgress = giraffe.eatingTimer > 0 ? Math.sin(giraffe.eatingTimer * 10) * 0.15 + 0.55 : 0;
  const neckAngle = -0.15 - eatProgress * 0.72;

  ctx.save();
  ctx.translate(-18, -88);
  ctx.rotate(neckAngle);

  ctx.fillStyle = '#ffca28';
  roundRect(ctx, -9, -115, 18, 120, 9);
  ctx.fill();

  // Neck spots
  ctx.fillStyle = '#8d6e63';
  [[-2, -25, 5], [3, -55, 5.5], [-2, -85, 4.5]].forEach(([sx, sy, r]) => {
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Giraffe Head (facing left toward Ella!)
  ctx.translate(0, -115);
  ctx.rotate(-neckAngle * 0.5);

  ctx.fillStyle = '#ffca28';
  ctx.beginPath();
  ctx.ellipse(-10, 0, 20, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Snout
  ctx.fillStyle = '#ffe082';
  ctx.beginPath();
  ctx.ellipse(-24, 3, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ossicones (horns)
  ctx.fillStyle = '#8d6e63';
  roundRect(ctx, -2, -22, 4, 14, 2);
  roundRect(ctx, 6, -21, 4, 14, 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -23, 4, 0, Math.PI * 2);
  ctx.arc(8, -22, 4, 0, Math.PI * 2);
  ctx.fill();

  // Expressive Eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-10, -3, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3e2723';
  ctx.beginPath();
  ctx.arc(-11, -3, 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-12, -4, 1, 0, Math.PI * 2);
  ctx.fill();

  // Happy chewing smile
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (giraffe.eatingTimer > 0) {
    ctx.arc(-22, 5, 4, 0, Math.PI);
  } else {
    ctx.arc(-20, 5, 4, 0.1 * Math.PI, 0.85 * Math.PI);
  }
  ctx.stroke();

  ctx.restore();

  // Floating Hearts when fed!
  if (giraffe.fed && giraffe.eatingTimer > 0) {
    ctx.fillStyle = '#ff4081';
    ctx.font = '24px sans-serif';
    ctx.fillText('💖', -48, -170 - (1 - giraffe.eatingTimer) * 40);
    ctx.fillText('🌿', -55, -135);
  }

  ctx.restore();
}
