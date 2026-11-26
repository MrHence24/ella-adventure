import { SaveManager } from './storage/SaveManager.js';
import { SoundEngine } from './audio/SoundEngine.js';
import { CustomizationUI } from './customization/CustomizationUI.js';
import { CreatureBookUI } from './creatures/CreatureBookUI.js';
import { WorldMapUI } from './worlds/WorldMapUI.js';
import { GameEngine } from './game/GameEngine.js';
import { GameRenderer } from './game/GameRenderer.js';
import { CREATURES } from './creatures/creaturesData.js';
import { WORLDS } from './worlds/worldsData.js';

class App {
  constructor() {
    this.saveManager = new SaveManager();
    this.soundEngine = new SoundEngine(this.saveManager);
    this.activeScreen = 'customize';
    this.toastTimer = null;

    this.screenCustomize = document.getElementById('screen-customize');
    this.screenGame = document.getElementById('screen-game');
    this.gameCanvas = document.getElementById('game-canvas');

    this.engine = new GameEngine({
      saveManager: this.saveManager,
      soundEngine: this.soundEngine,
      onHudUpdate: (hud) => this.updateHud(hud),
      onDiscovery: (icon, title, subtitle) => this.showToast(icon, title, subtitle),
      onGiraffePrompt: (show) => {
        document.getElementById('giraffe-feed-prompt').classList.toggle('hidden', !show);
      },
      onComplete: (result) => this.showCompleteModal(result),
    });

    this.renderer = new GameRenderer(this.gameCanvas, this.engine, this.saveManager);

    this.customizationUI = new CustomizationUI({
      saveManager: this.saveManager,
      soundEngine: this.soundEngine,
      onPlay: (worldId) => this.startGame(worldId),
    });

    this.creatureBookUI = new CreatureBookUI(this.saveManager, this.soundEngine);
    this.worldMapUI = new WorldMapUI(this.saveManager, this.soundEngine, (worldId) => {
      this.closeAllModals();
      this.startGame(worldId);
    });

    this.bindGlobalEvents();
    this.refreshTopStats();
    this.syncSettingsUI();

    this.lastFrameTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  bindGlobalEvents() {
    // Modal openers
    document.getElementById('btn-creature-book').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.creatureBookUI.render();
      this.openModal('modal-creatures');
    });

