import { useEffect, useMemo, useRef, useReducer, useState } from 'react';
import { Key } from './Key';
import { getFullPianoKeys, KEYBOARD_MAP, getNoteFromStep } from '../utils/noteMap';
import { useStore } from '../store/useStore';
import { useAudio } from '../hooks/useAudio';

export const Keyboard = () => {
  const { octave } = useStore();
  const { playNote, stopNote } = useAudio();
  const [pressed, setPressed] = useState(new Set());
  const containerRef = useRef(null);
  const thumbRef = useRef(null);
  const keys = useMemo(() => getFullPianoKeys(), []);

  const onMiniMap = (e) => {
    if (!containerRef.current) return;
    const pct = (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.getBoundingClientRect().width;
    containerRef.current.scrollTo({ left: (containerRef.current.scrollWidth - containerRef.current.clientWidth) * pct, behavior: 'smooth' });
  };

  useEffect(() => {
    const down = (e) => {
      if (e.repeat || e.ctrlKey || e.metaKey) return;
      const k = e.key.toLowerCase();
      if (k in KEYBOARD_MAP) { const n = getNoteFromStep(octave, KEYBOARD_MAP[k]); if (n) setPressed(p => new Set(p).add(n)); }
    };
    const up = (e) => {
      const k = e.key.toLowerCase();
      if (k in KEYBOARD_MAP) { const n = getNoteFromStep(octave, KEYBOARD_MAP[k]); if (n) setPressed(p => { const s = new Set(p); s.delete(n); return s; }); }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    
    const handleScroll = () => {
      if (!containerRef.current || !thumbRef.current) return;
      const left = (containerRef.current.scrollLeft / containerRef.current.scrollWidth) * 100;
      const width = (containerRef.current.clientWidth / containerRef.current.scrollWidth) * 100;
      thumbRef.current.style.left = `${left}%`;
      thumbRef.current.style.width = `${width}%`;
    };
    
    const container = containerRef.current;
    if (container) container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => { 
      window.removeEventListener('keydown', down); 
      window.removeEventListener('keyup', up); 
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, [octave]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="px-4">
        <div className="h-6 w-full bg-slate-900/50 rounded-full border border-white/5 relative overflow-hidden cursor-pointer" onClick={onMiniMap}>
          <div className="absolute inset-0 flex">
            {keys.map((k, i) => <div key={i} className={`flex-1 h-full ${k.isBlack ? 'bg-slate-800' : 'bg-slate-700/50'} border-r border-white/5`} />)}
          </div>
          <div ref={thumbRef} className="absolute top-0 h-full bg-indigo-500/30 border-x border-indigo-400/50 pointer-events-none"
            style={{ left: '40%', width: '20%' }} />
        </div>
      </div>
      <div className="flex justify-between items-center px-6 text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
        <span>Sub Bass</span>
        <div className="h-px flex-1 mx-8 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        <span>High Melodic</span>
      </div>
      <div ref={containerRef} className="flex w-full overflow-x-auto py-8 select-none touch-none px-4 scrollbar-hide">
        <div className="flex relative items-start">
          {keys.map(({ note, isBlack }) => (
            <Key key={note} note={note} isBlack={isBlack} isPhysicalPressed={pressed.has(note)} playNote={playNote} stopNote={stopNote} />
          ))}
        </div>
      </div>
    </div>
  );
};
