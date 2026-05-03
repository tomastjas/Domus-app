/**
 * Diário Espiritual — Página do Diário DOMUS
 * Design: "Lumen Argentum" — Elegância Litúrgica Moderna
 * Exibe reflexões pessoais salvas durante os estudos
 */
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft,
  PenLine,
  Trash2,
  BookOpen,
  Calendar,
  Filter,
} from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import { useDiary, type DiaryEntry } from "@/hooks/useDiary";
import { ADMIN_EMAILS } from "@/hooks/useAuthorization";

/* ─── CDN URLs ─── */
const IMG = {
  sinal: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/domus_pingente_540d99c3.jpg",
};

/* ═══════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════ */
function DiaryNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isAdmin = useMemo(() => {
    try {
      const stored = localStorage.getItem("domus_user");
      if (!stored) return false;
      const user = JSON.parse(stored);
      return ADMIN_EMAILS.includes(user.email?.toLowerCase());
    } catch { return false; }
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(13,11,9,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(184,184,184,0.08)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/estudos" className="flex items-center gap-3 group">
          <ArrowLeft size={16} style={{ color: "#b8b8b870" }} />
          <span
            className="text-sm tracking-[0.15em] uppercase transition-colors duration-300"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b870" }}
          >
            Estudos
          </span>
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:opacity-100 opacity-60"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Início
          </Link>
          <span
            className="text-sm tracking-[0.2em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}
          >
            Diário
          </span>
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
            { label: "Início", href: "/", isRoute: true },
            { label: "Estudos", href: "/estudos", isRoute: true },
            { label: "Diário", href: "/diario", isRoute: true, highlight: true },
          ]}
        />
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   DIARY ENTRY CARD
   ═══════════════════════════════════════════════════ */
function DiaryEntryCard({
  entry,
  onDelete,
  onUpdate,
}: {
  entry: DiaryEntry;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(entry.text);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const weekColors: Record<string, string> = {
    "Oração": "#b8b8b8",
    "Estudo": "#c9822a",
    "Missão": "#e8a832",
  };
  const color = weekColors[entry.weekLabel] || "#b8b8b8";

  const dateStr = new Date(entry.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${color}15`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: `1px solid ${color}10` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: color }}
          />
          <div>
            <p
              className="text-xs tracking-[0.15em] uppercase"
              style={{ fontFamily: "'Cinzel', serif", color: color + "90" }}
            >
              {entry.weekLabel} · {entry.dayLabel}
            </p>
            <p
              className="text-[10px] mt-1 flex items-center gap-1.5"
              style={{ color: "#b8b8b850", fontFamily: "'Source Sans 3', sans-serif" }}
            >
              <Calendar size={10} />
              {dateStr}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!editing && (
            <>
              <button
                onClick={() => { setEditing(true); setEditText(entry.text); }}
                className="p-1.5 transition-all duration-300 hover:bg-white/[0.05]"
                title="Editar"
              >
                <PenLine size={14} style={{ color: "#b8b8b850" }} />
              </button>
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-1.5 transition-all duration-300 hover:bg-red-500/10"
                  title="Excluir"
                >
                  <Trash2 size={14} style={{ color: "#b8b8b830" }} />
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="px-2 py-1 text-[10px] tracking-wider uppercase"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      color: "#ff6b6b",
                      border: "1px solid #ff6b6b30",
                    }}
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 text-[10px] tracking-wider uppercase"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      color: "#b8b8b860",
                      border: "1px solid #b8b8b815",
                    }}
                  >
                    Não
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {editing ? (
          <div className="space-y-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-3 text-sm leading-relaxed resize-none focus:outline-none"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${color}20`,
                color: "#d4d4d4c0",
                fontFamily: "'Source Sans 3', sans-serif",
                minHeight: "80px",
              }}
              rows={4}
            />
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 text-xs tracking-wider uppercase"
                style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b860", border: "1px solid #b8b8b815" }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (editText.trim()) {
                    onUpdate(entry.id, editText.trim());
                    setEditing(false);
                  }
                }}
                className="px-4 py-1.5 text-xs tracking-wider uppercase"
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "#0d0b09",
                  background: color,
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <p
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              color: "#d4d4d4b0",
              lineHeight: 1.8,
            }}
          >
            {entry.text}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════ */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center py-20"
    >
      <BookOpen size={40} className="mx-auto mb-6" style={{ color: "#b8b8b820" }} />

      <h3
        className="text-xl tracking-[0.12em] uppercase mb-4"
        style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b860" }}
      >
        Nenhuma reflexão ainda
      </h3>

      <p
        className="text-sm max-w-md mx-auto mb-8 leading-relaxed"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "#b8b8b850",
          lineHeight: 1.8,
        }}
      >
        Suas reflexões espirituais aparecerão aqui. Abra um estudo e clique em
        "Anotar reflexão" para começar seu diário.
      </p>

      <Link
        href="/estudos"
        className="inline-flex items-center gap-2 px-6 py-3 transition-all duration-300 hover:bg-white/[0.03]"
        style={{
          border: "1px solid #c9822a30",
          fontFamily: "'Cinzel', serif",
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          color: "#c9822a80",
        }}
      >
        <BookOpen size={14} />
        Ir para os Estudos
      </Link>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════ */
