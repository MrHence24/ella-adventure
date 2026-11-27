import test from 'node:test';
import assert from 'node:assert/strict';

import { SaveManager, DEFAULT_CHARACTER } from '../src/storage/SaveManager.js';
import { DRESSES, OUTFIT_CATEGORIES, isItemUnlocked } from '../src/customization/catalog.js';
import { CREATURES, getCreaturesByWorld } from '../src/creatures/creaturesData.js';
import { WORLDS, getWorldById } from '../src/worlds/worldsData.js';
import { generateLevel } from '../src/game/LevelGenerator.js';
import { GameEngine } from '../src/game/GameEngine.js';

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

function createMockSoundEngine() {
  return {
    playClick() {},
    playOutfitChange() {},
    playJump() {},
    playSlide() {},
    playStar() {},
    playGem() {},
    playBoost() {},
    playBoing() {},
    playCheckpoint() {},
    playCreatureDiscover() {},
    playGiraffeFeed() {},
    playLevelComplete() {},
    startMusic() {},
    stopMusic() {},
    speakHint() {},
  };
}

test('SaveManager persists character customization, unlocks, creatures, and worlds', () => {
  const storage = createMemoryStorage();
  const manager = new SaveManager(storage);

  assert.equal(manager.state.character.bodyColor, DEFAULT_CHARACTER.bodyColor);

  manager.updateCharacter({ outfitMode: 'separates', top: 'top_pink_heart' });
  manager.unlockItem('dress_giraffe_onesie');
  manager.discoverCreature('twiggy');
  manager.completeWorld('safari', 12, 3);

  const reloaded = new SaveManager(storage);
  assert.equal(reloaded.state.character.outfitMode, 'separates');
  assert.equal(reloaded.state.character.top, 'top_pink_heart');
  assert.ok(reloaded.state.unlockedItems.includes('dress_giraffe_onesie'));
  assert.ok(reloaded.state.discoveredCreatures.includes('twiggy'));
  assert.ok(reloaded.state.completedWorlds.includes('safari'));
  assert.equal(reloaded.state.totalStars, 12);
  assert.equal(reloaded.state.totalGems, 3);
});

test('Customization catalog includes all 5 required outfit categories and unlock logic', () => {
  const requiredCategories = ['princess', 'everyday', 'superhero', 'adventure', 'special'];
  const categoryIds = OUTFIT_CATEGORIES.map((c) => c.id);
  for (const req of requiredCategories) {
    assert.ok(categoryIds.includes(req), `Missing category ${req}`);
    assert.ok(DRESSES.some((d) => d.category === req), `No dress in category ${req}`);
  }

  const giraffeSuit = DRESSES.find((d) => d.id === 'dress_giraffe_onesie');
  assert.equal(isItemUnlocked(giraffeSuit, []), false);
  assert.equal(isItemUnlocked(giraffeSuit, ['dress_giraffe_onesie']), true);
});

test('All 4 worlds generate valid levels with collectibles, checkpoints, and 3 creatures each', () => {
  assert.equal(WORLDS.length, 4);
  assert.equal(CREATURES.length, 12);

  for (const world of WORLDS) {
    const level = generateLevel(world);
    assert.ok(level.collectibles.length >= 10);
    assert.equal(level.checkpoints.length, 2);
    assert.equal(level.creatureSpawns.length, 3);
    assert.equal(getCreaturesByWorld(world.id).length, 3);
  }

  const safari = generateLevel(getWorldById('safari'));
  assert.equal(safari.giraffes.length, 2);
});

test('GameEngine supports jumping, double-jumping, sliding, collectibles, and completing World 1', () => {
  const saveManager = new SaveManager(createMemoryStorage());
  let completedResult = null;
  const discoveries = [];

  const engine = new GameEngine({
    saveManager,
    soundEngine: createMockSoundEngine(),
    onDiscovery: (_icon, title, subtitle) => discoveries.push({ title, subtitle }),
    onComplete: (res) => {
      completedResult = res;
    },
  });

  engine.startWorld('meadow');
  assert.equal(engine.running, true);

  // Jump + Double Jump
  engine.jump();
  assert.equal(engine.player.onGround, false);
  assert.equal(engine.player.jumpsLeft, 1);
  engine.jump();
  assert.equal(engine.player.jumpsLeft, 0);

  // Simulate stepping through the entire Meadow level
  for (let i = 0; i < 600 && !engine.finished; i += 1) {
    engine.update(0.04);
  }

  assert.equal(engine.finished, true);
  assert.ok(completedResult !== null);
  assert.equal(completedResult.world.id, 'meadow');
  assert.ok(engine.stars > 0, 'Should collect stars while running');
  assert.ok(saveManager.state.completedWorlds.includes('meadow'));
  assert.ok(saveManager.state.unlockedItems.includes('dress_meadow_bloom'));
  assert.ok(discoveries.length >= 1, 'Should discover at least one meadow creature');
});

test('GameEngine Giraffe Safari pauses for feeding and unlocks Giraffe outfits', () => {
  const saveManager = new SaveManager(createMemoryStorage());
  let promptShown = false;

  const engine = new GameEngine({
    saveManager,
    soundEngine: createMockSoundEngine(),
    onGiraffePrompt: (show) => {
      promptShown = show;
    },
  });

  engine.startWorld('safari');
  engine.player.x = 1975;
  engine.update(0.04);

  assert.equal(promptShown, true);
  assert.ok(engine.activeGiraffe !== null);

  engine.feedActiveGiraffe();
  assert.equal(promptShown, false);
  assert.equal(saveManager.state.giraffesFed, 1);
  assert.ok(saveManager.state.unlockedItems.includes('dress_giraffe_onesie'));
});
