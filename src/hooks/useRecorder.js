import { useState, useRef, useCallback } from 'react';
import { engine } from '../audio/audioEngine';
import * as Tone from 'tone';

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const eventsRef = useRef([]);
  const startTimeRef = useRef(0);
  const timersRef = useRef([]);
  const [hasRecording, setHasRecording] = useState(false);

  const startRecording = useCallback(() => {
    eventsRef.current = [];
    startTimeRef.current = performance.now();
    setIsRecording(true);
    setHasRecording(false);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (eventsRef.current.length > 0) {
      setHasRecording(true);
    }
  }, []);

  const recordEvent = useCallback((type, note) => {
    if (!isRecording) return;
    eventsRef.current.push({
      type,
      note,
      time: performance.now() - startTimeRef.current
    });
  }, [isRecording]);

  const playRecording = useCallback(() => {
    if (eventsRef.current.length === 0 || isRecording) return;
    
    setIsPlaying(true);
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    eventsRef.current.forEach(event => {
      const timer = setTimeout(() => {
        if (event.type === 'on') {
          engine.playNote(event.note);
        } else {
          engine.stopNote(event.note, false);
        }
      }, event.time);
      timersRef.current.push(timer);
    });

    const lastEventTime = eventsRef.current[eventsRef.current.length - 1]?.time || 0;
    const stopTimer = setTimeout(() => {
      setIsPlaying(false);
    }, lastEventTime + 500);
    timersRef.current.push(stopTimer);

  }, [isRecording]);

  const stopPlayback = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setIsPlaying(false);
  }, []);

  const exportRecording = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(eventsRef.current, null, 2));
    const dt = new Date();
    const filename = `virtukeys-recording-${dt.getTime()}.json`;
    
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", filename);
    dlAnchorElem.click();
    dlAnchorElem.remove();
  }, []);

  return { 
    isRecording, isPlaying, 
    startRecording, stopRecording, 
    recordEvent, playRecording, stopPlayback,
    exportRecording,
    hasRecording
  };
};
