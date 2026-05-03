/**
 * DomusHome — Página principal do site DOMUS
 * Design: "Lumen Argentum" — Elegância Litúrgica Moderna
 * Paleta: couro escuro + prata + âmbar dourado
 * Seções: Hero → Lema → Pilares → Oração → Rodapé
 */
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import MobileMenu from "@/components/MobileMenu";
import { ADMIN_EMAILS } from "@/hooks/useAuthorization";

/* ─── CDN URLs ─── */
const IMG = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_hero_bg-NonFFxCQXSj6YkiRLiTDT9.webp",
  sinal: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_pingente_540d99c3.jpg",
  oracao: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_oracao-HfqzpvXxH8FRG9q4ZLBvxh.webp",
  estudo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_estudo-TzcXDfD7sVFrhUUo2n3zFc.webp",
  missao: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_missao-MYvQXDHuMMQKdqfQtUyuhB.webp",
  oracaoSection: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_oracao_section-ZcHndfuZb26462KnPNWSzP.webp",
};

/* ─── Scroll-triggered visibility hook ─── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ═══════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Verificar se o usuário logado é admin
  const isAdmin = useMemo(() => {
    try {
      const stored = localStorage.getItem("domus_user");
      if (!stored) return false;
      const user = JSON.parse(stored);
      return ADMIN_EMAILS.includes(user.email?.toLowerCase());
    } catch { return false; }
  }, []);

  const links = [
    { label: "Início", href: "#hero" },
    { label: "Pilares", href: "#pilares" },
    { label: "Oração", href: "#oracao" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(13,11,9,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(184,184,184,0.08)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <span
            className="text-xl tracking-[0.25em] uppercase transition-colors duration-300"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Domus
          </span>
        </a>
        <div className="hidden sm:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-50"
              style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/sobre"
            className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Sobre
          </Link>
          <Link
            href="/estudos"
            className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-80"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}
          >
            Estudos
          </Link>
          <Link
            href="/diario"
            className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Diário
          </Link>
          <Link
            href="/comunidade"
            className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Comunidade
          </Link>
          <Link
            href="/musicas"
            className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Músicas
          </Link>
          <Link
            href="/agenda"
            className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Agenda
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-80"
              style={{ fontFamily: "'Cinzel', serif", color: "#e8a040" }}
            >
              ⚙ Admin
            </Link>
          )}
        </div>
        <MobileMenu
          links={[
            { label: "Início", href: "#hero" },
            { label: "Pilares", href: "#pilares" },
            { label: "Oração", href: "#oracao" },
            { label: "Estudos", href: "/estudos", isRoute: true, highlight: true },
            { label: "Diário", href: "/diario", isRoute: true },
            { label: "Comunidade", href: "/comunidade", isRoute: true },
            { label: "Músicas", href: "/musicas", isRoute: true },
            { label: "Sobre", href: "/sobre", isRoute: true },
            { label: "Agenda", href: "/agenda", isRoute: true },
            ...(isAdmin ? [{ label: "⚙ Admin", href: "/admin", isRoute: true, highlight: true }] : []),
          ]}
        />
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════ */
function HeroSection() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-end justify-center overflow-hidden pb-16 sm:pb-24">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
        style={{ backgroundImage: `url(${IMG.hero})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(13,11,9,0.15) 0%, rgba(13,11,9,0.1) 30%, rgba(13,11,9,0.45) 55%, rgba(13,11,9,0.92) 80%, rgba(13,11,9,0.99) 100%)",
        }}
      />

      {/* Intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "#0d0b09" }}
          >
            <motion.div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="w-24 h-24 mx-auto mb-8 rounded-full overflow-hidden"
                style={{ border: "2px solid #b8b8b830" }}
              >
                <img src={IMG.sinal} alt="DOMUS" className="w-full h-full object-cover" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-4xl sm:text-5xl tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
              >
                Domus
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "180px" }}
                transition={{ duration: 1.2, delay: 1 }}
                className="silver-line-thick mx-auto mt-5"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="mt-5 text-xs tracking-[0.35em] uppercase"
                style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
              >
                Oration · Studium · Missio
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 3.2 }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.2em] uppercase text-emboss animate-metallic"
          style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
        >
          Domus
        </h1>

        <div className="silver-line-thick mx-auto mt-6 mb-6" style={{ maxWidth: "350px" }} />

        <p
          className="text-lg sm:text-xl tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Cinzel', serif", color: "#c9822a", textShadow: "0 0 20px #c9822a15" }}
        >
          Oration, Studium et Missio
        </p>

        <p
          className="mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontStyle: "italic", color: "#b8b8b8a0" }}
        >
          A oração permanece, o estudo aprofunda, a missão se cumpre.
          <br />
          Assim vamos servir ao Senhor.
        </p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 5, duration: 1 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="text-[10px] tracking-[0.4em] uppercase"
              style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b850" }}
            >
              Explorar
            </span>
            <div className="w-[1px] h-10" style={{ background: "linear-gradient(to bottom, #b8b8b840, transparent)" }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   LEMA SECTION
   ═══════════════════════════════════════════════════ */
function LemaSection() {
  const { ref, visible } = useInView(0.3);

  return (
    <section ref={ref} className="relative py-28 sm:py-36 overflow-hidden leather-texture">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, #0d0b09, #1a1410, #0d0b09)" }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="silver-line mx-auto mb-12" style={{ maxWidth: "200px" }} />

          <h2
            className="text-2xl sm:text-3xl md:text-4xl tracking-[0.15em] uppercase mb-8 text-emboss-gold"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}
          >
            Os Três Pilares
          </h2>

          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10">
            <div className="amber-line" style={{ maxWidth: "80px" }} />
            <span
              className="text-xs sm:text-sm tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b860" }}
            >
              Oration · Studium · Missio
            </span>
            <div className="amber-line" style={{ maxWidth: "80px" }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 max-w-3xl mx-auto">
            {[
              { icon: "🙏", latin: "Oration", pt: "Oração", desc: "As mãos em oração — nosso diálogo com Deus" },
              { icon: "📖", latin: "Studium", pt: "Estudo", desc: "A Bíblia — aprofundando na Palavra" },
              { icon: "🔥", latin: "Missio", pt: "Missão", desc: "A Chama — mantendo acesa por Deus" },
            ].map((p, i) => (
              <motion.div
                key={p.latin}
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.2 }}
                className="text-center"
              >
                <div className="text-4xl mb-3">{p.icon}</div>
                <p
                  className="text-lg tracking-[0.15em] uppercase mb-1"
                  style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
                >
                  {p.latin}
                </p>
                <p
                  className="text-sm tracking-wider"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#b8b8b860" }}
                >
                  {p.pt}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="silver-line mx-auto mt-12" style={{ maxWidth: "200px" }} />
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   PILARES SECTION (detailed)
   ═══════════════════════════════════════════════════ */
const PILARES = [
  {
    id: "oracao",
    latin: "Oration",
    title: "Oração",
    desc: "As mãos significam Oração — nosso canal de comunicação com o Pai. A oração permanece como alicerce da nossa fé, sustentando cada passo da nossa caminhada.",
    image: IMG.oracao,
    align: "left" as const,
  },
  {
    id: "estudo",
    latin: "Studium",
    title: "Estudo",
    desc: "A Bíblia significa Estudo — o aprofundamento na Palavra de Deus. Através do estudo, compreendemos Sua vontade e fortalecemos nossa fé com conhecimento e sabedoria.",
    image: IMG.estudo,
    align: "right" as const,
  },
  {
    id: "missao",
    latin: "Missio",
    title: "Missão",
    desc: "A Chama significa a Missão — mantendo a nossa chama acesa por Deus. A missão se cumpre quando levamos Sua luz ao mundo, servindo ao Senhor com fervor e dedicação.",
    image: IMG.missao,
    align: "left" as const,
  },
];

function PilarCard({ pilar, index }: { pilar: typeof PILARES[0]; index: number }) {
  const { ref, visible } = useInView(0.15);
  const isLeft = pilar.align === "left";

  return (
    <div ref={ref} className="relative">
      <div className={`flex flex-col ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8 lg:gap-16`}>
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full lg:w-5/12 flex-shrink-0"
        >
          <div
            className="relative overflow-hidden rounded-sm aspect-[3/4] max-w-sm mx-auto lg:max-w-none"
            style={{ border: "1px solid #b8b8b812" }}
          >
            <img
              src={pilar.image}
              alt={pilar.title}
              className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(13,11,9,0.5) 0%, transparent 50%)" }}
            />
            {/* Latin label */}
            <div className="absolute bottom-6 left-6">
              <p
                className="text-xs tracking-[0.4em] uppercase"
                style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b860" }}
              >
                {String(index + 1).padStart(2, "0")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className={`w-full lg:w-7/12 ${isLeft ? "lg:text-left" : "lg:text-right"} text-center`}
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a80" }}
          >
            {pilar.latin}
          </p>
          <h3
            className="text-3xl sm:text-4xl md:text-5xl tracking-[0.1em] uppercase mb-6 text-emboss"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            {pilar.title}
          </h3>
          <div
            className={`amber-line mb-8 ${isLeft ? "lg:mr-auto" : "lg:ml-auto"} mx-auto`}
            style={{ maxWidth: "120px" }}
          />
          <p
            className="text-lg sm:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              color: "#b8b8b8b0",
              lineHeight: 1.8,
            }}
          >
            {pilar.desc}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function PilaresSection() {
  return (
    <section id="pilares" className="relative py-24 sm:py-32">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, #0d0b09, #14110e, #0d0b09)" }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-6 space-y-28 sm:space-y-36">
        {PILARES.map((p, i) => (
          <PilarCard key={p.id} pilar={p} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ORAÇÃO SECTION
   ═══════════════════════════════════════════════════ */
const ORACAO_ESTROFES = [
  {
    lines: [
      "Senhor dai-me forças para prosseguir,",
      "Pois eu sei que só conseguirei em Ti,",
      "Sei que Estais preparando o fim",
      "De todo esse tormento,",
    ],
  },
  {
    lines: [
      "De todo esse sofrimento,",
      "São tantas as tentações,",
      "São tantas as tribulações,",
      "Querendo me afastar,",
    ],
  },
  {
    lines: [
      "Mas sei que o amor que Tens por mim",
      "Me faz querer ir até o fim,",
      "Meu Deus, eu confiarei em Ti.",
    ],
  },
  {
    lines: [
      "Pai, eu vou te adorar,",
      "Com toda a minha força eu vou te louvar,",
      "Viver desse amor é a minha essência",
      "E com a minha voz eu vou louvar tua Existência.",
    ],
  },
];

function OracaoSection() {
  const { ref, visible } = useInView(0.15);

  return (
    <section id="oracao" ref={ref} className="relative py-24 sm:py-36 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMG.oracaoSection})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(13,11,9,0.92) 0%, rgba(13,11,9,0.8) 30%, rgba(13,11,9,0.8) 70%, rgba(13,11,9,0.95) 100%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="silver-line mx-auto mb-10" style={{ maxWidth: "150px" }} />

          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a80" }}
          >
            Nossa Oração
          </p>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl tracking-[0.12em] uppercase mb-4 text-emboss"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Oração Domus
          </h2>

          <div className="amber-line-thick mx-auto mb-14" style={{ maxWidth: "250px" }} />
        </motion.div>

        {/* Estrofes */}
        <div className="space-y-10">
          {ORACAO_ESTROFES.map((estrofe, ei) => (
            <motion.div
              key={ei}
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + ei * 0.3 }}
            >
              {estrofe.lines.map((line, li) => (
                <p
                  key={li}
                  className="text-lg sm:text-xl md:text-2xl leading-relaxed mb-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "#d4d4d4d0",
                    lineHeight: 1.9,
                  }}
                >
                  {line}
                </p>
              ))}
              {ei < ORACAO_ESTROFES.length - 1 && (
                <div className="silver-line mx-auto mt-8" style={{ maxWidth: "60px" }} />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 2 }}
        >
          <div className="amber-line mx-auto mt-14 mb-6" style={{ maxWidth: "150px" }} />
          <p
            className="text-sm tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a50" }}
          >
            Amém
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="relative py-20 text-center" style={{ background: "#0d0b09" }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="silver-line mx-auto mb-10" style={{ maxWidth: "120px" }} />

        {/* Pingente small */}
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden"
          style={{ border: "1px solid #b8b8b815" }}
        >
          <img src={IMG.sinal} alt="DOMUS" className="w-full h-full object-cover" />
        </div>

        <p
          className="text-lg tracking-[0.25em] uppercase mb-3"
          style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b850" }}
        >
          Domus
        </p>

        <p
          className="text-xs tracking-[0.2em] uppercase mb-6"
          style={{ fontFamily: "'Cinzel', serif", color: "#c9822a40" }}
        >
          Oration · Studium · Missio
        </p>

        <p
          className="text-sm max-w-md mx-auto leading-relaxed"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#b8b8b840",
          }}
        >
          A oração permanece, o estudo aprofunda, a missão se cumpre.
          <br />
          Assim vamos servir ao Senhor.
        </p>

        <div className="silver-line mx-auto mt-10" style={{ maxWidth: "80px" }} />
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════ */
export default function DomusHome() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const h = () => {
      const top = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(height > 0 ? top / height : 0);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="relative min-h-screen" style={{ background: "#0d0b09" }}>
      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
        <div
          className="h-full transition-all duration-150"
          style={{
            width: `${scrollProgress * 100}%`,
            background: "linear-gradient(90deg, #b8b8b840, #c9822a, #e8a832, #c9822a, #b8b8b840)",
          }}
        />
      </div>

      <Nav />
      <HeroSection />
      <LemaSection />
      <PilaresSection />
      <OracaoSection />
      <Footer />
    </div>
  );
}
