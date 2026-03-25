import { useEffect, useRef } from 'react';

export const Visualizer = ({ analyzer }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!analyzer || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let id;
    const draw = () => {
      const buf = analyzer.getValue();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#818cf8';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#4f46e5';
      const sw = canvas.width / buf.length;
      buf.forEach((v, i) => {
        const y = ((v * 1.5) + 1) / 2 * canvas.height;
        i === 0 ? ctx.moveTo(0, y) : ctx.lineTo(i * sw, y);
      });
      ctx.stroke();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [analyzer]);

  return (
    <div className="w-full h-24 bg-slate-950/40 rounded-3xl border border-white/5 shadow-inner overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <span className="text-[10px] uppercase font-black tracking-[0.5em] text-indigo-300">Signal Flow</span>
      </div>
      <canvas ref={canvasRef} width={800} height={100} className="w-full h-full" />
    </div>
  );
};
