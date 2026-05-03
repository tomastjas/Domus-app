/**
 * SolicitarAcesso — Página de Solicitação de Acesso aos Estudos
 * Design: "Lumen Argentum" — Elegância Litúrgica Moderna
 * Suporta: formulário de solicitação + link de convite via query param
 */
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useSearch } from "wouter";
import { Mail, ArrowLeft, Check, LinkIcon, Gift, Send } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";
import { useAuthorization, ADMIN_EMAILS } from "@/hooks/useAuthorization";

const GOLD = "#c9822a";
const SILVER = "#b8b8b8";
const BG_DARK = "#0d0b09";
const BG_CARD = "#1a1815";
const BORDER = "#b8b8b815";

export default function SolicitarAcesso() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const inviteCode = params.get("convite");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [inviteUsed, setInviteUsed] = useState(false);
  const [erro, setErro] = useState("");

  const {
    isAuthorized, isValidInvite, useInvite,
    createAccessRequest,
  } = useAuthorization();

  const hasValidInvite = inviteCode ? isValidInvite(inviteCode) : false;

  const mobileLinks = [
    { label: "Início", href: "/", isRoute: true },
    { label: "Estudos", href: "/estudos", isRoute: true, highlight: true },
    { label: "Diário", href: "/diario", isRoute: true },
    { label: "Comunidade", href: "/comunidade", isRoute: true },
    { label: "Músicas", href: "/musicas", isRoute: true },
    { label: "Sobre", href: "/sobre", isRoute: true },
  ];

  // Se já está autorizado, redirecionar
  const currentUser = useMemo(() => {
    try {
      const stored = localStorage.getItem("domus_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }, []);

  // ─── Formulário de convite ───
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim()) { setErro("Por favor, digite seu nome"); return; }
    if (!email.trim() || !email.includes("@")) { setErro("Por favor, digite um email válido"); return; }
    if (!inviteCode) { setErro("Código de convite inválido"); return; }

    const success = useInvite(inviteCode, email.trim(), nome.trim());
    if (success) {
      // Salvar usuário logado
      localStorage.setItem("domus_user", JSON.stringify({
        name: nome.trim(),
        email: email.trim().toLowerCase(),
      }));
      setInviteUsed(true);
      setTimeout(() => navigate("/estudos"), 2000);
    } else {
      setErro("Convite inválido, expirado ou já utilizado.");
    }
  };

  // ─── Formulário de solicitação ───
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim()) { setErro("Por favor, digite seu nome"); return; }
    if (!email.trim() || !email.includes("@")) { setErro("Por favor, digite um email válido"); return; }

    // Criar solicitação no localStorage
    const success = createAccessRequest(email.trim(), nome.trim(), mensagem.trim());
    if (!success) {
      setErro("Já existe uma solicitação pendente com este email.");
      return;
    }

    // Abrir mailto para notificar admin
    const subject = encodeURIComponent(`[DOMUS] Solicitação de Acesso - ${nome.trim()}`);
    const body = encodeURIComponent(
      `Nova solicitação de acesso aos Estudos DOMUS:\n\n` +
      `Nome: ${nome.trim()}\n` +
      `Email: ${email.trim()}\n` +
      `Mensagem: ${mensagem.trim() || "(sem mensagem)"}\n\n` +
      `Para aprovar, acesse o Painel Administrativo do DOMUS.`
    );
    const adminEmails = ADMIN_EMAILS.join(',');
    window.open(`mailto:${adminEmails}?subject=${subject}&body=${body}`, "_blank");

    // Disparar evento para notificar admin em tempo real
    window.dispatchEvent(new CustomEvent('domus:new-request', { detail: { name: nome.trim(), email: email.trim() } }));

    setEnviado(true);
    setNome("");
    setEmail("");
    setMensagem("");
  };

  // ─── Tela de convite ───
  if (inviteCode) {
    return (
      <div className="relative min-h-screen" style={{ background: BG_DARK }}>
        <MobileMenu links={mobileLinks} />

        {/* Header */}
        <header
          className="fixed top-0 left-0 right-0 z-40 px-4 py-4 flex items-center justify-between"
          style={{ background: "rgba(13,11,9,0.95)", borderBottom: `1px solid ${BORDER}` }}
        >
          <Link href="/">
            <a className="text-xl font-bold" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
              DOMUS
            </a>
          </Link>
          <Link href="/">
            <a className="p-2 hover:bg-white/5 rounded transition">
              <ArrowLeft size={20} style={{ color: GOLD }} />
            </a>
          </Link>
        </header>

        <div className="pt-24 pb-12 px-4 max-w-lg mx-auto">
          {inviteUsed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: `${GOLD}20`, border: `2px solid ${GOLD}` }}
              >
                <Check size={40} style={{ color: GOLD }} />
              </motion.div>
              <h1 className="text-3xl font-bold mb-3" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
                Bem-vindo(a) ao DOMUS!
              </h1>
              <p className="mb-2" style={{ color: SILVER }}>
                Seu acesso aos Estudos foi liberado com sucesso.
              </p>
              <p className="text-sm" style={{ color: `${SILVER}80` }}>
                Redirecionando para os Estudos...
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <Gift size={40} className="mx-auto mb-4" style={{ color: GOLD }} />
                <h1 className="text-4xl font-bold mb-3" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
                  Convite DOMUS
                </h1>
                {hasValidInvite ? (
                  <p style={{ color: SILVER, fontFamily: "'Cormorant Garamond', serif" }}>
                    Você recebeu um convite para acessar os Estudos DOMUS. Preencha seus dados para ativar.
                  </p>
                ) : (
                  <div className="p-4 rounded mt-4" style={{ background: "#3a1a1a", border: "1px solid #5a2a2a" }}>
                    <p style={{ color: "#ff6a6a" }}>
                      Este convite é inválido, já foi utilizado ou expirou.
                    </p>
                    <Link href="/solicitar-acesso">
                      <a className="inline-block mt-3 text-sm underline" style={{ color: GOLD }}>
                        Solicitar acesso manualmente
                      </a>
                    </Link>
                  </div>
                )}
              </motion.div>

              {hasValidInvite && (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onSubmit={handleInviteSubmit}
                  className="space-y-5"
                >
                  {erro && (
                    <div className="p-3 rounded text-sm" style={{ background: "#3a1a1a", border: "1px solid #5a2a2a", color: "#ff6a6a" }}>
                      {erro}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm mb-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 rounded"
                      style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: SILVER }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full px-4 py-3 rounded"
                      style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: SILVER }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 rounded font-semibold flex items-center justify-center gap-2 transition hover:opacity-90"
                    style={{ background: GOLD, color: BG_DARK }}
                  >
                    <LinkIcon size={18} /> Ativar Convite
                  </motion.button>
                </motion.form>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── Tela de solicitação normal ───
  return (
    <div className="relative min-h-screen" style={{ background: BG_DARK }}>
      <MobileMenu links={mobileLinks} />

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-40 px-4 py-4 flex items-center justify-between"
        style={{ background: "rgba(13,11,9,0.95)", borderBottom: `1px solid ${BORDER}` }}
      >
        <Link href="/">
          <a className="text-xl font-bold" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
            DOMUS
          </a>
        </Link>
        <Link href="/">
          <a className="p-2 hover:bg-white/5 rounded transition">
            <ArrowLeft size={20} style={{ color: GOLD }} />
          </a>
        </Link>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Mail size={40} className="mx-auto mb-4" style={{ color: GOLD }} />
          <h1 className="text-4xl font-bold mb-3" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
            Solicitar Acesso
          </h1>
          <p style={{ color: SILVER, fontFamily: "'Cormorant Garamond', serif" }}>
            Os Estudos estão disponíveis apenas para usuários autorizados. Preencha o formulário abaixo para solicitar acesso.
          </p>
        </motion.div>

        {/* Success Message */}
        {enviado && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded flex items-start gap-3"
            style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}40` }}
          >
            <Check size={20} className="shrink-0 mt-0.5" style={{ color: GOLD }} />
            <div>
              <p style={{ color: GOLD, fontWeight: "bold" }}>Solicitação enviada com sucesso!</p>
              <p className="text-sm mt-1" style={{ color: SILVER }}>
                Um email de notificação foi preparado para o administrador. Você receberá uma resposta em breve.
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {erro && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded text-sm"
            style={{ background: "#3a1a1a", border: "1px solid #5a2a2a", color: "#ff6a6a" }}
          >
            {erro}
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleRequestSubmit}
          className="space-y-5"
        >
          <div>
            <label htmlFor="nome" className="block text-sm mb-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
              Nome Completo
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-3 rounded"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: SILVER }}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full px-4 py-3 rounded"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: SILVER }}
            />
          </div>

          <div>
            <label htmlFor="mensagem" className="block text-sm mb-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
              Mensagem (Opcional)
            </label>
            <textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Conte-nos por que gostaria de acessar os Estudos..."
              rows={4}
              className="w-full px-4 py-3 rounded resize-none"
              style={{ background: BG_CARD, border: `1px solid ${BORDER}`, color: SILVER }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 rounded font-semibold flex items-center justify-center gap-2 transition hover:opacity-90"
            style={{ background: GOLD, color: BG_DARK }}
          >
            <Send size={18} /> Enviar Solicitação
          </motion.button>
        </motion.form>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 p-5 rounded"
          style={{ background: BG_CARD, border: `1px solid ${BORDER}` }}
        >
          <p className="text-sm mb-3 font-bold" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
            📧 Contato Administrativo
          </p>
          <p className="text-sm" style={{ color: SILVER }}>
            Se tiver dúvidas sobre o acesso aos Estudos, entre em contato com:{" "}
            <a href="mailto:juffamilia@gmail.com" style={{ color: GOLD, textDecoration: "underline" }}>
              juffamilia@gmail.com
            </a>
          </p>
          <p className="text-xs mt-3" style={{ color: `${SILVER}60` }}>
            Se você recebeu um link de convite, acesse-o diretamente para ativar seu acesso automaticamente.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
