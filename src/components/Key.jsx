import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAudio } from '../hooks/useAudio';

export const Key = ({ note, isBlack, isHighlighted, recordEvent, isPhysicalPressed }) => {
  const { playNote, stopNote } = useAudio();
  const [isPointerActive, setIsPointerActive] = useState(false);
  const { isAudioReady } = useStore();

  const isActive = isPointerActive || isPhysicalPressed;

  const handlePointerDown = (e) => {
    e.preventDefault();
    // Allow multi-touch capturing
    e.target.setPointerCapture(e.pointerId);
    if (!isAudioReady) return;
    setIsPointerActive(true);
    playNote(note);
    if (recordEvent) recordEvent('on', note);
  };

  const handlePointerUp = (e) => {
    e.preventDefault();
    e.target.releasePointerCapture(e.pointerId);
    if (!isAudioReady) return;
    setIsPointerActive(false);
    stopNote(note);
    if (recordEvent) recordEvent('off', note);
  };

  const handlePointerEnter = (e) => {
    e.preventDefault();
    if (!isAudioReady) return;
    // Check if dragging across keys
    if (e.buttons > 0 || (e.pointerType === 'touch' && document.activeTouch)) {
      setIsPointerActive(true);
      playNote(note);
      if (recordEvent) recordEvent('on', note);
    }
  };

  const handlePointerLeave = (e) => {
    e.preventDefault();
    if (!isAudioReady) return;
    if (isPointerActive) {
      setIsPointerActive(false);
      stopNote(note);
      if (recordEvent) recordEvent('off', note);
    }
  };

  const baseClass = "relative rounded-b-md transition-all duration-75 select-none shrink-0 touch-none";
  const whiteClass = `w-12 h-48 bg-piano-white z-0 ${isActive ? 'shadow-key-white-active bg-piano-gray translate-y-[2px]' : 'shadow-key-white'}`;
  const blackClass = `w-8 h-32 bg-piano-black z-10 -mx-4 ${isActive ? 'shadow-key-black-active bg-gray-900 translate-y-[2px]' : 'shadow-key-black'}`;
  
  const highlightClass = isHighlighted ? 
    (isBlack ? 'after:content-[""] after:absolute after:bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:rounded-full after:bg-blue-400 after:shadow-[0_0_8px_rgba(96,165,250,0.8)]' 
             : 'after:content-[""] after:absolute after:bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-3 after:h-3 after:rounded-full after:bg-blue-400 after:shadow-[0_0_8px_rgba(96,165,250,0.8)]') 
    : '';

  return (
    <div
      className={`${baseClass} ${isBlack ? blackClass : whiteClass} ${highlightClass}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      data-note={note}
    >
      {!isBlack && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-400/50 font-medium pointer-events-none select-none">
          {note}
        </span>
      )}
    </div>
  );
};