export default function Diario() {
  const { entries, updateEntry, deleteEntry } = useDiary();
  const [filter, setFilter] = useState<string>("all");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const h = () => {
      const top = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(height > 0 ? top / height : 0);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const filteredEntries = filter === "all"
    ? entries
    : entries.filter((e) => e.weekLabel === filter);

  const weekFilters = [
    { label: "Todas", value: "all", color: "#b8b8b8" },
    { label: "Oração", value: "Oração", color: "#b8b8b8" },
    { label: "Estudo", value: "Estudo", color: "#c9822a" },
    { label: "Missão", value: "Missão", color: "#e8a832" },
  ];

  return (
    <div className="relative min-h-screen" style={{ background: "#0d0b09" }}>
      {/* Scroll progress */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
        <div
          className="h-full transition-all duration-150"
          style={{
            width: `${scrollProgress * 100}%`,
            background: "linear-gradient(90deg, #b8b8b840, #c9822a, #c9822a, #b8b8b840)",
          }}
        />
      </div>

      <DiaryNav />

      {/* Hero */}
      <section className="pt-28 pb-16 text-center" style={{ background: "#0d0b09" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <PenLine size={24} className="mx-auto mb-6" style={{ color: "#c9822a50" }} />

          <h1
            className="text-3xl sm:text-4xl md:text-5xl tracking-[0.15em] uppercase mb-4"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
          >
            Diário Espiritual
          </h1>

          <p
            className="text-sm max-w-lg mx-auto leading-relaxed mb-8"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#b8b8b870",
              lineHeight: 1.8,
            }}
          >
            Suas reflexões pessoais ao longo da jornada de formação DOMUS.
            Um espaço sagrado para registrar o que Deus fala ao seu coração.
          </p>

          <div
            className="mx-auto"
            style={{
              width: "150px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, #c9822a40, transparent)",
            }}
          />
        </motion.div>
      </section>

      {/* Filter & Content */}
      <section className="pb-20" style={{ background: "#0d0b09" }}>
        <div className="max-w-3xl mx-auto px-6">
          {entries.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-3 mb-8 flex-wrap"
            >
              <Filter size={14} style={{ color: "#b8b8b840" }} />
              {weekFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className="px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase transition-all duration-300"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: filter === f.value ? f.color : "#b8b8b840",
                    border: `1px solid ${filter === f.value ? f.color + "40" : "#b8b8b810"}`,
                    background: filter === f.value ? f.color + "08" : "transparent",
                  }}
                >
                  {f.label}
                </button>
              ))}

              <span
                className="ml-auto text-[10px] tracking-[0.1em]"
                style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b840" }}
              >
                {filteredEntries.length} {filteredEntries.length === 1 ? "reflexão" : "reflexões"}
              </span>
            </motion.div>
          )}

          {/* Entries */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredEntries.length === 0 && entries.length === 0 ? (
                <EmptyState />
              ) : filteredEntries.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-sm"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    color: "#b8b8b850",
                  }}
                >
                  Nenhuma reflexão encontrada para este filtro.
                </motion.p>
              ) : (
                filteredEntries.map((entry) => (
                  <DiaryEntryCard
                    key={entry.id}
                    entry={entry}
                    onDelete={deleteEntry}
                    onUpdate={updateEntry}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-14 text-center" style={{ background: "#0d0b09" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="mx-auto mb-6"
            style={{
              width: "80px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, #b8b8b820, transparent)",
            }}
          />

          <div
            className="w-12 h-12 mx-auto mb-4 rounded-full overflow-hidden"
            style={{ border: "1px solid #b8b8b815" }}
          >
            <img src={IMG.sinal} alt="DOMUS" className="w-full h-full object-cover" />
          </div>

          <p
            className="text-sm tracking-[0.2em] uppercase mb-2"
            style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b840" }}
          >
            Domus · Diário Espiritual
          </p>

          <p
            className="text-xs tracking-[0.15em] uppercase"
            style={{ fontFamily: "'Cinzel', serif", color: "#c9822a30" }}
          >
            Oration · Studium · Missio
          </p>
        </div>
      </footer>
    </div>
  );
}
