export const WARDROBE_TABS = [
  { id: 'color', label: 'Color', icon: '🎨' },
  { id: 'hair', label: 'Hair', icon: '💇‍♀️' },
  { id: 'dress', label: 'Outfits', icon: '👗' },
  { id: 'top', label: 'Tops', icon: '👕' },
  { id: 'bottom', label: 'Bottoms', icon: '👖' },
  { id: 'shoes', label: 'Shoes', icon: '👟' },
  { id: 'hat', label: 'Hats', icon: '👑' },
  { id: 'accessory', label: 'Extras', icon: '✨' },
];

export const OUTFIT_CATEGORIES = [
  { id: 'all', label: 'All', icon: '🌈' },
  { id: 'princess', label: 'Princess', icon: '👑' },
  { id: 'everyday', label: 'Everyday', icon: '☀️' },
  { id: 'superhero', label: 'Hero', icon: '⚡' },
  { id: 'adventure', label: 'Adventure', icon: '🧭' },
  { id: 'special', label: 'Special', icon: '🎁' },
];

export const BODY_COLORS = [
  { id: '#4fc3f7', name: 'Sky Blue', hex: '#4fc3f7' },
  { id: '#1e88e5', name: 'Ocean Blue', hex: '#1e88e5' },
  { id: '#f48fb1', name: 'Berry Pink', hex: '#f48fb1' },
  { id: '#ce93d8', name: 'Lavender', hex: '#ce93d8' },
  { id: '#ffcc80', name: 'Sunny Peach', hex: '#ffcc80' },
  { id: '#80cbc4', name: 'Minty Teal', hex: '#80cbc4' },
  { id: '#fff176', name: 'Starlight Gold', hex: '#fff176' },
  { id: '#ffab91', name: 'Coral Glow', hex: '#ffab91' },
];

export const HAIR_COLORS = [
  { id: '#1976d2', name: 'Cobalt Blue', hex: '#1976d2' },
  { id: '#ec407a', name: 'Bubblegum Pink', hex: '#ec407a' },
  { id: '#26c6da', name: 'Aqua Pop', hex: '#26c6da' },
  { id: '#fdd835', name: 'Golden Blonde', hex: '#fdd835' },
  { id: '#6d4c41', name: 'Cocoa Brown', hex: '#6d4c41' },
  { id: '#263238', name: 'Midnight', hex: '#263238' },
  { id: '#ab47bc', name: 'Grape Magic', hex: '#ab47bc' },
];

export const HAIR_STYLES = [
  { id: 'twintails', name: 'Twin Tails', icon: '🎀', unlockedByDefault: true },
  { id: 'waves', name: 'Flowing Waves', icon: '🌊', unlockedByDefault: true },
  { id: 'bob', name: 'Starry Bob', icon: '⭐', unlockedByDefault: true },
  { id: 'ponytail', name: 'Speed Ponytail', icon: '⚡', unlockedByDefault: true },
  { id: 'puffs', name: 'Fluffy Puffs', icon: '☁️', unlockedByDefault: true },
  { id: 'braid', name: 'Crown Braid', icon: '👑', unlockedByDefault: true },
];

