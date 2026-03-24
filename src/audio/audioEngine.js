import * as Tone from 'tone';
import { createPiano, createSynth, createOrgan } from './instruments';

class AudioEngine {
  constructor() {
    this.instruments = {};
    this.currentInstrument = null;
    this.masterVolume = new Tone.Volume(0).toDestination();
    this.initialized = false;
    this.activeNotes = new Set();
    this.sustainedNotes = new Set();
  }

  async init(onReady) {
    if (this.initialized) return;
    await Tone.start();
    Tone.context.lookAhead = 0.05; // Minimize latency
    
    this.instruments['synth'] = createSynth().connect(this.masterVolume);
    this.instruments['organ'] = createOrgan().connect(this.masterVolume);
    this.instruments['piano'] = createPiano(() => {
      console.log('Piano samples loaded');
    }).connect(this.masterVolume);

    this.currentInstrument = this.instruments['synth']; // Default
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

  playNote(note) {
    if (!this.initialized || !this.currentInstrument) return;
    
    // Velocity simulation
    const velocity = this.currentInstrument instanceof Tone.Sampler ? 0.7 + Math.random() * 0.3 : 1;
    this.currentInstrument.triggerAttack(note, Tone.now(), velocity);
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
    
    // Release all notes that are currently sustained but not physically held down
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
