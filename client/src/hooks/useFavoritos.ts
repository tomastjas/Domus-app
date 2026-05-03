import { useEffect, useState } from "react";

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("domus_favoritos_musicas");
    if (saved) {
      setFavoritos(JSON.parse(saved));
    }
  }, []);

  const toggleFavorito = (musicaId: number) => {
    setFavoritos((prev) => {
      const updated = prev.includes(musicaId)
        ? prev.filter((id) => id !== musicaId)
        : [...prev, musicaId];
      localStorage.setItem("domus_favoritos_musicas", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorito = (musicaId: number) => favoritos.includes(musicaId);

  return { favoritos, toggleFavorito, isFavorito };
}
