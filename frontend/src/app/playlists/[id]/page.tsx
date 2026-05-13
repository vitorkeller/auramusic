"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "../../../components/Header";
import { Play, Heart, MoreHorizontal, Clock, Music2, Pause } from "lucide-react";
import { usePlayer } from "../../../contexts/PlayerContext";

export default function PlaylistDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  
  const [playlist, setPlaylist] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("userPlaylists");
    if (saved) {
      const all = JSON.parse(saved);
      const found = all.find((p: any) => p.id.toString() === params.id);
      if (found) setPlaylist(found);
    }
    setIsChecking(false);
  }, [params.id]);

  if (isChecking || !playlist) return null;

  return (
    <>
      <Header />
      <div className="p-8 pb-32 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8 items-end bg-white/5 p-8 rounded-[40px] border border-white/5 backdrop-blur-md">
          <div className={`w-56 h-56 rounded-3xl shadow-2xl bg-gradient-to-br ${playlist.color} flex items-center justify-center flex-shrink-0`}>
            <Music2 size={80} className="text-white/20" />
          </div>
          <div className="flex flex-col gap-4 pb-2 w-full">
            <span className="text-sm font-semibold text-white/70 uppercase tracking-widest">Playlist</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">{playlist.title}</h1>
            <p className="text-gray-400">Criada por <strong className="text-white">Você</strong> • {playlist.songs?.length || 0} músicas</p>
            <div className="flex items-center gap-4 mt-2">
              <button 
                onClick={() => playlist.songs?.[0] && playTrack(playlist.songs[0], playlist.songs)} // <-- Passando a lista playlist.songs
                className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-500 text-black shadow-lg hover:scale-105 transition-transform"
              >
                <Play size={24} className="fill-current ml-1" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="grid grid-cols-[auto_2fr_2fr_auto_auto] gap-4 px-4 py-2 border-b border-white/10 text-sm font-semibold text-gray-400 mb-4">
            <div className="w-8"></div>
            <div>Título</div>
            <div>Duração</div>
            <div className="w-12 flex justify-center"><Clock size={16} /></div>
          </div>

          <div className="flex flex-col gap-2">
            {(playlist.songs || []).map((song: any) => {
              const isPlayingNow = currentTrack?.id === song.id && isPlaying;
              return (
                <div 
                  key={song.id} 
                  onClick={() => playTrack(song, playlist.songs)} // <-- Passando a lista playlist.songs
                  className={`grid grid-cols-[auto_2fr_2fr_auto_auto] gap-4 items-center px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer ${currentTrack?.id === song.id ? 'bg-white/10' : ''}`}
                >
                  <div className="w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isPlayingNow ? <Pause size={16} className="text-blue-500 fill-current" /> : <Play size={16} className="text-white fill-current" />}
                  </div>
                  <div className="flex items-center gap-4 truncate">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${song.cover}`} />
                    <div className="truncate">
                      <p className={`font-semibold truncate ${currentTrack?.id === song.id ? 'text-blue-400' : 'text-white'}`}>{song.title}</p>
                      <p className="text-xs text-gray-400">{song.artist}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{song.duration}</div>
                  <div className="w-12 text-center text-sm text-gray-400">
                     <Heart size={18} className="hover:text-white transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}