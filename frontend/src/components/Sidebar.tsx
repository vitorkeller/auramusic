"use client";

import { Home, Library, Heart, LogOut, UserCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-24 h-full flex flex-col items-center pt-8 pb-10 z-50">
      
      <Link href="/" className="mb-8 hover:scale-110 transition-transform">
         <Image src="/img/icon_black.png" alt="Logo" width={48} height={48} />
      </Link>

      <div className="flex flex-col gap-4">
          
          <nav className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-[40px] py-6 px-2 flex flex-col gap-6 items-center shadow-2xl">
             <NavItem href="/" icon={<Home size={22} />} active={pathname === "/"} />
             <NavItem icon={<Library size={22} />} active={pathname === "/library"} />
             <NavItem icon={<Heart size={22} />} active={pathname === "/favorites"} />
          </nav>

          <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/5 rounded-[40px] py-6 px-2 flex flex-col gap-6 items-center shadow-2xl">
             <NavItem href="/login" icon={<UserCircle2 size={24} />} active={pathname === "/login"} />
             <NavItem icon={<LogOut size={24} />} />
          </div>

      </div>

    </aside>
  );
}

function NavItem({ icon, active = false, href }: { icon: React.ReactNode, active?: boolean, href?: string }) {
  const classes = `w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
    active 
      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
      : 'text-gray-400 hover:text-white hover:bg-white/5'
  }`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
      </Link>
    );
  }

  return (
    <button className={classes}>
      {icon}
    </button>
  );
}