import { create } from 'zustand';

export const useStore = create((set) => ({
  isAudioReady: false,
  volume: 0,
  instrument: 'synth',
  sustain: false,
  cutoff: 5000,
  reverbWet: 0.3,
  octave: 3,
  isRecording: false,
  isPlaying: false,
  hasRecording: false,

  setAudioReady: (v) => set({ isAudioReady: v }),
  setVolume: (v) => set({ volume: v }),
  setInstrument: (v) => set({ instrument: v }),
  setSustain: (v) => set({ sustain: v }),
  setCutoff: (v) => set({ cutoff: v }),
  setReverbWet: (v) => set({ reverbWet: v }),
  setOctave: (v) => set({ octave: Math.max(1, Math.min(6, v)) }),
  setIsRecording: (v) => set({ isRecording: v }),
  setIsPlaying: (v) => set({ isPlaying: v }),
  setHasRecording: (v) => set({ hasRecording: v }),
}));
