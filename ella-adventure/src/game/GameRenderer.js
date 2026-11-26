import { drawCharacter, drawStarShape, roundRect } from '../customization/CharacterRenderer.js';
import { drawCreature, drawGiraffe } from '../creatures/CreatureRenderer.js';

export class GameRenderer {
  constructor(canvas, engine, saveManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.engine = engine;
    this.saveManager = saveManager;
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = parent.clientWidth || 800;
    const h = parent.clientHeight || 500;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.viewW = w;
    this.viewH = h;
  }

  render() {
    const level = this.engine.level;
    if (!level) return;
    if (!this.viewW || !this.viewH) this.resize();

    const ctx = this.ctx;
    const w = this.viewW;
    const h = this.viewH;
    const world = level.world;
    const time = this.engine.time;
    const groundY = Math.round(h * 0.78);
    const camX = this.engine.player.x - Math.min(w * 0.28, 220);

    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0, world.skyTop);
    skyGrad.addColorStop(1, world.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Sun or Glowing Moon/Crystal Orb
    ctx.fillStyle = world.id === 'crystal' ? 'rgba(224, 247, 250, 0.85)' : '#fff59d';
    ctx.beginPath();
    ctx.arc(w * 0.84, h * 0.18, 42, 0, Math.PI * 2);
    ctx.fill();

    // 2. Parallax Clouds & Hills
    this.drawClouds(ctx, w, groundY, camX, time, world);
    this.drawHills(ctx, w, groundY, camX * 0.25, world.hillFar, 95, 280);
    this.drawHills(ctx, w, groundY, camX * 0.5, world.hillNear, 55, 210);

    // 3. Ground
    ctx.fillStyle = world.groundBottom;
    ctx.fillRect(0, groundY, w, h - groundY);
    ctx.fillStyle = world.groundTop;
    ctx.fillRect(0, groundY, w, 20);

    // Scrolling ground sparkles/flowers
    ctx.fillStyle = world.accentColor;
    const tileStep = 140;
    const startTile = Math.floor(camX / tileStep) * tileStep;
    for (let tx = startTile; tx < camX + w + tileStep; tx += tileStep) {
      const sx = tx - camX;
      ctx.beginPath();
      ctx.arc(sx + 20, groundY + 10, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. World Objects (screen-space relative to camX)
    // Platforms
    for (const plat of level.platforms) {
      const sx = plat.x - camX;
      if (sx + plat.width < -50 || sx > w + 50) continue;
      const py = groundY - plat.yOffset;
      ctx.fillStyle = world.id === 'sky' ? '#ffffff' : world.groundTop;
      roundRect(ctx, sx, py, plat.width, 18, 9);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Boost Pads
    for (const b of level.boosts) {
      const sx = b.x - camX;
      if (sx < -60 || sx > w + 60) continue;
      ctx.fillStyle = '#00e5ff';
      roundRect(ctx, sx - 26, groundY - 10, 52, 12, 6);
      ctx.fill();
      ctx.fillStyle = '#ffd54f';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('⚡⚡', sx - 16, groundY - 14);
    }

    // Checkpoints
    for (const cp of level.checkpoints) {
      const sx = cp.x - camX;
      if (sx < -60 || sx > w + 60) continue;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sx - 3, groundY - 82, 6, 82);
      ctx.fillStyle = cp.reached ? '#ffd54f' : '#ff80ab';
      ctx.beginPath();
      ctx.moveTo(sx + 3, groundY - 80);
      ctx.lineTo(sx + 44, groundY - 64);
      ctx.lineTo(sx + 3, groundY - 48);
      ctx.closePath();
      ctx.fill();
    }

    // Giraffes (World 2!)
    for (const g of level.giraffes) {
      const sx = g.x - camX;
      if (sx < -160 || sx > w + 160) continue;
      drawGiraffe(ctx, g, sx, groundY, time);
    }

    // Obstacles
    for (const obs of level.obstacles) {
      const sx = obs.x - camX;
      if (sx < -80 || sx > w + 80) continue;
      if (obs.type === 'bush') {
        ctx.fillStyle = world.id === 'crystal' ? '#ab47bc' : '#43a047';
        ctx.beginPath();
        ctx.arc(sx, groundY - 18, 22, 0, Math.PI * 2);
        ctx.arc(sx - 14, groundY - 10, 14, 0, Math.PI * 2);
        ctx.arc(sx + 14, groundY - 10, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = world.accentColor;
        ctx.beginPath();
        ctx.arc(sx - 5, groundY - 22, 4, 0, Math.PI * 2);
        ctx.arc(sx + 8, groundY - 14, 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Hanging Flower/Ribbon Banner to slide under
        const by = groundY - obs.yOffset;
        ctx.fillStyle = '#8d6e63';
        ctx.fillRect(sx - 28, by - 45, 5, 45);
        ctx.fillRect(sx + 23, by - 45, 5, 45);
        ctx.fillStyle = world.accentColor;
        roundRect(ctx, sx - 28, by - 40, 56, 26, 8);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('⬇', sx - 7, by - 22);
      }
    }

    // Collectibles
    for (const c of level.collectibles) {
      if (c.collected) continue;
      const sx = c.x - camX;
      if (sx < -40 || sx > w + 40) continue;
      const cy = groundY - c.yOffset + Math.sin(time * 5 + c.x * 0.02) * 5;
      if (c.type === 'star') {
        ctx.fillStyle = '#ffd54f';
        drawStarShape(ctx, sx, cy, 5, 14, 6.5);
        ctx.fillStyle = '#fff9c4';
        drawStarShape(ctx, sx, cy, 5, 7, 3.5);
      } else if (c.type === 'gem') {
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.moveTo(sx, cy - 14);
        ctx.lineTo(sx + 12, cy);
        ctx.lineTo(sx, cy + 14);
        ctx.lineTo(sx - 12, cy);
        ctx.closePath();
        ctx.fill();
      } else {
        // Special flower
        ctx.fillStyle = '#ff80ab';
        for (let a = 0; a < 5; a += 1) {
          const ang = (a * Math.PI * 2) / 5 + time;
          ctx.beginPath();
          ctx.arc(sx + Math.cos(ang) * 8, cy + Math.sin(ang) * 8, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#ffd54f';
        ctx.beginPath();
        ctx.arc(sx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Original Creatures!
    for (const spawn of level.creatureSpawns) {
      const sx = spawn.x - camX;
      if (sx < -60 || sx > w + 60) continue;
      drawCreature(ctx, spawn.creature, sx, groundY - spawn.yOffset, 1.0, time, true);
    }

    // Rainbow Finish Arch
    const finX = level.length - camX;
    if (finX > -100 && finX < w + 150) {
      const colors = ['#ff5252', '#ffca28', '#66bb6a', '#29b6f6', '#ab47bc'];
      colors.forEach((col, i) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(finX, groundY, 95 - i * 8, Math.PI, 0);
        ctx.stroke();
      });
    }

    // 5. Player Character
    const px = this.engine.player.x - camX;
    const py = groundY - this.engine.player.y - 32;
    const pose = this.engine.finished
      ? 'celebrate'
      : this.engine.activeGiraffe
      ? 'idle'
      : this.engine.player.slideTimer > 0
      ? 'slide'
      : !this.engine.player.onGround
      ? 'jump'
      : 'run';

    // Speed lines when boosting!
    if (this.engine.player.boostTimer > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i += 1) {
        const ly = py - 50 + i * 22;
        ctx.beginPath();
        ctx.moveTo(px - 35 - i * 10, ly);
        ctx.lineTo(px - 95 - i * 10, ly);
        ctx.stroke();
      }
    }

    ctx.save();
    if (this.engine.player.invulnTimer > 0 && Math.floor(time * 16) % 2 === 0) {
      ctx.globalAlpha = 0.6;
    }
    drawCharacter(ctx, this.saveManager.state.character, {
      x: px,
      y: py,
      scale: 0.95,
      pose,
      time,
      facing: 1,
    });
    ctx.restore();

    // 6. Sparkle Particles
    for (const p of this.engine.particles) {
      const sx = p.x - camX;
      const sy = groundY - p.y;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life * 1.4);
      ctx.beginPath();
      ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  drawClouds(ctx, w, groundY, camX, time, world) {
    ctx.fillStyle = world.id === 'crystal' ? 'rgba(179, 157, 219, 0.25)' : 'rgba(255, 255, 255, 0.85)';
    for (let i = 0; i < 6; i += 1) {
      const cx = ((i * 260 - camX * 0.12 + time * 10) % (w + 200) + (w + 200)) % (w + 200) - 100;
      const cy = 55 + (i % 3) * 45;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.arc(cx + 22, cy - 6, 28, 0, Math.PI * 2);
      ctx.arc(cx + 46, cy, 22, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawHills(ctx, w, groundY, offset, color, height, period) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    for (let x = 0; x <= w + 20; x += 20) {
      const y = groundY - Math.abs(Math.sin((x + offset) / period)) * height - 15;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, groundY);
    ctx.closePath();
    ctx.fill();
  }
}
