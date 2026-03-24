import * as Tone from 'tone';
import { createPiano, createSynth, createCinematicPad, createStrings } from './instruments';

class AudioEngine {
  constructor() {
    this.instruments = {};
    this.currentInstrument = null;
    this.masterVolume = new Tone.Volume(0).toDestination();
    
    // Global Cinematic FX chain
    this.reverb = new Tone.Reverb({
      decay: 4,
      preDelay: 0.1,
      wet: 0.3
    }).connect(this.masterVolume);
    
    this.delay = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.4,
      wet: 0.2
    }).connect(this.reverb);

    this.filter = new Tone.Filter(2000, "lowpass").connect(this.delay);
    
    this.initialized = false;
    this.activeNotes = new Set();
    this.sustainedNotes = new Set();
    
    // For visualization
    this.analyzer = new Tone.Analyser("waveform", 256);
    this.masterVolume.connect(this.analyzer);
  }

  async init(onReady) {
    if (this.initialized) return;
    await Tone.start();
    Tone.context.lookAhead = 0.05;
    
    await this.reverb.ready;

    this.instruments['synth'] = createSynth().connect(this.filter);
    this.instruments['piano'] = createPiano(() => {
      console.log('Piano samples loaded');
    }).connect(this.filter);
    this.instruments['pad'] = createCinematicPad().connect(this.filter);
    this.instruments['strings'] = createStrings().connect(this.filter);

    this.currentInstrument = this.instruments['synth'];
    this.initialized = true;
    if (onReady) onReady();
  }

  setInstrument(name) {
    if (this.instruments[name]) {
      this.currentInstrument = this.instruments[name];
    }
  }

  setVolume(db) {
    this.masterVolume.volume.rampTo(db, 0.1);
  }

  setFilterFreq(freq) {
    this.filter.frequency.rampTo(freq, 0.1);
  }

  setReverbWet(wet) {
    this.reverb.wet.rampTo(wet, 0.1);
  }

  playNote(note, velocity = 0.8) {
    if (!this.initialized || !this.currentInstrument) return;
    
    const finalVelocity = this.currentInstrument instanceof Tone.Sampler ? velocity : velocity * 0.5;
    this.currentInstrument.triggerAttack(note, Tone.now(), finalVelocity);
    this.activeNotes.add(note);
    this.sustainedNotes.add(note);
  }

  stopNote(note, sustainEnabled) {
    if (!this.initialized || !this.currentInstrument) return;
    this.activeNotes.delete(note);
    
    if (!sustainEnabled) {
      this.currentInstrument.triggerRelease(note, Tone.now());
      this.sustainedNotes.delete(note);
    }
  }

  releaseSustain() {
    if (!this.initialized || !this.currentInstrument) return;
    
    const toRelease = [];
    this.sustainedNotes.forEach(note => {
      if (!this.activeNotes.has(note)) {
        toRelease.push(note);
        this.sustainedNotes.delete(note);
      }
    });
    
    if (toRelease.length > 0) {
      this.currentInstrument.triggerRelease(toRelease, Tone.now());
    }
  }
}

export const engine = new AudioEngine();
