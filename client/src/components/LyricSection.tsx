/**
 * LyricSection — Seção fullscreen com fundo de imagem e texto da letra.
 * Design: "Chama Viva" — Cinematográfico Escuro
 * Cada seção é uma "cena" da música com parallax e fade-in.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface LyricSectionProps {
  bgImage: string;
  title: string;
  lines: string[];
  subtitle?: string;
  overlayOpacity?: number;
  index: number;
}

export default function LyricSection({
  bgImage,
  title,
  lines,
  subtitle,
  overlayOpacity = 0.55,
  index,
}: LyricSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const offset = rect.top / window.innerHeight;
        setScrollY(offset);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxY = scrollY * 40;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden snap-start"
    >
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
        style={{
          backgroundImage: `url(${bgImage})`,
          transform: `translateY(${parallaxY}px) scale(1.05)`,
          transition: "transform 0.1s linear",
        }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(5,5,5,${overlayOpacity + 0.15}) 0%,
            rgba(5,5,5,${overlayOpacity - 0.1}) 40%,
            rgba(5,5,5,${overlayOpacity}) 60%,
            rgba(5,5,5,${overlayOpacity + 0.2}) 100%
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Gold line top */}
        <motion.div
          initial={{ width: 0 }}
          animate={isVisible ? { width: "100%" } : {}}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="gold-line mx-auto mb-8"
          style={{ maxWidth: "200px" }}
        />

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wider mb-8 animate-glow-pulse"
          style={{
            fontFamily: "'Cinzel', serif",
            color: "#d4a853",
            textShadow: "0 0 30px rgba(212, 168, 83, 0.4), 0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {title}
        </motion.h2>

        {/* Gold line after title */}
        <motion.div
          initial={{ width: 0 }}
          animate={isVisible ? { width: "100%" } : {}}
          transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
          className="gold-line-thick mx-auto mb-10"
          style={{ maxWidth: "300px" }}
        />

        {/* Lyrics lines */}
        <div className="space-y-4">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.8 + i * 0.25,
                ease: "easeOut",
              }}
              className="text-xl sm:text-2xl md:text-3xl leading-relaxed"
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 300,
                color: "#fff5e6",
                textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                letterSpacing: "0.02em",
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.5 + lines.length * 0.25 }}
          >
            <div className="gold-line mx-auto mt-10 mb-4" style={{ maxWidth: "150px" }} />
            <p
              className="text-base sm:text-lg tracking-widest uppercase"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#d4a85399",
              }}
            >
              {subtitle}
            </p>
          </motion.div>
        )}

        {/* Gold line bottom */}
        <motion.div
          initial={{ width: 0 }}
          animate={isVisible ? { width: "100%" } : {}}
          transition={{ duration: 1.5, delay: 1.2 + lines.length * 0.2, ease: "easeOut" }}
          className="gold-line mx-auto mt-8"
          style={{ maxWidth: "200px" }}
        />
      </div>

      {/* Section number indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 0.15 } : {}}
        transition={{ duration: 2, delay: 1 }}
        className="absolute bottom-8 right-8 text-8xl font-heading"
        style={{
          fontFamily: "'Cinzel', serif",
          color: "#d4a853",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.div>
    </section>
  );
}
