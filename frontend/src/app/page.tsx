"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Play, Heart, Pause } from "lucide-react";
import { usePlayer } from "../contexts/PlayerContext";

export default function Home() {
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);
	
	const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
	const [likedSongs, setLikedSongs] = useState<any[]>([]);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			router.replace("/login");
			return;
		} else {
			setIsChecking(false);
		}

		const savedLikes = localStorage.getItem("likedSongs");
		if (savedLikes) {
			setLikedSongs(JSON.parse(savedLikes));
		}
	}, [router]);

	const toggleLike = (e: React.MouseEvent, song: any) => {
		e.stopPropagation(); 
		
		const isLiked = likedSongs.some((s) => s.id === song.id);
		let updatedLikes;
		
		if (isLiked) {
			updatedLikes = likedSongs.filter((s) => s.id !== song.id);
		} else {
			const songToSave = {
				id: song.id,
				title: song.title,
				artist: song.artist,
				album: song.album || "Single", 
				duration: song.duration || "3:30", 
				cover: song.color || song.cover
			};
			updatedLikes = [...likedSongs, songToSave];
		}
		
		setLikedSongs(updatedLikes);
		localStorage.setItem("likedSongs", JSON.stringify(updatedLikes));
	};

	// Nova versão do handleSongClick que envia a fila inteira para o Player
	const handleSongClick = (song: any, queueSource: any[]) => {
		if (currentTrack?.id === song.id && currentTrack?.artist === song.artist) {
			togglePlay();
		} else {
			// Formata a lista inteira para o padrão que o Player entende
			const formattedQueue = queueSource.map((s: any) => ({
				id: s.id,
				title: s.title,
				artist: s.artist,
				album: s.album || "Single",
				duration: s.duration || "3:30",
				cover: s.color || s.cover
			}));

			playTrack({
				id: song.id,
				title: song.title,
				artist: song.artist,
				album: song.album || "Single",
				duration: song.duration || "3:30",
				cover: song.color || song.cover
			}, formattedQueue);
		}
	};

	if (isChecking) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-black">
				<span className="text-white">Carregando...</span>
			</div>
		);
	}

	return (
		<>
			<Header />

			<div className="p-8 pb-10 flex flex-col gap-12">

				<div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
					<div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 flex flex-col gap-6 relative overflow-hidden border border-white/5">
						<span className="text-sm font-semibold text-white/70">Currated playlist</span>
						<h2 className="text-6xl font-bold text-white tracking-tight">R & B Hits</h2>
						<p className="text-white/80 max-w-lg leading-relaxed">All mine, Lie again, Petty call me everyday, Out of time, No love, Bad habit, and so much more</p>
						<div className="flex items-center gap-4 mt-auto">
							<div className="flex -space-x-3">
								{[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border border-black" />)}
							</div>
							<strong className="font-semibold text-white">33k Likes</strong>
						</div>
						<div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-950 rounded-full blur-[100px] pointer-events-none" />
					</div>

					<div className="flex flex-col gap-6">
						<h3 className="text-xl font-bold text-white tracking-tight">Top charts</h3>
						<div className="flex flex-col gap-4">
							{topCharts.map(item => {
								const isThisSongPlaying = currentTrack?.id === item.id && currentTrack?.artist === item.artist;
								const isLiked = likedSongs.some((s) => s.id === item.id);
								
								return (
									<div 
										key={item.id} 
										onClick={() => handleSongClick(item, topCharts)} // <-- Enviando a fila topCharts
										className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition border border-white/5 group/card ${
											isThisSongPlaying ? "bg-white/10 border-blue-500/30" : "bg-[#121212] hover:bg-white/5"
										}`}
									>
										<div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${item.color} flex-shrink-0 border border-white/5 flex items-center justify-center`}>
											{isThisSongPlaying && isPlaying && <Pause size={20} className="text-white fill-current" />}
										</div>
										<div className="flex-1 truncate">
											<h4 className={`font-semibold truncate transition ${isThisSongPlaying ? "text-blue-400" : "text-white group-hover/card:text-blue-400"}`}>
												{item.title}
											</h4>
											<p className="text-sm text-gray-400 truncate">{item.artist}</p>
										</div>

										<button 
											className="ml-auto w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all group/btn hover:bg-white/5" 
											onClick={(e) => toggleLike(e, item)}
										>
											<Heart size={18} className={`transition-all ${isLiked ? 'fill-pink-500 text-pink-500 border-transparent' : 'text-gray-400 group-hover/btn:text-white'}`} />
										</button>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-6">
					<div className="flex items-end justify-between">
						<h2 className="text-3xl font-bold text-white tracking-tight">New releases.</h2>
						<span className="text-sm font-medium text-gray-400 hover:text-white cursor-pointer transition-colors">
							Mostrar tudo
						</span>
					</div>

					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
						{newReleases.map((album) => {
							const isThisSongPlaying = currentTrack?.id === album.id && currentTrack?.artist === album.artist;
							const isLiked = likedSongs.some((s) => s.id === album.id);

							return (
								<div
									key={album.id}
									onClick={() => handleSongClick(album, newReleases)} // <-- Enviando a fila newReleases
									className={`backdrop-blur-md p-4 rounded-3xl transition-all cursor-pointer border flex flex-col group ${
										isThisSongPlaying 
											? "bg-white/10 border-blue-500/40" 
											: "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
									}`}
								>
									<div className={`aspect-square rounded-2xl mb-4 shadow-lg overflow-hidden relative bg-gradient-to-br ${album.color}`}>
										<div className={`absolute inset-0 transition-colors ${isThisSongPlaying ? "bg-transparent" : "bg-black/20 group-hover:bg-transparent"}`} />
										
										<button 
											onClick={(e) => toggleLike(e, album)}
											className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition-all z-20 hover:scale-110 ${
												isLiked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
											}`}
										>
											<Heart size={16} className={isLiked ? "fill-pink-500 text-pink-500" : "text-white"} />
										</button>

										<button className={`absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-black shadow-xl transition-all z-10 ${
											isThisSongPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
										}`}>
											{isThisSongPlaying && isPlaying ? (
												<Pause size={18} className="fill-current" />
											) : (
												<Play size={18} className="fill-current ml-1" />
											)}
										</button>
									</div>
									<strong className={`block font-semibold text-sm truncate transition-colors ${isThisSongPlaying ? "text-blue-400" : "text-white group-hover:text-blue-400"}`}>
										{album.title}
									</strong>
									<span className="text-xs text-gray-400 block truncate mt-1">
										{album.artist}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
}

const topCharts = [
	{ id: 101, title: "Golden age of 80s", artist: "Sean swadder", duration: "2:34:45", color: "from-amber-600 to-amber-900" },
	{ id: 102, title: "Reggae “n” blues", artist: "Dj YK mule", duration: "1:02:42", color: "from-red-600 to-red-900" },
	{ id: 103, title: "Tomorrow's tunes", artist: "Obi Datti", duration: "2:01:25", color: "from-sky-600 to-sky-900" },
];

const newReleases = [
	{ id: 1, title: "Life in a bubble", artist: "Código & Café", color: "from-slate-600 to-slate-900" },
	{ id: 2, title: "Mountain", artist: "Pixel Perfect", color: "from-sky-400 to-indigo-800" },
	{ id: 3, title: "Cyberpunk Beats", artist: "Synthwave", color: "from-blue-600 to-blue-900" },
	{ id: 4, title: "Lofi Study", artist: "Chill Flow", color: "from-orange-600 to-orange-900" },
	{ id: 5, title: "Ocean Waves", artist: "Nature Sounds", color: "from-cyan-700 to-blue-900" },
	{ id: 6, title: "Midnight City", artist: "Neon Dreams", color: "from-indigo-600 to-indigo-950" },
	{ id: 7, title: "Chill Vibes", artist: "Relaxing Mix", color: "from-lime-600 to-lime-900" },
	{ id: 8, title: "Electric Feel", artist: "The Synthetics", color: "from-rose-600 to-rose-900" },
];