/**
 * Agenda — Página de Eventos DOMUS
 * Design: Mantém estilo visual do site (cores ouro/prata, fundo escuro)
 * Exibe eventos ordenados por data com filtros e galeria de fotos
 */
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Calendar, MapPin, Plus, Filter, X, Image as ImageIcon,
  ChevronLeft, ChevronRight, Trash2, Edit2, AlertTriangle
} from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import { useAuthorization, ADMIN_EMAILS } from "@/hooks/useAuthorization";
import { useEvents, type DOMUSEvent } from "@/hooks/useEvents";

// ─── Cores do tema ───
const GOLD = "#c9822a";
const SILVER = "#b8b8b8";
const BG_DARK = "#0d0b09";
const BG_CARD = "#1a1815";
const BORDER = "#b8b8b815";

type FilterType = "all" | "upcoming" | "completed";

interface MobileLink {
  label: string;
  href: string;
}

const mobileLinks: MobileLink[] = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Estudos", href: "/estudos" },
  { label: "Diário", href: "/diario" },
  { label: "Comunidade", href: "/comunidade" },
  { label: "Músicas", href: "/musicas" },
  { label: "Agenda", href: "/agenda" },
];

export default function Agenda() {
  const { isAdmin } = useAuthorization();
  const { events, getSortedEvents, getEventStatus } = useEvents();
  const [filter, setFilter] = useState<FilterType>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isCurrentAdmin = useMemo(
    () => ADMIN_EMAILS.some(email => isAdmin(email)),
    [isAdmin]
  );

  // Ordenar eventos e aplicar filtro
  const filteredEvents = useMemo(() => {
    const { upcoming, completed } = getSortedEvents(events);
    
    switch (filter) {
      case "upcoming":
        return upcoming;
      case "completed":
        return completed;
      case "all":
      default:
        return [...upcoming, ...completed];
    }
  }, [events, filter, getSortedEvents]);

  const { upcoming: upcomingCount, completed: completedCount } = useMemo(() => {
    const { upcoming, completed } = getSortedEvents(events);
    return { upcoming: upcoming.length, completed: completed.length };
  }, [events, getSortedEvents]);

  return (
    <div className="relative min-h-screen" style={{ background: BG_DARK }}>
      <MobileMenu links={mobileLinks} />

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-40 px-4 py-4 flex items-center justify-between"
        style={{ background: "rgba(13,11,9,0.95)", borderBottom: `1px solid ${BORDER}` }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
            DOMUS
          </Link>
          <span className="text-xs px-2 py-1 rounded" style={{ background: `${GOLD}20`, color: GOLD }}>
            AGENDA
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isCurrentAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
              }}
              className="p-2 rounded transition"
              style={{
                background: showForm ? `${GOLD}30` : "transparent",
                color: GOLD,
                border: `1px solid ${showForm ? GOLD : "transparent"}`,
              }}
            >
              <Plus size={18} />
            </motion.button>
          )}
          <Link href="/" className="p-2 rounded transition hover:bg-white/5">
            <ChevronLeft size={18} style={{ color: GOLD }} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 max-w-4xl mx-auto">
        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex gap-2 flex-wrap"
        >
          {[
            { value: "all" as FilterType, label: `Todos (${events.length})` },
            { value: "upcoming" as FilterType, label: `Próximos (${upcomingCount})` },
            { value: "completed" as FilterType, label: `Realizados (${completedCount})` },
          ].map(btn => (
            <motion.button
              key={btn.value}
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilter(btn.value)}
              className="px-4 py-2 rounded text-sm font-medium transition"
              style={{
                background: filter === btn.value ? GOLD : BG_CARD,
                color: filter === btn.value ? BG_DARK : SILVER,
                border: `1px solid ${filter === btn.value ? GOLD : BORDER}`,
              }}
            >
              <Filter size={14} className="inline mr-2" />
              {btn.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Eventos */}
        <AnimatePresence>
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <AlertTriangle size={32} className="mx-auto mb-4" style={{ color: GOLD }} />
              <p style={{ color: SILVER }}>Nenhum evento encontrado</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event, idx) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isAdmin={isCurrentAdmin}
                  index={idx}
                  onEdit={() => {
                    setEditingId(event.id);
                    setShowForm(true);
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

interface EventCardProps {
  event: DOMUSEvent;
  isAdmin: boolean;
  index: number;
  onEdit: () => void;
}

function EventCard({ event, isAdmin: isAdminUser, index, onEdit }: EventCardProps) {
  const { deleteEvent } = useEvents();
  const isCompleted = event.date <= Date.now();
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-lg overflow-hidden transition"
      style={{
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
      }}
    >
      <div className="p-6">
        {/* Header do Evento */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
              {event.title}
            </h3>
            <div className="flex items-center gap-4 flex-wrap text-sm" style={{ color: SILVER }}>
              <div className="flex items-center gap-2">
                <Calendar size={16} style={{ color: GOLD }} />
                {dateStr}
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} style={{ color: GOLD }} />
                  {event.location}
                </div>
              )}
              <span
                className="px-2 py-1 rounded text-xs font-medium"
                style={{
                  background: isCompleted ? "#1a3a1a" : "#3a1a1a",
                  color: isCompleted ? "#6aff6a" : "#ff9966",
                }}
              >
                {isCompleted ? "Realizado" : "Próximo"}
              </span>
            </div>
          </div>

          {isAdminUser && (
            <div className="flex gap-2 ml-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={onEdit}
                className="p-2 rounded transition"
                style={{ background: `${GOLD}20`, color: GOLD }}
              >
                <Edit2 size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => deleteEvent(event.id)}
                className="p-2 rounded transition"
                style={{ background: "#3a1a1a", color: "#ff6a6a" }}
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          )}
        </div>

        {/* Descrição */}
        <p className="mb-4" style={{ color: SILVER }}>
          {event.description}
        </p>

        {/* Galeria de Fotos (apenas para eventos realizados) */}
        {isCompleted && event.photos.length > 0 && (
          <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${BORDER}` }}>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: GOLD }}>
              <ImageIcon size={16} /> Fotos do Evento ({event.photos.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {event.photos.map(photo => (
                <motion.div
                  key={photo.id}
                  whileHover={{ scale: 1.05 }}
                  className="relative group cursor-pointer rounded overflow-hidden"
                  style={{ background: BG_DARK }}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || "Foto do evento"}
                    className="w-full h-32 object-cover"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.7)" }}
                  >
                    <p className="text-xs text-center px-2" style={{ color: GOLD }}>
                      Visualizar
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Botão para adicionar fotos (admin, eventos realizados) */}
        {isAdminUser && isCompleted && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="mt-4 px-4 py-2 rounded text-sm font-medium transition"
            style={{
              background: `${GOLD}20`,
              color: GOLD,
              border: `1px solid ${GOLD}`,
            }}
          >
            <Plus size={14} className="inline mr-2" />
            Adicionar Fotos
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
