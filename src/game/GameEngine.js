import { generateLevel } from './LevelGenerator.js';
import { getWorldById } from '../worlds/worldsData.js';
import { findCatalogItem } from '../customization/catalog.js';

const SPEED_MULTIPLIERS = {
  cozy: 0.8,
  fast: 1.0,
  super: 1.25,
};

export class GameEngine {
  constructor({ saveManager, soundEngine, onHudUpdate, onDiscovery, onGiraffePrompt, onComplete }) {
    this.saveManager = saveManager;
    this.soundEngine = soundEngine;
    this.onHudUpdate = onHudUpdate;
    this.onDiscovery = onDiscovery;
    this.onGiraffePrompt = onGiraffePrompt;
    this.onComplete = onComplete;

    this.running = false;
    this.paused = false;
    this.level = null;
    this.time = 0;

    this.player = {
      x: 120,
      y: 0, // height above ground (0 = on ground, >0 = in air)
      vy: 0,
      jumpsLeft: 2,
      slideTimer: 0,
      invulnTimer: 0,
      boostTimer: 0,
      coyoteTimer: 0,
      onGround: true,
    };

    this.stars = 0;
    this.gems = 0;
    this.particles = [];
    this.activeGiraffe = null;
    this.giraffeWaitResumeTimer = 0;
    this.finished = false;
  }

  startWorld(worldId) {
    const world = getWorldById(worldId);
    this.level = generateLevel(world);
    this.saveManager.setCurrentWorld(world.id);
    this.time = 0;
    this.stars = 0;
    this.gems = 0;
    this.particles = [];
    this.activeGiraffe = null;
    this.giraffeWaitResumeTimer = 0;
    this.finished = false;
    this.paused = false;
    this.running = true;

    this.player = {
      x: 120,
      y: 0,
      vy: 0,
      jumpsLeft: 2,
      slideTimer: 0,
      invulnTimer: 0,
      boostTimer: 0,
      coyoteTimer: 0,
      onGround: true,
    };

    this.onGiraffePrompt?.(false);
    this.emitHud();
    this.soundEngine.startMusic(world.musicKey);
  }

  stop() {
    this.running = false;
    this.soundEngine.stopMusic();
    this.onGiraffePrompt?.(false);
  }

  setPaused(paused) {
    this.paused = paused;
  }

  jump() {
    if (!this.running || this.paused || this.finished) return;
    if (this.activeGiraffe && !this.activeGiraffe.fed) {
      // Allow Space/Jump to also feed giraffe for super easy kids UX!
      this.feedActiveGiraffe();
      return;
    }
    if (this.player.onGround || this.player.coyoteTimer > 0) {
      this.player.vy = 660;
      this.player.onGround = false;
      this.player.coyoteTimer = 0;
      this.player.jumpsLeft = 1;
      this.player.slideTimer = 0;
      this.soundEngine.playJump(false);
      this.spawnParticles(this.player.x, this.player.y, '#ffffff', 6);
    } else if (this.player.jumpsLeft > 0) {
      this.player.vy = 590;
      this.player.jumpsLeft = 0;
      this.player.slideTimer = 0;
      this.soundEngine.playJump(true);
      this.spawnParticles(this.player.x, this.player.y, '#4fc3f7', 10);
    }
  }

  slide() {
    if (!this.running || this.paused || this.finished) return;
    if (this.activeGiraffe) return;
    if (this.player.onGround) {
      this.player.slideTimer = 0.62;
      this.soundEngine.playSlide();
      this.spawnParticles(this.player.x - 10, 4, '#fff59d', 5);
    } else {
      // Fast-fall if in air
      this.player.vy = Math.min(this.player.vy, -520);
    }
  }

  feedActiveGiraffe() {
    if (!this.activeGiraffe || this.activeGiraffe.fed) return;
    const g = this.activeGiraffe;
    g.fed = true;
    g.eatingTimer = 1.25;
    this.giraffeWaitResumeTimer = 1.15;
    this.onGiraffePrompt?.(false);
    this.soundEngine.playGiraffeFeed();
    this.saveManager.incrementGiraffesFed();
    this.spawnParticles(g.x - 20, 110, '#ff80ab', 16);

    const fedCount = this.saveManager.state.giraffesFed;
    if (fedCount === 1 && this.saveManager.unlockItem('dress_giraffe_onesie')) {
      const item = findCatalogItem('dress', 'dress_giraffe_onesie');
      this.onDiscovery?.('🎁', 'New Outfit Unlocked!', item.name);
      this.soundEngine.speakHint('Yay! You unlocked the Giraffe Spot Suit!');
    } else if (fedCount >= 2 && this.saveManager.unlockItem('hat_giraffe_ears')) {
      const item = findCatalogItem('hat', 'hat_giraffe_ears');
      this.onDiscovery?.('🦒', 'New Headband!', item.name);
      this.soundEngine.speakHint('Awesome! You unlocked the Giraffe Headband!');
    } else {
      this.onDiscovery?.('🦒', 'Happy Giraffe!', 'Yummy green leaves!');
    }
  }

