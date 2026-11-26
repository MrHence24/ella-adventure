export const CREATURES = [
  // World 1: Colorful Meadow
  {
    id: 'bramblebun',
    name: 'Bramblebun',
    worldId: 'meadow',
    type: 'bunny',
    primary: '#4fc3f7',
    secondary: '#e1f5fe',
    accent: '#ff80ab',
    personality: 'Bouncy & Sweet',
    description: 'A blueberry-colored meadow hopper who loves racing butterflies.',
  },
  {
    id: 'petalpuff',
    name: 'Petalpuff',
    worldId: 'meadow',
    type: 'sprite',
    primary: '#f48fb1',
    secondary: '#fff59d',
    accent: '#81c784',
    personality: 'Cheerful & Shy',
    description: 'A flower-eared sprite that giggles whenever flowers bloom.',
  },
  {
    id: 'sunpip',
    name: 'Sunpip',
    worldId: 'meadow',
    type: 'bird',
    primary: '#ffd54f',
    secondary: '#fff9c4',
    accent: '#ff7043',
    personality: 'Musical',
    description: 'A tiny golden songbird that chirps happy tunes as you run by.',
  },

  // World 2: Giraffe Safari
  {
    id: 'twiggy',
    name: 'Twiggy',
    worldId: 'safari',
    type: 'giraffe_calf',
    primary: '#ffca28',
    secondary: '#8d6e63',
    accent: '#fff8e1',
    personality: 'Curious & Gentle',
    description: 'A baby giraffe with a long wiggly neck who adores crunchy green leaves!',
  },
  {
    id: 'savannahop',
    name: 'Savannahop',
    worldId: 'safari',
    type: 'gazelle',
    primary: '#ffb74d',
    secondary: '#ffe0b2',
    accent: '#29b6f6',
    personality: 'Super Fast',
    description: 'A speedy spotted hopper that loves friendly races across the savanna.',
  },
  {
    id: 'acaciawing',
    name: 'Acaciawing',
    worldId: 'safari',
    type: 'bird',
    primary: '#26c6da',
    secondary: '#b2ebf2',
    accent: '#ffd54f',
    personality: 'Friendly Guide',
    description: 'A turquoise safari bird that perches near tall giraffe trees.',
  },

  // World 3: Crystal Adventure
  {
    id: 'glimmerfox',
    name: 'Glimmerfox',
    worldId: 'crystal',
    type: 'fox',
    primary: '#29b6f6',
    secondary: '#e0f7fa',
    accent: '#e040fb',
    personality: 'Sparkly & Brave',
    description: 'An azure crystal kit whose tail glows like a lantern in dark caves.',
  },
  {
    id: 'sparklebat',
    name: 'Sparklebat',
    worldId: 'crystal',
    type: 'bat',
    primary: '#ce93d8',
    secondary: '#f3e5f5',
    accent: '#4fc3f7',
    personality: 'Playful',
    description: 'A friendly lavender cave flyer who collects shiny gems.',
  },
  {
    id: 'dewdrop',
    name: 'Dewdrop',
    worldId: 'crystal',
    type: 'slime',
    primary: '#80deea',
    secondary: '#ffffff',
    accent: '#f06292',
    personality: 'Squishy & Happy',
    description: 'A bouncy crystal pearl that jiggles like jelly when it says hello!',
  },

  // World 4: Sky Adventure
  {
    id: 'cloudpuff',
    name: 'Cloudpuff',
    worldId: 'sky',
    type: 'cloud',
    primary: '#ffffff',
    secondary: '#b3e5fc',
    accent: '#ff80ab',
    personality: 'Dreamy',
    description: 'A smiling cotton-candy cloudling that floats beside rainbow bridges.',
  },
  {
    id: 'prismapup',
    name: 'Prismapup',
    worldId: 'sky',
    type: 'fox',
    primary: '#42a5f5',
    secondary: '#ff80ab',
    accent: '#ffd54f',
    personality: 'Energetic',
    description: 'A sky-blue pup with a rainbow-tipped tail who loves high jumps!',
  },
  {
    id: 'starwing',
    name: 'Starwing',
    worldId: 'sky',
    type: 'owl',
    primary: '#7e57c2',
    secondary: '#d1c4e9',
    accent: '#ffd54f',
    personality: 'Wise & Kind',
    description: 'A tiny star-crowned owl that watches over floating islands.',
  },
];

export function getCreaturesByWorld(worldId) {
  return CREATURES.filter((c) => c.worldId === worldId);
}

export function getCreatureById(id) {
  return CREATURES.find((c) => c.id === id) || null;
}
