import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';

export const Key = ({ note, isBlack, isHighlighted, recordEvent, isPhysicalPressed, playNote, stopNote }) => {
  const [activePointers, setActivePointers] = useState(new Set());
  const { isAudioReady } = useStore();
  const keyRef = useRef(null);

  const isActive = activePointers.size > 0 || isPhysicalPressed;

  const getVelocity = (e) => {
    if (!keyRef.current) return 0.8;
    const rect = keyRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const velocity = Math.max(0.4, Math.min(1.0, 0.4 + (y / rect.height) * 0.6));
    return velocity;
  };

  const handlePointerDown = (e) => {
    if (!isAudioReady) return;
    
    setActivePointers(prev => {
      const next = new Set(prev);
      next.add(e.pointerId);
      return next;
    });

    const velocity = getVelocity(e);
    playNote(note, velocity);
    if (recordEvent) recordEvent('on', note, velocity);
  };

  const handlePointerUp = (e) => {
    if (!isAudioReady) return;
    
    setActivePointers(prev => {
      const next = new Set(prev);
      next.delete(e.pointerId);
      return next;
    });

    stopNote(note);
    if (recordEvent) recordEvent('off', note);
  };

  const handlePointerEnter = (e) => {
    if (!isAudioReady) return;
    if (e.buttons > 0) {
      setActivePointers(prev => {
        const next = new Set(prev);
        next.add(e.pointerId);
        return next;
      });
      const velocity = 0.8;
      playNote(note, velocity);
      if (recordEvent) recordEvent('on', note, velocity);
    }
  };

  const handlePointerLeave = (e) => {
    if (!isAudioReady) return;
    setActivePointers(prev => {
      const next = new Set(prev);
      if (next.has(e.pointerId)) {
        next.delete(e.pointerId);
        stopNote(note);
        if (recordEvent) recordEvent('off', note);
      }
      return next;
    });
  };

  const baseClass = "relative rounded-b-xl transition-all duration-75 select-none shrink-0 touch-none group overflow-hidden border-x border-slate-300";
  const whiteClass = `w-10 sm:w-12 h-44 sm:h-56 bg-slate-100 z-0 ${isActive ? 'bg-indigo-300 shadow-[inset_0_4px_12px_rgba(0,0,0,0.2)] translate-y-1' : 'shadow-[0_8px_0_#cbd5e1,0_15px_20px_rgba(0,0,0,0.3)]'}`;
  const blackClass = `w-6 sm:w-8 h-28 sm:h-36 bg-slate-900 z-10 -mx-3 sm:-mx-4 rounded-b-md ${isActive ? 'bg-indigo-900 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)] translate-y-1' : 'shadow-[0_6px_0_#000,0_10px_15px_rgba(0,0,0,0.5)]'}`;
  
  const highlightClass = isHighlighted ? 'after:content-[""] after:absolute after:bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-2 after:h-2 after:rounded-full after:bg-indigo-400 after:shadow-[0_0_12px_rgba(129,140,248,0.8)]' : '';

  return (
    <div
      ref={keyRef}
      className={`${baseClass} ${isBlack ? blackClass : whiteClass} ${highlightClass}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      data-note={note}
    >
      {!isBlack && (
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-bold uppercase pointer-events-none opacity-40">
          {note}
        </span>
      )}
      <div className={`absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent opacity-0 transition-opacity ${isActive ? 'opacity-100' : ''}`}></div>
    </div>
  );
};
