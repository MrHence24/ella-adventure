import { WORLDS } from './worldsData.js';

export class WorldMapUI {
  constructor(saveManager, soundEngine, onSelectWorld) {
    this.saveManager = saveManager;
    this.soundEngine = soundEngine;
    this.onSelectWorld = onSelectWorld;
    this.gridEl = document.getElementById('worlds-grid');
  }

  render() {
    this.gridEl.innerHTML = '';
    const completed = this.saveManager.state.completedWorlds;

    WORLDS.forEach((world) => {
      const isDone = completed.includes(world.id);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `world-card ${isDone ? 'completed' : ''}`;
      card.style.background = `linear-gradient(135deg, ${world.skyTop}, ${world.hillNear})`;
      card.innerHTML = `
        <div class="world-card-top">
          <span class="world-card-emoji">${world.emoji}</span>
          ${isDone ? '<span class="world-done-badge">⭐ Completed!</span>' : '<span class="world-play-badge">▶ Play</span>'}
        </div>
        <div class="world-card-title">World ${world.number}: ${world.name}</div>
        <div class="world-card-sub">${world.subtitle}</div>
      `;
      card.addEventListener('click', () => {
        this.soundEngine.playClick();
        this.onSelectWorld(world.id);
      });
      this.gridEl.appendChild(card);
    });
  }
}
