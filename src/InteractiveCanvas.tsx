import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface InteractiveCanvasProps {
  currentSection: number;
}

const PARTICLE_COUNT = 85;
const PARTICLE_COLORS = ['#155dfc', '#3b82f6', '#60a5fa', '#06b6d4', '#818cf8'];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number; alpha: number; color: string;
}

export default function InteractiveCanvas({ currentSection }: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const bgLoadedRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const animationIdRef = useRef<number>(0);
  const bgAlphaRef = useRef<number>(0); // for fade transition
  const currentSectionRef = useRef<number>(0);

  // Keep ref in sync with prop for use inside rAF
  useEffect(() => {
    currentSectionRef.current = currentSection;

    // Animate bgAlpha: 1 for section 0, 0 for the rest
    const target = currentSection === 0 ? 1 : 0;
    const proxy = { val: bgAlphaRef.current };
    gsap.to(proxy, {
      val: target,
      duration: 1.2,
      ease: 'power2.inOut',
      overwrite: true,
      onUpdate: () => { bgAlphaRef.current = proxy.val; },
    });
  }, [currentSection]);

  // Preload background.webp once (optimized, 149KB vs 1.8MB)
  useEffect(() => {
    const img = new Image();
    img.src = '/background.webp';
    img.onload = () => {
      bgImageRef.current = img;
      bgLoadedRef.current = true;
    };
  }, []);

  // ── Draw background.png (only for section 0, fades out for others) ──
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = '#000511';
    ctx.fillRect(0, 0, w, h);

    const img = bgImageRef.current;
    const alpha = bgAlphaRef.current;

    if (img && bgLoadedRef.current && alpha > 0.01) {
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const iw = img.naturalWidth * scale;
      const ih = img.naturalHeight * scale;
      const ix = (w - iw) / 2;
      const iy = (h - ih) / 2;

      ctx.save();
      ctx.globalAlpha = alpha * 0.72;
      ctx.drawImage(img, ix, iy, iw, ih);
      ctx.restore();
    }
  }, []);

  // ── Unified rAF Loop ──
  const runLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const mouse = mouseRef.current;

    // 1. Draw background (section 0 = bg.png, others = dark)
    drawBackground(ctx, w, h);

    // 2. Cyber grid (visible on all sections)
    ctx.save();
    ctx.strokeStyle = 'rgba(21, 93, 252, 0.04)';
    ctx.lineWidth = 1;
    const gs = 80;
    for (let x = 0; x < w; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.restore();

    // 3. Particles
    const pts = particlesRef.current;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;

      if (p.x < 0 || p.x > w) { p.vx *= -1; p.x = Math.max(0, Math.min(w, p.x)); }
      if (p.y < 0 || p.y > h) { p.vy *= -1; p.y = Math.max(0, Math.min(h, p.y)); }

      // Mouse attraction
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < 220) {
          const force = (220 - dist) / 22000;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          const speed = Math.hypot(p.vx, p.vy);
          if (speed > 1.5) { p.vx = (p.vx / speed) * 1.5; p.vy = (p.vy / speed) * 1.5; }
        }
      }

      // Glow dot
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Connecting lines
      for (let j = i + 1; j < pts.length; j++) {
        const p2 = pts[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 130) {
          ctx.save();
          ctx.globalAlpha = 0.2 * (1 - dist / 130);
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    animationIdRef.current = requestAnimationFrame(runLoop);
  }, [drawBackground]);

  // ── Init canvas, particles, events ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initParticles = () => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.55 + 0.2,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      }));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const onMouseLeave = () => { mouseRef.current.active = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    animationIdRef.current = requestAnimationFrame(runLoop);

    return () => {
      cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [runLoop]);

  return (
    <div className="fixed inset-0 z-0 bg-[#000511] overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* CRT Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.35) 2px,rgba(0,0,0,0.35) 4px)' }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,5,17,0.8) 100%)' }}
      />
    </div>
  );
}
