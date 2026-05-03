/**
 * MobileMenu — Menu hambúrguer para navegação mobile
 * Design: "Lumen Argentum" — fullscreen overlay com links animados
 * Inclui link Admin automático para administradores logados
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ADMIN_EMAILS } from "@/hooks/useAuthorization";

interface NavLink {
  label: string;
  href: string;
  isRoute?: boolean;
  highlight?: boolean;
}

interface MobileMenuProps {
  links: NavLink[];
}

export default function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Verificar se o usuário logado é admin
  const isAdmin = useMemo(() => {
    try {
      const stored = localStorage.getItem("domus_user");
      if (!stored) return false;
      const user = JSON.parse(stored);
      return ADMIN_EMAILS.includes(user.email?.toLowerCase());
    } catch { return false; }
  }, []);

  // Adicionar link Admin automaticamente se for admin
  const allLinks = useMemo(() => {
    const hasAdmin = links.some(l => l.href === "/admin");
    if (isAdmin && !hasAdmin) {
      return [...links, { label: "⚙ Admin", href: "/admin", isRoute: true, highlight: true }];
    }
    return links;
  }, [links, isAdmin]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${scrollY}px`;
    } else {
      const scrollY = parseInt(document.body.style.top || "0") * -1;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [open]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Fechar menu ao pressionar Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLinkClick = useCallback((href: string, isRoute?: boolean) => {
    handleClose();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  }, [handleClose]);

  return (
    <div className="sm:hidden">
      {/* Hamburger button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px] p-2"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-haspopup="true"
      >
        <motion.span
          animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="block w-6 h-[1.5px]"
          style={{ background: open ? "#c9822a" : "#b8b8b8" }}
        />
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.2 }}
          className="block w-6 h-[1.5px]"
          style={{ background: "#b8b8b8" }}
        />
        <motion.span
          animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="block w-6 h-[1.5px]"
          style={{ background: open ? "#c9822a" : "#b8b8b8" }}
        />
      </button>

      {/* Fullscreen overlay */}
      <AnimatePresence mode="wait">
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
              className="fixed inset-0 z-40 top-0 left-0"
              style={{ background: "rgba(0,0,0,0.5)" }}
              aria-hidden="true"
            />

            {/* Menu content */}
            <motion.div
              key="menu"
              ref={menuRef}
              id="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 top-0 left-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden"
              style={{ background: "rgba(13,11,9,0.98)" }}
            >
              <nav className="w-full text-center space-y-6 px-4 py-20 max-h-screen overflow-y-auto">
                {allLinks.map((link, i) => (
                  <motion.div
                    key={`${link.label}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    {link.isRoute ? (
                      <Link
                        href={link.href}
                        onClick={() => handleLinkClick(link.href, true)}
                        className="block text-2xl tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-100 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          color: link.highlight ? "#c9822a" : "#b8b8b8",
                          opacity: link.highlight ? 1 : 0.7,
                        }}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={() => handleLinkClick(link.href, false)}
                        className="block text-2xl tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-100 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          color: link.highlight ? "#c9822a" : "#b8b8b8",
                          opacity: link.highlight ? 1 : 0.7,
                        }}
                      >
                        {link.label}
                      </a>
                    )}
                  </motion.div>
                ))}

                {/* Decorative line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "80px" }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mx-auto mt-8"
                  style={{ height: "1px", background: "linear-gradient(90deg, transparent, #c9822a40, transparent)" }}
                />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-xs tracking-[0.3em] uppercase mt-6"
                  style={{ fontFamily: "'Cinzel', serif", color: "#b8b8b8" }}
                >
                  Oration · Studium · Missio
                </motion.p>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
