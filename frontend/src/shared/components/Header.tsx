import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="text-white py-2 px-6">
            <div className={`hidden md:flex items-center justify-center relative px-6 py-3 rounded-2xl ${mobileMenuOpen ? 'bg-[#2a2a2a]' : 'bg-neutral-950'}`}>
                <Link to="/dashboard" className="absolute left-6 text-2xl font-bold !text-red-600">
                    Avans
                </Link>
                <nav className="flex items-center gap-1 bg-[#3a3a3a] rounded-full p-1">
                    <Link to="/dashboard" className="!text-black bg-white hover:opacity-80 transition-opacity px-5 py-2 rounded-full font-medium">
                        Dashboard
                    </Link>
                    <Link to="/dashboard" className="!text-white bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors px-5 py-2 rounded-full font-medium">
                        Keuzenmodules
                    </Link>
                    <Link to="/dashboard" className="!text-white bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors px-5 py-2 rounded-full font-medium">
                        AI Keuzenmodules
                    </Link>
                    <Link to="/dashboard" className="!text-white bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors px-5 py-2 rounded-full font-medium">
                        Instellingen
                    </Link>
                </nav>
            </div>

            <div className={`md:hidden rounded-2xl ${mobileMenuOpen ? 'bg-[#2a2a2a]' : 'bg-neutral-950'}`}>
                <div className="flex items-center justify-between px-6 py-4">
                    <Link
                        to="/dashboard"
                        className="text-3xl font-bold !text-red-600 !bg-transparent !border-0 !p-0 cursor-pointer !outline-none focus:!outline-none"
                    >
                        Avans
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-4xl font-bold text-white !bg-transparent !border-0 !p-0 cursor-pointer !outline-none focus:!outline-none"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <nav className="flex flex-col items-center py-8 space-y-6 text-lg">
                        <Link
                            to="/dashboard"
                            className="!text-white hover:opacity-80 transition-opacity"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/dashboard"
                            className="!text-white hover:opacity-80 transition-opacity"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Keuzenmodules
                        </Link>
                        <Link
                            to="/dashboard"
                            className="!text-white hover:opacity-80 transition-opacity"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            AI Keuzenmodules
                        </Link>
                        <Link
                            to="/dashboard"
                            className="!text-white hover:opacity-80 transition-opacity"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Instellingen
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
