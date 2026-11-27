import {
  ACCESSORIES,
  BODY_COLORS,
  BOTTOMS,
  DRESSES,
  HAIR_COLORS,
  HAIR_STYLES,
  HATS,
  OUTFIT_CATEGORIES,
  SHOES,
  TOPS,
  WARDROBE_TABS,
  isItemUnlocked,
} from './catalog.js';
import { drawCharacter } from './CharacterRenderer.js';
import { WORLDS, getWorldById } from '../worlds/worldsData.js';

export class CustomizationUI {
  constructor({ saveManager, soundEngine, onPlay }) {
    this.saveManager = saveManager;
    this.soundEngine = soundEngine;
    this.onPlay = onPlay;

    this.activeTab = 'dress';
    this.activeCategory = 'all';
    this.previewPose = 'idle';
    this.celebrateTimer = 0;
    this.time = 0;

    this.previewCanvas = document.getElementById('preview-canvas');
    this.previewCtx = this.previewCanvas.getContext('2d');
    this.tabsEl = document.getElementById('wardrobe-tabs');
    this.styleFilterEl = document.getElementById('style-filter-bar');
    this.gridEl = document.getElementById('wardrobe-grid');

    this.bindControls();
    this.renderTabs();
    this.renderGrid();
    this.updateWorldStrip();
  }

