/**
 * Admin — Painel Administrativo DOMUS
 * Design: "Lumen Argentum" — Elegância Litúrgica Moderna
 * Acesso exclusivo para admins (juffamilia@gmail.com)
 * Gerencia: usuários autorizados, solicitações de acesso, convites
 */
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  Shield, Users, Mail, LinkIcon, Check, X, Trash2,
  Copy, Clock, UserPlus, ArrowLeft, AlertTriangle,
  ChevronDown, ChevronUp, Plus, RefreshCw
} from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import { useAuthorization, ADMIN_EMAILS } from "@/hooks/useAuthorization";
import type { AccessRequest, InviteLink } from "@/hooks/useAuthorization";

// ─── Cores do tema ───
const GOLD = "#c9822a";
const SILVER = "#b8b8b8";
const BG_DARK = "#0d0b09";
const BG_CARD = "#1a1815";
const BORDER = "#b8b8b815";

// ─── Tabs ───
type TabId = "requests" | "users" | "invites";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: "requests", label: "Solicitações", icon: <Mail size={16} /> },
  { id: "users", label: "Usuários", icon: <Users size={16} /> },
  { id: "invites", label: "Convites", icon: <LinkIcon size={16} /> },
];

// ─── Componente principal ───
export default function Admin() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("requests");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Verificar se o usuário logado é admin
  const currentUser = useMemo(() => {
    try {
      const stored = localStorage.getItem("domus_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }, []);

  const isCurrentAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email?.toLowerCase());

  const {
    authorizedUsers, revokeUser,
    accessRequests, approveRequest, rejectRequest, deleteRequest, getPendingRequests, pendingCount: hookPendingCount,
    inviteLinks, createInvite, revokeInvite, deleteInvite,
    authorizeUser,
  } = useAuthorization();

  const pendingCount = hookPendingCount;

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Listener para notificações de novas solicitações
  useEffect(() => {
    const handleRequestsUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.pendingCount > pendingCount) {
        showToast(`Novas solicitacoes: ${customEvent.detail.pendingCount - pendingCount}!`);
      }
    };

    window.addEventListener('domus:requests-updated', handleRequestsUpdated);
    return () => window.removeEventListener('domus:requests-updated', handleRequestsUpdated);
  }, [pendingCount]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
  };

  const mobileLinks = [
    { label: "Início", href: "/" },
    { label: "Estudos", href: "/estudos" },
    { label: "Diário", href: "/diario" },
    { label: "Comunidade", href: "/comunidade" },
    { label: "Músicas", href: "/musicas" },
    { label: "Sobre", href: "/sobre" },
  ];

  // ─── Tela de acesso negado ───
  if (!isCurrentAdmin) {
    return (
      <div className="relative min-h-screen flex items-center justify-center" style={{ background: BG_DARK }}>
        <MobileMenu links={mobileLinks} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 max-w-md"
        >
          <AlertTriangle size={48} className="mx-auto mb-4" style={{ color: GOLD }} />
          <h1 className="text-3xl font-bold mb-4" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
            Acesso Restrito
          </h1>
          <p className="mb-6" style={{ color: SILVER }}>
            Este painel é exclusivo para administradores do DOMUS.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold transition hover:opacity-90"
            style={{ background: GOLD, color: BG_DARK }}
          >
            <ArrowLeft size={16} /> Voltar ao Início
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ background: BG_DARK }}>
      <MobileMenu links={mobileLinks} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-4 right-4 z-[60] px-4 py-3 rounded shadow-lg flex items-center gap-2"
            style={{
              background: toast.type === "success" ? "#1a3a1a" : "#3a1a1a",
              border: `1px solid ${toast.type === "success" ? "#2a5a2a" : "#5a2a2a"}`,
              color: toast.type === "success" ? "#6aff6a" : "#ff6a6a",
            }}
          >
            {toast.type === "success" ? <Check size={16} /> : <X size={16} />}
            <span className="text-sm">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
            ADMIN
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs hidden sm:block" style={{ color: SILVER }}>
            {currentUser?.name || currentUser?.email}
          </span>
          <Link href="/" className="p-2 rounded transition hover:bg-white/5">
            <ArrowLeft size={18} style={{ color: GOLD }} />
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Shield size={32} className="mx-auto mb-3" style={{ color: GOLD }} />
          <h1 className="text-4xl font-bold mb-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
            Painel Administrativo
          </h1>
          <p className="text-sm" style={{ color: SILVER, fontFamily: "'Cormorant Garamond', serif" }}>
            Gerencie usuários, solicitações e convites
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded text-sm whitespace-nowrap transition-all"
              style={{
                background: activeTab === tab.id ? GOLD : BG_CARD,
                color: activeTab === tab.id ? BG_DARK : SILVER,
                border: `1px solid ${activeTab === tab.id ? GOLD : BORDER}`,
                fontFamily: "'Cinzel', serif",
                fontWeight: activeTab === tab.id ? "bold" : "normal",
              }}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "requests" && pendingCount > 0 && (
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: activeTab === tab.id ? BG_DARK : GOLD,
                    color: activeTab === tab.id ? GOLD : BG_DARK,
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "requests" && (
            <RequestsTab
              key="requests"
              requests={accessRequests}
              onApprove={(id) => { approveRequest(id); showToast("Solicitação aprovada!"); }}
              onReject={(id) => { rejectRequest(id); showToast("Solicitação rejeitada."); }}
              onDelete={(id) => { deleteRequest(id); showToast("Solicitação removida."); }}
            />
          )}
          {activeTab === "users" && (
            <UsersTab
              key="users"
              users={authorizedUsers}
              onRevoke={(email) => { revokeUser(email); showToast("Acesso revogado."); }}
              onAdd={(email, name) => {
                const ok = authorizeUser(email, name);
                if (ok) showToast(`${name} autorizado(a)!`);
                else showToast("Usuário já autorizado.", "error");
              }}
            />
          )}
          {activeTab === "invites" && (
            <InvitesTab
              key="invites"
              invites={inviteLinks}
              onCreateInvite={(hours) => {
                const code = createInvite(currentUser?.email || "admin", hours);
                showToast("Convite criado!");
                return code;
              }}
              onRevoke={(id) => { revokeInvite(id); showToast("Convite revogado."); }}
              onDelete={(id) => { deleteInvite(id); showToast("Convite removido."); }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Tab: Solicitações ───
function RequestsTab({
  requests,
  onApprove,
  onReject,
  onDelete,
}: {
  requests: AccessRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  const statusColors: Record<string, string> = {
    pending: "#f59e0b",
    approved: "#22c55e",
    rejected: "#ef4444",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovada",
    rejected: "Rejeitada",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1 rounded text-xs transition"
            style={{
              background: filter === f ? `${GOLD}30` : "transparent",
              color: filter === f ? GOLD : SILVER,
              border: `1px solid ${filter === f ? GOLD : BORDER}`,
            }}
          >
            {f === "all" ? "Todas" : statusLabels[f]}
            {f === "pending" && requests.filter(r => r.status === "pending").length > 0 && (
              <span className="ml-1">({requests.filter(r => r.status === "pending").length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: SILVER }}>
          <Mail size={40} className="mx-auto mb-3 opacity-30" />
          <p>Nenhuma solicitação {filter !== "all" ? statusLabels[filter]?.toLowerCase() : ""} encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <motion.div
              key={req.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 rounded"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold" style={{ color: "#e0d6c8" }}>{req.name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${statusColors[req.status]}20`, color: statusColors[req.status] }}
                    >
                      {statusLabels[req.status]}
                    </span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: SILVER }}>{req.email}</p>
                  {req.message && (
                    <p className="text-sm mt-2 p-2 rounded" style={{ color: "#e0d6c8", background: "#0d0b09" }}>
                      "{req.message}"
                    </p>
                  )}
                  <p className="text-xs mt-2" style={{ color: `${SILVER}80` }}>
                    <Clock size={10} className="inline mr-1" />
                    {new Date(req.requestedAt).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => onApprove(req.id)}
                        className="p-2 rounded transition hover:bg-green-900/30"
                        title="Aprovar"
                      >
                        <Check size={16} style={{ color: "#22c55e" }} />
                      </button>
                      <button
                        onClick={() => onReject(req.id)}
                        className="p-2 rounded transition hover:bg-red-900/30"
                        title="Rejeitar"
                      >
                        <X size={16} style={{ color: "#ef4444" }} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onDelete(req.id)}
                    className="p-2 rounded transition hover:bg-red-900/20"
                    title="Remover"
                  >
                    <Trash2 size={14} style={{ color: `${SILVER}60` }} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Tab: Usuários ───
function UsersTab({
  users,
  onRevoke,
  onAdd,
}: {
  users: { email: string; name: string; authorizedAt: string }[];
  onRevoke: (email: string) => void;
  onAdd: (email: string, name: string) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleAdd = () => {
    if (newName.trim() && newEmail.trim() && newEmail.includes("@")) {
      onAdd(newEmail.trim(), newName.trim());
      setNewName("");
      setNewEmail("");
      setShowAddForm(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Admins */}
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
          <Shield size={14} /> Administradores
        </h3>
        {ADMIN_EMAILS.map((email) => (
          <div
            key={email}
            className="p-3 rounded mb-2 flex items-center justify-between"
            style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30` }}
          >
            <div>
              <span className="text-sm font-semibold" style={{ color: GOLD }}>Administrador</span>
              <p className="text-xs" style={{ color: SILVER }}>{email}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded" style={{ background: `${GOLD}20`, color: GOLD }}>
              ADMIN
            </span>
          </div>
        ))}
      </div>

      {/* Botão adicionar */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
          <Users size={14} /> Usuários Autorizados ({users.length})
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded text-xs transition"
          style={{ background: showAddForm ? `${GOLD}30` : BG_CARD, color: GOLD, border: `1px solid ${GOLD}40` }}
        >
          {showAddForm ? <ChevronUp size={12} /> : <Plus size={12} />}
          {showAddForm ? "Cancelar" : "Adicionar"}
        </button>
      </div>

      {/* Formulário de adição */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 rounded overflow-hidden"
            style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
          >
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome completo"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ background: BG_DARK, border: `1px solid ${BORDER}`, color: SILVER }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm"
                style={{ background: BG_DARK, border: `1px solid ${BORDER}`, color: SILVER }}
              />
              <button
                onClick={handleAdd}
                className="w-full py-2 rounded text-sm font-semibold flex items-center justify-center gap-2 transition hover:opacity-90"
                style={{ background: GOLD, color: BG_DARK }}
              >
                <UserPlus size={14} /> Autorizar Usuário
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de usuários */}
      {users.length === 0 ? (
        <div className="text-center py-12" style={{ color: SILVER }}>
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>Nenhum usuário autorizado ainda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <motion.div
              key={user.email}
              layout
              className="p-3 rounded flex items-center justify-between"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
            >
              <div>
                <span className="text-sm font-semibold" style={{ color: "#e0d6c8" }}>{user.name}</span>
                <p className="text-xs" style={{ color: SILVER }}>{user.email}</p>
                <p className="text-xs mt-1" style={{ color: `${SILVER}60` }}>
                  Autorizado em {new Date(user.authorizedAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <button
                onClick={() => onRevoke(user.email)}
                className="p-2 rounded transition hover:bg-red-900/20"
                title="Revogar acesso"
              >
                <X size={16} style={{ color: "#ef4444" }} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Tab: Convites ───
function InvitesTab({
  invites,
  onCreateInvite,
  onRevoke,
  onDelete,
}: {
  invites: InviteLink[];
  onCreateInvite: (hours: number) => string;
  onRevoke: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [expiresHours, setExpiresHours] = useState(72);
  const [lastCreatedCode, setLastCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    const code = onCreateInvite(expiresHours);
    setLastCreatedCode(code);
    setCopied(false);
  };

  const getInviteUrl = (code: string) => {
    return `${window.location.origin}/solicitar-acesso?convite=${code}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Criar convite */}
      <div className="p-4 rounded mb-6" style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}>
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
          <Plus size={14} /> Criar Novo Convite
        </h3>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs block mb-1" style={{ color: SILVER }}>Validade</label>
            <select
              value={expiresHours}
              onChange={(e) => setExpiresHours(Number(e.target.value))}
              className="w-full px-3 py-2 rounded text-sm"
              style={{ background: BG_DARK, border: `1px solid ${BORDER}`, color: SILVER }}
            >
              <option value={24}>24 horas</option>
              <option value={48}>48 horas</option>
              <option value={72}>72 horas (3 dias)</option>
              <option value={168}>7 dias</option>
              <option value={720}>30 dias</option>
            </select>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 transition hover:opacity-90"
            style={{ background: GOLD, color: BG_DARK }}
          >
            <LinkIcon size={14} /> Gerar Convite
          </button>
        </div>

        {/* Link gerado */}
        <AnimatePresence>
          {lastCreatedCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 rounded overflow-hidden"
              style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30` }}
            >
              <p className="text-xs mb-2 font-bold" style={{ color: GOLD }}>Link de Convite Gerado:</p>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  readOnly
                  value={getInviteUrl(lastCreatedCode)}
                  className="flex-1 px-2 py-1.5 rounded text-xs"
                  style={{ background: BG_DARK, border: `1px solid ${BORDER}`, color: SILVER }}
                />
                <button
                  onClick={() => copyToClipboard(getInviteUrl(lastCreatedCode))}
                  className="p-2 rounded transition hover:bg-white/5"
                  title="Copiar link"
                >
                  {copied ? (
                    <Check size={14} style={{ color: "#22c55e" }} />
                  ) : (
                    <Copy size={14} style={{ color: GOLD }} />
                  )}
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: `${SILVER}80` }}>
                Compartilhe este link com a pessoa que deseja convidar. O convite é de uso único.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lista de convites */}
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
        <LinkIcon size={14} /> Convites ({invites.length})
      </h3>

      {invites.length === 0 ? (
        <div className="text-center py-12" style={{ color: SILVER }}>
          <LinkIcon size={40} className="mx-auto mb-3 opacity-30" />
          <p>Nenhum convite criado ainda.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {invites.map((invite) => {
            const expired = isExpired(invite.expiresAt);
            const used = !!invite.usedBy;
            const active = invite.active && !expired && !used;

            return (
              <motion.div
                key={invite.id}
                layout
                className="p-3 rounded"
                style={{ background: BG_CARD, border: `1px solid ${BORDER}`, opacity: active ? 1 : 0.6 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs px-2 py-0.5 rounded" style={{ background: BG_DARK, color: GOLD }}>
                        {invite.code}
                      </code>
                      {active && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#22c55e20", color: "#22c55e" }}>
                          Ativo
                        </span>
                      )}
                      {used && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#3b82f620", color: "#3b82f6" }}>
                          Usado por {invite.usedBy}
                        </span>
                      )}
                      {expired && !used && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#ef444420", color: "#ef4444" }}>
                          Expirado
                        </span>
                      )}
                      {!invite.active && !used && !expired && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#f59e0b20", color: "#f59e0b" }}>
                          Revogado
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: `${SILVER}80` }}>
                      Criado em {new Date(invite.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                      {" · "}
                      Expira em {new Date(invite.expiresAt).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {active && (
                      <>
                        <button
                          onClick={() => copyToClipboard(getInviteUrl(invite.code))}
                          className="p-2 rounded transition hover:bg-white/5"
                          title="Copiar link"
                        >
                          <Copy size={14} style={{ color: GOLD }} />
                        </button>
                        <button
                          onClick={() => onRevoke(invite.id)}
                          className="p-2 rounded transition hover:bg-red-900/20"
                          title="Revogar"
                        >
                          <X size={14} style={{ color: "#ef4444" }} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDelete(invite.id)}
                      className="p-2 rounded transition hover:bg-red-900/20"
                      title="Remover"
                    >
                      <Trash2 size={14} style={{ color: `${SILVER}40` }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
