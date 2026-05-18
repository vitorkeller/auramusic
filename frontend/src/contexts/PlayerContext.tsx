"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  file_url: string;
};

type PlayerContextData = {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[]; // A fila de músicas atual
  // Agora o playTrack pode receber a lista completa de músicas da tela
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: (isShuffle?: boolean) => void;
  prevTrack: () => void;
};

const PlayerContext = createContext<PlayerContextData>({} as PlayerContextData);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);

  const playTrack = (track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Se passarmos uma lista nova, ele salva; senão, a fila é só a música atual
    if (newQueue) {
      setQueue(newQueue);
    } else if (queue.length === 0) {
      setQueue([track]);
    }
  };

  const togglePlay = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = (isShuffle = false) => {
    if (!queue.length || !currentTrack) return;
    
    // Se for aleatório, pega um número sorteado
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setCurrentTrack(queue[randomIndex]);
      setIsPlaying(true);
      return;
    }

    // Se não for, pega o próximo
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % queue.length; // Volta pro início se acabar
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (!queue.length || !currentTrack) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    // Se for a primeira música, volta pra última
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, queue, playTrack, togglePlay, nextTrack, prevTrack }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);