import * as Tone from 'tone';

const PIANO_URLS = {
  "A0": "A0.mp3", "C1": "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3", "A1": "A1.mp3",
  "C2": "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3", "A2": "A2.mp3", "C3": "C3.mp3",
  "D#3": "Ds3.mp3", "F#3": "Fs3.mp3", "A3": "A3.mp3", "C4": "C4.mp3", "D#4": "Ds4.mp3",
  "F#4": "Fs4.mp3", "A4": "A4.mp3", "C5": "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
  "A5": "A5.mp3", "C6": "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3", "A6": "A6.mp3",
  "C7": "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3", "A7": "A7.mp3", "C8": "C8.mp3"
};

export const createPiano = (onLoad) => {
  return new Tone.Sampler({
    urls: PIANO_URLS,
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
    onload: onLoad,
  });
};

export const createSynth = () => {
  return new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "fatcustom",
      partials: [0.2, 1, 0, 0.5, 0.1],
      spread: 40,
      count: 3
    },
    envelope: {
      attack: 0.001,
      decay: 1.2,
      sustain: 0,
      release: 1.2
    }
  });
};

export const createOrgan = () => {
  return new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "square" },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 1,
      release: 0.5
    }
  });
};
