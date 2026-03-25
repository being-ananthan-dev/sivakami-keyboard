import { useEffect } from 'react';
import { Keyboard } from './components/Keyboard';
import { Controls } from './components/Controls';
import { Visualizer } from './components/Visualizer';
import { useAudio } from './hooks/useAudio';
import { useStore } from './store/useStore';

function App() {
  const { isAudioReady, setSustain } = useStore();
  const { initAudio, analyzer } = useAudio();

  useEffect(() => {
    const down = (e) => { if (e.code === 'Space' && !e.repeat) { e.preventDefault(); setSustain(true); } };
    const up = (e) => { if (e.code === 'Space') { e.preventDefault(); setSustain(false); } };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [setSustain]);

  useEffect(() => {
    if (isAudioReady) return;
    const startEngine = () => {
      initAudio();
    };
    // Auto-init audio on first interaction so we don't need a landing page
    window.addEventListener('pointerdown', startEngine, { once: true });
    window.addEventListener('keydown', startEngine, { once: true });
    return () => {
      window.removeEventListener('pointerdown', startEngine);
      window.removeEventListener('keydown', startEngine);
    };
  }, [isAudioReady, initAudio]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 relative font-sans">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              <span className="text-2xl font-black text-white italic">V</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase text-white leading-none">
                VirtuKeys <span className="text-indigo-400">Professional</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold mt-1">Cinematic Scoring Workstation</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/50 rounded-full border border-white/5 backdrop-blur-md">
            <span className={`w-2 h-2 rounded-full ${isAudioReady ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'} animate-pulse`} />
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">
              {isAudioReady ? 'Engine Active' : 'Engine Standby'}
            </span>
          </div>
        </header>

        <div className="flex-1 flex flex-col gap-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2"><Controls /></div>
            <Visualizer analyzer={analyzer} />
          </div>
          <main className="w-full pb-12"><Keyboard /></main>
        </div>
      </div>
    </div>
  );
}

export default App;
