import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEvents, type DOMUSEvent } from './useEvents';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useEvents', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should load default events on first use', () => {
    const { result } = renderHook(() => useEvents());
    
    expect(result.current.events.length).toBeGreaterThan(0);
    expect(result.current.isLoading).toBe(false);
  });

  it('should create a new event', () => {
    const { result } = renderHook(() => useEvents());
    
    const initialCount = result.current.events.length;
    
    act(() => {
      result.current.createEvent({
        title: 'Test Event',
        date: Date.now() + 86400000, // Tomorrow
        description: 'Test Description',
        location: 'Test Location',
        status: 'upcoming',
        photos: [],
      });
    });
    
    expect(result.current.events.length).toBe(initialCount + 1);
    expect(result.current.events[result.current.events.length - 1].title).toBe('Test Event');
  });

  it('should update an event', () => {
    const { result } = renderHook(() => useEvents());
    
    const eventId = result.current.events[0].id;
    const newTitle = 'Updated Title';
    
    act(() => {
      result.current.updateEvent(eventId, { title: newTitle });
    });
    
    const updatedEvent = result.current.events.find(e => e.id === eventId);
    expect(updatedEvent?.title).toBe(newTitle);
  });

  it('should delete an event', () => {
    const { result } = renderHook(() => useEvents());
    
    const initialCount = result.current.events.length;
    const eventId = result.current.events[0].id;
    
    act(() => {
      result.current.deleteEvent(eventId);
    });
    
    expect(result.current.events.length).toBe(initialCount - 1);
    expect(result.current.events.find(e => e.id === eventId)).toBeUndefined();
  });

  it('should sort events correctly', () => {
    const { result } = renderHook(() => useEvents());
    
    const now = Date.now();
    const testEvents: DOMUSEvent[] = [
      {
        id: '1',
        title: 'Past Event',
        date: now - 86400000, // Yesterday
        description: 'Past',
        status: 'completed',
        photos: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '2',
        title: 'Future Event 1',
        date: now + 172800000, // In 2 days
        description: 'Future 1',
        status: 'upcoming',
        photos: [],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '3',
        title: 'Future Event 2',
        date: now + 86400000, // Tomorrow
        description: 'Future 2',
        status: 'upcoming',
        photos: [],
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    const { upcoming, completed } = result.current.getSortedEvents(testEvents);
    
    // Check upcoming are sorted by date (closest first)
    expect(upcoming[0].title).toBe('Future Event 2');
    expect(upcoming[1].title).toBe('Future Event 1');
    
    // Check completed are sorted by date (most recent first)
    expect(completed[0].title).toBe('Past Event');
  });

  it('should add photo to event', () => {
    const { result } = renderHook(() => useEvents());
    
    const eventId = result.current.events[0].id;
    const initialPhotoCount = result.current.events[0].photos.length;
    
    act(() => {
      result.current.addPhotoToEvent(eventId, {
        url: 'https://example.com/photo.jpg',
        caption: 'Test Photo',
      });
    });
    
    const event = result.current.events.find(e => e.id === eventId);
    expect(event?.photos.length).toBe(initialPhotoCount + 1);
    expect(event?.photos[0].url).toBe('https://example.com/photo.jpg');
  });

  it('should remove photo from event', () => {
    const { result } = renderHook(() => useEvents());
    
    const eventId = result.current.events[0].id;
    
    // First add a photo
    act(() => {
      result.current.addPhotoToEvent(eventId, {
        url: 'https://example.com/photo.jpg',
        caption: 'Test Photo',
      });
    });
    
    const photoId = result.current.events.find(e => e.id === eventId)?.photos[0].id;
    
    // Then remove it
    act(() => {
      result.current.removePhotoFromEvent(eventId, photoId!);
    });
    
    const event = result.current.events.find(e => e.id === eventId);
    expect(event?.photos.length).toBe(0);
  });

  it('should persist events to localStorage', () => {
    const { result } = renderHook(() => useEvents());
    
    act(() => {
      result.current.createEvent({
        title: 'Persistent Event',
        date: Date.now() + 86400000,
        description: 'Should persist',
        status: 'upcoming',
        photos: [],
      });
    });
    
    const stored = localStorage.getItem('domus_events');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed.some((e: DOMUSEvent) => e.title === 'Persistent Event')).toBe(true);
  });
});
