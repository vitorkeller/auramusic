// app/page.tsx

"use client"; // Necessário para usar hooks e acessar o localStorage

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Importante: usar next/navigation no App Router
import { Header } from "../components/Header";
import { Play, Heart } from "lucide-react";

export default function Home() {
	const router = useRouter();
	// Começa como true, pois a primeira coisa que a página faz é verificar o login
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			// Se não tem token, manda pro login e substitui o histórico (replace)
			router.replace("/login");
		} else {
			// Se tem token, termina a verificação e mostra a página
			setIsChecking(false);
		}
	}, [router]);

	// Enquanto estiver verificando (ou redirecionando), mostra a tela de carregamento
	if (isChecking) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-black">
				<span className="text-white">Carregando...</span>
			</div>
		);
	}

	// Se estiver autenticado, renderiza a página normalmente
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
							{topCharts.map(item => (
								<div key={item.id} className="bg-[#121212] p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 cursor-pointer transition border border-white/5 group/card">
									<div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${item.color} flex-shrink-0 border border-white/5`} />
									<div>
										<h4 className="text-white font-semibold truncate group-hover/card:text-blue-400 transition">{item.title}</h4>
										<p className="text-sm text-gray-400 truncate">{item.artist}</p>
									</div>

									<button className="ml-auto w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all group/btn">
										<Heart size={18} className="group-hover/btn:fill-white transition-all" />
									</button>
								</div>
							))}
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
						{newReleases.map((album) => (
							<div
								key={album.id}
								className="bg-white/5 backdrop-blur-md p-4 rounded-3xl hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/10 group flex flex-col"
							>
								<div className={`aspect-square rounded-2xl mb-4 shadow-lg overflow-hidden relative bg-linear-to-br ${album.color}`}>
									<div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
									<button className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-black opacity-0 group-hover:opacity-100 shadow-xl transition-all translate-y-4 group-hover:translate-y-0 z-10">
										<Play size={18} className="fill-current ml-1" />
									</button>
								</div>
								<strong className="block font-semibold text-white text-sm truncate group-hover:text-blue-400 transition-colors">
									{album.title}
								</strong>
								<span className="text-xs text-gray-400 block truncate mt-1">
									{album.artist}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

const topCharts = [
	{ id: 1, title: "Golden age of 80s", artist: "Sean swadder", duration: "2:34:45", color: "from-amber-600 to-amber-900" },
	{ id: 2, title: "Reggae “n” blues", artist: "Dj YK mule", duration: "1:02:42", color: "from-red-600 to-red-900" },
	{ id: 3, title: "Tomorrow's tunes", artist: "Obi Datti", duration: "2:01:25", color: "from-sky-600 to-sky-900" },
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
	{ id: 9, title: "Life in a bubble", artist: "Código & Café", color: "from-slate-600 to-slate-900" },
	{ id: 10, title: "Mountain", artist: "Pixel Perfect", color: "from-sky-400 to-indigo-800" },
	{ id: 11, title: "Cyberpunk Beats", artist: "Synthwave", color: "from-blue-600 to-blue-900" },
	{ id: 12, title: "Lofi Study", artist: "Chill Flow", color: "from-orange-600 to-orange-900" },
	{ id: 13, title: "Ocean Waves", artist: "Nature Sounds", color: "from-cyan-700 to-blue-900" },
	{ id: 14, title: "Midnight City", artist: "Neon Dreams", color: "from-indigo-600 to-indigo-950" },
	{ id: 15, title: "Chill Vibes", artist: "Relaxing Mix", color: "from-lime-600 to-lime-900" },
	{ id: 16, title: "Electric Feel", artist: "The Synthetics", color: "from-rose-600 to-rose-900" },
];
