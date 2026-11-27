const STORAGE_KEY = 'ellas_adventure_save_v1';

export const DEFAULT_CHARACTER = {
  bodyColor: '#4fc3f7',     // Bright sky blue (Ella's favorite!)
  hairStyle: 'twintails',
  hairColor: '#1976d2',     // Cobalt blue
  outfitMode: 'dress',      // 'dress' or 'separates'
  dress: 'dress_sky_hero',
  top: 'top_blue_hoodie',
  bottom: 'bottom_denim_skirt',
  shoes: 'shoes_blue_speed',
  hat: 'hat_blue_bow',
  accessory: 'acc_star_pack',
};

export function createDefaultSave() {
  return {
    version: 1,
    character: { ...DEFAULT_CHARACTER },
    unlockedItems: [], // Additional unlocked item IDs beyond defaults
    discoveredCreatures: [],
    completedWorlds: [],
    currentWorldId: 'meadow',
    totalStars: 0,
    totalGems: 0,
    giraffesFed: 0,
    settings: {
      muted: false,
      volume: 0.7,
      voiceHints: true,
      speed: 'fast', // 'cozy' | 'fast' | 'super'
    },
  };
}

export class SaveManager {
  constructor(storage = null) {
    this.storage = storage ?? (typeof window !== 'undefined' && window.localStorage ? window.localStorage : null);
    this.memoryFallback = null;
    this.state = this.load();
  }

  load() {
    const defaults = createDefaultSave();
    try {
      const raw = this.storage ? this.storage.getItem(STORAGE_KEY) : this.memoryFallback;
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return {
        ...defaults,
        ...parsed,
        character: { ...defaults.character, ...(parsed.character || {}) },
        settings: { ...defaults.settings, ...(parsed.settings || {}) },
        unlockedItems: Array.isArray(parsed.unlockedItems) ? parsed.unlockedItems : [],
        discoveredCreatures: Array.isArray(parsed.discoveredCreatures) ? parsed.discoveredCreatures : [],
        completedWorlds: Array.isArray(parsed.completedWorlds) ? parsed.completedWorlds : [],
      };
    } catch {
      return defaults;
    }
  }

  save() {
    try {
      const serialized = JSON.stringify(this.state);
      if (this.storage) {
        this.storage.setItem(STORAGE_KEY, serialized);
      } else {
        this.memoryFallback = serialized;
      }
      return true;
    } catch {
      return false;
    }
  }

  updateCharacter(patch) {
    this.state.character = { ...this.state.character, ...patch };
    this.save();
  }

  unlockItem(itemId) {
    if (!this.state.unlockedItems.includes(itemId)) {
      this.state.unlockedItems.push(itemId);
      this.save();
      return true;
    }
    return false;
  }

  discoverCreature(creatureId) {
    if (!this.state.discoveredCreatures.includes(creatureId)) {
      this.state.discoveredCreatures.push(creatureId);
      this.save();
      return true;
    }
    return false;
  }

  completeWorld(worldId, starsEarned = 0, gemsEarned = 0) {
    if (!this.state.completedWorlds.includes(worldId)) {
      this.state.completedWorlds.push(worldId);
    }
    this.state.totalStars += starsEarned;
    this.state.totalGems += gemsEarned;
    this.save();
  }

  addCollectibles(stars = 0, gems = 0) {
    this.state.totalStars += stars;
    this.state.totalGems += gems;
    this.save();
  }

  incrementGiraffesFed() {
    this.state.giraffesFed += 1;
    this.save();
  }

  updateSettings(patch) {
    this.state.settings = { ...this.state.settings, ...patch };
    this.save();
  }

  setCurrentWorld(worldId) {
    this.state.currentWorldId = worldId;
    this.save();
  }

  reset() {
    this.state = createDefaultSave();
    this.save();
    return this.state;
  }
}
