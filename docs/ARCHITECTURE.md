# Architecture — Ella's Adventure

## Module Separation
- `src/main.js`: Application lifecycle, screen routing (`customize` vs `game`), modal management, and `requestAnimationFrame` loop.
- `src/storage/SaveManager.js`: `localStorage` persistence (`ellas_adventure_save_v1`) with safe in-memory fallback for tests.
- `src/customization/`: `catalog.js` (data), `CharacterRenderer.js` (2D Canvas vector character), `CustomizationUI.js` (wardrobe UI).
- `src/game/`: `LevelGenerator.js` (deterministic world layouts), `GameEngine.js` (physics, collisions, giraffe feeding, creature discovery), `GameRenderer.js` (parallax backgrounds, entities, particles).
- `src/creatures/`: `creaturesData.js`, `CreatureRenderer.js` (creatures & giraffes), `CreatureBookUI.js`.
- `src/audio/SoundEngine.js`: Web Audio API synthesizer for SFX & looping world melodies, plus Web Speech API voice hints.
