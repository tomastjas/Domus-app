/**
 * Músicas — Página de Músicas DOMUS
 * Design: "Lumen Argentum" — Elegância Litúrgica Moderna
 * Conteúdo: Letras de músicas de adoração e louvor com player e favoritos
 */
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Music, ChevronRight, Heart, Play, Pause } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import { useFavoritos } from "@/hooks/useFavoritos";
import { ADMIN_EMAILS } from "@/hooks/useAuthorization";

/* ─── DADOS DAS MÚSICAS ─── */
const MUSICAS = [
  {
    id: 1,
    titulo: "Vou Te Adorar",
    autor: "DOMUS",
    categoria: "Adoração",
    letra: `Senhor dai-me forças para prosseguir,
Pois eu sei que só conseguirei em Ti,
Sei que Estais preparando o fim
De todo esse tormento,

De todo esse sofrimento,
São tantas as tentações,
São tantas as tribulações,
Querendo me afastar,
Mas sei que o amor que Tens por mim
Me faz querer ir até o fim,
Meu Deus, eu confiarei em Ti.

Pai, eu vou te adorar,
Com toda a minha força eu vou te louvar,
Viver desse amor é a minha essência
E com a minha voz eu vou louvar tua Existência.`,
  },
  {
    id: 2,
    titulo: "Lindo És",
    autor: "DOMUS",
    categoria: "Louvor",
    letra: `Lindo és meu Deus
Lindo és meu Pai
Como humildade filho teu
Te peço perdão

Sei que não sou digno
Desse teu amor
Mas quero aproveitar
Cada minuto junto a ti

Quero sentir tua presença
Tocar a minha alma senhor
Reacender minha chama 
Vem ser o meu guia senhor (bis)
Vem ser o meu guia de amor`,
  },
  {
    id: 3,
    titulo: "Deus Te Quer",
    autor: "DOMUS",
    categoria: "Esperança",
    letra: `Deus te quer aqui por perto
Deus te quer e já tá certo
Deus te quer fazer feliz                           
Como você sempre quis

Pra quê chorar e se maltratar                                                                         
Se tem um Deus alí em cima capaz de te ajudar
Pra quê falar e se maldizer                                                                                  
Se tem um Deus alí em cima que faz de tudo por você

Quem nunca chorou e Deus consolou
Quem nunca sofreu e a vida viveu (2x)
Deus te chama vê se aceita
Deus te clama filho me aceita

Deus te quer aqui por perto
Deus te quer e já tá certo
Deus te quer fazer feliz 
Como você sempre quis (2x)`,
  },
];

export default function Musicas() {
  const [mounted, setMounted] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const { isFavorito, toggleFavorito } = useFavoritos();

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
    const user = localStorage.getItem("domus_current_user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const filteredMusicas = filterCategory === "Todos"
    ? MUSICAS
    : MUSICAS.filter(m => m.categoria === filterCategory);

  const categories = ["Todos", ...Array.from(new Set(MUSICAS.map(m => m.categoria)))];

  const togglePlay = (musicaId: number) => {
    setPlayingId(playingId === musicaId ? null : musicaId);
  };

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
              <Link href="/sobre" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60" style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}>
                Sobre
              </Link>
              <Link href="/estudos" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60" style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}>
                Estudos
              </Link>
              <Link href="/musicas" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-100" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
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
          <div className="flex items-center justify-center gap-3 mb-6">
            <Music size={40} style={{ color: "#c9822a" }} />
          </div>
          <h1 className="text-5xl md:text-6xl mb-4 tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
            MÚSICAS
          </h1>
          <p className="text-lg md:text-xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
            Letras de adoração, louvor e esperança
          </p>
          <p className="text-sm tracking-[0.1em] uppercase opacity-60" style={{ color: "#d4af37" }}>
            Cante com o coração
          </p>
        </motion.div>
      </section>

      {/* FILTROS */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex gap-2 justify-center flex-wrap"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 text-sm tracking-[0.1em] uppercase ${
                filterCategory === category
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 hover:border-white/20"
              }`}
              style={{
                color: filterCategory === category ? "#c9822a" : "#b8b8b8",
              }}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </section>

      {/* GRID DE MÚSICAS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMusicas.map((musica, idx) => (
            <motion.div
              key={musica.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm tracking-[0.1em] uppercase opacity-60 mb-2" style={{ color: "#d4af37" }}>
                    {musica.categoria}
                  </p>
                  <h3 className="text-2xl tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
                    {musica.titulo}
                  </h3>
                </div>
                {isLoggedIn && (
                  <button
                    onClick={() => toggleFavorito(musica.id)}
                    className="transition-all duration-300 hover:scale-110"
                  >
                    <Heart
                      size={24}
                      style={{
                        color: isFavorito(musica.id) ? "#e8a87c" : "#b8b8b8",
                        fill: isFavorito(musica.id) ? "#e8a87c" : "none",
                      }}
                    />
                  </button>
                )}
              </div>

              <p className="text-sm opacity-60 mb-4">Por {musica.autor}</p>

              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => togglePlay(musica.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 hover:border-white/30"
                  style={{ borderColor: "#d4af37", color: "#d4af37" }}
                >
                  {playingId === musica.id ? (
                    <>
                      <Pause size={16} />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Tocar
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedMusic(selectedMusic === musica.id ? null : musica.id)}
                  className="flex items-center gap-2 text-sm transition-all duration-300"
                  style={{ color: "#d4af37" }}
                >
                  {selectedMusic === musica.id ? "Fechar" : "Ver Letra"}
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* PLAYER SIMULADO */}
              {playingId === musica.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 pt-4 border-t border-white/10"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full"
                          style={{ backgroundColor: "#d4af37" }}
                          animate={{ width: ["0%", "100%"] }}
                          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                      <span className="text-xs opacity-60">3:00</span>
                    </div>
                    <p className="text-xs opacity-60">▶ Tocando agora...</p>
                  </div>
                </motion.div>
              )}

              {/* LETRA EXPANDIDA */}
              {selectedMusic === musica.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}
                  >
                    {musica.letra}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl mb-6 tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
            Cante com Devoção
          </h2>
          <p className="text-lg mb-8 opacity-60" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Que estas músicas toquem seu coração e fortaleçam sua fé.
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-sm opacity-60">
        <p>DOMUS — Oração, Estudo, Missão © 2026</p>
      </footer>
    </div>
  );
}
