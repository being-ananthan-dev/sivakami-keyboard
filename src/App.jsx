import { useEffect } from 'react';
import { Keyboard } from './components/Keyboard';
import { Controls } from './components/Controls';
import { Visualizer } from './components/Visualizer';
import { useAudio } from './hooks/useAudio';
import { useRecorder } from './hooks/useRecorder';
import { useStore } from './store/useStore';
import { Waves } from 'lucide-react';

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
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-8 relative font-sans selection:bg-indigo-500/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto h-full flex flex-col relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              <span className="text-2xl font-black text-white italic">V</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-black tracking-[-0.02em] uppercase text-white leading-none">
                VirtuKeys <span className="text-indigo-400">Professional</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold mt-1">Cinematic Scoring Workstation</p>
            </div>
          </div>

          {!isAudioReady ? (
            <button 
              onClick={initAudio}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:-translate-y-0.5"
            >
              Initialize Engine
            </button>
          ) : (
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/50 rounded-full border border-white/5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">Engine Active</span>
            </div>
          )}
        </header>

        {!isAudioReady ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in text-center py-20">
            <div className="w-32 h-32 bg-slate-900/50 rounded-full flex items-center justify-center border border-white/10 mb-8 animate-pulse">
              <Waves size={64} className="text-indigo-400 opacity-20" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Enter the Soundstage</h2>
            <p className="max-w-md text-slate-400 text-sm leading-relaxed mb-12 font-medium">
              A professional-grade scoring tool with 88-key range, integrated arpeggiation, and ambient synthesis modules.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-fade-in gap-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <Controls recorder={recorder} />
              </div>
              <div className="flex flex-col gap-6">
                <Visualizer analyzer={analyzer} />
                <div className="p-6 bg-slate-900/40 rounded-[32px] border border-white/5 backdrop-blur-xl shadow-2xl">
                  <h3 className="text-[10px] uppercase font-black tracking-widest text-indigo-400/60 mb-4">Mastering Engine</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Range</span>
                      <span className="text-slate-200 uppercase tracking-widest">88 Keys (A0-C8)</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Sample Rate</span>
                      <span className="text-slate-200">48 kHz</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                         <span className="text-[10px] font-black uppercase text-slate-400">Spectral Analysis</span>
                       </div>
                       <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                         <div className="w-[75%] h-full bg-indigo-500/50"></div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <main className="w-full pb-12">
              <Keyboard recordEvent={recorder.recordEvent} />
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
