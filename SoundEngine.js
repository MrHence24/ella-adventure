export class SoundEngine {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.ctx = null;
    this.masterGain = null;
    this.musicTimer = null;
    this.currentWorldMusic = null;
    this.stepIndex = 0;
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.applyVolume();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  applyVolume() {
    if (!this.masterGain || !this.ctx) return;
    const { muted, volume } = this.saveManager.state.settings;
    const target = muted ? 0 : Math.max(0, Math.min(1, volume)) * 0.45;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.02);
  }

  playTone(freq, duration = 0.14, type = 'sine', slideTo = null, delay = 0, gainVal = 0.25) {
    if (this.saveManager.state.settings.muted) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
    }

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(gainVal, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  playClick() {
    this.playTone(540, 0.07, 'triangle', 720, 0, 0.2);
  }

  playOutfitChange() {
    this.playTone(523.25, 0.09, 'sine', null, 0, 0.2);
    this.playTone(659.25, 0.09, 'sine', null, 0.06, 0.2);
    this.playTone(783.99, 0.14, 'triangle', null, 0.12, 0.22);
  }

  playJump(isDouble = false) {
    if (isDouble) {
      this.playTone(480, 0.16, 'triangle', 920, 0, 0.25);
    } else {
      this.playTone(330, 0.15, 'sine', 660, 0, 0.25);
    }
  }

  playSlide() {
    this.playTone(360, 0.12, 'triangle', 190, 0, 0.18);
  }

  playStar() {
    this.playTone(880, 0.09, 'sine', null, 0, 0.22);
    this.playTone(1174.66, 0.13, 'sine', null, 0.05, 0.22);
  }

  playGem() {
    this.playTone(783.99, 0.08, 'triangle', null, 0, 0.24);
    this.playTone(1046.5, 0.08, 'triangle', null, 0.05, 0.24);
    this.playTone(1318.51, 0.16, 'sine', null, 0.1, 0.24);
  }

  playBoost() {
    this.playTone(440, 0.1, 'sawtooth', 880, 0, 0.12);
    this.playTone(660, 0.15, 'triangle', 1320, 0.06, 0.18);
  }

  playBoing() {
    this.playTone(220, 0.16, 'sine', 150, 0, 0.22);
    this.playTone(180, 0.14, 'triangle', 260, 0.08, 0.16);
  }

  playCheckpoint() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this.playTone(f, 0.14, 'triangle', null, i * 0.07, 0.22);
    });
  }

  playCreatureDiscover() {
    const notes = [587.33, 739.99, 880, 1174.66];
    notes.forEach((f, i) => {
      this.playTone(f, 0.18, 'sine', null, i * 0.08, 0.25);
    });
  }

  playGiraffeFeed() {
    // Gentle cheerful munch + happy chime
    this.playTone(320, 0.09, 'triangle', 260, 0, 0.22);
    this.playTone(340, 0.09, 'triangle', 280, 0.14, 0.22);
    this.playTone(523.25, 0.14, 'sine', 659.25, 0.3, 0.24);
    this.playTone(783.99, 0.22, 'sine', 1046.5, 0.42, 0.24);
  }

  playLevelComplete() {
    const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const times = [0, 0.1, 0.2, 0.32, 0.46, 0.58];
    melody.forEach((f, i) => {
      this.playTone(f, 0.22, 'triangle', null, times[i], 0.25);
    });
  }

  startMusic(worldKey = 'meadow') {
    this.stopMusic();
    this.currentWorldMusic = worldKey;
    const patterns = {
      meadow: [523.25, 659.25, 783.99, 659.25, 587.33, 659.25, 523.25, 392.0],
      safari: [440.0, 523.25, 659.25, 523.25, 587.33, 523.25, 440.0, 329.63],
      crystal: [659.25, 783.99, 987.77, 783.99, 739.99, 783.99, 659.25, 493.88],
      sky: [587.33, 739.99, 880.0, 739.99, 659.25, 739.99, 880.0, 1174.66],
    };
    const seq = patterns[worldKey] || patterns.meadow;
    this.stepIndex = 0;

    this.musicTimer = setInterval(() => {
      if (this.saveManager.state.settings.muted) return;
      if (typeof document !== 'undefined' && document.hidden) return;
      const note = seq[this.stepIndex % seq.length];
      this.playTone(note, 0.22, 'sine', null, 0, 0.08);
      if (this.stepIndex % 2 === 0) {
        this.playTone(note / 2, 0.28, 'triangle', null, 0, 0.06);
      }
      this.stepIndex += 1;
    }, 320);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  speakHint(text) {
    if (this.saveManager.state.settings.muted || !this.saveManager.state.settings.voiceHints) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.02;
      utter.pitch = 1.2;
      utter.volume = Math.min(1, this.saveManager.state.settings.volume);
      window.speechSynthesis.speak(utter);
    } catch {
      // Ignore speech synthesis errors on unsupported browsers
    }
  }
}
