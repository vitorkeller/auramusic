"use client"

import { useState } from "react"
import Image from "next/image";
import Link from "next/link";
import { InputField } from "@/src/components/InputField";
import Button from "@/src/components/Button";

export default function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const handleRegister = async () => {
		setError("")

		if (!username || !password) {
			setError("Preencha todos os campos")
			return
		}

		setLoading(true)

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password })
			});

			if (!response.ok) {
				throw new Error("Usuário ou senha inválidos");
			}

			const data = await response.json();

			localStorage.setItem("token", data.token);
			localStorage.setItem("userRole", data.role);
			localStorage.setItem("username", data.username);
			

			window.location.href = "/login";

		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="grid grid-rows-4 justify-items-center min-h-screen align-itemns ">
			<Link href="/">
				<Image className="row-span-1 pt-30" src="/img/logo_black1.png" alt="Logo" width={310} height={10} />
			</Link>

			<div className="mt-6 row-span-3 self-end w-158 h-158 border border-white/10 rounded-t-2xl bg-white/8 backdrop-blur-md shadow-inner shadow-black/30">
				<div className="flex flex-col h-full">
					<h1 className="flex justify-center text-3xl pt-8 pb-2 font-bold">Cadastro</h1>

					<div className="flex flex-col self-center">
						<InputField
							label="Usuário"
							type="text"
							placeholder="Crie seu usuário..."
							icon="/img/user.png"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>

						<InputField
							label="Senha"
							type="password"
							placeholder="Crie sua senha..."
							icon="/img/pin.png"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<div className="mt-2 flex flex-col gap-3">
							<Button onClick={handleRegister} disabled={loading}>
								{loading ? (
									<div className="flex justify-center w-full">
										<Image src="/img/loading.gif" alt="loading" width={24} height={24} />
									</div>
								) : (
									<span className="text-white font-medium flex justify-center w-full">Registrar</span>
								)}
							</Button>

							<div className="flex justify-center text-sm text-white/40">
								<span>Já tem uma conta? </span>
								<Link href="/login" className="ml-1 hover:text-white transition-colors">
									Entrar
								</Link>
							</div>
						</div>

						{error && (
							<span className="text-red-500 text-sm mt-3 text-center">
								{error}
							</span>
						)}

						<span className="flex justify-center mt-50 px-4 text-white/80 text-md">Aura Music © 2026 </span>
					</div>
				</div>
			</div>
		</div>
	);
}
