import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchOpen(false)
            setSearchQuery('')
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-bg shadow-lg shadow-black/50' : 'bg-gradient-to-b from-black/80 to-transparent'
                }`}
        >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-brand-red font-extrabold text-2xl tracking-tight hover:text-brand-red-dark transition-colors no-select"
                    >
                        <span className="text-yellow-400">KOD</span>FLIX
                    </Link>

                    {/* Nav Links (desktop) */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                        <Link
                            to="/"
                            className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-white' : ''}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/search"
                            className={`hover:text-white transition-colors ${location.pathname === '/search' ? 'text-white' : ''}`}
                        >
                            Browse
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        {searchOpen ? (
                            <form onSubmit={handleSearchSubmit} className="flex items-center">
                                <input
                                    id="navbar-search"
                                    type="text"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search movies..."
                                    className="bg-dark-surface border border-dark-border text-white text-sm px-3 py-1.5 rounded-l focus:outline-none focus:border-brand-red w-48 sm:w-64 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="bg-brand-red hover:bg-brand-red-dark px-3 py-1.5 rounded-r transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="ml-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </form>
                        ) : (
                            <button
                                id="search-toggle"
                                onClick={() => setSearchOpen(true)}
                                className="text-gray-300 hover:text-white transition-colors p-1"
                                aria-label="Open search"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        )}

                        {/* User avatar + logout */}
                        {user && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded bg-brand-red flex items-center justify-center text-white text-sm font-bold no-select">
                                    {user.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <button
                                    id="logout-btn"
                                    onClick={handleLogout}
                                    className="hidden sm:block text-gray-400 hover:text-white text-sm transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
