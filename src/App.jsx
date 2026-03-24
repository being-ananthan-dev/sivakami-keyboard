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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col pt-8 pb-4 px-4 overflow-hidden touch-none select-none">
      <header className="text-center mb-6 shrink-0">
        <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">VirtuKeys</h1>
        <p className="text-slate-400 text-sm mt-1">Multi-touch Virtual Web Instrument</p>
      </header>

      {!isAudioReady ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
          <div className="max-w-md text-center p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
            <h2 className="text-2xl font-bold mb-4">Welcome to VirtuKeys</h2>
            <p className="text-slate-400 mb-8">Click below to initialize the high-performance Tone.js audio engine.</p>
            <button 
              onClick={initAudio}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              Start Playing
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-fade-in min-h-0">
          <Controls recorder={recorder} />
          
          <div className="flex-1 flex flex-col items-center justify-end mt-4 min-h-0 overflow-hidden">
            <Keyboard recordEvent={recorder.recordEvent} />
          </div>
          
          <div className="shrink-0 mt-4 text-center text-xs text-slate-500 hidden md:block">
            <p>Use QWERTY rows to play. Spacebar for sustain pedal. Touch screens fully supported.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
