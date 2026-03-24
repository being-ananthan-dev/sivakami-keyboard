import { Volume2, VolumeX, Settings, Music, Mic, Square, Play, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { NOTES } from '../utils/noteMap';

export const Controls = ({ recorder }) => {
  const { 
    volume, setVolume, 
    octave, setOctave, 
    instrument, setInstrument,
    sustain, setSustain,
    scale, setScale
  } = useStore();

  const {
    isRecording, isPlaying,
    startRecording, stopRecording,
    playRecording, stopPlayback,
    exportRecording, hasRecording
  } = recorder;

  return (
    <div className="flex flex-col gap-4 p-5 bg-indigo-950/40 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(31,38,135,0.37)] w-full max-w-4xl mx-auto mt-4 border border-indigo-500/20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-xs text-indigo-300/80 mb-1 uppercase font-bold tracking-wider">Instrument</label>
            <select 
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              className="bg-slate-900/80 backdrop-blur border border-indigo-500/30 text-indigo-100 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 shadow-inner"
            >
              <option value="piano">🎹 Grand Piano</option>
              <option value="synth">🌊 Poly Synth</option>
              <option value="organ">🏛️ Classic Organ</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-indigo-300/80 mb-1 uppercase font-bold tracking-wider text-center">Octave</label>
            <div className="flex items-center bg-slate-900/80 backdrop-blur rounded-lg border border-indigo-500/30 shadow-inner">
              <button 
                onClick={() => setOctave(octave - 1)}
                className="px-3 py-1.5 text-indigo-300 hover:text-white hover:bg-indigo-500/30 rounded-l-lg transition-colors"
                disabled={octave <= 1}
              >-</button>
              <span className="px-3 py-1.5 font-mono text-sm min-w-[2rem] text-center border-x border-indigo-500/30 text-indigo-100">{octave}</span>
              <button 
                onClick={() => setOctave(octave + 1)}
                className="px-3 py-1.5 text-indigo-300 hover:text-white hover:bg-indigo-500/30 rounded-r-lg transition-colors"
                disabled={octave >= 6}
              >+</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Recorder</label>
          <div className="flex gap-2">
            {!isRecording ? (
              <button onClick={startRecording} disabled={isPlaying} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
                <Mic size={18} />
              </button>
            ) : (
              <button onClick={stopRecording} className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white animate-pulse transition-colors">
                <Square size={18} fill="currentColor" />
              </button>
            )}
            
            {!isPlaying ? (
              <button onClick={playRecording} disabled={!hasRecording || isRecording} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-colors disabled:opacity-50">
                <Play size={18} fill="currentColor" />
              </button>
            ) : (
              <button onClick={stopPlayback} className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors">
                <Square size={18} fill="currentColor" />
              </button>
            )}

            <button onClick={exportRecording} disabled={!hasRecording || isRecording || isPlaying} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50" title="Export JSON">
              <Download size={18} />
            </button>
          </div>
        </div>

      </div>

      <div className="h-px w-full bg-slate-700 my-1"></div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only"
              checked={sustain}
              onChange={(e) => setSustain(e.target.checked)}
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${sustain ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${sustain ? 'translate-x-4' : ''}`}></div>
          </div>
          <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Sustain Pedal (Spacebar)</span>
        </label>

        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <label className="text-xs text-indigo-300/80 mb-1 uppercase font-bold tracking-wider">Scale</label>
            <select 
              value={scale || ''}
              onChange={(e) => setScale(e.target.value || null)}
              className="bg-slate-900/80 backdrop-blur border border-indigo-500/30 text-indigo-100 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-1.5 min-w-[100px] shadow-inner"
            >
              <option value="">None</option>
              {NOTES.map(n => <option key={n} value={n}>{n} Major</option>)}
            </select>
          </div>

          <div className="flex items-center gap-3">
            {volume <= -30 ? <VolumeX size={18} className="text-slate-400" /> : <Volume2 size={18} className="text-slate-400" />}
            <input 
              type="range" 
              min="-30" 
              max="10" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
