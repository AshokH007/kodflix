import { useState, useEffect } from 'react'
import { getTrending, getBackdropUrl } from '../services/tmdb'

function LoginBackground() {
    const [backdrops, setBackdrops] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBackdrops = async () => {
            try {
                const movies = await getTrending()
                const items = movies
                    .filter(m => m.backdrop_path)
                    .slice(0, 10)
                    .map(m => ({
                        id: m.id,
                        url: getBackdropUrl(m.backdrop_path, 'original'),
                        title: (m.title || m.name || '').toUpperCase()
                    }))

                if (items.length > 0) {
                    setBackdrops(items)
                }
            } catch (err) {
                console.error('Failed to fetch login backdrops:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchBackdrops()
    }, [])

    useEffect(() => {
        if (backdrops.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % backdrops.length)
        }, 8000)

        return () => clearInterval(interval)
    }, [backdrops])

    if (loading || backdrops.length === 0) {
        return <div className="fixed inset-0 bg-dark-bg z-0" />
    }

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-black">
            {backdrops.map((item, index) => (
                <div key={item.id} className="absolute inset-0">
                    <div
                        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out`}
                        style={{
                            backgroundImage: `url(${item.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: index === currentIndex ? 1 : 0
                        }}
                    />

                    {/* Glass Effect Movie Title & Web Link */}
                    <div
                        className={`absolute bottom-20 right-10 transition-all duration-1000 ease-in-out hidden sm:block`}
                        style={{
                            opacity: index === currentIndex ? 1 : 0,
                            transform: `translateY(${index === currentIndex ? '0' : '20px'})`
                        }}
                    >
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-5 rounded-2xl shadow-2xl flex flex-col items-end">
                            <p className="text-brand-red text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">
                                Now Trending
                            </p>
                            <h2 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4 text-right">
                                {item.title}
                            </h2>
                            <a
                                href={`https://www.themoviedb.org/movie/${item.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all hover:gap-4"
                            >
                                View Details
                                <span className="text-brand-red">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            ))}

            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-black/50 transition-opacity duration-1000" />
        </div>
    )
}

export default LoginBackground
