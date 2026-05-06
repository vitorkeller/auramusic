import Image from "next/image";

export function Header() {
    return (
        // Sem 'sticky', sem 'fixed'. O 'px-8' garante o mesmo alinhamento do conteúdo de baixo.
        <header className="w-full px-8 pt-8 pb-4">
            
            {/* A barra vai ocupar todo o espaço disponível dentro do recuo px-8 */}
            <div className="flex items-center border border-white/10 rounded-full bg-white/5 backdrop-blur-xl shadow-lg w-full transition-all hover:bg-white/10">
                <Image 
                    className="ml-6 mr-3 opacity-60" 
                    src="/img/search.png" 
                    alt="Lupa" 
                    width={26} 
                    height={26} 
                />
                <input 
                    className="w-full outline-none bg-transparent text-white placeholder-gray-400 py-4 pr-8 text-lg font-medium tracking-wide rounded-r-full" 
                    type="text" 
                    placeholder="Search artists"
                />
            </div>                
        </header>
    );
}