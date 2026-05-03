/**
 * Home — Página principal do site devocional DOMUS
 * Design: "Chama Viva" — Cinematográfico Escuro
 * Experiência imersiva de scroll com seções fullscreen para cada estrofe.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import LyricSection from "@/components/LyricSection";
import FireParticles from "@/components/FireParticles";
import { Images } from "lucide-react";

// CDN URLs
const IMAGES = {
  fundo1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/fundo_1_ceu_dourado_cd269943.jpg",
  fundo2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/fundo_2_luz_azul_53591333.jpg",
  fundo3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/fundo_3_chama_fogo_5db026b3.jpg",
  fundo4: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/fundo_4_presenca_0d1ff2fc.jpg",
  fundo5: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/fundo_5_aurora_64cc59be.jpg",
  concept: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/concept_art_guia_amor_6ca7e4cd.jpg",
};

const SECTIONS = [
  {
    bgImage: IMAGES.fundo1,
    title: "Lindo és meu Deus",
    lines: ["Lindo és meu Pai", "Como humildade filho teu", "Te peço perdão"],
    overlayOpacity: 0.5,
  },
  {
    bgImage: IMAGES.fundo2,
    title: "Sei que não sou digno",
    lines: ["Desse teu amor", "Mas quero aproveitar", "Cada minuto junto a ti"],
    overlayOpacity: 0.45,
  },
  {
    bgImage: IMAGES.fundo4,
    title: "Quero sentir",
    lines: ["tua presença", "Tocar a minha alma, Senhor", "Reacender minha chama"],
    overlayOpacity: 0.4,
  },
  {
    bgImage: IMAGES.fundo3,
    title: "Vem ser o meu guia",
    lines: ["Senhor", "", "Vem ser o meu guia", "de amor"],
    subtitle: "Refrão",
    overlayOpacity: 0.5,
  },
];

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative bg-[#050505] min-h-screen">
      {/* Fire particles overlay */}
      <FireParticles count={30} />

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px]">
        <div
          className="h-full transition-all duration-150"
          style={{
            width: `${scrollProgress * 100}%`,
            background: "linear-gradient(90deg, #d4622a, #d4a853, #e8a832)",
          }}
        />
      </div>

      {/* Gallery link */}
      <Link href="/galeria">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
          className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer hover:bg-white/5 transition-all duration-300"
          style={{
            borderColor: "#d4a85340",
            backdropFilter: "blur(10px)",
            background: "rgba(5,5,5,0.6)",
          }}
        >
          <Images size={18} style={{ color: "#d4a853" }} />
          <span
            className="text-sm tracking-wider uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#d4a853" }}
          >
            Galeria
          </span>
        </motion.div>
      </Link>

      {/* Intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
          >
            <motion.div className="text-center">
              {/* Cross symbol */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-6xl mb-6"
                style={{ color: "#d4a853" }}
              >
                ✝
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl tracking-[0.2em]"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "#d4a853",
                  textShadow: "0 0 40px rgba(212, 168, 83, 0.5)",
                }}
              >
                DOMUS
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "200px" }}
                transition={{ duration: 1.5, delay: 1 }}
                className="gold-line-thick mx-auto mt-6"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1, delay: 2 }}
                className="mt-6 text-sm tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#fff5e6" }}
              >
                Uma experiência devocional
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden snap-start">
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{ backgroundImage: `url(${IMAGES.concept})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(5,5,5,0.6) 0%, rgba(5,5,5,0.3) 40%, rgba(5,5,5,0.5) 70%, rgba(5,5,5,0.95) 100%)",
          }}
        />
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 3.5 }}
          >
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em] mb-6 animate-glow-pulse"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#d4a853",
                textShadow: "0 0 40px rgba(212, 168, 83, 0.5), 0 4px 8px rgba(0,0,0,0.8)",
              }}
            >
              DOMUS
            </h1>
            <div className="gold-line-thick mx-auto mb-8" style={{ maxWidth: "350px" }} />
            <p
              className="text-lg sm:text-xl tracking-wider"
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 300,
                color: "#fff5e6cc",
                textShadow: "0 2px 4px rgba(0,0,0,0.6)",
              }}
            >
              Lindo és meu Pai
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span
                className="text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Cinzel', serif", color: "#d4a85380" }}
              >
                Rolar
              </span>
              <div className="w-[1px] h-8" style={{ background: "linear-gradient(to bottom, #d4a85360, transparent)" }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Lyric sections */}
      {SECTIONS.map((section, i) => (
        <LyricSection key={i} index={i} {...section} />
      ))}

      {/* Final section — Concept Art */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden snap-start">
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{ backgroundImage: `url(${IMAGES.concept})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.7) 60%, rgba(5,5,5,0.95) 100%)",
          }}
        />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="gold-line mx-auto mb-10" style={{ maxWidth: "200px" }} />
            <h2
              className="text-3xl sm:text-4xl md:text-5xl tracking-[0.15em] mb-6 animate-glow-pulse"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#d4a853",
                textShadow: "0 0 30px rgba(212, 168, 83, 0.4)",
              }}
            >
              Vem ser o meu guia
            </h2>
            <p
              className="text-2xl sm:text-3xl md:text-4xl mb-8"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 400,
                color: "#fff5e6",
                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
              }}
            >
              de amor
            </p>
            <div className="gold-line-thick mx-auto mb-10" style={{ maxWidth: "300px" }} />
            <p
              className="text-base tracking-widest uppercase"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#d4a85360",
              }}
            >
              ✝
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 text-center" style={{ background: "#050505" }}>
        <div className="gold-line mx-auto mb-8" style={{ maxWidth: "120px" }} />
        <p
          className="text-sm tracking-widest uppercase mb-4"
          style={{ fontFamily: "'Cinzel', serif", color: "#d4a85350" }}
        >
          DOMUS
        </p>
        <p
          className="text-xs"
          style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#ffffff20" }}
        >
          Uma experiência devocional
        </p>
        <div className="mt-8">
          <Link href="/galeria">
            <span
              className="text-sm tracking-wider uppercase px-6 py-3 rounded-full border cursor-pointer hover:bg-white/5 transition-all duration-300 inline-block"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#d4a853",
                borderColor: "#d4a85330",
              }}
            >
              Ver Galeria de Artes
            </span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
