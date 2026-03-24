import { useEffect } from 'react';
import { Keyboard } from './components/Keyboard';
import { Controls } from './components/Controls';
import { Visualizer } from './components/Visualizer';
import { useAudio } from './hooks/useAudio';
import { useRecorder } from './hooks/useRecorder';
import { useStore } from './store/useStore';

function App() {
  const { isAudioReady, setSustain } = useStore();
  const { initAudio, analyzer } = useAudio();
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
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col pt-6 pb-6 px-6 overflow-hidden touch-none select-none relative font-sans">
      {/* Cinematic Glow Background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[#000] opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none opacity-5"></div>
      
      <header className="flex items-center justify-between mb-8 shrink-0 z-10 max-w-6xl w-full mx-auto border-b border-white/5 pb-4">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-black tracking-[-0.05em] uppercase text-white">
            Sivakami's <span className="text-indigo-400">Cinematic Suite</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-px w-8 bg-indigo-500/50"></span>
            <span className="text-[10px] text-indigo-300/40 uppercase font-black tracking-[0.3em]">Hans Zimmer Edition v2.0</span>
          </div>
        </div>
        
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] text-white/40 uppercase font-black tracking-widest text-right">Owner & Chief Composer</span>
          <span className="text-sm font-bold text-indigo-200 uppercase tracking-tighter">Sivakami A G</span>
        </div>
      </header>

      {!isAudioReady ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in z-10">
          <div className="max-w-md text-center p-12 bg-slate-900/40 backdrop-blur-3xl rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[42px] blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative">
              <h2 className="text-3xl font-black mb-4 text-white uppercase tracking-tight">Studio Initialized</h2>
              <p className="text-indigo-200/60 mb-10 leading-relaxed font-medium">Calibrating audio buffers and loading orchestral sample libraries for professional scoring.</p>
              <button 
                onClick={initAudio}
                className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-indigo-50 hover:shadow-indigo-500/20 active:scale-95 transition-all text-sm"
              >
                Access Workstation
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-fade-in min-h-0 z-10 max-w-6xl w-full mx-auto gap-6 sm:gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Controls recorder={recorder} />
            </div>
            <div className="hidden lg:flex flex-col justify-end gap-4">
              <Visualizer analyzer={analyzer} />
              <div className="bg-slate-950/60 p-4 rounded-3xl border border-white/5 flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[9px] font-black uppercase text-indigo-300/40 tracking-widest">Mastering chain</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="w-1 h-1 rounded-full bg-green-500/40"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-200/50">L</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[82%] h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-200/50">R</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden">
             <Keyboard recordEvent={recorder.recordEvent} />
          </div>
          
          <footer className="shrink-0 flex items-center justify-between px-2 pt-4 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-300/80">
              © 2026 Cinematic Productions • Sivakami A G
            </span>
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-100/30">Latency: 2.4ms</span>
               <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-100/30">Sampling: 48kHz</span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
