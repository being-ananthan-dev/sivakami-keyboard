import { useEffect, useState, useMemo } from 'react';
import { Key } from './Key';
import { getKeysForOctave, KEYBOARD_MAP, getNoteFromStep, getScaleNotes } from '../utils/noteMap';
import { useStore } from '../store/useStore';

export const Keyboard = ({ recordEvent }) => {
  const { octave, scale } = useStore();
  const [pressedKeys, setPressedKeys] = useState(new Set());
  
  const highlightedNotes = useMemo(() => {
    return getScaleNotes(scale);
  }, [scale]);

  const keys = useMemo(() => {
    return [...getKeysForOctave(octave), ...getKeysForOctave(octave + 1)];
  }, [octave]);

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
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between items-center px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
        <span>Low Frequency</span>
        <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
        <span>High Frequency</span>
      </div>
      
      <div className="flex w-full overflow-x-auto py-8 select-none touch-none px-4 scrollbar-hide active:cursor-grabbing">
        <div className="flex relative items-start mx-auto">
        {keys.map(({ note, isBlack }) => {
          const isHighlighted = highlightedNotes.includes(note.replace(/\d/, ''));
          const isPressed = pressedKeys.has(note);
          
          return (
            <Key
              key={note}
              note={note}
              isBlack={isBlack}
              isHighlighted={isHighlighted}
              recordEvent={recordEvent}
              isPhysicalPressed={isPressed}
            />
          );
        })}
        </div>
      </div>
    </div>
  );
};
