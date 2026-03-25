import { useEffect, useCallback, useState } from 'react';
import { engine } from '../audio/audioEngine';
import { useStore } from '../store/useStore';

export const useAudio = () => {
  const { 
    volume, instrument, sustain, isAudioReady, setAudioReady, cutoff, reverbWet,
    arpActive, arpRate, lfoActive, lfoRate, lfoDepth,
    attack, decay, sustainLevel, release, setMIDIConnected
  } = useStore();

  const [analyzer, setAnalyzer] = useState(null);

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
    engine.setReverbWet(reverbWet);
  }, [reverbWet, isAudioReady]);

  useEffect(() => {
    if (!isAudioReady) return;
    engine.setArp(arpActive, arpRate);
  }, [arpActive, arpRate, isAudioReady]);

  useEffect(() => {
    if (!isAudioReady) return;
    engine.setLFO(lfoActive, lfoRate, lfoDepth);
  }, [lfoActive, lfoRate, lfoDepth, isAudioReady]);

  useEffect(() => {
    if (!isAudioReady) return;
    engine.setEnvelope(attack, decay, sustainLevel, release);
  }, [attack, decay, sustainLevel, release, isAudioReady]);

  useEffect(() => {
    if (isAudioReady) {
      engine.initMIDI().then(connected => {
        setMIDIConnected(connected);
      });
    }
  }, [isAudioReady, setMIDIConnected]);

  useEffect(() => {
    if (!sustain && isAudioReady) {
      engine.releaseSustain();
    }
  }, [sustain, isAudioReady]);

  const initAudio = useCallback(async () => {
    await engine.init(() => {
      setAudioReady(true);
      setAnalyzer(engine.analyzer);
    });
  }, [setAudioReady]);

  const playNote = useCallback((note, velocity) => {
    engine.playNote(note, velocity);
  }, []);

  const stopNote = useCallback((note) => {
    const sustainEnabled = useStore.getState().sustain;
    engine.stopNote(note, sustainEnabled);
  }, []);

  return { initAudio, playNote, stopNote, analyzer };
};
