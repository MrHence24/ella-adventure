import test from 'node:test';
import assert from 'node:assert/strict';

import { SaveManager, DEFAULT_CHARACTER } from '../src/storage/SaveManager.js';
import { DRESSES, OUTFIT_CATEGORIES, SHOES, HATS, isItemUnlocked } from '../src/customization/catalog.js';
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

  assert.deepEqual(manager.state.character, DEFAULT_CHARACTER);

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

test('SaveManager retains partial old saves and resets to defaults without losing persistence', () => {
  const storage = createMemoryStorage();
  storage.setItem('ellas_adventure_save_v1', JSON.stringify({ character: { hairColor: '#ec407a' } }));

  const manager = new SaveManager(storage);
  assert.equal(manager.state.character.hairColor, '#ec407a');
  assert.equal(manager.state.character.bodyColor, DEFAULT_CHARACTER.bodyColor);
  assert.equal(manager.state.settings.speed, 'fast');

  manager.reset();
  const reloaded = new SaveManager(storage);
  assert.deepEqual(reloaded.state.character, DEFAULT_CHARACTER);
  assert.deepEqual(reloaded.state.completedWorlds, []);
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
  assert.equal(isItemUnlocked(SHOES.find((item) => item.id === 'shoes_cloud_wings'), []), false);
  assert.equal(isItemUnlocked(HATS.find((item) => item.id === 'hat_giraffe_ears'), []), false);
  assert.equal(isItemUnlocked(DRESSES.find((item) => item.id === 'dress_sky_hero'), []), true);
});

test('Creature data associates three unique creatures with each existing world', () => {
  assert.equal(WORLDS.length, 4);
  assert.equal(CREATURES.length, 12);

  for (const world of WORLDS) {
    const creatures = getCreaturesByWorld(world.id);
    assert.equal(creatures.length, 3);
    assert.ok(creatures.every((creature) => creature.worldId === world.id));
  }
  assert.equal(new Set(CREATURES.map((creature) => creature.id)).size, CREATURES.length);
  assert.ok(CREATURES.every((creature) => WORLDS.some((world) => world.id === creature.worldId)));
});

test('All four worlds generate collectibles, checkpoints, world creatures, and Safari giraffes', () => {
  for (const world of WORLDS) {
    const level = generateLevel(world);
    assert.equal(level.world, world);
    assert.equal(level.length, world.length);
    assert.ok(level.collectibles.length >= 10);
    assert.ok(level.collectibles.some((item) => item.type === 'star'));
    assert.ok(level.collectibles.some((item) => item.type === 'gem'));
    assert.equal(level.checkpoints.length, 2);
    assert.deepEqual(level.creatureSpawns.map((spawn) => spawn.creature.id), getCreaturesByWorld(world.id).map((creature) => creature.id));
    assert.equal(level.giraffes.length, world.hasGiraffes ? 2 : 0);
  }

  const safari = generateLevel(getWorldById('safari'));
  assert.equal(safari.giraffes.length, 2);
});

test('World completion is retained and replayed collectibles accumulate', () => {
  const storage = createMemoryStorage();
  const saveManager = new SaveManager(storage);

  saveManager.completeWorld('meadow', 8, 2);
  saveManager.completeWorld('meadow', 5, 1);
  saveManager.setCurrentWorld('safari');

  const reloaded = new SaveManager(storage);
  assert.deepEqual(reloaded.state.completedWorlds, ['meadow']);
  assert.equal(reloaded.state.currentWorldId, 'safari');
  assert.equal(reloaded.state.totalStars, 13);
  assert.equal(reloaded.state.totalGems, 3);
});

test('GameEngine pause, resume, stop, and restart preserve expected run state', () => {
  const saveManager = new SaveManager(createMemoryStorage());
  const engine = new GameEngine({ saveManager, soundEngine: createMockSoundEngine() });

  engine.startWorld('meadow');
  engine.setPaused(true);
  const pausedX = engine.player.x;
  engine.update(0.05);
  engine.jump();
  assert.equal(engine.player.x, pausedX);
  assert.equal(engine.player.onGround, true);

  engine.setPaused(false);
  engine.jump();
  assert.equal(engine.player.onGround, false);
  engine.update(0.05);
  assert.ok(engine.player.x > pausedX);

  engine.stop();
  const stoppedX = engine.player.x;
  engine.update(0.05);
  assert.equal(engine.player.x, stoppedX);

  engine.startWorld('safari');
  assert.equal(engine.running, true);
  assert.equal(engine.paused, false);
  assert.equal(engine.finished, false);
  assert.equal(engine.level.world.id, 'safari');
  assert.equal(engine.player.x, 120);
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

test('Feeding one then two giraffes unlocks the outfit and headband in order', () => {
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
  assert.equal(saveManager.state.unlockedItems.includes('hat_giraffe_ears'), false);

  for (let i = 0; i < 30; i += 1) engine.update(0.05);
  engine.player.x = 3990;
  engine.update(0.04);
  assert.equal(promptShown, true);
  engine.feedActiveGiraffe();
  assert.equal(saveManager.state.giraffesFed, 2);
  assert.ok(saveManager.state.unlockedItems.includes('hat_giraffe_ears'));
});

test('Discovering the sixth creature unlocks cloud wing shoes', () => {
  const saveManager = new SaveManager(createMemoryStorage());
  for (const creature of CREATURES.slice(1, 6)) saveManager.discoverCreature(creature.id);
  assert.equal(saveManager.state.unlockedItems.includes('shoes_cloud_wings'), false);

  const engine = new GameEngine({ saveManager, soundEngine: createMockSoundEngine() });
  engine.startWorld('meadow');
  engine.player.x = engine.level.creatureSpawns[0].x;
  engine.update(0.01);

  assert.equal(saveManager.state.discoveredCreatures.length, 6);
  assert.ok(saveManager.state.unlockedItems.includes('shoes_cloud_wings'));
});
