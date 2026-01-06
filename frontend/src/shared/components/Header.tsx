import { useState } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Keuzenmodules', path: '/dashboard' },
    { label: 'AI Keuzenmodules', path: '/dashboard' },
    { label: 'Instellingen', path: '/dashboard' },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const bgClass = mobileMenuOpen ? 'bg-[#2a2a2a]' : 'bg-neutral-950';

    return (
        <header className="text-white py-2 px-6">
            {/* Desktop Navigation */}
            <div className={`hidden md:flex items-center justify-center relative px-6 py-3 rounded-2xl ${bgClass}`}>
                <Link to="/dashboard" className="absolute left-6 text-2xl font-bold !text-red-600">
                    Avans
                </Link>

                <nav className="flex items-center gap-1 bg-[#3a3a3a] rounded-full p-1">
                    {NAV_LINKS.map((link, index) => (
                        <Link
                            key={link.label}
                            to={link.path}
                            className={`
                                ${index === 0 
                                    ? '!text-black bg-white hover:opacity-80' 
                                    : '!text-white bg-[#3a3a3a] hover:bg-[#4a4a4a]'
                                }
                                transition-all px-5 py-2 rounded-full font-medium
                            `}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden rounded-2xl ${bgClass}`}>
                <div className="flex items-center justify-between px-6 py-4">
                    <Link to="/dashboard" className="text-3xl font-bold !text-red-600">
                        Avans
                    </Link>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-4xl font-bold text-white"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <nav className="flex flex-col items-center py-8 space-y-6 text-lg">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                className="!text-white hover:opacity-80 transition-opacity"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
