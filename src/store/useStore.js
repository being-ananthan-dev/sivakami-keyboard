import { create } from 'zustand';

export const useStore = create((set) => ({
  volume: 0, // dB
  octave: 3,
  instrument: 'synth', // 'piano', 'synth', 'organ'
  sustain: false,
  scale: null, // e.g., 'C' for C Major
  transpose: 0, // semitones (-12 to +12)
  isAudioReady: false,

  setVolume: (vol) => set({ volume: vol }),
  setOctave: (oct) => set({ octave: Math.max(1, Math.min(6, oct)) }),
  setInstrument: (inst) => set({ instrument: inst }),
  setSustain: (sus) => set({ sustain: sus }),
  setScale: (scale) => set({ scale }),
  setTranspose: (trans) => set({ transpose: Math.max(-12, Math.min(12, trans)) }),
  setAudioReady: (ready) => set({ isAudioReady: ready }),
}));
