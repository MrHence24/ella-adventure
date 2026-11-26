import { CREATURES } from './creaturesData.js';
import { drawCreature } from './CreatureRenderer.js';
import { getWorldById } from '../worlds/worldsData.js';

export class CreatureBookUI {
  constructor(saveManager, soundEngine) {
    this.saveManager = saveManager;
    this.soundEngine = soundEngine;
    this.gridEl = document.getElementById('creatures-grid');
  }

  render() {
    this.gridEl.innerHTML = '';
    const discovered = this.saveManager.state.discoveredCreatures;

    CREATURES.forEach((creature) => {
      const isFound = discovered.includes(creature.id);
      const world = getWorldById(creature.worldId);

      const card = document.createElement('div');
      card.className = `creature-card ${isFound ? 'found' : 'unfound'}`;

      const canvas = document.createElement('canvas');
      canvas.width = 110;
      canvas.height = 95;
      const ctx = canvas.getContext('2d');
      drawCreature(ctx, creature, 55, 52, 1.15, 0.5, isFound);

      const info = document.createElement('div');
      info.className = 'creature-info';
      info.innerHTML = `
        <div class="creature-name">${isFound ? creature.name : '???'}</div>
        <div class="creature-world-tag">${world.emoji} ${world.name}</div>
        <p class="creature-desc">${isFound ? creature.description : 'Run & explore this world to meet this friend!'}</p>
      `;

      card.appendChild(canvas);
      card.appendChild(info);

      if (isFound) {
        card.addEventListener('click', () => {
          this.soundEngine.playCreatureDiscover();
          this.soundEngine.speakHint(`${creature.name}. ${creature.description}`);
        });
      }

      this.gridEl.appendChild(card);
    });
  }
}
