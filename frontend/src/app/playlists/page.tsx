"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "../../components/Header";
import { Plus, Play, Music2, Trash2, X, Check } from "lucide-react";

export default function PlaylistsPage() {
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);

	const [playlists, setPlaylists] = useState<any[]>([]);
	const [availableSongs, setAvailableSongs] = useState<any[]>([]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newPlaylistName, setNewPlaylistName] = useState("");
	const [selectedSongs, setSelectedSongs] = useState<number[]>([]);

	const [isDeleteMode, setIsDeleteMode] = useState(false);
	const [playlistsToDelete, setPlaylistsToDelete] = useState<number[]>([]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.replace("/login");
			return;
		}

		const fetchData = async () => {
			try {
				const plRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists/`, {
					headers: { "Authorization": `Bearer ${token}` }
				});
				if (plRes.ok) setPlaylists(await plRes.json());

				const trRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tracks/`, {
					headers: { "Authorization": `Bearer ${token}` }
				});
				if (trRes.ok) setAvailableSongs(await trRes.json());

			} catch (error) {
				console.error("Erro ao carregar dados", error);
			} finally {
				setIsChecking(false);
			}
		};

		fetchData();
	}, [router]);

	const handleCreatePlaylist = async () => {
		if (!newPlaylistName.trim()) return alert("Digite um nome para a playlist");
		const token = localStorage.getItem("token");

		const colors = ["from-blue-600 to-indigo-900", "from-rose-500 to-red-900", "from-emerald-500 to-teal-800"];
		const chosenColor = colors[Math.floor(Math.random() * colors.length)];

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					name: newPlaylistName,
					color: chosenColor,
					tracks: selectedSongs
				})
			});

			if (res.status === 401) {
				localStorage.removeItem("token");
				router.replace("/login");
				return;
			}

			if (res.ok) {
				const data = await res.json();
				setPlaylists([{ id: data.id, title: newPlaylistName, color: chosenColor, tracks: selectedSongs.length }, ...playlists]);

				setIsModalOpen(false);
				setNewPlaylistName("");
				setSelectedSongs([]);
			}
		} catch (error) {
			console.error("Erro ao criar playlist", error);
		}
	};

	const toggleSongSelection = (id: number) => {
		setSelectedSongs(prev => prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]);
	};

	const togglePlaylistForDeletion = (id: number) => {
		setPlaylistsToDelete(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
	};

	const confirmDeletion = async () => {
		if (playlistsToDelete.length === 0) {
			setIsDeleteMode(false);
			return;
		}

		if (confirm(`Tem certeza que deseja excluir ${playlistsToDelete.length} playlist(s)?`)) {
			const token = localStorage.getItem("token");

			try {
				await Promise.all(playlistsToDelete.map(id =>
					fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlists/${id}`, {
						method: "DELETE",
						headers: { "Authorization": `Bearer ${token}` }
					})
				));

				setPlaylists(prev => prev.filter(p => !playlistsToDelete.includes(p.id)));
				setIsDeleteMode(false);
				setPlaylistsToDelete([]);
			} catch (error) {
				console.error("Erro ao apagar playlists", error);
			}
		}
	};

	const cancelDeleteMode = () => {
		setIsDeleteMode(false);
		setPlaylistsToDelete([]);
	};

	if (isChecking) return null;

	return (
		<>
			<Header />
			<div className="p-8 pb-32 flex flex-col gap-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-4xl font-bold text-white tracking-tight">Minhas Playlists</h1>
						<p className="text-gray-400 mt-2">Você tem {playlists.length} playlists criadas.</p>
					</div>

					<div className="flex items-center gap-4">
						{isDeleteMode ? (
							<>
								<button
									onClick={cancelDeleteMode}
									className="px-6 py-3 rounded-full font-bold transition-all text-white bg-white/10 hover:bg-white/20"
								>
									Cancelar
								</button>
								<button
									onClick={confirmDeletion}
									className={`px-6 py-3 rounded-full font-bold transition-all shadow-lg ${playlistsToDelete.length > 0 ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20' : 'bg-red-600/50 text-white/50 cursor-not-allowed'}`}
								>
									Apagar ({playlistsToDelete.length})
								</button>
							</>
						) : (
							<>
								<button
									onClick={() => setIsDeleteMode(true)}
									className="w-12 h-12 flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all"
									title="Selecionar para apagar"
								>
									<Trash2 size={20} />
								</button>
								<button
									onClick={() => setIsModalOpen(true)}
									className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-600/20"
								>
									<Plus size={20} /> Nova Playlist
								</button>
							</>
						)}
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
					{playlists.map((p) => {
						const isSelectedForDeletion = playlistsToDelete.includes(p.id);

						const CardContent = (
							<div className={`bg-white/5 backdrop-blur-md p-5 rounded-[32px] border transition-all cursor-pointer h-full relative flex flex-col group ${isDeleteMode && isSelectedForDeletion ? 'border-red-500 bg-red-500/10' : 'border-white/5 hover:bg-white/10'}`}>
								{isDeleteMode && (
									<div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center z-20 transition-all ${isSelectedForDeletion ? 'bg-red-500 border-red-500' : 'border-white/30 bg-black/40'}`}>
										{isSelectedForDeletion && <Check size={14} className="text-white" />}
									</div>
								)}
								<div className={`aspect-square rounded-2xl mb-4 relative overflow-hidden bg-gradient-to-br ${p.color} flex items-center justify-center ${isDeleteMode && isSelectedForDeletion ? 'opacity-50' : ''}`}>
									<Music2 size={48} className="text-white/20" />
									{!isDeleteMode && (
										<div className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-black opacity-0 group-hover:opacity-100 shadow-2xl transition-all translate-y-4 group-hover:translate-y-0">
											<Play size={18} className="fill-current ml-1" />
										</div>
									)}
								</div>
								<h3 className="text-white font-bold truncate mt-auto">{p.title}</h3>
								<p className="text-xs text-gray-500">{p.tracks} músicas</p>
							</div>
						);

						if (isDeleteMode) {
							return (
								<div key={p.id} onClick={() => togglePlaylistForDeletion(p.id)}>
									{CardContent}
								</div>
							);
						}

						return (
							<Link href={`/playlists/${p.id}`} key={p.id}>
								{CardContent}
							</Link>
						);
					})}
				</div>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
					<div className="bg-[#181818] border border-white/10 w-full max-w-lg rounded-[40px] p-8 flex flex-col gap-6 shadow-2xl">
						<div className="flex justify-between items-center">
							<h2 className="text-2xl font-bold text-white">Nova Playlist</h2>
							<button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
						</div>

						<div className="flex flex-col gap-2">
							<label className="text-sm font-semibold text-gray-400">Nome da Playlist</label>
							<input
								autoFocus
								className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-colors"
								placeholder="Ex: Hits de Verão"
								value={newPlaylistName}
								onChange={(e) => setNewPlaylistName(e.target.value)}
							/>
						</div>

						<div className="flex flex-col gap-3">
							<label className="text-sm font-semibold text-gray-400">Selecione as músicas ({selectedSongs.length})</label>
							<div className="max-h-60 overflow-y-auto flex flex-col gap-2 pr-2 custom-scrollbar">
								{availableSongs.map(song => {
									const isImage = song.cover?.startsWith('http');
									return (
										<div
											key={song.id}
											onClick={() => toggleSongSelection(song.id)}
											className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all border ${selectedSongs.includes(song.id) ? 'bg-blue-600/20 border-blue-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
										>
											<div
												className={`w-10 h-10 rounded-lg flex-shrink-0 bg-cover bg-center ${!isImage ? `bg-gradient-to-br ${song.cover}` : ''}`}
												style={isImage ? { backgroundImage: `url(${song.cover})` } : {}}
											/>
											<div className="flex-1">
												<p className="text-white text-sm font-bold">{song.title}</p>
												<p className="text-xs text-gray-400">{song.artist}</p>
											</div>
											{selectedSongs.includes(song.id) && <Check size={18} className="text-blue-500" />}
										</div>
									);
								})}
							</div>
						</div>

						<button
							onClick={handleCreatePlaylist}
							className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all"
						>
							Criar Playlist
						</button>
					</div>
				</div>
			)}
		</>
	);
}