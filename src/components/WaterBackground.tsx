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
      time += 0.003;

      // Background gradient that shifts slowly
      const grad = ctx.createLinearGradient(
        w * 0.5 + Math.sin(time * 0.7) * w * 0.3,
        0,
        w * 0.5 + Math.cos(time * 0.5) * w * 0.3,
        h
      );
      grad.addColorStop(0, 'hsl(200, 20%, 97%)');
      grad.addColorStop(0.4, 'hsl(195, 30%, 94%)');
      grad.addColorStop(0.7, 'hsl(187, 35%, 92%)');
      grad.addColorStop(1, 'hsl(200, 20%, 96%)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Flowing wave layers
      ctx.globalAlpha = 0.035;
      for (let layer = 0; layer < 3; layer++) {
        const speed = 0.4 + layer * 0.15;
        const amplitude = 30 + layer * 15;
        const yOffset = h * (0.3 + layer * 0.2);
        const hue = 195 + layer * 8;

        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 4) {
          const y =
            yOffset +
            Math.sin(x * 0.003 + time * speed) * amplitude +
            Math.sin(x * 0.007 - time * speed * 0.6) * amplitude * 0.5 +
            Math.cos(x * 0.001 + time * speed * 0.3) * amplitude * 0.3;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = `hsl(${hue}, 60%, 55%)`;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Ripples
      if (Math.random() < 0.02) spawnRipple();

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.age++;
        if (r.age > r.maxAge) {
          ripples.splice(i, 1);
          continue;
        }

        const progress = r.age / r.maxAge;
        const radius = r.size * progress;
        const alpha = (1 - progress) * 0.06;

        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(199, 70%, 55%, ${alpha})`;
        ctx.lineWidth = 1.5 * (1 - progress);
        ctx.stroke();

        // Inner ring
        if (progress < 0.6) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, radius * 0.5, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(187, 60%, 50%, ${alpha * 0.5})`;
          ctx.lineWidth = 1;
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
