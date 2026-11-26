import { getCreaturesByWorld } from '../creatures/creaturesData.js';

export function generateLevel(world) {
  const collectibles = [];
  const obstacles = [];
  const platforms = [];
  const boosts = [];
  const checkpoints = [];
  const giraffes = [];
  const creatureSpawns = [];

  const length = world.length;
  const worldCreatures = getCreaturesByWorld(world.id);

  // Place generous star trails from x=400 to length-350
  for (let x = 420; x < length - 380; x += 360) {
    // Ground or arc of 3 stars
    const isArc = (Math.floor(x / 360) % 2) === 0;
    for (let i = 0; i < 3; i += 1) {
      collectibles.push({
        id: `star_${x}_${i}`,
        type: 'star',
        x: x + i * 52,
        yOffset: isArc ? (i === 1 ? 115 : 70) : 45,
        collected: false,
      });
    }
  }

  // Place elevated platforms (hidden/bonus sky paths!) with gems & flowers
  for (let x = 950; x < length - 650; x += 1150) {
    platforms.push({
      x,
      width: 220,
      yOffset: 125,
    });
    // Bonus gems on top of platform
    for (let i = 0; i < 3; i += 1) {
      collectibles.push({
        id: `gem_plat_${x}_${i}`,
        type: i === 1 ? 'flower' : 'gem',
        x: x + 45 + i * 65,
        yOffset: 175,
        collected: false,
      });
    }
  }

  // Place friendly, low-density obstacles (generous spacing >= 580px!)
  for (let x = 760; x < length - 650; x += 640) {
    // Leave clear space around Giraffe stations in World 2
    if (world.hasGiraffes && (Math.abs(x - 2100) < 340 || Math.abs(x - 4100) < 340)) {
      continue;
    }
    const kind = (Math.floor(x / 640) % 3);
    if (kind === 0) {
      obstacles.push({
        id: `obs_${x}`,
        type: 'bush', // Jump over
        x,
        width: 44,
        height: 40,
        hit: false,
      });
    } else if (kind === 1) {
      obstacles.push({
        id: `obs_${x}`,
        type: 'banner', // Slide under OR jump over
        x,
        width: 54,
        height: 45,
        yOffset: 58,
        hit: false,
      });
    } else {
      boosts.push({
        id: `boost_${x}`,
        x,
        width: 56,
        triggered: false,
      });
    }
  }

  // Checkpoints (1 halfway, 1 near 75%)
  checkpoints.push(
    { id: 'cp_1', x: Math.round(length * 0.48), reached: false },
    { id: 'cp_2', x: Math.round(length * 0.78), reached: false },
  );

  // Giraffe Feeding Stations in World 2!
  if (world.hasGiraffes) {
    giraffes.push(
      { id: 'giraffe_1', x: 2100, fed: false, eatingTimer: 0, promptDismissed: false },
      { id: 'giraffe_2', x: 4100, fed: false, eatingTimer: 0, promptDismissed: false },
    );
  }

  // Place 3 Original Creatures per World!
  worldCreatures.forEach((creature, idx) => {
    const cx = Math.round(length * (0.24 + idx * 0.3));
    const onPlatform = idx === 1;
    creatureSpawns.push({
      creature,
      x: cx,
      yOffset: onPlatform ? 160 : 32,
      discoveredInRun: false,
    });
  });

  return {
    world,
    length,
    collectibles,
    obstacles,
    platforms,
    boosts,
    checkpoints,
    giraffes,
    creatureSpawns,
  };
}
