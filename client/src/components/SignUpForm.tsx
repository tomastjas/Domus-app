import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

interface SignUpFormProps {
  onClose: () => void;
  onSubmit: (data: { name: string; email: string }) => void;
}

export default function SignUpForm({ onClose, onSubmit }: SignUpFormProps) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "" });

  const validateForm = () => {
    const newErrors = { name: "", email: "" };
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save to localStorage
      const users = JSON.parse(localStorage.getItem("domus_users") || "[]");
      users.push({
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        joinedDate: new Date().toISOString(),
      });
      localStorage.setItem("domus_users", JSON.stringify(users));
      
      setSubmitted(true);
      onSubmit(formData);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <div className="bg-black border border-white/20 rounded-lg p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <Check size={48} style={{ color: "#c9822a", margin: "0 auto" }} />
          </motion.div>
          <h3 className="text-2xl mb-2" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
            Bem-vindo!
          </h3>
          <p className="text-sm opacity-60 mb-4">
            Sua inscrição foi confirmada. Comece sua jornada agora!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-black border border-white/20 rounded-lg p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl" style={{ fontFamily: "'Cinzel', serif", color: "#c9822a" }}>
            Junte-se a DOMUS
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X size={20} style={{ color: "#b8b8b8" }} />
          </button>
        </div>

        <p className="text-sm opacity-60 mb-6">
          Comece sua jornada de formação espiritual com nossa comunidade.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 opacity-60">Nome Completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Seu nome"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: "#e8a87c" }}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-60">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: "#e8a87c" }}>
                {errors.email}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded border transition-all duration-300 hover:border-white/30 mt-6"
            style={{ borderColor: "#c9822a", color: "#c9822a" }}
          >
            Começar Jornada
          </button>
        </form>

        <p className="text-xs opacity-40 text-center mt-4">
          Seus dados serão salvos localmente no seu navegador
        </p>
      </motion.div>
    </motion.div>
  );
}
