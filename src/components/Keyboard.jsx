import { useEffect, useMemo, useRef, useReducer, useState } from 'react';
import { Key } from './Key';
import { getFullPianoKeys, KEYBOARD_MAP, getNoteFromStep } from '../utils/noteMap';
import { useStore } from '../store/useStore';
import { useAudio } from '../hooks/useAudio';

export const Keyboard = ({ recordEvent }) => {
  const { octave } = useStore();
  const { playNote, stopNote } = useAudio();
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const keys = useMemo(() => {
    return getFullPianoKeys();
  }, []);

  const containerRef = useRef(null);

  const handleMiniMapClick = (e) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const scrollTarget = (containerRef.current.scrollWidth - containerRef.current.clientWidth) * percentage;
    containerRef.current.scrollTo({ left: scrollTarget, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      
      const keyChar = e.key.toLowerCase();
      if (keyChar in KEYBOARD_MAP) {
        const step = KEYBOARD_MAP[keyChar];
        const note = getNoteFromStep(octave, step);
        if (note) {
          setPressedKeys(prev => {
            const next = new Set(prev);
            next.add(note);
            return next;
          });
        }
      }
    };

    const handleKeyUp = (e) => {
      const keyChar = e.key.toLowerCase();
      if (keyChar in KEYBOARD_MAP) {
        const step = KEYBOARD_MAP[keyChar];
        const note = getNoteFromStep(octave, step);
        if (note) {
          setPressedKeys(prev => {
            const next = new Set(prev);
            next.delete(note);
            return next;
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [octave]);

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Mini Map */}
      <div className="px-4">
        <div 
          className="h-6 w-full bg-slate-900/50 rounded-full border border-white/5 relative overflow-hidden cursor-pointer group"
          onClick={handleMiniMapClick}
        >
          <div className="absolute inset-0 flex">
            {keys.map((k, i) => (
              <div 
                key={i} 
                className={`flex-1 h-full ${k.isBlack ? 'bg-slate-800' : 'bg-slate-700/50'} border-r border-white/5`}
              />
            ))}
          </div>
          <div 
            className="absolute top-0 h-full bg-indigo-500/30 border-x border-indigo-400/50 transition-all pointer-events-none"
            style={{ 
              left: containerRef.current ? `${(containerRef.current.scrollLeft / containerRef.current.scrollWidth) * 100}%` : '40%',
              width: containerRef.current ? `${(containerRef.current.clientWidth / containerRef.current.scrollWidth) * 100}%` : '20%'
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center px-6 text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
        <span>Sub Bass</span>
        <div className="h-[1px] flex-1 mx-8 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        <span>High Melodic</span>
      </div>
      
      <div 
        ref={containerRef}
        className="flex w-full overflow-x-auto py-8 select-none touch-none px-4 scrollbar-hide active:cursor-grabbing"
        onScroll={() => forceUpdate()}
      >
        <div className="flex relative items-start">
        {keys.map(({ note, isBlack }) => {
          const isPressed = pressedKeys.has(note);
          
          return (
            <Key
              key={note}
              note={note}
              isBlack={isBlack}
              isHighlighted={false}
              recordEvent={recordEvent}
              isPhysicalPressed={isPressed}
              playNote={playNote}
              stopNote={stopNote}
            />
          );
        })}
        </div>
      </div>
    </div>
  );
};
