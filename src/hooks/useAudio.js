import { useEffect, useCallback, useState } from 'react';
import { engine } from '../audio/audioEngine';
import { useStore } from '../store/useStore';

export const useAudio = () => {
  const { volume, instrument, sustain, isAudioReady, setAudioReady, cutoff, reverbWet } = useStore();
  const [analyzer, setAnalyzer] = useState(null);

  const initAudio = useCallback(async () => {
    await engine.init();
    setAudioReady(true);
    setAnalyzer(engine.analyzer);
  }, [setAudioReady]);

  useEffect(() => {
    if (!isAudioReady) return;
    engine.setVolume(volume);
  }, [volume, isAudioReady]);

  useEffect(() => {
    if (!isAudioReady) return;
    engine.setInstrument(instrument);
  }, [instrument, isAudioReady]);

  useEffect(() => {
    if (!isAudioReady) return;
    engine.setCutoff(cutoff);
  }, [cutoff, isAudioReady]);

  useEffect(() => {
    if (!isAudioReady) return;
    engine.setReverb(reverbWet);
  }, [reverbWet, isAudioReady]);

  useEffect(() => {
    if (!sustain && isAudioReady) engine.releaseSustain();
  }, [sustain, isAudioReady]);

  const playNote = useCallback((note, velocity) => engine.playNote(note, velocity), []);
  const stopNote = useCallback((note) => {
    engine.stopNote(note, useStore.getState().sustain);
  }, []);

  return { initAudio, playNote, stopNote, analyzer };
};
