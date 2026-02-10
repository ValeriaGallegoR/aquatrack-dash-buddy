import { useEffect, useRef } from 'react';

export default function WaterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Ripple pool
    const ripples: { x: number; y: number; age: number; maxAge: number; size: number }[] = [];
    const spawnRipple = () => {
      ripples.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        age: 0,
        maxAge: 180 + Math.random() * 120,
        size: 20 + Math.random() * 40,
      });
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      time += 0.002;

      // Slowly shifting background gradient with blue → teal → soft green
      const angle = time * 0.3;
      const grad = ctx.createLinearGradient(
        w * 0.5 + Math.sin(angle) * w * 0.4,
        Math.sin(angle * 0.7) * h * 0.1,
        w * 0.5 + Math.cos(angle * 0.8) * w * 0.4,
        h + Math.cos(angle * 0.5) * h * 0.1
      );
      grad.addColorStop(0, 'hsl(200, 22%, 97%)');
      grad.addColorStop(0.3, 'hsl(195, 30%, 95%)');
      grad.addColorStop(0.55, 'hsl(180, 28%, 93%)');
      grad.addColorStop(0.8, 'hsl(168, 25%, 94%)');
      grad.addColorStop(1, 'hsl(195, 20%, 96%)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Flowing wave layers (blue, teal, green)
      const waveConfigs = [
        { speed: 0.35, amp: 35, yPct: 0.25, hue: 200, sat: 55, light: 58, alpha: 0.03 },
        { speed: 0.28, amp: 28, yPct: 0.45, hue: 187, sat: 60, light: 52, alpha: 0.025 },
        { speed: 0.22, amp: 22, yPct: 0.6, hue: 174, sat: 50, light: 50, alpha: 0.03 },
        { speed: 0.18, amp: 18, yPct: 0.75, hue: 165, sat: 40, light: 55, alpha: 0.02 },
      ];

      for (const wc of waveConfigs) {
        ctx.globalAlpha = wc.alpha;
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 3) {
          const y =
            h * wc.yPct +
            Math.sin(x * 0.0025 + time * wc.speed) * wc.amp +
            Math.sin(x * 0.006 - time * wc.speed * 0.7) * wc.amp * 0.4 +
            Math.cos(x * 0.0015 + time * wc.speed * 0.4) * wc.amp * 0.25;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = `hsl(${wc.hue}, ${wc.sat}%, ${wc.light}%)`;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Ripples
      if (Math.random() < 0.015) spawnRipple();

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.age++;
        if (r.age > r.maxAge) {
          ripples.splice(i, 1);
          continue;
        }

        const progress = r.age / r.maxAge;
        const ease = 1 - Math.pow(1 - progress, 3);
        const radius = r.size * ease;
        const alpha = (1 - progress) * (1 - progress) * 0.07;

        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(195, 65%, 55%, ${alpha})`;
        ctx.lineWidth = 1.5 * (1 - progress);
        ctx.stroke();

        if (progress < 0.5) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, radius * 0.45, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(174, 55%, 50%, ${alpha * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
