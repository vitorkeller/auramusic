"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, Maximize2, Shuffle, Repeat, Heart, ListMusic 
} from "lucide-react";

export default function Player() {
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(66);

  const track = {
    title: "Seasons in",
    artist: "James",
    duration: "4:20",
  };

  const TOTAL_SECONDS = 260;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (pathname === "/login" || pathname === "/register") return null;

  const currentSeconds = Math.floor((progress / 100) * TOTAL_SECONDS);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <footer className="fixed bottom-0 w-full h-28 bg-[#121212]/80 backdrop-blur-2xl border-t border-white/5 flex items-center z-[100] selection:bg-blue-500/30 transition-all">
      
      <div className="w-24 shrink-0" />
      
      <div className="flex-1 flex items-center justify-between px-10">
        <div className="flex items-center gap-5 w-1/4">
          <div className="w-16 h-16 rounded-lg shadow-2xl bg-linear-to-br from-blue-600 to-indigo-900 shrink-0 border border-white/10 group cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </div>
          
          <div className="flex flex-col truncate">
            <h4 className="text-white text-base font-bold truncate hover:text-blue-400 cursor-pointer transition-colors">
              {track.title}
            </h4>
            <p className="text-xs text-gray-400 truncate hover:underline cursor-pointer">
              {track.artist}
            </p>
          </div>
          <button className="ml-3 text-gray-500 hover:text-blue-500 transition-colors">
            <Heart size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center w-2/4 max-w-xl">
          <div className="flex items-center gap-7 mb-3">
            <button className="text-gray-500 hover:text-white transition"><Shuffle size={18} /></button>
            <button className="text-gray-400 hover:text-white transition"><SkipBack size={24} className="fill-current" /></button>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-full hover:scale-110 hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] group"
            >
              {isPlaying ? (
                <Pause size={24} className="text-black group-hover:text-white fill-current" />
              ) : (
                <Play size={24} className="text-black group-hover:text-white fill-current ml-1" />
              )}
            </button>

            <button className="text-gray-400 hover:text-white transition"><SkipForward size={24} className="fill-current" /></button>
            <button className="text-gray-500 hover:text-white transition"><Repeat size={18} /></button>
          </div>
          
          <div className="flex items-center gap-4 w-full">
            <span className="text-xs text-gray-500 font-medium w-8 text-right">
              {formatTime(currentSeconds)}
            </span>
            
            <div className="h-1.5 flex-1 bg-white/10 rounded-full group relative flex items-center">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress} 
                onChange={(e) => setProgress(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute left-0 h-full bg-blue-500 group-hover:bg-blue-400 rounded-full pointer-events-none"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
              </div>
            </div>

            <span className="text-xs text-gray-500 font-medium w-8">
              {track.duration}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-5 w-1/4">
          <button className="text-gray-500 hover:text-blue-500 transition"><ListMusic size={20} /></button>
          <div className="flex items-center gap-3 group">
            <Volume2 size={20} className="text-gray-500 group-hover:text-white transition" />
            
            <div className="w-28 h-1.5 bg-white/10 rounded-full relative flex items-center">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute left-0 h-full bg-gray-400 group-hover:bg-blue-500 rounded-full pointer-events-none"
                style={{ width: `${volume}%` }}
              >
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
              </div>
            </div>

          </div>
          <button className="text-gray-500 hover:text-white transition"><Maximize2 size={18} /></button>
        </div>
      </div>

    </footer>
  );
}