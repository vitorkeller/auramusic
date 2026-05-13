"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, Edit2, Save } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Usuário");
  const [bio, setBio] = useState("Apaixonado por música e tecnologia. Criando playlists para todos os momentos do dia.");
  const [photo, setPhoto] = useState("/img/icon_black.png");
  
  const [playlistCount, setPlaylistCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setName(storedName);

    const savedPlaylists = localStorage.getItem("userPlaylists");
    if (savedPlaylists) {
      const parsedPlaylists = JSON.parse(savedPlaylists);
      setPlaylistCount(parsedPlaylists.length);
    }

    const savedLikes = localStorage.getItem("likedSongs");
    if (savedLikes) {
      const parsedLikes = JSON.parse(savedLikes);
      setLikedCount(parsedLikes.length);
    }
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    localStorage.setItem("userName", name);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
    }
  };

  return (
    // Adicionado o pb-32 aqui na div principal
    <div className="p-8 pb-32 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[40px] p-12 backdrop-blur-xl flex flex-col items-center gap-8 relative shadow-2xl">
        
        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="absolute top-8 right-8 flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full transition-all z-10"
        >
          {isEditing ? (
            <>
              <Save size={18} className="text-blue-400" />
              <span className="text-sm font-semibold">Salvar</span>
            </>
          ) : (
            <>
              <Edit2 size={18} className="text-gray-400" />
              <span className="text-sm font-semibold">Editar</span>
            </>
          )}
        </button>

        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.3)] bg-zinc-800 flex items-center justify-center group mt-4">
           <Image 
              src={photo} 
              alt={name} 
              fill
              className="object-cover"
           />
           
           {isEditing && (
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
             >
               <Camera className="text-white mb-2" size={28} />
               <span className="text-white text-xs font-bold uppercase tracking-wider">Mudar Foto</span>
             </div>
           )}
           
           <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>

        <div className="text-center w-full flex flex-col items-center">
          {isEditing ? (
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-3xl font-bold text-white mb-2 bg-black/40 border border-white/20 rounded-2xl px-6 py-2 outline-none focus:border-blue-500 focus:bg-black/60 text-center w-4/5 transition-all"
            />
          ) : (
            <h1 className="text-4xl font-bold text-white mb-2">{name}</h1>
          )}
          
          <p className="text-blue-400 font-semibold mb-6 uppercase tracking-widest text-sm">Usuário Ativo</p>
          
          {isEditing ? (
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="text-gray-300 leading-relaxed text-base w-full max-w-lg bg-black/40 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 focus:bg-black/60 resize-none transition-all shadow-inner"
            />
          ) : (
            <p className="text-gray-300 leading-relaxed text-lg italic max-w-md min-h-[100px]">
              {bio}
            </p>
          )}
        </div>

        <div className="flex gap-16 w-full justify-center pt-10 border-t border-white/10 mt-2">
          <div className="text-center group cursor-pointer">
            <p className="text-white font-black text-3xl group-hover:text-blue-400 transition-colors">
              {playlistCount}
            </p>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-2 group-hover:text-gray-400 transition-colors">Playlists</p>
          </div>

          <div className="text-center group cursor-pointer">
            <p className="text-white font-black text-3xl group-hover:text-blue-400 transition-colors">
              {likedCount}
            </p>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-2 group-hover:text-gray-400 transition-colors">Curtidas</p>
          </div>
        </div>
      </div>
    </div>
  );
}