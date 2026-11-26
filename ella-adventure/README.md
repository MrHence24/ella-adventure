# Ella's Adventure

A fast-paced, colorful, child-friendly browser running & dress-up adventure game built with HTML5 Canvas, CSS3, ES Modules, and Web Audio API.

## Features

- **Dress-Up First**: Starts directly on the Character Customization screen with a large animated character preview (Idle & Run poses), mix-and-match outfits across 5 categories (Princess, Everyday, Superhero, Adventure, Special), hairstyles, colors, shoes, hats, and accessories.
- **4 Distinct Worlds**:
  1. **Colorful Meadow** — Bright blue skies, rolling hills, flowers, and gentle obstacles.
  2. **Giraffe Safari** — Expressive long-necked giraffes you can stop and feed for joyful animations and special unlocks.
  3. **Crystal Adventure** — Glowing caverns, secret upper ledges, and sparkling gems.
  4. **Sky Adventure** — Floating islands, fluffy clouds, and rainbow bridges.
- **12 Original Collectible Creatures**: Discover original creatures while running and view them anytime in the **Creature Book**.
- **Child-Friendly & Forgiving**: Unlimited retries, no punishing Game Over, double-jump + coyote time, speed selector (Cozy / Fast / Super), and optional Web Speech voice hints.
- **100% Original Audio & Visuals**: Synthesized Web Audio sound effects and world melodies with volume & mute controls, plus procedural Canvas vector art.
- **Offline Local Persistence**: Automatically saves outfits, unlocked items, discovered creatures, completed worlds, and settings in `localStorage`.

## Technology Stack

- **HTML5 Canvas** (2D rendering & animations)
- **CSS3** (Responsive mobile/tablet/desktop layout)
- **Vanilla JavaScript (ES Modules)**
- **Web Audio API & Web Speech API**
- **Vite** (Development server & production bundler)
- **Node.js Test Runner** (`node --test`)

## Installation & Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Run unit tests
npm test

# 4. Build for production
npm run build

# 5. Preview the production build locally
npm run preview
```

## Controls

- **Desktop**: `Space` / `↑` / `W` to Jump (press again in mid-air to Double Jump), `↓` / `S` to Slide, `E` / `F` / `Space` to Feed Giraffes, `Esc` to Pause.
- **Mobile / Touch**: Large on-screen **JUMP!** and **SLIDE** buttons, tap anywhere on the canvas to jump, and tap the **Feed Giraffe!** button when visiting a giraffe.

## Deployment to GitHub Pages

This repository includes `.github/workflows/deploy.yml` and `vite.config.js` (`base: './'`) for automatic GitHub Pages deployment:

1. Push the repository to GitHub on the `main` branch.
2. In your GitHub repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Every push to `main` automatically runs tests, builds `dist/`, and publishes to GitHub Pages.

## Project Structure

```text
ella-adventure/
├── .github/workflows/deploy.yml
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ASSET_CREDITS.md
│   ├── DEVELOPMENT.md
│   └── GAME_DESIGN.md
├── public/assets/
├── src/
│   ├── audio/SoundEngine.js
│   ├── creatures/
│   │   ├── CreatureBookUI.js
│   │   ├── CreatureRenderer.js
│   │   └── creaturesData.js
│   ├── customization/
│   │   ├── CharacterRenderer.js
│   │   ├── CustomizationUI.js
│   │   └── catalog.js
│   ├── game/
│   │   ├── GameEngine.js
│   │   ├── GameRenderer.js
│   │   └── LevelGenerator.js
│   ├── storage/SaveManager.js
│   ├── styles/main.css
│   ├── worlds/
│   │   ├── WorldMapUI.js
│   │   └── worldsData.js
│   └── main.js
├── tests/gameLogic.test.js
├── index.html
├── package.json
├── vite.config.js
├── LICENSE
└── README.md
```

## Credits

All character designs, creatures, world art, sound effects, and music in **Ella's Adventure** are 100% original procedural creations. See [`docs/ASSET_CREDITS.md`](docs/ASSET_CREDITS.md) for details.
