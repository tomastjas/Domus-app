import { useState, useEffect, useCallback } from 'react';

export interface EventPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: number;
}

export interface DOMUSEvent {
  id: string;
  title: string;
  date: number; // timestamp em ms
  description: string;
  location?: string;
  status: 'upcoming' | 'completed';
  photos: EventPhoto[];
  createdAt: number;
  updatedAt: number;
}

const EVENTS_STORAGE_KEY = 'domus_events';

// Eventos de exemplo
const DEFAULT_EVENTS: DOMUSEvent[] = [
  {
    id: '1',
    title: 'Abertura da Jornada DOMUS',
    date: new Date('2026-04-15').getTime(),
    description: 'Início oficial da jornada de 21 dias de oração, estudo e comunidade.',
    location: 'Igreja Central',
    status: 'upcoming',
    photos: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: 'Encontro de Oração - Semana 1',
    date: new Date('2026-04-22').getTime(),
    description: 'Encontro comunitário para oração e reflexão sobre os estudos da primeira semana.',
    location: 'Sala de Comunhão',
    status: 'upcoming',
    photos: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    title: 'Estudo Bíblico Aprofundado',
    date: new Date('2026-03-20').getTime(),
    description: 'Análise profunda dos textos bíblicos com especialista convidado.',
    location: 'Auditório',
    status: 'completed',
    photos: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export function useEvents() {
  const [events, setEvents] = useState<DOMUSEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar eventos do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (stored) {
        setEvents(JSON.parse(stored));
      } else {
        // Usar eventos padrão na primeira vez
        setEvents(DEFAULT_EVENTS);
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setEvents(DEFAULT_EVENTS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sincronizar com outras abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === EVENTS_STORAGE_KEY && e.newValue) {
        try {
          setEvents(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Erro ao sincronizar eventos:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Atualizar status automático baseado na data atual
  const getEventStatus = useCallback((event: DOMUSEvent): 'upcoming' | 'completed' => {
    const now = Date.now();
    return event.date > now ? 'upcoming' : 'completed';
  }, []);

  // Ordenar eventos por data
  const getSortedEvents = useCallback((eventsToSort: DOMUSEvent[]) => {
    const now = Date.now();
    const upcoming = eventsToSort
      .filter(e => e.date > now)
      .sort((a, b) => a.date - b.date);
    
    const completed = eventsToSort
      .filter(e => e.date <= now)
      .sort((a, b) => b.date - a.date);

    return { upcoming, completed };
  }, []);

  // Criar novo evento
  const createEvent = useCallback((eventData: Omit<DOMUSEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: DOMUSEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    window.dispatchEvent(new Event('events-updated'));
    return newEvent;
  }, [events]);

  // Atualizar evento
  const updateEvent = useCallback((id: string, updates: Partial<DOMUSEvent>) => {
    const updatedEvents = events.map(e =>
      e.id === id
        ? { ...e, ...updates, updatedAt: Date.now() }
        : e
    );
    setEvents(updatedEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    window.dispatchEvent(new Event('events-updated'));
  }, [events]);

  // Excluir evento
  const deleteEvent = useCallback((id: string) => {
    const updatedEvents = events.filter(e => e.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    window.dispatchEvent(new Event('events-updated'));
  }, [events]);

  // Adicionar foto a um evento
  const addPhotoToEvent = useCallback((eventId: string, photo: Omit<EventPhoto, 'id' | 'uploadedAt'>) => {
    const updatedEvents = events.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          photos: [
            ...e.photos,
            {
              ...photo,
              id: Date.now().toString(),
              uploadedAt: Date.now(),
            },
          ],
          updatedAt: Date.now(),
        };
      }
      return e;
    });
    setEvents(updatedEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    window.dispatchEvent(new Event('events-updated'));
  }, [events]);

  // Remover foto de um evento
  const removePhotoFromEvent = useCallback((eventId: string, photoId: string) => {
    const updatedEvents = events.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          photos: e.photos.filter(p => p.id !== photoId),
          updatedAt: Date.now(),
        };
      }
      return e;
    });
    setEvents(updatedEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    window.dispatchEvent(new Event('events-updated'));
  }, [events]);

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    addPhotoToEvent,
    removePhotoFromEvent,
    getSortedEvents,
    getEventStatus,
  };
}
