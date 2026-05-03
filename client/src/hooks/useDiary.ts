/**
 * useDiary — Hook para gerenciar o Diário Espiritual DOMUS
 * Armazena reflexões pessoais no localStorage
 */
import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "domus_diary";

export interface DiaryEntry {
  id: string;
  weekIndex: number;
  dayIndex: number;
  weekLabel: string;
  dayLabel: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryState {
  entries: DiaryEntry[];
}

function loadDiary(): DiaryState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { entries: [] };
}

function saveDiary(state: DiaryState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useDiary() {
  const [diary, setDiary] = useState<DiaryState>(loadDiary);

  useEffect(() => {
    saveDiary(diary);
  }, [diary]);

  const addEntry = useCallback(
    (weekIndex: number, dayIndex: number, weekLabel: string, dayLabel: string, text: string) => {
      const now = new Date().toISOString();
      const entry: DiaryEntry = {
        id: `${weekIndex}-${dayIndex}-${Date.now()}`,
        weekIndex,
        dayIndex,
        weekLabel,
        dayLabel,
        text,
        createdAt: now,
        updatedAt: now,
      };
      setDiary((prev) => ({ entries: [entry, ...prev.entries] }));
    },
    []
  );

  const updateEntry = useCallback((id: string, text: string) => {
    setDiary((prev) => ({
      entries: prev.entries.map((e) =>
        e.id === id ? { ...e, text, updatedAt: new Date().toISOString() } : e
      ),
    }));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setDiary((prev) => ({
      entries: prev.entries.filter((e) => e.id !== id),
    }));
  }, []);

  const getEntriesForDay = useCallback(
    (weekIndex: number, dayIndex: number) => {
      return diary.entries.filter((e) => e.weekIndex === weekIndex && e.dayIndex === dayIndex);
    },
    [diary]
  );

  return { entries: diary.entries, addEntry, updateEntry, deleteEntry, getEntriesForDay };
}
