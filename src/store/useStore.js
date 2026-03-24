import { create } from 'zustand';

export const useStore = create((set) => ({
  volume: 0, 
  octave: 3,
  instrument: 'synth', 
  sustain: false,
  scale: null, 
  transpose: 0, 
  isAudioReady: false,
  
  // Cinematic FX state
  cutoff: 2000,
  reverbWet: 0.3,

  setVolume: (vol) => set({ volume: vol }),
  setOctave: (oct) => set({ octave: Math.max(1, Math.min(6, oct)) }),
  setInstrument: (inst) => set({ instrument: inst }),
  setSustain: (sus) => set({ sustain: sus }),
  setScale: (scale) => set({ scale }),
  setTranspose: (trans) => set({ transpose: Math.max(-12, Math.min(12, trans)) }),
  setAudioReady: (ready) => set({ isAudioReady: ready }),
  
  setCutoff: (cutoff) => set({ cutoff }),
  setReverbWet: (reverbWet) => set({ reverbWet }),
}));
