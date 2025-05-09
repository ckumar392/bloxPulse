import React, { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { colors } from '../theme/theme';

const ParticleCanvas = styled('canvas')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  opacity: 0.25,
  backgroundColor: '#F8F9FA', // subtle off-white background
  filter: 'blur(1px)',
});

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  baseX: number;
  baseY: number;
  angle: number;
  color: string;
  opacity: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const particleColors = [
        'rgba(37,99,235,0.6)',   // Primary (Blue): #2563EB
        'rgba(22,163,74,0.5)',   // Secondary (Green): #16A34A
        'rgba(107,114,128,0.4)', // Tertiary (Gray): #6B7280
        'rgba(59,130,246,0.45)'  // Blue: #3B82F6
      ];

      const particles: Particle[] = [];
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1.2 + 0.3; // Slightly smaller particles
        particles.push({
          x,
          y,
          size,
          speedX: (Math.random() - 0.5) * 0.4, // Slower movement
          speedY: (Math.random() - 0.5) * 0.4,
          baseX: x,
          baseY: y,
          angle: Math.random() * Math.PI * 2,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
          opacity: Math.random() * 0.6 + 0.1, // More subtle opacity
        });
      }
      particlesRef.current = particles;
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Interactive shift with mouse movement - more subtle
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 150 - dist) / 150 * 0.6; // Reduced influence

        p.angle += 0.005; // Slower rotation
        p.x += p.speedX + Math.sin(p.angle) * 0.15 + (dx / 2000) * influence;
        p.y += p.speedY + Math.cos(p.angle) * 0.15 + (dy / 2000) * influence;

        // Reset if out of bounds
        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6; // Reduced glow for subtlety
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Connections - more professional and subtle
      particlesRef.current.forEach((a, i) => {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const b = particlesRef.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) { // Slightly longer connections
            const opacity = 0.01 + (1 - dist / 110) * 0.05; // More subtle connections
            ctx.beginPath();
            // Use primary blue for connections
            ctx.strokeStyle = `rgba(37,99,235,${opacity})`;
            ctx.lineWidth = 0.2; // Thinner lines
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return <ParticleCanvas ref={canvasRef} />;
};

export default ParticleBackground;