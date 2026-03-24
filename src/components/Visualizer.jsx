import { useEffect, useRef } from 'react';

export const Visualizer = ({ analyzer }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!analyzer || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = () => {
      const buffer = analyzer.getValue();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#818cf8'; // Indigo-400
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#4f46e5';

      const sliceWidth = canvas.width / buffer.length;
      let x = 0;

      for (let i = 0; i < buffer.length; i++) {
        const v = buffer[i] * 1.5; // Scale for visibility
        const y = (v + 1) / 2 * canvas.height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [analyzer]);

  return (
    <div className="w-full h-24 bg-slate-950/40 rounded-3xl border border-white/5 shadow-inner overflow-hidden relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <span className="text-[10px] uppercase font-black tracking-[0.5em] text-indigo-300">Signal Flow</span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={100} 
        className="w-full h-full"
      />
    </div>
  );
};
