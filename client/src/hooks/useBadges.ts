import { useState, useEffect } from "react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
}

const BADGES: Badge[] = [
  {
    id: "first_week",
    name: "Primeira Semana",
    description: "Complete a primeira semana de oração",
    icon: "🌟",
    color: "#c9822a",
    unlocked: false,
  },
  {
    id: "first_reflection",
    name: "Reflexionista",
    description: "Escreva sua primeira reflexão no diário",
    icon: "✍️",
    color: "#d4af37",
    unlocked: false,
  },
  {
    id: "complete_journey",
    name: "Jornada Completa",
    description: "Complete os 21 dias de formação",
    icon: "🏆",
    color: "#e8a87c",
    unlocked: false,
  },
  {
    id: "five_reflections",
    name: "Cinco Reflexões",
    description: "Escreva 5 reflexões no diário",
    icon: "📝",
    color: "#b8b8b8",
    unlocked: false,
  },
  {
    id: "community_member",
    name: "Membro da Comunidade",
    description: "Participe da comunidade DOMUS",
    icon: "🙌🏻",
    color: "#c9822a",
    unlocked: false,
  },
];

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>(BADGES);

  // Load badges from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("domus_badges");
    if (stored) {
      try {
        setBadges(JSON.parse(stored));
      } catch {
        setBadges(BADGES);
      }
    }
  }, []);

  // Save badges to localStorage
  const saveBadges = (newBadges: Badge[]) => {
    setBadges(newBadges);
    localStorage.setItem("domus_badges", JSON.stringify(newBadges));
  };

  // Unlock a badge
  const unlockBadge = (badgeId: string) => {
    const updated = badges.map((badge) =>
      badge.id === badgeId
        ? { ...badge, unlocked: true, unlockedDate: new Date().toISOString() }
        : badge
    );
    saveBadges(updated);
  };

  // Get unlocked badges
  const getUnlockedBadges = () => badges.filter((b) => b.unlocked);

  // Get locked badges
  const getLockedBadges = () => badges.filter((b) => !b.unlocked);

  return {
    badges,
    unlockBadge,
    getUnlockedBadges,
    getLockedBadges,
  };
}
