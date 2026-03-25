import * as Tone from 'tone';
import { createPiano, createSynth, createCinematicPad, createStrings } from './instruments';

// Maintenance: Force rebuild to resolve PWA caching/synchronization issues.

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
    
    // Modulation LFO
    this.lfo = new Tone.LFO("4n", 400, 4000).start();
    this.lfo.connect(this.filter.frequency);
    this.lfoStarted = false; // Manual state tracking

    // Arpeggiator
    this.arpActive = false;
    this.arpNotes = [];
    this.arpPattern = null;
    this.arpRate = "8n";

    // For visualization
    this.analyzer = new Tone.Analyser("waveform", 256);
    this.masterVolume.connect(this.analyzer);

    // MIDI Support
    this.midiAccess = null;
    this.midiHandlers = [];
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
    
    // Auto-init MIDI if supported
    this.initMIDI();

    if (onReady) onReady();
  }

  async initMIDI() {
    if (navigator.requestMIDIAccess) {
      try {
        this.midiAccess = await navigator.requestMIDIAccess();
        for (let input of this.midiAccess.inputs.values()) {
          input.onmidimessage = (msg) => this.handleMIDIMessage(msg);
        }
        return true;
      } catch (e) {
        console.warn("MIDI Access Denied", e);
        return false;
      }
    }
    return false;
  }

  handleMIDIMessage(msg) {
    const [status, noteNum, velocity] = msg.data;
    const type = status & 0xf0;
    const note = Tone.Frequency(noteNum, "midi").toNote();

    if (type === 144 && velocity > 0) { // Note On
      this.playNote(note, velocity / 127);
      this.midiHandlers.forEach(h => h('on', note));
    } else if (type === 128 || (type === 144 && velocity === 0)) { // Note Off
      this.stopNote(note, false); // MIDI usually handles its own sustain/release
      this.midiHandlers.forEach(h => h('off', note));
    }
  }

  onMIDIEvent(callback) {
    this.midiHandlers.push(callback);
  }

  setInstrument(name) {
    if (this.instruments[name]) {
      this.currentInstrument = this.instruments[name];
    }
  }

  setVolume(db) {
    this.masterVolume.volume.rampTo(db, 0.1);
  }

  setCutoff(freq) {
    this.filter.frequency.rampTo(freq, 0.1);
  }

  setReverbWet(wet) {
    this.reverb.wet.rampTo(wet, 0.1);
  }

  setEnvelope(attack, decay, sustain, release) {
    Object.values(this.instruments).forEach(inst => {
      if (inst.envelope) {
        inst.envelope.attack = attack;
        inst.envelope.decay = decay;
        inst.envelope.sustain = sustain;
        inst.envelope.release = release;
      }
    });
  }

  setArp(active, rate = "8n") {
    this.arpActive = active;
    this.arpRate = rate;
    this.updateArp();
  }

  setLFO(active, rate = "4n", depth = 1000) {
    if (active) {
      this.lfo.frequency.value = rate;
      this.lfo.amplitude.value = depth / 2000; // Normalize
      if (!this.lfoStarted) {
        this.lfo.start();
        this.lfoStarted = true;
      }
    } else {
      this.lfo.stop();
      this.lfoStarted = false;
      this.filter.frequency.value = 2000; // Reset
    }
  }

  updateArp() {
    if (this.arpPattern) {
      this.arpPattern.dispose();
      this.arpPattern = null;
    }

    if (this.arpActive && this.arpNotes.length > 0) {
      this.arpPattern = new Tone.Pattern((time, note) => {
        if (this.currentInstrument) {
          this.currentInstrument.triggerAttackRelease(note, "16n", time);
        }
      }, this.arpNotes, "up");
      this.arpPattern.interval = this.arpRate;
      this.arpPattern.start(0);
    }
  }

  playNote(note, velocity = 0.8) {
    if (!this.initialized || !this.currentInstrument) return;
    
    if (this.arpActive) {
      if (!this.arpNotes.includes(note)) {
        this.arpNotes.push(note);
        this.arpNotes.sort(); // Sort for predictable patterns
        this.updateArp();
      }
    } else {
      const finalVelocity = this.currentInstrument instanceof Tone.Sampler ? velocity : velocity * 0.5;
      this.currentInstrument.triggerAttack(note, Tone.now(), finalVelocity);
    }
    
    this.activeNotes.add(note);
    this.sustainedNotes.add(note);
  }

  stopNote(note, sustainEnabled) {
    if (!this.initialized || !this.currentInstrument) return;
    this.activeNotes.delete(note);
    
    if (this.arpActive) {
      this.arpNotes = this.arpNotes.filter(n => n !== note);
      this.updateArp();
    }

    if (!sustainEnabled) {
      if (!this.arpActive) {
        this.currentInstrument.triggerRelease(note, Tone.now());
      }
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
