/**
 * Gallery — Galeria de artes gráficas DOMUS
 * Design: "Chama Viva" — Cinematográfico Escuro
 * Grid de artes com lightbox e download.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, X, Download, ZoomIn } from "lucide-react";

const ARTES = [
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/arte_1_lindo_es_0ae02d5e.jpg",
    title: "Lindo és meu Deus",
    desc: "Céu dourado com raios de luz divina",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/arte_2_nao_sou_digno_7ab59a6d.jpg",
    title: "Sei que não sou digno",
    desc: "Céu azul com luz celestial",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/arte_3_tua_presenca_4412814d.jpg",
    title: "Quero sentir tua presença",
    desc: "Silhueta em oração sob luz divina",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/arte_4_meu_guia_fddbcc0c.jpg",
    title: "Vem ser o meu guia",
    desc: "Chama e faíscas de fogo — Refrão",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/arte_5_completa_0b7fcb24.jpg",
    title: "Letra Completa",
    desc: "Aurora boreal — Arte de capa",
  },
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390831948/BcraeUEdXMZSEHjX8DWEaS/concept_art_guia_amor_6ca7e4cd.jpg",
    title: "Concept Art",
    desc: "Caminho de luz — Referência visual para animação",
  },
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleDownload = (src: string, title: string) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `${title.replace(/\s+/g, "_")}.jpg`;
    link.target = "_blank";
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#050505] relative">
      {/* Header */}
      <header className="sticky top-0 z-40 py-4 px-6" style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <span className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <ArrowLeft size={20} style={{ color: "#d4a853" }} />
              <span
                className="text-sm tracking-wider uppercase"
                style={{ fontFamily: "'Cinzel', serif", color: "#d4a853" }}
              >
                Voltar
              </span>
            </span>
          </Link>
          <h1
            className="text-lg tracking-[0.15em]"
            style={{ fontFamily: "'Cinzel', serif", color: "#d4a853" }}
          >
            Galeria de Artes
          </h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      {/* Gallery intro */}
      <div className="text-center py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="gold-line mx-auto mb-8" style={{ maxWidth: "150px" }} />
          <h2
            className="text-3xl sm:text-4xl tracking-[0.15em] mb-4"
            style={{
              fontFamily: "'Cinzel', serif",
              color: "#d4a853",
              textShadow: "0 0 20px rgba(212, 168, 83, 0.3)",
            }}
          >
            Artes Gráficas
          </h2>
          <p
            className="text-base max-w-lg mx-auto"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 300,
              color: "#fff5e6aa",
            }}
          >
            Cada arte retrata um momento da música, com identidade visual única
            e estética de produção audiovisual cristã.
          </p>
          <div className="gold-line mx-auto mt-8" style={{ maxWidth: "150px" }} />
        </motion.div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTES.map((arte, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative overflow-hidden rounded-lg cursor-pointer"
              style={{
                border: "1px solid rgba(212, 168, 83, 0.15)",
                background: "#0a0a0a",
              }}
              onClick={() => setSelectedIndex(i)}
            >
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={arte.src}
                  alt={arte.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "rgba(5,5,5,0.7)" }}
              >
                <ZoomIn size={32} style={{ color: "#d4a853" }} className="mb-4" />
                <p
                  className="text-lg tracking-wider"
                  style={{ fontFamily: "'Cinzel', serif", color: "#d4a853" }}
                >
                  {arte.title}
                </p>
                <p
                  className="text-sm mt-2"
                  style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#fff5e6aa" }}
                >
                  {arte.desc}
                </p>
              </div>
              {/* Bottom label */}
              <div className="p-4">
                <p
                  className="text-sm tracking-wider"
                  style={{ fontFamily: "'Cinzel', serif", color: "#d4a853cc" }}
                >
                  {arte.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(5,5,5,0.95)" }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-3xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={ARTES[selectedIndex].src}
                alt={ARTES[selectedIndex].title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <div className="flex items-center justify-between mt-4 px-2">
                <div>
                  <p
                    className="text-lg tracking-wider"
                    style={{ fontFamily: "'Cinzel', serif", color: "#d4a853" }}
                  >
                    {ARTES[selectedIndex].title}
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#fff5e6aa" }}
                  >
                    {ARTES[selectedIndex].desc}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(ARTES[selectedIndex].src, ARTES[selectedIndex].title)}
                    className="p-3 rounded-full border transition-all duration-300 hover:bg-white/5"
                    style={{ borderColor: "#d4a85340" }}
                    title="Baixar"
                  >
                    <Download size={20} style={{ color: "#d4a853" }} />
                  </button>
                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="p-3 rounded-full border transition-all duration-300 hover:bg-white/5"
                    style={{ borderColor: "#d4a85340" }}
                    title="Fechar"
                  >
                    <X size={20} style={{ color: "#d4a853" }} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Navigation arrows */}
            {selectedIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex - 1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full border transition-all duration-300 hover:bg-white/5"
                style={{ borderColor: "#d4a85340" }}
              >
                <ArrowLeft size={24} style={{ color: "#d4a853" }} />
              </button>
            )}
            {selectedIndex < ARTES.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(selectedIndex + 1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full border transition-all duration-300 hover:bg-white/5 rotate-180"
                style={{ borderColor: "#d4a85340" }}
              >
                <ArrowLeft size={24} style={{ color: "#d4a853" }} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 text-center" style={{ background: "#050505" }}>
        <div className="gold-line mx-auto mb-6" style={{ maxWidth: "80px" }} />
        <p
          className="text-xs tracking-widest uppercase"
          style={{ fontFamily: "'Cinzel', serif", color: "#d4a85330" }}
        >
          DOMUS — Galeria
        </p>
      </footer>
    </div>
  );
}
