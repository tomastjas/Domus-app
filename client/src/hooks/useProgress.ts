/**
 * useProgress — Hook para gerenciar progresso dos estudos DOMUS
 * Armazena no localStorage quais dias foram concluídos
 */
import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "domus_study_progress";

export interface ProgressState {
  /** Map de "week-day" => true (concluído) */
  completed: Record<string, boolean>;
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { completed: {} };
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const toggleDay = useCallback((weekIndex: number, dayIndex: number) => {
    const key = `${weekIndex}-${dayIndex}`;
    setProgress((prev) => {
      const next = { ...prev, completed: { ...prev.completed } };
      if (next.completed[key]) {
        delete next.completed[key];
      } else {
        next.completed[key] = true;
      }
      return next;
    });
  }, []);

  const isDayCompleted = useCallback(
    (weekIndex: number, dayIndex: number) => {
      return !!progress.completed[`${weekIndex}-${dayIndex}`];
    },
    [progress]
  );

  const getWeekProgress = useCallback(
    (weekIndex: number, totalDays: number) => {
      let count = 0;
      for (let i = 0; i < totalDays; i++) {
        if (progress.completed[`${weekIndex}-${i}`]) count++;
      }
      return { completed: count, total: totalDays, percent: totalDays > 0 ? (count / totalDays) * 100 : 0 };
    },
    [progress]
  );

  const getTotalProgress = useCallback(
    (weeksLengths: number[]) => {
      let completed = 0;
      let total = 0;
      weeksLengths.forEach((len, wi) => {
        for (let i = 0; i < len; i++) {
          total++;
          if (progress.completed[`${wi}-${i}`]) completed++;
        }
      });
      return { completed, total, percent: total > 0 ? (completed / total) * 100 : 0 };
    },
    [progress]
  );

  const resetProgress = useCallback(() => {
    setProgress({ completed: {} });
  }, []);

  return { toggleDay, isDayCompleted, getWeekProgress, getTotalProgress, resetProgress };
}