    document.getElementById('btn-worlds-map').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.worldMapUI.render();
      this.openModal('modal-worlds');
    });

    document.getElementById('btn-audio-settings').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.syncSettingsUI();
      this.openModal('modal-settings');
    });

    // Modal close buttons
    document.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.soundEngine.playClick();
        document.getElementById(btn.dataset.close).classList.add('hidden');
      });
    });

    // Settings controls
    document.getElementById('toggle-mute').addEventListener('click', () => {
      const next = !this.saveManager.state.settings.muted;
      this.saveManager.updateSettings({ muted: next });
      this.soundEngine.applyVolume();
      this.syncSettingsUI();
    });

    document.getElementById('volume-slider').addEventListener('input', (e) => {
      const vol = Number(e.target.value) / 100;
      this.saveManager.updateSettings({ volume: vol, muted: vol === 0 });
      this.soundEngine.applyVolume();
      this.syncSettingsUI();
    });

    document.getElementById('toggle-voice').addEventListener('click', () => {
      const next = !this.saveManager.state.settings.voiceHints;
      this.saveManager.updateSettings({ voiceHints: next });
      this.syncSettingsUI();
    });

    document.querySelectorAll('.speed-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.soundEngine.playClick();
        this.saveManager.updateSettings({ speed: btn.dataset.speed });
        this.syncSettingsUI();
      });
    });

    document.getElementById('btn-reset-progress').addEventListener('click', () => {
      this.saveManager.reset();
      this.customizationUI.renderGrid();
      this.customizationUI.updateWorldStrip();
      this.refreshTopStats();
      this.syncSettingsUI();
      this.closeAllModals();
    });

    // Gameplay HUD & Touch Controls
    document.getElementById('btn-pause').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.engine.setPaused(true);
      this.openModal('modal-pause');
    });

    document.getElementById('btn-back-dressup').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.returnToCustomize();
    });

    document.getElementById('btn-resume').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.closeAllModals();
      this.engine.setPaused(false);
    });

    document.getElementById('btn-restart-level').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.closeAllModals();
      this.startGame(this.saveManager.state.currentWorldId);
    });

    document.getElementById('btn-pause-dressup').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.closeAllModals();
      this.returnToCustomize();
    });

    document.getElementById('btn-feed-giraffe').addEventListener('click', () => {
      this.engine.feedActiveGiraffe();
      this.refreshTopStats();
    });

    const jumpBtn = document.getElementById('btn-touch-jump');
    const slideBtn = document.getElementById('btn-touch-slide');

    jumpBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.engine.jump();
    });

    slideBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.engine.slide();
    });

    this.gameCanvas.addEventListener('pointerdown', () => {
      this.engine.jump();
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (this.activeScreen !== 'game') return;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        this.engine.jump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        this.engine.slide();
      } else if (e.code === 'KeyE' || e.code === 'KeyF') {
        this.engine.feedActiveGiraffe();
      } else if (e.code === 'Escape') {
        this.engine.setPaused(!this.engine.paused);
        if (this.engine.paused) this.openModal('modal-pause');
        else this.closeAllModals();
      }
    });

    // Level Complete Modal buttons
    document.getElementById('btn-next-world-play').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.closeAllModals();
      const idx = WORLDS.findIndex((w) => w.id === this.saveManager.state.currentWorldId);
      const nextWorld = WORLDS[(idx + 1) % WORLDS.length];
      this.startGame(nextWorld.id);
    });

    document.getElementById('btn-complete-dressup').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.closeAllModals();
      this.returnToCustomize();
    });

    document.getElementById('btn-complete-replay').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.closeAllModals();
      this.startGame(this.saveManager.state.currentWorldId);
    });

    window.addEventListener('resize', () => {
      if (this.activeScreen === 'game') {
        this.renderer.resize();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.activeScreen === 'game' && this.engine.running && !this.engine.paused && !this.engine.finished) {
        this.engine.setPaused(true);
        this.openModal('modal-pause');
      }
    });
  }

  startGame(worldId) {
    this.activeScreen = 'game';
    this.screenCustomize.classList.remove('active');
    this.screenGame.classList.add('active');
    this.closeAllModals();
    this.renderer.resize();
    this.engine.startWorld(worldId);
  }

  returnToCustomize() {
    this.engine.stop();
    this.activeScreen = 'customize';
    this.screenGame.classList.remove('active');
    this.screenCustomize.classList.add('active');
    this.customizationUI.renderGrid();
    this.customizationUI.updateWorldStrip();
    this.refreshTopStats();
  }

  updateHud({ stars, gems, progress, world }) {
    document.getElementById('hud-stars').textContent = String(stars);
    document.getElementById('hud-gems').textContent = String(gems);
    document.getElementById('hud-world-title').textContent = `${world.emoji} World ${world.number}: ${world.name}`;
    document.getElementById('level-progress-fill').style.width = `${Math.round(progress * 100)}%`;
  }

  showToast(icon, title, subtitle) {
    const toast = document.getElementById('discovery-toast');
    document.getElementById('toast-icon').textContent = icon;
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-subtitle').textContent = subtitle;
    toast.classList.remove('hidden');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
    this.refreshTopStats();
  }

  showCompleteModal({ world, stars, gems, newlyUnlocked }) {
    this.refreshTopStats();
    document.getElementById('complete-title').textContent = 'Amazing Job, Ella!';
    document.getElementById('complete-subtitle').textContent = `You finished ${world.name}!`;
    document.getElementById('complete-stars').textContent = String(stars);
    document.getElementById('complete-gems').textContent = String(gems);

    const unlocksBox = document.getElementById('complete-unlocks');
    const unlocksList = document.getElementById('complete-unlocks-list');
    if (newlyUnlocked.length > 0) {
      unlocksBox.classList.remove('hidden');
      unlocksList.innerHTML = newlyUnlocked
        .map((item) => `<div class="unlock-chip">${item.icon} ${item.name}</div>`)
        .join('');
    } else {
      unlocksBox.classList.add('hidden');
      unlocksList.innerHTML = '';
    }

    this.openModal('modal-complete');
  }

  refreshTopStats() {
    document.getElementById('total-stars-count').textContent = String(this.saveManager.state.totalStars);
    document.getElementById('total-creatures-count').textContent =
      `${this.saveManager.state.discoveredCreatures.length}/${CREATURES.length}`;
  }

  syncSettingsUI() {
    const { muted, volume, voiceHints, speed } = this.saveManager.state.settings;
    const muteBtn = document.getElementById('toggle-mute');
    muteBtn.textContent = muted ? 'OFF' : 'ON';
    muteBtn.classList.toggle('on', !muted);
    document.getElementById('audio-icon').textContent = muted ? '🔇' : '🔊';
    document.getElementById('volume-slider').value = String(Math.round(volume * 100));

    const voiceBtn = document.getElementById('toggle-voice');
    voiceBtn.textContent = voiceHints ? 'ON' : 'OFF';
    voiceBtn.classList.toggle('on', voiceHints);

    document.querySelectorAll('.speed-pill').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.speed === speed);
    });
  }

  openModal(id) {
    this.closeAllModals();
    document.getElementById(id).classList.remove('hidden');
  }

  closeAllModals() {
    document.querySelectorAll('.modal').forEach((m) => m.classList.add('hidden'));
  }

  loop(now) {
    const dt = Math.min((now - this.lastFrameTime) / 1000, 0.05);
    this.lastFrameTime = now;

    if (this.activeScreen === 'customize') {
      this.customizationUI.renderPreview(dt);
    } else if (this.activeScreen === 'game') {
      this.engine.update(dt);
      this.renderer.render();
    }

    requestAnimationFrame((t) => this.loop(t));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.__ellaApp = new App();
});