export const DRESSES = [
  {
    id: 'dress_sky_hero',
    name: 'Sky Bolt Suit',
    category: 'superhero',
    primary: '#1e88e5',
    secondary: '#ffd54f',
    accent: '#ffffff',
    style: 'hero',
    icon: '⚡',
    unlockedByDefault: true,
  },
  {
    id: 'dress_ocean_princess',
    name: 'Ocean Princess',
    category: 'princess',
    primary: '#29b6f6',
    secondary: '#e1f5fe',
    accent: '#ffd54f',
    style: 'gown',
    icon: '👸',
    unlockedByDefault: true,
  },
  {
    id: 'dress_rose_tutu',
    name: 'Rose Sparkle Tutu',
    category: 'princess',
    primary: '#ec407a',
    secondary: '#f8bbd0',
    accent: '#ffffff',
    style: 'tutu',
    icon: '🌸',
    unlockedByDefault: true,
  },
  {
    id: 'dress_safari_romper',
    name: 'Safari Explorer',
    category: 'adventure',
    primary: '#aed581',
    secondary: '#fff59d',
    accent: '#8d6e63',
    style: 'romper',
    icon: '🧭',
    unlockedByDefault: true,
  },
  {
    id: 'dress_rainbow_dash',
    name: 'Rainbow Starlight',
    category: 'superhero',
    primary: '#7e57c2',
    secondary: '#4fc3f7',
    accent: '#ff80ab',
    style: 'hero',
    icon: '🌟',
    unlockedByDefault: true,
  },
  {
    id: 'dress_cozy_sundress',
    name: 'Bluebell Sundress',
    category: 'everyday',
    primary: '#42a5f5',
    secondary: '#ffffff',
    accent: '#ffca28',
    style: 'sundress',
    icon: '🌼',
    unlockedByDefault: true,
  },
  // Special Unlockable Outfits
  {
    id: 'dress_giraffe_onesie',
    name: 'Giraffe Spot Suit',
    category: 'special',
    primary: '#ffca28',
    secondary: '#8d6e63',
    accent: '#fff8e1',
    style: 'giraffe',
    icon: '🦒',
    unlockedByDefault: false,
    unlockHint: 'Feed a Giraffe in World 2!',
  },
  {
    id: 'dress_crystal_princess',
    name: 'Crystal Queen Gown',
    category: 'special',
    primary: '#00bcd4',
    secondary: '#e040fb',
    accent: '#e0f7fa',
    style: 'gown',
    icon: '💎',
    unlockedByDefault: false,
    unlockHint: 'Finish World 3: Crystal Adventure!',
  },
  {
    id: 'dress_sky_champion',
    name: 'Rainbow Sky Suit',
    category: 'special',
    primary: '#1e88e5',
    secondary: '#ff80ab',
    accent: '#ffd54f',
    style: 'hero',
    icon: '🌈',
    unlockedByDefault: false,
    unlockHint: 'Finish World 4: Sky Adventure!',
  },
  {
    id: 'dress_meadow_bloom',
    name: 'Meadow Flower Dress',
    category: 'special',
    primary: '#66bb6a',
    secondary: '#f48fb1',
    accent: '#fff59d',
    style: 'tutu',
    icon: '🌺',
    unlockedByDefault: false,
    unlockHint: 'Finish World 1: Colorful Meadow!',
  },
];

export const TOPS = [
  {
    id: 'top_blue_hoodie',
    name: 'Blue Speed Hoodie',
    category: 'everyday',
    primary: '#1e88e5',
    secondary: '#90caf9',
    icon: '🧥',
    unlockedByDefault: true,
  },
  {
    id: 'top_pink_heart',
    name: 'Pink Heart Tee',
    category: 'everyday',
    primary: '#ec407a',
    secondary: '#ffffff',
    icon: '💖',
    unlockedByDefault: true,
  },
  {
    id: 'top_safari_vest',
    name: 'Explorer Vest',
    category: 'adventure',
    primary: '#d7ccc8',
    secondary: '#8bc34a',
    icon: '🦺',
    unlockedByDefault: true,
  },
  {
    id: 'top_hero_jacket',
    name: 'Starlight Jacket',
    category: 'superhero',
    primary: '#3949ab',
    secondary: '#ffd54f',
    icon: '🌟',
    unlockedByDefault: true,
  },
  {
    id: 'top_princess_blouse',
    name: 'Royal Puff Top',
    category: 'princess',
    primary: '#80deea',
    secondary: '#ffffff',
    icon: '🎀',
    unlockedByDefault: true,
  },
];

export const BOTTOMS = [
  {
    id: 'bottom_denim_skirt',
    name: 'Blue Skater Skirt',
    category: 'everyday',
    primary: '#1565c0',
    secondary: '#64b5f6',
    style: 'skirt',
    icon: '👗',
    unlockedByDefault: true,
  },
  {
    id: 'bottom_pink_tutu',
    name: 'Fluffy Pink Skirt',
    category: 'princess',
    primary: '#f06292',
    secondary: '#fce4ec',
    style: 'skirt',
    icon: '🩰',
    unlockedByDefault: true,
  },
  {
    id: 'bottom_speed_shorts',
    name: 'Turbo Shorts',
    category: 'superhero',
    primary: '#0288d1',
    secondary: '#ffd54f',
    style: 'shorts',
    icon: '🩳',
    unlockedByDefault: true,
  },
  {
    id: 'bottom_safari_pants',
    name: 'Adventure Cargo',
    category: 'adventure',
    primary: '#8d6e63',
    secondary: '#d7ccc8',
    style: 'pants',
    icon: '👖',
    unlockedByDefault: true,
  },
  {
    id: 'bottom_star_leggings',
    name: 'Starry Leggings',
    category: 'everyday',
    primary: '#5c6bc0',
    secondary: '#fff176',
    style: 'pants',
    icon: '✨',
    unlockedByDefault: true,
  },
];

