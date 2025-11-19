import { menuItems } from '@/utils/utils';
import { useUI } from '@/context/UIContext';
import { useState } from 'react';
import '../styles/app.css';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { handleDocClick } = useUI();
    const icons = { Home: menuItems.home, Geo: menuItems.geoSearch, Pipeline: menuItems.analytics, LinkedIn: menuItems.linkedIn, NavMenu: menuItems.navMenu, CloseMenu: menuItems.closeMenu, Git: menuItems.git, Architecure: menuItems.architecture };
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-teal-500 backdrop-blur-md bg-opacity-80 text-white shadow-lg">
            <div className="max-w-8xl mx-auto flex items-center justify-between px-6 py-3">
                <h1 className="text-xl font-semibold tracking-tight">
                    ASYNC DOC PIPELINE
                </h1>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-md hover:bg-white/20 transition md:hidden"
                    aria-label="Toggle Menu"
                >
                    {menuOpen ? <icons.CloseMenu size={24} /> : <icons.NavMenu size={24} />}
                </button>

                <nav className="hidden md:flex gap-4 items-center">
                    <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition">
                        <icons.Home size={20} /> Home
                    </a>
                    <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition">
                        <icons.Geo size={20} /> Geo Search
                    </a>
                    <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition">
                        <icons.Pipeline size={20} /> Real Time Analytics Pipeline
                    </a>
                    <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition">
                        <icons.LinkedIn size={20} /> LinkedIn
                    </a>
                    <a href="https://github.com/Vijayanand-debug/async-document-processing-pipeline" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition">
                        <icons.Git size={20} /> Source Code
                    </a>
                    <a href="#" onClick={() => handleDocClick('img')} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition">
                        <icons.Architecure size={20} /> Architecture
                    </a>
                </nav>
            </div>

            {menuOpen && (
                <nav className="flex flex-col bg-gradient-to-b from-emerald-700 to-teal-600 text-white py-3 px-6 space-y-2 shadow-lg animate-fadeIn md:hidden">
                    <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition"> <icons.Home size={20} /> Home </a>
                    <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition"> <icons.Geo size={20} /> Geo Search </a>
                    <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition"> <icons.Pipeline size={20} /> Real Time Analytics Pipeline
                    </a>
                    <a href="mylink" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition">
                        <icons.LinkedIn size={20} /> LinkedIn
                    </a>
                    <a href="mylink" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition">
                        <icons.Git size={20} /> Source Code
                    </a>
                    <a href="#"
                        onClick={() => handleDocClick('img')}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/20 transition"
                    >
                        <icons.Architecure size={20} /> Architecture
                    </a>
                </nav>
            )}
        </header>

    );
}