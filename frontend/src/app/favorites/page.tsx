"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import { Play, Heart, Clock, Pause } from "lucide-react";
import { usePlayer } from "../../contexts/PlayerContext";

export default function HeartPage() {
	const router = useRouter();
	const { playTrack, currentTrack, isPlaying } = usePlayer();

	const [likedSongs, setLikedSongs] = useState<any[]>([]);
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.replace("/login");
			return;
		}

		const fetchFavorites = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/`, {
					headers: {
						"Authorization": `Bearer ${token}`
					}
				});

				if (response.status === 401) {
					localStorage.removeItem("token");
					router.replace("/login");
					return;
				}

				if (response.ok) {
					const data = await response.json();
					setLikedSongs(data);
				}
			} catch (error) {
				console.error("Erro ao buscar favoritos:", error);
			} finally {
				setIsChecking(false);
			}
		};

		fetchFavorites();

		const handleLikesUpdated = () => fetchFavorites();
		window.addEventListener("likesUpdated", handleLikesUpdated);

		return () => window.removeEventListener("likesUpdated", handleLikesUpdated);
	}, [router]);

	const removeFavorite = async (e: React.MouseEvent, id: number) => {
		e.stopPropagation();
		const token = localStorage.getItem("token");

		try {
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${id}`, {
				method: "DELETE",
				headers: { "Authorization": `Bearer ${token}` }
			});

			setLikedSongs(prev => prev.filter(s => s.id !== id));

			window.dispatchEvent(new Event("likesUpdated"));
		} catch (error) {
			console.error("Erro ao remover favorito", error);
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
									onClick={() => playTrack(likedSongs[0], likedSongs)}
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
								const isImage = song.cover?.startsWith('http');

								return (
									<div
										key={song.id}
										onClick={() => playTrack(song, likedSongs)}
										className={`grid grid-cols-[auto_2fr_2fr_auto_auto] gap-4 items-center px-4 py-3 rounded-2xl transition-colors group cursor-pointer ${currentTrack?.id === song.id ? "bg-white/10" : "hover:bg-white/5"
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
											{/* CAPA DA MÚSICA CORRIGIDA */}
											<div
												className={`w-10 h-10 rounded-lg flex-shrink-0 bg-cover bg-center ${!isImage ? `bg-gradient-to-br ${song.cover}` : ''}`}
												style={isImage ? { backgroundImage: `url(${song.cover})` } : {}}
											/>
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