export const SHOES = [
  {
    id: 'shoes_blue_speed',
    name: 'Blue Turbo Sneakers',
    primary: '#1e88e5',
    secondary: '#ffffff',
    accent: '#ffd54f',
    icon: '👟',
    unlockedByDefault: true,
  },
  {
    id: 'shoes_pink_boots',
    name: 'Pink Sparkle Boots',
    primary: '#ec407a',
    secondary: '#f8bbd0',
    accent: '#ffffff',
    icon: '🥾',
    unlockedByDefault: true,
  },
  {
    id: 'shoes_glass_slippers',
    name: 'Ice Crystal Shoes',
    primary: '#80deea',
    secondary: '#e0f7fa',
    accent: '#ffffff',
    icon: '👠',
    unlockedByDefault: true,
  },
  {
    id: 'shoes_safari_boots',
    name: 'Trail Boots',
    primary: '#795548',
    secondary: '#aed581',
    accent: '#ffd54f',
    icon: '🥾',
    unlockedByDefault: true,
  },
  {
    id: 'shoes_cloud_wings',
    name: 'Cloud Wing Kicks',
    primary: '#4fc3f7',
    secondary: '#ffffff',
    accent: '#ff80ab',
    icon: '🪽',
    unlockedByDefault: false,
    unlockHint: 'Discover 6 creatures in your Creature Book!',
  },
];

export const HATS = [
  { id: 'hat_none', name: 'No Hat', icon: '🚫', unlockedByDefault: true },
  { id: 'hat_blue_bow', name: 'Big Blue Bow', primary: '#1e88e5', secondary: '#90caf9', icon: '🎀', unlockedByDefault: true },
  { id: 'hat_pink_hearts', name: 'Pink Heart Band', primary: '#ec407a', secondary: '#f8bbd0', icon: '💕', unlockedByDefault: true },
  { id: 'hat_tiara', name: 'Princess Tiara', primary: '#ffd54f', secondary: '#4fc3f7', icon: '👑', unlockedByDefault: true },
  { id: 'hat_safari', name: 'Safari Sun Hat', primary: '#d7ccc8', secondary: '#8bc34a', icon: '👒', unlockedByDefault: true },
  { id: 'hat_giraffe_ears', name: 'Giraffe Headband', primary: '#ffca28', secondary: '#8d6e63', icon: '🦒', unlockedByDefault: false, unlockHint: 'Feed 2 Giraffes in World 2!' },
];

export const ACCESSORIES = [
  { id: 'acc_none', name: 'None', icon: '🚫', unlockedByDefault: true },
  { id: 'acc_star_pack', name: 'Star Backpack', primary: '#ffd54f', secondary: '#1e88e5', icon: '🎒', unlockedByDefault: true },
  { id: 'acc_hero_cape', name: 'Hero Cape', primary: '#29b6f6', secondary: '#ffd54f', icon: '🦸‍♀️', unlockedByDefault: true },
  { id: 'acc_butterfly_wings', name: 'Sparkle Wings', primary: '#f48fb1', secondary: '#81d4fa', icon: '🦋', unlockedByDefault: true },
  { id: 'acc_rainbow_scarf', name: 'Rainbow Scarf', primary: '#ff80ab', secondary: '#4fc3f7', icon: '🧣', unlockedByDefault: true },
  { id: 'acc_heart_shades', name: 'Cool Shades', primary: '#ec407a', secondary: '#ffffff', icon: '🕶️', unlockedByDefault: true },
];

export function isItemUnlocked(item, unlockedIds = []) {
  if (!item) return false;
  return Boolean(item.unlockedByDefault || unlockedIds.includes(item.id));
}

export function findCatalogItem(type, id) {
  const map = {
    dress: DRESSES,
    top: TOPS,
    bottom: BOTTOMS,
    shoes: SHOES,
    hat: HATS,
    accessory: ACCESSORIES,
    hair: HAIR_STYLES,
  };
  const list = map[type] || [];
  return list.find((item) => item.id === id) || list[0] || null;
}
