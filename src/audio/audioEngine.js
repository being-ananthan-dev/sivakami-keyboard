import * as Tone from 'tone';

class AudioEngine {
  constructor() {
    this.initialized = false;
    this.synth = null;
    this.sampler = null;
    this.pad = null;
    this.strings = null;
    this.currentInstrument = null;
    this.masterVol = null;
    this.reverb = null;
    this.delay = null;
    this.filter = null;
    this.analyzer = null;
    this.activeNotes = new Set();
    this.sustainedNotes = new Set();
  }

  async init() {
    if (this.initialized) return;
    await Tone.start();

    this.masterVol = new Tone.Volume(0).toDestination();
    this.analyzer = new Tone.Analyser('waveform', 256);
    this.masterVol.connect(this.analyzer);

    this.reverb = new Tone.Reverb({ decay: 3, wet: 0.3 }).connect(this.masterVol);
    await this.reverb.ready;

    this.delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.3, wet: 0.15 }).connect(this.reverb);
    this.filter = new Tone.Filter({ frequency: 5000, type: 'lowpass' }).connect(this.delay);

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'fatsawtooth', spread: 30, count: 3 },
      envelope: { attack: 0.01, decay: 0.5, sustain: 0.4, release: 1 }
    }).connect(this.filter);

    this.pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 1.5, decay: 1, sustain: 0.8, release: 3 }
    }).connect(this.filter);

    this.strings = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.4, decay: 0.3, sustain: 0.7, release: 1.5 }
    }).connect(this.filter);

    this.sampler = new Tone.Sampler({
      urls: {
        A0: 'A0.mp3', C1: 'C1.mp3', 'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3', A1: 'A1.mp3',
        C2: 'C2.mp3', 'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3', A2: 'A2.mp3', C3: 'C3.mp3',
        'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3', A3: 'A3.mp3', C4: 'C4.mp3', 'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3', A4: 'A4.mp3', C5: 'C5.mp3', 'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
        A5: 'A5.mp3', C6: 'C6.mp3', 'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3', A6: 'A6.mp3',
        C7: 'C7.mp3', 'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3', A7: 'A7.mp3', C8: 'C8.mp3'
      },
      release: 1.5,
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
    }).connect(this.filter);

    this.currentInstrument = this.synth;
    this.initialized = true;
  }

  getInstrument(name) {
    const map = { synth: this.synth, piano: this.sampler, pad: this.pad, strings: this.strings };
    return map[name] || this.synth;
  }

  setInstrument(name) { this.currentInstrument = this.getInstrument(name); }

  setVolume(v) { if (this.masterVol) this.masterVol.volume.value = v; }
  setCutoff(f) { if (this.filter) this.filter.frequency.value = f; }
  setReverb(w) { if (this.reverb) this.reverb.wet.value = w; }

  playNote(note, velocity = 0.8) {
    if (!this.initialized || !this.currentInstrument) return;
    try {
      const v = this.currentInstrument === this.sampler ? velocity : velocity * 0.5;
      this.currentInstrument.triggerAttack(note, Tone.now(), v);
      this.activeNotes.add(note);
      this.sustainedNotes.add(note);
    } catch (e) { console.warn('playNote error', e.message); }
  }

  stopNote(note, sustainOn) {
    if (!this.initialized || !this.currentInstrument) return;
    this.activeNotes.delete(note);
    if (!sustainOn) {
      try { this.currentInstrument.triggerRelease(note, Tone.now()); } catch (e) {}
      this.sustainedNotes.delete(note);
    }
  }

  releaseSustain() {
    if (!this.initialized || !this.currentInstrument) return;
    const toRelease = [];
    this.sustainedNotes.forEach(n => {
      if (!this.activeNotes.has(n)) { toRelease.push(n); this.sustainedNotes.delete(n); }
    });
    if (toRelease.length) {
      try { this.currentInstrument.triggerRelease(toRelease, Tone.now()); } catch (e) {}
    }
  }
}

export const engine = new AudioEngine();
