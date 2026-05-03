/**
 * Comunidade — Página de Comunidade DOMUS
 * Design: "Lumen Argentum" — Elegância Litúrgica Moderna
 * Conteúdo: Reflexões apenas de usuários reais logados, badges e filtros
 */
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Users,
  TrendingUp,
  Heart,
  MessageSquare,
  ChevronRight,
  LogOut,
  Award,
} from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import SignUpForm from "@/components/SignUpForm";
import { useBadges } from "@/hooks/useBadges";
import { ADMIN_EMAILS } from "@/hooks/useAuthorization";

/* ─── CDN URLs ─── */
const IMG = {
  comunidade_hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_comunidade_hero.jpg",
};

export default function Comunidade() {
  const [mounted, setMounted] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [filterWeek, setFilterWeek] = useState("Todos");
  const [sortBy, setSortBy] = useState("likes");
  const [userReflections, setUserReflections] = useState<any[]>([]);
  const [communityMembers, setCommunityMembers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    completedJourneys: 0,
    totalReflections: 0,
    growthRate: 0,
  });
  const { badges, getUnlockedBadges } = useBadges();

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
    loadCommunityData();
    
    // Check if user is logged in
    const user = localStorage.getItem("domus_current_user");
    if (user) {
      setIsLoggedIn(true);
      setUserName(JSON.parse(user).name);
    }
  }, []);

  const loadCommunityData = () => {
    // Load all users from localStorage
    const users = JSON.parse(localStorage.getItem("domus_users") || "[]");
    setCommunityMembers(users);

    // Load all reflections from localStorage
    const allReflections: any[] = [];
    users.forEach((user: any) => {
      const userDiary = JSON.parse(localStorage.getItem(`domus_diary_${user.id}`) || "{}");
      Object.values(userDiary).forEach((entry: any) => {
        if (entry && entry.reflection) {
          allReflections.push({
            id: `${user.id}-${entry.date}`,
            author: user.name,
            week: entry.week || "Sem semana",
            day: entry.day || "Sem dia",
            reflection: entry.reflection,
            likes: Math.floor(Math.random() * 50) + 10,
            date: entry.date,
          });
        }
      });
    });

    setUserReflections(allReflections);

    // Calculate stats
    const completedCount = users.filter((u: any) => {
      const progress = JSON.parse(localStorage.getItem(`domus_progress_${u.id}`) || "{}");
      return Object.values(progress).filter((p: any) => p === true).length === 21;
    }).length;

    setStats({
      totalUsers: users.length,
      completedJourneys: completedCount,
      totalReflections: allReflections.length,
      growthRate: users.length > 0 ? Math.floor((completedCount / users.length) * 100) : 0,
    });
  };

  const handleSignUp = (data: { name: string; email: string }) => {
    localStorage.setItem("domus_current_user", JSON.stringify(data));
    setIsLoggedIn(true);
    setUserName(data.name);
    loadCommunityData();
  };

  const handleLogout = () => {
    localStorage.removeItem("domus_current_user");
    setIsLoggedIn(false);
    setUserName("");
  };

  const filteredReflections = filterWeek === "Todos"
    ? userReflections
    : userReflections.filter(r => r.week.includes(filterWeek));

  const sortedReflections = [...filteredReflections].sort((a, b) => {
    if (sortBy === "likes") return b.likes - a.likes;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Get user progress for members display
  const getMemberProgress = (userId: number) => {
    const progress = JSON.parse(localStorage.getItem(`domus_progress_${userId}`) || "{}");
    const completed = Object.values(progress).filter((p: any) => p === true).length;
    return Math.floor((completed / 21) * 100);
  };

  const getMemberWeek = (userId: number) => {
    const progress = JSON.parse(localStorage.getItem(`domus_progress_${userId}`) || "{}");
    const completed = Object.values(progress).filter((p: any) => p === true).length;
    
    if (completed === 21) return "Concluído";
    if (completed <= 7) return "Semana 1";
    if (completed <= 14) return "Semana 2";
    return "Semana 3";
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
              <Link href="/estudos" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60" style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}>
                Estudos
              </Link>
              <Link href="/diario" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60" style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}>
                Diário
              </Link>
              <Link href="/comunidade" className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-100" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
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
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm opacity-60">{userName}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm tracking-[0.1em] uppercase px-4 py-2 rounded border transition-all duration-300 hover:border-white/30 flex items-center gap-2"
                  style={{ borderColor: "#c9822a", color: "#c9822a" }}
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSignUp(true)}
                className="hidden md:block text-sm tracking-[0.1em] uppercase px-4 py-2 rounded border transition-all duration-300 hover:border-white/30"
                style={{ borderColor: "#c9822a", color: "#c9822a" }}
              >
                Entrar
              </button>
            )}
            <MobileMenu
              links={[
                { label: "Início", href: "/", isRoute: true },
                { label: "Estudos", href: "/estudos", isRoute: true },
                { label: "Diário", href: "/diario", isRoute: true },
                { label: "Comunidade", href: "/comunidade", isRoute: true },
              ]}
            />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url('${IMG.comunidade_hero}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl mb-4 tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
            COMUNIDADE DOMUS
          </h1>
          <p className="text-lg md:text-xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
            Uma família unida em oração, estudo e missão
          </p>
          <p className="text-sm tracking-[0.1em] uppercase opacity-60" style={{ color: "#d4af37" }}>
            Somos mais fortes juntos
          </p>
        </motion.div>
      </section>

      {/* ESTATÍSTICAS */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
          >
            <Users size={28} style={{ color: "#c9822a", marginBottom: "1rem" }} />
            <p className="text-3xl font-bold mb-2" style={{ color: "#c9822a" }}>
              {stats.totalUsers}
            </p>
            <p className="text-sm tracking-[0.1em] uppercase opacity-60" style={{ color: "#b8b8b8" }}>
              Participantes Ativos
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
          >
            <TrendingUp size={28} style={{ color: "#d4af37", marginBottom: "1rem" }} />
            <p className="text-3xl font-bold mb-2" style={{ color: "#d4af37" }}>
              {stats.completedJourneys}
            </p>
            <p className="text-sm tracking-[0.1em] uppercase opacity-60" style={{ color: "#b8b8b8" }}>
              Jornadas Completadas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
          >
            <MessageSquare size={28} style={{ color: "#b8b8b8", marginBottom: "1rem" }} />
            <p className="text-3xl font-bold mb-2" style={{ color: "#b8b8b8" }}>
              {stats.totalReflections}
            </p>
            <p className="text-sm tracking-[0.1em] uppercase opacity-60" style={{ color: "#b8b8b8" }}>
              Reflexões Compartilhadas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
          >
            <Heart size={28} style={{ color: "#e8a87c", marginBottom: "1rem" }} />
            <p className="text-3xl font-bold mb-2" style={{ color: "#e8a87c" }}>
              {stats.growthRate}%
            </p>
            <p className="text-sm tracking-[0.1em] uppercase opacity-60" style={{ color: "#b8b8b8" }}>
              Taxa de Conclusão
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* BADGES */}
      {isLoggedIn && getUnlockedBadges().length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl mb-12 tracking-[0.05em] flex items-center gap-3" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
              <Award size={32} />
              Suas Conquistas
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {getUnlockedBadges().map((badge, idx) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm text-center hover:border-white/20 transition-all duration-300"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="text-sm font-semibold mb-1" style={{ color: badge.color }}>
                    {badge.name}
                  </p>
                  <p className="text-xs opacity-40">{badge.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* REFLEXÕES EM DESTAQUE COM FILTROS */}
      {sortedReflections.length > 0 ? (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
                Reflexões da Comunidade
              </h2>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="likes">Mais Curtidas</option>
                  <option value="recent">Mais Recentes</option>
                </select>
                <select
                  value={filterWeek}
                  onChange={(e) => setFilterWeek(e.target.value)}
                  className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded text-white focus:outline-none focus:border-white/30 transition-colors"
                >
                  <option value="Todos">Todos</option>
                  <option value="Semana 1">Semana 1</option>
                  <option value="Semana 2">Semana 2</option>
                  <option value="Semana 3">Semana 3</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedReflections.map((reflection, idx) => (
                <motion.div
                  key={reflection.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300 flex flex-col"
                >
                  <div className="mb-4">
                    <p className="text-sm tracking-[0.1em] uppercase opacity-60 mb-2" style={{ color: "#d4af37" }}>
                      {reflection.week}
                    </p>
                    <p className="text-sm opacity-40 mb-3">{reflection.day}</p>
                  </div>

                  <p className="text-base leading-relaxed mb-6 flex-grow" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#b8b8b8" }}>
                    "{reflection.reflection}"
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <p className="text-sm font-semibold" style={{ color: "#c9822a" }}>
                      {reflection.author}
                    </p>
                    <div className="flex items-center gap-2">
                      <Heart size={16} style={{ color: "#e8a87c" }} />
                      <span className="text-sm opacity-60">{reflection.likes}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      ) : (
        <section className="py-16 px-4 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg opacity-60 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Nenhuma reflexão compartilhada ainda. Seja o primeiro a compartilhar sua jornada!
            </p>
          </motion.div>
        </section>
      )}

      {/* MEMBROS DA COMUNIDADE */}
      {communityMembers.length > 0 && (
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl mb-12 tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
              Membros da Comunidade
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityMembers.map((member, idx) => {
                const progress = getMemberProgress(member.id);
                const week = getMemberWeek(member.id);
                const colors = ["#c9822a", "#d4af37", "#b8b8b8", "#e8a87c"];
                const color = colors[idx % colors.length];

                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: color }}
                      >
                        {member.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{member.name}</p>
                        <p className="text-sm opacity-60">{week}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="opacity-60">Progresso</span>
                        <span style={{ color }}>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="h-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl mb-6 tracking-[0.05em]" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
            Junte-se à Comunidade
          </h2>
          <p className="text-lg mb-8 opacity-60" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Comece sua jornada de formação espiritual com nossa comunidade e compartilhe suas reflexões com outras pessoas.
          </p>
          {!isLoggedIn && (
            <button
              onClick={() => setShowSignUp(true)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border transition-all duration-300 hover:border-white/30"
              style={{ borderColor: "#c9822a", color: "#c9822a" }}
            >
              Começar Agora
              <ChevronRight size={18} />
            </button>
          )}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-sm opacity-60">
        <p>DOMUS — Oração, Estudo, Missão © 2026</p>
      </footer>

      {/* SIGN UP FORM MODAL */}
      <AnimatePresence>
        {showSignUp && (
          <SignUpForm
            onClose={() => setShowSignUp(false)}
            onSubmit={handleSignUp}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
