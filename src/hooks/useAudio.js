import { useEffect, useCallback } from 'react';
import { engine } from '../audio/audioEngine';
import { useStore } from '../store/useStore';

export const useAudio = () => {
  const { 
    volume, instrument, sustain, setAudioReady, cutoff, reverbWet,
    arpActive, arpRate, lfoActive, lfoRate, lfoDepth
  } = useStore();

  useEffect(() => {
    engine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    engine.setInstrument(instrument);
  }, [instrument]);

  useEffect(() => {
    engine.setCutoff(cutoff);
  }, [cutoff]);

  useEffect(() => {
    engine.setReverbWet(reverbWet);
  }, [reverbWet]);

  useEffect(() => {
    engine.setArp(arpActive, arpRate);
  }, [arpActive, arpRate]);

  useEffect(() => {
    engine.setLFO(lfoActive, lfoRate, lfoDepth);
  }, [lfoActive, lfoRate, lfoDepth]);

  useEffect(() => {
    if (!sustain) {
      engine.releaseSustain();
    }
  }, [sustain]);

  const initAudio = useCallback(async () => {
    await engine.init(() => setAudioReady(true));
  }, [setAudioReady]);

  const playNote = useCallback((note, velocity) => {
    engine.playNote(note, velocity);
  }, []);

  const stopNote = useCallback((note) => {
    const sustainEnabled = useStore.getState().sustain;
    engine.stopNote(note, sustainEnabled);
  }, []);

  return { initAudio, playNote, stopNote, analyzer: engine.analyzer };
};
