"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import { Play, Heart, Clock, Music2, Pause } from "lucide-react";
import { usePlayer } from "../../contexts/PlayerContext";

export default function HeartPage() {
  const router = useRouter();
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const saved = localStorage.getItem("likedSongs");
    if (saved) {
      setLikedSongs(JSON.parse(saved));
    } else {
      const defaults = [
        { id: 1, title: "Midnight City", artist: "M83", album: "Hurry Up...", duration: "4:03", cover: "from-blue-600 to-indigo-900" },
        { id: 2, title: "Starboy", artist: "The Weeknd", album: "Starboy", duration: "3:50", cover: "from-red-600 to-red-900" },
      ];
      setLikedSongs(defaults);
      localStorage.setItem("likedSongs", JSON.stringify(defaults));
    }
    setIsChecking(false);
  }, [router]);

  const removeFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updated = likedSongs.filter(s => s.id !== id);
    setLikedSongs(updated);
    localStorage.setItem("likedSongs", JSON.stringify(updated));
  };

  if (isChecking) return null;

  return (
    <>
      <Header />
      <div className="p-8 pb-32 flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row gap-8 items-end bg-gradient-to-t from-white/5 to-pink-500/10 p-8 rounded-[40px] border border-white/5 backdrop-blur-md">
          <div className="w-56 h-56 rounded-3xl shadow-2xl bg-gradient-to-br from-pink-600 to-red-900 flex items-center justify-center flex-shrink-0">
            <Heart size={100} className="text-white fill-current" />
          </div>
          <div className="flex flex-col gap-4 pb-2 w-full">
            <span className="text-sm font-semibold text-white/70 uppercase tracking-widest">Playlist</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">Heart</h1>
            <p className="text-gray-400">
              <strong className="text-white">{likedSongs.length} músicas</strong> curtidas
            </p>
            
            <div className="flex items-center gap-4 mt-2">
              {likedSongs.length > 0 && (
                <button 
                  onClick={() => playTrack(likedSongs[0], likedSongs)} // <-- Passando a lista likedSongs
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-pink-500 text-white hover:scale-105 transition-transform shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                >
                  <Play size={24} className="fill-current ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="grid grid-cols-[auto_2fr_2fr_auto_auto] gap-4 px-4 py-2 border-b border-white/10 text-sm font-semibold text-gray-400 mb-4">
            <div className="w-8"></div>
            <div>Título</div>
            <div>Álbum</div>
            <div className="mr-8"></div>
            <div className="w-12 flex justify-center"><Clock size={16} /></div>
          </div>

          <div className="flex flex-col gap-2">
            {likedSongs.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <Heart size={48} className="mx-auto mb-4 opacity-20" />
                <p>Você ainda não curtiu nenhuma música.</p>
              </div>
            ) : (
              likedSongs.map((song) => {
                const isThisSongPlaying = currentTrack?.id === song.id && isPlaying;
                return (
                  <div 
                    key={song.id} 
                    onClick={() => playTrack(song, likedSongs)} // <-- Passando a lista likedSongs
                    className={`grid grid-cols-[auto_2fr_2fr_auto_auto] gap-4 items-center px-4 py-3 rounded-2xl transition-colors group cursor-pointer ${
                      currentTrack?.id === song.id ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="w-8 flex items-center justify-center">
                      {isThisSongPlaying ? (
                        <Pause size={16} className="text-pink-500 fill-current" />
                      ) : (
                        <Play size={16} className={`group-hover:opacity-100 transition-opacity ${currentTrack?.id === song.id ? 'opacity-100 text-pink-500' : 'opacity-0 text-white'} fill-current`} />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className={`w-10 h-10 rounded-lg flex-shrink-0 bg-gradient-to-br ${song.cover}`} />
                      <div className="truncate">
                        <p className={`font-semibold truncate ${currentTrack?.id === song.id ? "text-pink-400" : "text-white"}`}>{song.title}</p>
                        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400 truncate">
                      {song.album}
                    </div>

                    <div className="mr-8">
                      <button 
                        onClick={(e) => removeFavorite(e, song.id)}
                        className="text-pink-500 hover:text-gray-400 transition-colors"
                        title="Remover dos favoritos"
                      >
                        <Heart size={18} className="fill-current" />
                      </button>
                    </div>

                    <div className="w-12 text-center text-sm text-gray-400">
                      {song.duration}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}