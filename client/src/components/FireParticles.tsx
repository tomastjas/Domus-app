/**
 * FireParticles — Partículas de brasas/fogo flutuando para cima.
 * Design: "Chama Viva" — Cinematográfico Escuro
 * Cores: âmbar (#e8a832), dourado (#d4a853), laranja (#d4622a)
 */
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const COLORS = ["#e8a832", "#d4a853", "#d4622a", "#fff5e6", "#c9822a"];

export default function FireParticles({ count = 40 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = (): Particle => {
      const maxLife = 200 + Math.random() * 300;
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 50,
        size: 1 + Math.random() * 3,
        speedY: -(0.3 + Math.random() * 1.2),
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: 0.3 + Math.random() * 0.7,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0,
        maxLife,
      };
    };

    particlesRef.current = Array.from({ length: count }, createParticle);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        p.life++;
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.life * 0.02) * 0.3;

        const lifeRatio = p.life / p.maxLife;
        const alpha = p.opacity * (1 - lifeRatio);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.globalAlpha = alpha * 0.3;
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -20) {
          particlesRef.current[i] = createParticle();
        }
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}