  bindControls() {
    document.getElementById('btn-preview-anim').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.previewPose = this.previewPose === 'idle' ? 'run' : 'idle';
      document.getElementById('preview-anim-icon').textContent = this.previewPose === 'run' ? '🧍‍♀️' : '🏃';
      document.getElementById('preview-anim-text').textContent = this.previewPose === 'run' ? 'Idle Pose' : 'Run Pose';
    });

    document.getElementById('btn-randomize').addEventListener('click', () => {
      this.randomize();
    });

    document.getElementById('btn-prev-world').addEventListener('click', () => {
      this.cycleWorld(-1);
    });
    document.getElementById('btn-next-world').addEventListener('click', () => {
      this.cycleWorld(1);
    });

    document.getElementById('btn-play').addEventListener('click', () => {
      this.soundEngine.playClick();
      this.onPlay(this.saveManager.state.currentWorldId);
    });
  }

  cycleWorld(dir) {
    this.soundEngine.playClick();
    const idx = WORLDS.findIndex((w) => w.id === this.saveManager.state.currentWorldId);
    const nextIdx = (idx + dir + WORLDS.length) % WORLDS.length;
    this.saveManager.setCurrentWorld(WORLDS[nextIdx].id);
    this.updateWorldStrip();
  }

  updateWorldStrip() {
    const world = getWorldById(this.saveManager.state.currentWorldId);
    document.getElementById('selected-world-emoji').textContent = world.emoji;
    document.getElementById('selected-world-name').textContent = `World ${world.number}: ${world.name}`;
  }

  randomize() {
    const unlocked = this.saveManager.state.unlockedItems;
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const pickUnlocked = (arr) => pick(arr.filter((i) => isItemUnlocked(i, unlocked)));

    const useDress = Math.random() > 0.35;
    this.saveManager.updateCharacter({
      bodyColor: pick(BODY_COLORS).hex,
      hairStyle: pick(HAIR_STYLES).id,
      hairColor: pick(HAIR_COLORS).hex,
      outfitMode: useDress ? 'dress' : 'separates',
      dress: pickUnlocked(DRESSES).id,
      top: pickUnlocked(TOPS).id,
      bottom: pickUnlocked(BOTTOMS).id,
      shoes: pickUnlocked(SHOES).id,
      hat: pickUnlocked(HATS).id,
      accessory: pickUnlocked(ACCESSORIES).id,
    });
    this.celebrateTimer = 0.8;
    this.soundEngine.playOutfitChange();
    this.renderGrid();
  }

  renderTabs() {
    this.tabsEl.innerHTML = '';
    WARDROBE_TABS.forEach((tab) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `tab-btn ${this.activeTab === tab.id ? 'active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(this.activeTab === tab.id));
      btn.innerHTML = `<span class="tab-icon">${tab.icon}</span><span class="tab-label">${tab.label}</span>`;
      btn.addEventListener('click', () => {
        this.soundEngine.playClick();
        this.activeTab = tab.id;
        this.renderTabs();
        this.renderGrid();
      });
      this.tabsEl.appendChild(btn);
    });
  }

  renderStyleFilter() {
    const showFilter = ['dress', 'top', 'bottom'].includes(this.activeTab);
    this.styleFilterEl.classList.toggle('hidden', !showFilter);
    if (!showFilter) return;

    this.styleFilterEl.innerHTML = '';
    OUTFIT_CATEGORIES.forEach((cat) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-pill ${this.activeCategory === cat.id ? 'active' : ''}`;
      btn.innerHTML = `<span>${cat.icon}</span> <span>${cat.label}</span>`;
      btn.addEventListener('click', () => {
        this.soundEngine.playClick();
        this.activeCategory = cat.id;
        this.renderStyleFilter();
        this.renderGrid();
      });
      this.styleFilterEl.appendChild(btn);
    });
  }

  renderGrid() {
    this.renderStyleFilter();
    this.gridEl.innerHTML = '';
    const char = this.saveManager.state.character;
    const unlocked = this.saveManager.state.unlockedItems;

    if (this.activeTab === 'color') {
      BODY_COLORS.forEach((col) => {
        const card = this.createSwatchCard(col.name, col.hex, char.bodyColor === col.hex, () => {
          this.saveManager.updateCharacter({ bodyColor: col.hex });
          this.soundEngine.playOutfitChange();
          this.renderGrid();
        });
        this.gridEl.appendChild(card);
      });
      return;
    }

    if (this.activeTab === 'hair') {
      HAIR_STYLES.forEach((style) => {
        const card = this.createItemCard({
          name: style.name,
          icon: style.icon,
          selected: char.hairStyle === style.id,
          unlocked: true,
          colorDot: char.hairColor,
          onClick: () => {
            this.saveManager.updateCharacter({ hairStyle: style.id });
            this.soundEngine.playOutfitChange();
            this.renderGrid();
          },
        });
        this.gridEl.appendChild(card);
      });
      HAIR_COLORS.forEach((col) => {
        const card = this.createSwatchCard(col.name, col.hex, char.hairColor === col.hex, () => {
          this.saveManager.updateCharacter({ hairColor: col.hex });
          this.soundEngine.playOutfitChange();
          this.renderGrid();
        });
        this.gridEl.appendChild(card);
      });
      return;
    }

    const listMap = {
      dress: DRESSES,
      top: TOPS,
      bottom: BOTTOMS,
      shoes: SHOES,
      hat: HATS,
      accessory: ACCESSORIES,
    };
    let items = listMap[this.activeTab] || [];

    if (['dress', 'top', 'bottom'].includes(this.activeTab) && this.activeCategory !== 'all') {
      const filtered = items.filter((i) => i.category === this.activeCategory);
      if (filtered.length > 0) items = filtered;
    }

    items.forEach((item) => {
      const unlockedItem = isItemUnlocked(item, unlocked);
      let selected = false;
      if (this.activeTab === 'dress') {
        selected = char.outfitMode === 'dress' && char.dress === item.id;
      } else if (this.activeTab === 'top') {
        selected = char.outfitMode === 'separates' && char.top === item.id;
      } else if (this.activeTab === 'bottom') {
        selected = char.outfitMode === 'separates' && char.bottom === item.id;
      } else {
        selected = char[this.activeTab] === item.id;
      }

      const card = this.createItemCard({
        name: item.name,
        icon: item.icon,
        selected,
        unlocked: unlockedItem,
        unlockHint: item.unlockHint,
        colorDot: item.primary,
        onClick: () => {
          if (!unlockedItem) {
            this.soundEngine.speakHint(item.unlockHint || 'Keep playing to unlock this!');
            return;
          }
          if (this.activeTab === 'dress') {
            this.saveManager.updateCharacter({ outfitMode: 'dress', dress: item.id });
          } else if (this.activeTab === 'top') {
            this.saveManager.updateCharacter({ outfitMode: 'separates', top: item.id });
          } else if (this.activeTab === 'bottom') {
            this.saveManager.updateCharacter({ outfitMode: 'separates', bottom: item.id });
          } else {
            this.saveManager.updateCharacter({ [this.activeTab]: item.id });
          }
          this.celebrateTimer = 0.65;
          this.soundEngine.playOutfitChange();
          this.renderGrid();
        },
      });
      this.gridEl.appendChild(card);
    });
  }

  createSwatchCard(name, hex, selected, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `wardrobe-item ${selected ? 'selected' : ''}`;
    btn.innerHTML = `
      <span class="swatch-circle" style="background:${hex}"></span>
      <span class="item-name">${name}</span>
    `;
    btn.addEventListener('click', onClick);
    return btn;
  }

  createItemCard({ name, icon, selected, unlocked, unlockHint, colorDot, onClick }) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `wardrobe-item ${selected ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`;
    btn.title = unlocked ? name : unlockHint || 'Locked';
    btn.innerHTML = `
      <span class="item-icon">${unlocked ? icon : '🔒'}</span>
      ${colorDot ? `<span class="item-color-dot" style="background:${colorDot}"></span>` : ''}
      <span class="item-name">${name}</span>
      ${!unlocked && unlockHint ? `<span class="lock-hint">${unlockHint}</span>` : ''}
    `;
    btn.addEventListener('click', onClick);
    return btn;
  }

  renderPreview(dt) {
    this.time += dt;
    if (this.celebrateTimer > 0) {
      this.celebrateTimer = Math.max(0, this.celebrateTimer - dt);
    }

    const ctx = this.previewCtx;
    const w = this.previewCanvas.width;
    const h = this.previewCanvas.height;
    ctx.clearRect(0, 0, w, h);

    // Cheerful spotlight platform
    const grad = ctx.createRadialGradient(w / 2, h * 0.52, 20, w / 2, h * 0.52, 180);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(1, 'rgba(179, 229, 252, 0.1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Floor shadow
    ctx.fillStyle = 'rgba(21, 101, 192, 0.16)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.81, 68, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    const pose = this.celebrateTimer > 0 ? 'celebrate' : this.previewPose;
    drawCharacter(ctx, this.saveManager.state.character, {
      x: w / 2,
      y: h * 0.72,
      scale: 2.05,
      pose,
      time: this.time,
      facing: 1,
    });
  }
}
