import { useEffect, useCallback } from 'react';
import { engine } from '../audio/audioEngine';
import { useStore } from '../store/useStore';

export const useAudio = () => {
  const { volume, instrument, sustain, setAudioReady } = useStore();

  useEffect(() => {
    engine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    engine.setInstrument(instrument);
  }, [instrument]);

  useEffect(() => {
    if (!sustain) {
      engine.releaseSustain();
    }
  }, [sustain]);

  const initAudio = useCallback(async () => {
    await engine.init(() => setAudioReady(true));
  }, [setAudioReady]);

  const playNote = useCallback((note) => {
    engine.playNote(note);
  }, []);

  const stopNote = useCallback((note) => {
    const sustainEnabled = useStore.getState().sustain;
    engine.stopNote(note, sustainEnabled);
  }, []);

  return { initAudio, playNote, stopNote };
};
