import { Volume2, VolumeX, Waves, Circle, Square, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import { engine } from '../audio/audioEngine';

export const Controls = () => {
  const {
    volume, setVolume,
    instrument, setInstrument,
    sustain, setSustain,
    cutoff, setCutoff,
    reverbWet, setReverbWet,
    isRecording, setIsRecording,
    isPlaying, setIsPlaying
  } = useStore();

  const handleRecord = () => {
    if (isRecording) {
      engine.stopRecording();
      setIsRecording(false);
    } else {
      if (isPlaying) { engine.stopPlayingRecording(); setIsPlaying(false); }
      engine.startRecording();
      setIsRecording(true);
    }
  };

  const handlePlay = () => {
    if (isRecording) { engine.stopRecording(); setIsRecording(false); }
    if (isPlaying) {
      engine.stopPlayingRecording();
      setIsPlaying(false);
    } else {
      const duration = engine.playRecording();
      if (duration > 0) {
        setIsPlaying(true);
        setTimeout(() => setIsPlaying(false), duration + 3000);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950/80 backdrop-blur-2xl rounded-3xl shadow-2xl w-full border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Waves size={140} className="text-indigo-400" />
      </div>

      <h2 className="text-[10px] text-indigo-300/40 uppercase font-black tracking-[0.4em]">Workstation Console</h2>

      <div className="flex flex-wrap items-start gap-8 relative z-10">
        {/* Source */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-indigo-300/60 uppercase font-black tracking-widest">Source</label>
          <select value={instrument} onChange={e => setInstrument(e.target.value)}
            className="bg-slate-900 border border-white/10 text-indigo-50 text-xs rounded-xl p-3 min-w-[150px] outline-none cursor-pointer hover:bg-slate-800 transition-colors">
            <option value="piano">🎹 Grand Piano</option>
            <option value="pad">🌌 Cinematic Pad</option>
            <option value="strings">🎻 Orchestral Strings</option>
            <option value="synth">⚡ Lead Synth</option>
          </select>
        </div>

        {/* Cinematic FX */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-indigo-300/60 uppercase font-black tracking-widest">Cinematic FX</label>
          <div className="flex gap-4 bg-slate-900/50 p-3 rounded-2xl border border-white/5">
            <div className="flex flex-col gap-1 items-center">
              <input type="range" min="200" max="10000" value={cutoff} onChange={e => setCutoff(parseInt(e.target.value))}
                className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400" />
              <span className="text-[9px] text-indigo-400/60 uppercase font-bold">Filter</span>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <input type="range" min="0" max="1" step="0.01" value={reverbWet} onChange={e => setReverbWet(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400" />
              <span className="text-[9px] text-purple-400/60 uppercase font-bold">Ambient</span>
            </div>
          </div>
        </div>
        {/* Sequencer */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-indigo-300/60 uppercase font-black tracking-widest">Sequencer</label>
          <div className="flex gap-2 bg-slate-900/50 p-3 rounded-2xl border border-white/5">
            <button onClick={handleRecord} className={`flex items-center justify-center w-12 h-10 rounded-xl border transition-all ${isRecording ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:text-red-400'}`}>
              {isRecording ? <Square size={16} className="fill-current" /> : <Circle size={16} className="fill-current" />}
            </button>
            <button onClick={handlePlay} className={`flex items-center justify-center w-12 h-10 rounded-xl border transition-all ${isPlaying ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-800/50 border-white/5 text-slate-400 hover:text-emerald-400'}`}>
              {isPlaying ? <Square size={16} className="fill-current" /> : <Play size={16} className="fill-current translate-x-0.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
        <label className="flex items-center gap-4 cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={sustain} onChange={e => setSustain(e.target.checked)} />
            <div className={`block w-12 h-6 rounded-full transition-all ${sustain ? 'bg-indigo-500' : 'bg-slate-800'}`} />
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-lg ${sustain ? 'translate-x-6' : ''}`} />
          </div>
          <span className={`text-xs font-black uppercase tracking-widest ${sustain ? 'text-indigo-300' : 'text-slate-500'}`}>Sustain</span>
        </label>

        <div className="flex items-center gap-4 bg-slate-900/30 px-6 py-2 rounded-full border border-white/5">
          {volume <= -30 ? <VolumeX size={16} className="text-slate-500" /> : <Volume2 size={16} className="text-indigo-400" />}
          <input type="range" min="-40" max="0" step="1" value={volume} onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-40 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
        </div>
      </div>
    </div>
  );
};
