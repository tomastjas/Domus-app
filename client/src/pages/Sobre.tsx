/**
 * Sobre — Página "Sobre o DOMUS"
 * Design: "Lumen Argentum" — Elegância Litúrgica Moderna
 * Conteúdo: História, missão e significado dos pilares
 */
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { BookOpen, Flame, Handshake, Heart } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import { ADMIN_EMAILS } from "@/hooks/useAuthorization";

/* ─── CDN URLs ─── */
const IMG = {
  sinal: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_pingente_540d99c3.jpg",
};

export default function Sobre() {
  const [mounted, setMounted] = useState(false);

  const isAdmin = useMemo(() => {
    try {
      const stored = localStorage.getItem("domus_user");
      if (!stored) return false;
      const user = JSON.parse(stored);
      return ADMIN_EMAILS.includes(user.email?.toLowerCase());
    } catch { return false; }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg tracking-[0.2em] uppercase" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
              DOMUS
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60" style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}>
                Início
              </Link>
              <Link href="/sobre" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-100" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
                Sobre
              </Link>
              <Link href="/estudos" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60" style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}>
                Estudos
              </Link>
              <Link href="/musicas" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60" style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}>
                Músicas
              </Link>
              <Link href="/comunidade" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60" style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}>
                Comunidade
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-80" style={{ fontFamily: "'Cinzel', serif", color: "#e8a040" }}>
                  ⚙ Admin
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <MobileMenu
              links={[
                { label: "Início", href: "/", isRoute: true },
                { label: "Sobre", href: "/sobre", isRoute: true },
                { label: "Estudos", href: "/estudos", isRoute: true },
                { label: "Músicas", href: "/musicas", isRoute: true },
                { label: "Comunidade", href: "/comunidade", isRoute: true },
              ]}
            />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl mb-4 tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
            SOBRE O DOMUS
          </h1>
          <p className="text-lg md:text-xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
            Conheça a história e a missão da comunidade DOMUS
          </p>
          <p className="text-sm tracking-[0.1em] uppercase opacity-60" style={{ color: "#d4af37" }}>
            Oração, Estudo, Missão
          </p>
        </motion.div>
      </section>

      {/* HISTÓRIA */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl mb-6 tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
              Nossa História
            </h2>
            <p className="mb-4 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
              DOMUS é uma comunidade de formação espiritual cristã fundada sobre três pilares fundamentais: <strong style={{ color: "#c9822a" }}>Oração</strong>, <strong style={{ color: "#d4af37" }}>Estudo</strong> e <strong style={{ color: "#e8a87c" }}>Missão</strong>.
            </p>
            <p className="mb-4 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
              Nascida da convicção de que a vida cristã se constrói através da intimidade com Deus, do conhecimento profundo de Sua Palavra e do compromisso missionário, DOMUS oferece um caminho estruturado de 21 dias para transformação espiritual.
            </p>
            <p className="leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
              Cada participante é convidado a viver uma experiência de adoração, aprendizado e entrega, descobrindo sua vocação dentro da família de Deus.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <img
              src={IMG.sinal}
              alt="Pingente DOMUS"
              className="w-64 h-64 object-cover rounded-lg shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* OS TRÊS PILARES */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl mb-12 tracking-[0.05em] text-center" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
            Os Três Pilares
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ORAÇÃO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <Handshake size={32} style={{ color: "#c9822a" }} />
                <h3 className="text-2xl tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
                  ORAÇÃO
                </h3>
              </div>
              <p className="leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
                A oração é o coração da vida cristã. Através da oração, nos conectamos com Deus, compartilhamos nossos anseios e recebemos força para prosseguir. Na primeira semana de DOMUS, aprofundamos nossa intimidade com o Pai através da contemplação, intercessão e adoração.
              </p>
            </motion.div>

            {/* ESTUDO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <BookOpen size={32} style={{ color: "#d4af37" }} />
                <h3 className="text-2xl tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#d4af37" }}>
                  ESTUDO
                </h3>
              </div>
              <p className="leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
                O estudo da Palavra de Deus nos transforma e nos equipa. Na segunda semana, mergulhamos nas Escrituras, compreendendo os ensinamentos de Jesus e dos apóstolos. Cada dia traz uma reflexão profunda que nos leva a um entendimento mais claro da vontade divina.
              </p>
            </motion.div>

            {/* MISSÃO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <Flame size={32} style={{ color: "#e8a87c" }} />
                <h3 className="text-2xl tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#e8a87c" }}>
                  MISSÃO
                </h3>
              </div>
              <p className="leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
                A missão é a expressão viva de nossa fé. Na terceira semana, somos chamados a levar a chama do Evangelho ao mundo. Através da ação, testemunho e serviço, nos tornamos instrumentos da graça de Deus, transformando vidas e comunidades.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SIGNIFICADO DO PINGENTE */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl mb-12 tracking-[0.05em] text-center" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
          O Sinal DOMUS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="mb-6 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
                O sinal em formato de cruz é o símbolo visual de DOMUS, representando os três pilares em perfeita harmonia:
              </p>

              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                  <p className="text-sm tracking-[0.1em] uppercase mb-2" style={{ color: "#c9822a" }}>
                    🙌🏻 Mãos em Oração
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
                    Representa a oração e a intimidade com Deus. Símbolo da humildade e da entrega ao Pai.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                  <p className="text-sm tracking-[0.1em] uppercase mb-2" style={{ color: "#d4af37" }}>
                    📖 Bíblia
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
                    Representa o estudo e o conhecimento da Palavra de Deus. Símbolo da sabedoria e transformação.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                  <p className="text-sm tracking-[0.1em] uppercase mb-2" style={{ color: "#e8a87c" }}>
                    🔥 Chama
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
                    Representa a missão e o Espírito Santo. Símbolo do fogo divino que nos impulsiona a servir.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="text-center">
                <p className="text-6xl mb-4">✝️</p>
                <p className="text-sm opacity-60" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  A cruz representa a redenção em Cristo, centro de toda nossa fé e missão.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* MISSÃO */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl mb-6 tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
            Nossa Missão
          </h2>
          <p className="text-lg mb-8 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
            Formar discípulos de Jesus Cristo através de uma jornada integrada de oração profunda, estudo transformador e missão ativa. Queremos ser uma comunidade que adora, aprende e serve, levando a graça de Deus a todos os cantos do mundo.
          </p>
          <Link
            href="/estudos"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border transition-all duration-300 hover:border-white/30"
            style={{ borderColor: "#c9822a", color: "#c9822a" }}
          >
            Comece Sua Jornada
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-sm opacity-60">
        <p>DOMUS — Oração, Estudo, Missão © 2026</p>
      </footer>
    </div>
  );
}