  update(dt) {
    if (!this.running || this.paused || !this.level) return;
    const clampedDt = Math.min(dt, 0.05);
    this.time += clampedDt;

    // Update giraffe eating timers
    for (const g of this.level.giraffes) {
      if (g.eatingTimer > 0) {
        g.eatingTimer = Math.max(0, g.eatingTimer - clampedDt);
      }
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      p.x += p.vx * clampedDt;
      p.y += p.vy * clampedDt;
      p.vy -= 260 * clampedDt;
      p.life -= clampedDt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    if (this.finished) return;

    // Timers
    if (this.player.slideTimer > 0) this.player.slideTimer = Math.max(0, this.player.slideTimer - clampedDt);
    if (this.player.invulnTimer > 0) this.player.invulnTimer = Math.max(0, this.player.invulnTimer - clampedDt);
    if (this.player.boostTimer > 0) this.player.boostTimer = Math.max(0, this.player.boostTimer - clampedDt);

    // Check Giraffe station pause
    if (this.activeGiraffe) {
      if (!this.activeGiraffe.fed) {
        return; // Wait happily for Ella to tap Feed!
      }
      if (this.giraffeWaitResumeTimer > 0) {
        this.giraffeWaitResumeTimer -= clampedDt;
        if (this.giraffeWaitResumeTimer <= 0) {
          this.activeGiraffe = null;
        }
        return;
      }
    }

    // Check if approaching an unfed Giraffe
    for (const g of this.level.giraffes) {
      if (!g.fed && Math.abs(this.player.x - (g.x - 110)) < 28) {
        this.activeGiraffe = g;
        this.player.y = 0;
        this.player.vy = 0;
        this.player.onGround = true;
        this.onGiraffePrompt?.(true);
        this.soundEngine.speakHint('Tap Feed Giraffe to give her a yummy leaf!');
        return;
      }
    }

    // Horizontal movement
    const speedSetting = this.saveManager.state.settings.speed || 'fast';
    const mult = SPEED_MULTIPLIERS[speedSetting] || 1.0;
    const boostMult = this.player.boostTimer > 0 ? 1.45 : 1.0;
    const vx = this.level.world.baseSpeed * mult * boostMult;
    this.player.x += vx * clampedDt;

    // Vertical physics (gravity + platforms)
    const prevY = this.player.y;
    this.player.vy -= 1750 * clampedDt;
    this.player.y += this.player.vy * clampedDt;

    let landed = false;
    // Check elevated platforms when falling
    if (this.player.vy <= 0) {
      for (const plat of this.level.platforms) {
        if (this.player.x >= plat.x - 18 && this.player.x <= plat.x + plat.width + 18) {
          if (prevY >= plat.yOffset - 8 && this.player.y <= plat.yOffset) {
            this.player.y = plat.yOffset;
            this.player.vy = 0;
            landed = true;
            break;
          }
        }
      }
    }

    if (this.player.y <= 0) {
      this.player.y = 0;
      this.player.vy = 0;
      landed = true;
    }

    if (landed) {
      this.player.onGround = true;
      this.player.jumpsLeft = 2;
      this.player.coyoteTimer = 0.14;
    } else {
      if (this.player.onGround) {
        this.player.onGround = false;
      }
      this.player.coyoteTimer = Math.max(0, this.player.coyoteTimer - clampedDt);
    }

    // Collectibles
    const playerCenterY = this.player.y + (this.player.slideTimer > 0 ? 22 : 42);
    for (const c of this.level.collectibles) {
      if (c.collected) continue;
      const dx = Math.abs(this.player.x - c.x);
      const dy = Math.abs(playerCenterY - c.yOffset);
      if (dx < 38 && dy < 44) {
        c.collected = true;
        if (c.type === 'star') {
          this.stars += 1;
          this.soundEngine.playStar();
          this.spawnParticles(c.x, c.yOffset, '#ffd54f', 7);
        } else {
          this.gems += 1;
          this.soundEngine.playGem();
          this.spawnParticles(c.x, c.yOffset, '#ff80ab', 10);
        }
        this.emitHud();
      }
    }

    // Speed Boost Pads
    for (const b of this.level.boosts) {
      if (!b.triggered && Math.abs(this.player.x - b.x) < 35 && this.player.y < 30) {
        b.triggered = true;
        this.player.boostTimer = 1.6;
        this.soundEngine.playBoost();
        this.spawnParticles(b.x, 12, '#4fc3f7', 12);
      }
    }

    // Forgiving Obstacles (gentle boing, no game over!)
    if (this.player.invulnTimer <= 0) {
      const isSliding = this.player.slideTimer > 0;
      for (const obs of this.level.obstacles) {
        if (obs.hit) continue;
        const dx = Math.abs(this.player.x - obs.x);
        if (dx < 24) {
          if (obs.type === 'bush' && this.player.y < 28) {
            obs.hit = true;
            this.player.invulnTimer = 1.0;
            this.player.vy = 260;
            this.soundEngine.playBoing();
            this.spawnParticles(obs.x, 20, '#81c784', 8);
          } else if (obs.type === 'banner' && !isSliding && this.player.y + 72 > obs.yOffset && this.player.y < obs.yOffset + 35) {
            obs.hit = true;
            this.player.invulnTimer = 1.0;
            this.soundEngine.playBoing();
            this.spawnParticles(obs.x, obs.yOffset, '#ff80ab', 8);
          }
        }
      }
    }

    // Checkpoints
    for (const cp of this.level.checkpoints) {
      if (!cp.reached && this.player.x >= cp.x) {
        cp.reached = true;
        this.soundEngine.playCheckpoint();
        this.spawnParticles(cp.x, 60, '#ffd54f', 16);
      }
    }

    // Creature Discovery!
    for (const spawn of this.level.creatureSpawns) {
      if (!spawn.discoveredInRun && Math.abs(this.player.x - spawn.x) < 62 && Math.abs(this.player.y - spawn.yOffset) < 95) {
        spawn.discoveredInRun = true;
        const isNew = this.saveManager.discoverCreature(spawn.creature.id);
        this.soundEngine.playCreatureDiscover();
        this.spawnParticles(spawn.x, spawn.yOffset + 20, spawn.creature.primary, 16);
        this.onDiscovery?.('🐾', isNew ? 'New Creature Found!' : 'Friendly Creature!', spawn.creature.name);

        if (this.saveManager.state.discoveredCreatures.length >= 6) {
          if (this.saveManager.unlockItem('shoes_cloud_wings')) {
            const shoes = findCatalogItem('shoes', 'shoes_cloud_wings');
            this.onDiscovery?.('🪽', 'New Shoes Unlocked!', shoes.name);
          }
        }
      }
    }

    // Progress HUD update
    this.emitHud();

    // Finish Arch!
    if (this.player.x >= this.level.length) {
      this.finished = true;
      this.soundEngine.stopMusic();
      this.soundEngine.playLevelComplete();
      this.spawnParticles(this.player.x, 80, '#ffd54f', 28);

      const newlyUnlocked = [];
      const rewardId = this.level.world.rewardOutfitId;
      if (rewardId && this.saveManager.unlockItem(rewardId)) {
        const rewardItem = findCatalogItem('dress', rewardId);
        if (rewardItem) newlyUnlocked.push(rewardItem);
      }
      this.saveManager.completeWorld(this.level.world.id, this.stars, this.gems);
      this.onComplete?.({
        world: this.level.world,
        stars: this.stars,
        gems: this.gems,
        newlyUnlocked,
      });
    }
  }

  spawnParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i += 1) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 220,
        vy: Math.random() * 240 + 60,
        color,
        size: Math.random() * 5 + 3,
        life: 0.45 + Math.random() * 0.35,
      });
    }
  }

  emitHud() {
    if (!this.level) return;
    const progress = Math.max(0, Math.min(1, this.player.x / this.level.length));
    this.onHudUpdate?.({
      stars: this.stars,
      gems: this.gems,
      progress,
      world: this.level.world,
    });
  }
}
