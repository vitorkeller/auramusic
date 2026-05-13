// app/layout.tsx
"use client";

import { Quicksand } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import { PlayerProvider } from "../contexts/PlayerContext";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return (
      <html lang="pt-BR">
        <body className={`${quicksand.variable} font-sans antialiased h-screen w-full bg-black`}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR">
      <body className={`${quicksand.variable} font-sans antialiased overflow-hidden`}>
        <AuthProvider>
          <PlayerProvider>
            <div className="flex h-screen w-full bg-black/20">
              <Sidebar />
              <main className="flex-1 overflow-y-auto relative pb-32">
                {children}
              </main>
            </div>
            <Player />
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}