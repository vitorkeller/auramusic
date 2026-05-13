"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, Shuffle, Repeat, Heart, ListMusic 
} from "lucide-react";
import { usePlayer } from "../contexts/PlayerContext";

export default function Player() {
  const pathname = usePathname();
  // Puxamos a queue e a função playTrack do contexto
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, queue, playTrack } = usePlayer();
  
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(66);
  const [isLiked, setIsLiked] = useState(false);
  
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  // Novo estado para controlar a visibilidade da fila
  const [isQueueVisible, setIsQueueVisible] = useState(false);

  useEffect(() => {
    setProgress(0); 
    
    if (currentTrack) {
      const savedLikes = localStorage.getItem("likedSongs");
      if (savedLikes) {
        const likedArray = JSON.parse(savedLikes);
        setIsLiked(likedArray.some((s: any) => s.id === currentTrack.id));
      } else {
        setIsLiked(false);
      }
    }
  }, [currentTrack?.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 0.1;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (progress >= 100) {
      if (isLooping) {
        setProgress(0);
      } else {
        nextTrack(isShuffle);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, isLooping, isShuffle]);

  const handleToggleLike = () => {
    if (!currentTrack) return;
    
    const savedLikes = localStorage.getItem("likedSongs");
    let likedArray = savedLikes ? JSON.parse(savedLikes) : [];

    if (isLiked) {
      likedArray = likedArray.filter((s: any) => s.id !== currentTrack.id);
    } else {
      likedArray.push({
        id: currentTrack.id,
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || "Single",
        duration: currentTrack.duration,
        cover: currentTrack.cover
      });
    }

    localStorage.setItem("likedSongs", JSON.stringify(likedArray));
    setIsLiked(!isLiked); 
    window.dispatchEvent(new Event("likesUpdated"));
  };

  if (pathname === "/login" || pathname === "/register" || !currentTrack) return null;

  const timeParts = currentTrack.duration.split(":");
  const TOTAL_SECONDS = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
  const currentSeconds = Math.floor((progress / 100) * TOTAL_SECONDS);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      {/* PAINEL DA FILA DE MÚSICAS */}
      {isQueueVisible && (
        <div className="fixed bottom-32 right-8 w-80 max-h-[400px] bg-[#1a1a1a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 z-40 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-white font-bold text-lg tracking-tight">Fila de Reprodução</h3>
            <span className="text-xs font-semibold text-gray-500 bg-white/5 px-2 py-1 rounded-full">{queue.length}</span>
          </div>
          
          <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
            {queue.map((track, index) => {
              const isPlayingNow = currentTrack?.id === track.id;
              return (
                <div 
                  key={`${track.id}-${index}`} 
                  onClick={() => playTrack(track, queue)}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors group ${
                    isPlayingNow ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.cover} flex-shrink-0 flex items-center justify-center`}>
                    {isPlayingNow && isPlaying ? (
                      <Pause size={14} className="text-white fill-current" />
                    ) : (
                      <Play size={14} className={`text-white fill-current ml-0.5 transition-opacity ${isPlayingNow ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 truncate">
                    <span className={`text-sm font-semibold truncate transition-colors ${isPlayingNow ? "text-blue-400" : "text-white group-hover:text-blue-400"}`}>
                      {track.title}
                    </span>
                    <span className="text-xs text-gray-400 truncate">{track.artist}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PLAYER (RODAPÉ) */}
      <footer className="fixed bottom-0 w-full h-28 bg-[#121212]/90 backdrop-blur-2xl border-t border-white/5 flex items-center z-50 transition-all">
        <div className="w-24 shrink-0" />
        
        <div className="flex-1 flex items-center justify-between px-10">
          <div className="flex items-center gap-5 w-1/4">
            <div className={`w-16 h-16 rounded-lg shadow-2xl bg-gradient-to-br ${currentTrack.cover} shrink-0 border border-white/10 group cursor-pointer relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
            
            <div className="flex flex-col truncate">
              <h4 className="text-white text-base font-bold truncate hover:text-blue-400 cursor-pointer transition-colors">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-gray-400 truncate hover:underline cursor-pointer">
                {currentTrack.artist}
              </p>
            </div>
            
            <button 
              onClick={handleToggleLike}
              className={`ml-3 transition-colors ${isLiked ? "text-pink-500 hover:text-pink-400" : "text-gray-500 hover:text-pink-500"}`}
            >
              <Heart size={20} className={isLiked ? "fill-current" : ""} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center w-2/4 max-w-xl">
            <div className="flex items-center gap-7 mb-3">
              <button onClick={() => setIsShuffle(!isShuffle)} className={`${isShuffle ? 'text-blue-500' : 'text-gray-500'} hover:text-white transition`}>
                <Shuffle size={18} />
              </button>
              
              <button onClick={prevTrack} className="text-gray-400 hover:text-white transition">
                <SkipBack size={24} className="fill-current" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:scale-110 hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] group"
              >
                {isPlaying ? (
                  <Pause size={24} className="text-black group-hover:text-white fill-current" />
                ) : (
                  <Play size={24} className="text-black group-hover:text-white fill-current ml-1" />
                )}
              </button>

              <button onClick={() => nextTrack(isShuffle)} className="text-gray-400 hover:text-white transition">
                <SkipForward size={24} className="fill-current" />
              </button>

              <button onClick={() => setIsLooping(!isLooping)} className={`${isLooping ? 'text-blue-500' : 'text-gray-500'} hover:text-white transition`}>
                <Repeat size={18} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 w-full">
              <span className="text-xs text-gray-500 font-medium w-8 text-right">{formatTime(currentSeconds)}</span>
              <div className="h-1.5 flex-1 bg-white/10 rounded-full group relative flex items-center">
                <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="absolute left-0 h-full bg-blue-500 group-hover:bg-blue-400 rounded-full pointer-events-none" style={{ width: `${progress}%` }}>
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium w-8">{currentTrack.duration}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-5 w-1/4">
            {/* BOTÃO DA FILA */}
            <button 
              onClick={() => setIsQueueVisible(!isQueueVisible)} 
              className={`transition-colors ${isQueueVisible ? 'text-blue-500' : 'text-gray-500 hover:text-white'}`}
            >
              <ListMusic size={20} />
            </button>
            
            <div className="flex items-center gap-3 group">
              <Volume2 size={20} className="text-gray-500 group-hover:text-white transition" />
              <div className="w-28 h-1.5 bg-white/10 rounded-full relative flex items-center">
                <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="absolute left-0 h-full bg-gray-400 group-hover:bg-blue-500 rounded-full pointer-events-none" style={{ width: `${volume}%` }}>
                  <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}