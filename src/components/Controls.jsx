import { Volume2, VolumeX, Mic, Square, Play, Download, Waves, Zap, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Controls = ({ recorder }) => {
  const { 
    volume, setVolume, 
    instrument, setInstrument,
    sustain, setSustain,
    cutoff, setCutoff,
    reverbWet, setReverbWet,
    arpActive, setArpActive,
    arpRate, setArpRate,
    lfoActive, setLFOActive,
    lfoRate, setLFORate,
    lfoDepth, setLFODepth,
    attack, decay, sustainLevel, release, setEnvelope,
    midiConnected
  } = useStore();

  const {
    isRecording, isPlaying,
    startRecording, stopRecording,
    playRecording, stopPlayback,
    exportRecording, hasRecording
  } = recorder;

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950/80 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-6xl mx-auto mt-4 border border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Waves size={160} className="text-indigo-400" />
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[10px] text-indigo-300/40 uppercase font-black tracking-[0.4em]">Workstation Console</h2>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${midiConnected ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 border-white/5 text-slate-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${midiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
          <span className="text-[9px] font-black uppercase tracking-widest">{midiConnected ? 'MIDI Connected' : 'MIDI Discovery'}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-8 relative z-10">
        
        {/* Instrument & Range */}
        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-indigo-300/60 uppercase font-black tracking-[0.2em]">Source</label>
            <select 
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="bg-slate-900 border border-white/10 text-indigo-50 text-xs rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none block p-3 min-w-[150px] shadow-2xl appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <option value="piano">🎹 Grand Piano</option>
              <option value="pad">🌌 Cinematic Pad</option>
              <option value="strings">🎻 Orchestral Strings</option>
              <option value="synth">⚡ Lead Synth</option>
            </select>
          </div>
        </div>

        {/* Synthesis Section */}
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-indigo-300/60 uppercase font-black tracking-[0.2em]">Arpeggiator</label>
            <div className="flex gap-3 bg-slate-900/50 p-2 rounded-2xl border border-white/5 shadow-inner">
              <button 
                onClick={() => setArpActive(!arpActive)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${arpActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-500'}`}
              >
                <Zap size={18} fill={arpActive ? "white" : "none"} />
              </button>
              <select 
                value={arpRate}
                onChange={(e) => setArpRate(e.target.value)}
                className="bg-slate-800 border-none text-[10px] text-indigo-100 rounded-lg p-2 outline-none cursor-pointer"
              >
                <option value="4n">1/4</option>
                <option value="8n">1/8</option>
                <option value="16n">1/16</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-indigo-300/60 uppercase font-black tracking-[0.2em]">Modulation (LFO)</label>
            <div className="flex gap-3 bg-slate-900/50 p-2 rounded-2xl border border-white/5 shadow-inner">
              <button 
                onClick={() => setLFOActive(!lfoActive)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${lfoActive ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-800 text-slate-500'}`}
              >
                <Activity size={18} />
              </button>
              <div className="flex flex-col gap-1 justify-center">
                <input 
                  type="range" min="100" max="3000" value={lfoDepth} 
                  onChange={(e) => setLFODepth(parseInt(e.target.value))}
                  className="w-16 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-purple-400"
                />
                <span className="text-[8px] text-purple-400/60 uppercase font-bold text-center">Depth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic FX */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-indigo-300/60 uppercase font-black tracking-[0.2em]">Cinematic FX</label>
          <div className="flex gap-4 bg-slate-900/50 p-3 rounded-2xl border border-white/5 shadow-inner">
            <div className="flex flex-col gap-1 items-center">
              <input 
                type="range" min="200" max="10000" value={cutoff} 
                onChange={(e) => setCutoff(parseInt(e.target.value))}
                className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
              <span className="text-[9px] text-indigo-400/60 uppercase font-bold">Filter</span>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <input 
                type="range" min="0" max="1" step="0.01" value={reverbWet} 
                onChange={(e) => setReverbWet(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <span className="text-[9px] text-purple-400/60 uppercase font-bold">Ambient</span>
            </div>
          </div>
        </div>

        {/* Granular Envelope */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-indigo-300/60 uppercase font-black tracking-[0.2em]">Master Envelope</label>
          <div className="flex gap-4 bg-slate-900/50 p-3 rounded-2xl border border-white/5 shadow-inner">
            {[
              { label: 'A', value: attack, key: 'attack', min: 0.001, max: 2, step: 0.01 },
              { label: 'D', value: decay, key: 'decay', min: 0.1, max: 2, step: 0.01 },
              { label: 'S', value: sustainLevel, key: 'sustainLevel', min: 0, max: 1, step: 0.01 },
              { label: 'R', value: release, key: 'release', min: 0.1, max: 4, step: 0.01 },
            ].map(ctrl => (
              <div key={ctrl.key} className="flex flex-col gap-1 items-center">
                <input 
                  type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={ctrl.value} 
                  onChange={(e) => setEnvelope({ [ctrl.key]: parseFloat(e.target.value) })}
                  className="w-12 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-400"
                />
                <span className="text-[8px] text-slate-500 font-bold">{ctrl.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Recorder */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-indigo-300/60 uppercase font-black tracking-[0.2em]">Session Recorder</label>
          <div className="flex gap-3 bg-slate-900/50 p-2 rounded-2xl border border-white/5 shadow-2xl">
            <button onClick={isRecording ? stopRecording : startRecording} className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${isRecording ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-slate-800 hover:bg-red-500/20 text-red-400 border border-white/5'}`}>
              {isRecording ? <Square size={20} fill="white" /> : <Mic size={20} />}
            </button>
            <button onClick={isPlaying ? stopPlayback : playRecording} disabled={!hasRecording || isRecording} className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all disabled:opacity-20 ${isPlaying ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-slate-800 hover:bg-indigo-500/20 text-indigo-400 border border-white/5'}`}>
              {isPlaying ? <Square size={20} fill="white" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button onClick={exportRecording} disabled={!hasRecording || isRecording || isPlaying} className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-indigo-400/20 text-indigo-300 border border-white/5 transition-all disabled:opacity-20">
              <Download size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
        <label className="flex items-center gap-4 cursor-pointer group">
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={sustain} onChange={(e) => setSustain(e.target.checked)} />
            <div className={`block w-12 h-6 rounded-full transition-all duration-300 ${sustain ? 'bg-indigo-500' : 'bg-slate-800 shadow-inner'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-lg ${sustain ? 'translate-x-6' : ''}`}></div>
          </div>
          <span className={`text-xs font-black uppercase tracking-[0.1em] transition-colors ${sustain ? 'text-indigo-300' : 'text-slate-500'}`}>Sustain Drive</span>
        </label>

        <div className="flex items-center gap-4 bg-slate-900/30 px-6 py-2 rounded-full border border-white/5">
          {volume <= -30 ? <VolumeX size={16} className="text-slate-500" /> : <Volume2 size={16} className="text-indigo-400" />}
          <input 
            type="range" min="-40" max="0" step="1" value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-40 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
