import { create } from 'zustand';

export const useStore = create((set) => ({
  volume: 0, 
  octave: 3,
  instrument: 'synth', 
  sustain: false,
  isAudioReady: false,
  
  // Cinematic FX state
  cutoff: 2000,
  reverbWet: 0.3,

  // Advanced synthesis
  arpActive: false,
  arpRate: "8n",
  lfoActive: false,
  lfoRate: "4n",
  lfoDepth: 1000,

  // Granular Synthesis (ADSR)
  attack: 0.1,
  decay: 0.2,
  sustainLevel: 0.8,
  release: 1.5,
  
  // Hardware
  midiConnected: false,

  setVolume: (vol) => set({ volume: vol }),
  setOctave: (oct) => set({ octave: Math.max(1, Math.min(6, oct)) }),
  setInstrument: (inst) => set({ instrument: inst }),
  setSustain: (sus) => set({ sustain: sus }),
  setAudioReady: (ready) => set({ isAudioReady: ready }),
  setCutoff: (cutoff) => set({ cutoff }),
  setReverbWet: (reverbWet) => set({ reverbWet }),

  setArpActive: (active) => set({ arpActive: active }),
  setArpRate: (rate) => set({ arpRate: rate }),
  setLFOActive: (active) => set({ lfoActive: active }),
  setLFORate: (rate) => set({ lfoRate: rate }),
  setLFODepth: (depth) => set({ lfoDepth: depth }),

  setEnvelope: (env) => set((state) => ({ ...state, ...env })),
  setMIDIConnected: (connected) => set({ midiConnected: connected }),
}));
