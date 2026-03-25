import { useState, useRef } from 'react';

export const Key = ({ note, isBlack, isPhysicalPressed, playNote, stopNote }) => {
  const [pointers, setPointers] = useState(new Set());
  const ref = useRef(null);
  const isActive = pointers.size > 0 || isPhysicalPressed;

  const velocity = (e) => {
    if (!ref.current) return 0.8;
    const rect = ref.current.getBoundingClientRect();
    return Math.max(0.4, Math.min(1.0, 0.4 + ((e.clientY - rect.top) / rect.height) * 0.6));
  };

  const onDown = (e) => {
    setPointers(p => new Set(p).add(e.pointerId));
    playNote(note, velocity(e));
  };
  const onUp = (e) => {
    setPointers(p => { const n = new Set(p); n.delete(e.pointerId); return n; });
    stopNote(note);
  };
  const onEnter = (e) => {
    if (e.buttons > 0) { setPointers(p => new Set(p).add(e.pointerId)); playNote(note, 0.8); }
  };
  const onLeave = (e) => {
    setPointers(p => {
      const n = new Set(p);
      if (n.has(e.pointerId)) { n.delete(e.pointerId); stopNote(note); }
      return n;
    });
  };

  const base = 'relative rounded-b-xl transition-all duration-75 select-none shrink-0 touch-none overflow-hidden';
  const white = `w-10 sm:w-12 h-44 sm:h-56 z-0 border-x border-slate-300 ${isActive ? 'bg-indigo-300 translate-y-1 shadow-inner' : 'bg-slate-100 shadow-[0_8px_0_#cbd5e1,0_15px_20px_rgba(0,0,0,0.3)]'}`;
  const black = `w-6 sm:w-8 h-28 sm:h-36 z-10 -mx-3 sm:-mx-4 rounded-b-md ${isActive ? 'bg-indigo-900 translate-y-1 shadow-inner' : 'bg-slate-900 shadow-[0_6px_0_#000,0_10px_15px_rgba(0,0,0,0.5)]'}`;

  return (
    <div ref={ref} className={`${base} ${isBlack ? black : white}`}
      onPointerDown={onDown} onPointerUp={onUp} onPointerEnter={onEnter}
      onPointerLeave={onLeave} onPointerCancel={onLeave} data-note={note}>
      {!isBlack && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-slate-400 font-bold pointer-events-none opacity-40">{note}</span>}
      <div className={`absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};
