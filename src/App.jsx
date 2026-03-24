import { useEffect } from 'react';
import { Keyboard } from './components/Keyboard';
import { Controls } from './components/Controls';
import { useAudio } from './hooks/useAudio';
import { useRecorder } from './hooks/useRecorder';
import { useStore } from './store/useStore';

function App() {
  const { isAudioReady, setSustain } = useStore();
  const { initAudio } = useAudio();
  const recorder = useRecorder();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setSustain(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSustain(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setSustain]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col pt-8 pb-4 px-4 overflow-hidden touch-none select-none relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      <header className="text-center mb-6 shrink-0 z-10">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-br from-fuchsia-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl">
          Sivakami's Keys
        </h1>
        <p className="text-indigo-200/70 text-sm md:text-base mt-2 font-semibold tracking-[0.2em] uppercase">
          Exclusive Virtual Instrument
        </p>
      </header>

      {!isAudioReady ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in z-10">
          <div className="max-w-md text-center p-10 bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(79,70,229,0.15)] border border-indigo-500/20">
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Welcome, Sivakami A G</h2>
            <p className="text-indigo-300/80 mb-8 leading-relaxed">Your personalized grand piano and synthesizer engines are ready to be initialized.</p>
            <button 
              onClick={initAudio}
              className="px-10 py-5 bg-gradient-to-r from-indigo-500 hover:from-indigo-400 to-purple-600 hover:to-purple-500 text-white font-bold rounded-full shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all hover:scale-105 active:scale-95 border border-indigo-400/30"
            >
              Start Playing Engine
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-fade-in min-h-0 z-10 max-w-6xl w-full mx-auto">
          <Controls recorder={recorder} />
          
          <div className="flex-1 flex flex-col items-center justify-end mt-4 mb-2 min-h-0 overflow-hidden perspective-1000">
            <Keyboard recordEvent={recorder.recordEvent} />
          </div>
          
          <div className="shrink-0 mt-2 text-center text-xs text-indigo-300/50 flex flex-col items-center gap-1">
            <p>Made exclusively for <strong>Sivakami A G</strong> • Spacebar for sustain pedal</p>
            <p className="hidden md:block">Use your keyboard (Z-M, Q-P rows) or touch screen to play chords.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
