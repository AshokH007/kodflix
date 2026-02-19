import { useState, useEffect, useRef } from 'react'
import MovieCard from './MovieCard'

function MovieRow({ title, fetchFn }) {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const rowRef = useRef(null)

    useEffect(() => {
        fetchFn()
            .then((data) => {
                setMovies(data || [])
                setError('')
            })
            .catch((err) => {
                setError(err.message || 'Failed to load movies')
                setMovies([])
            })
            .finally(() => setLoading(false))
    }, [fetchFn])

    const scroll = (direction) => {
        if (rowRef.current) {
            const amount = direction === 'left' ? -600 : 600
            rowRef.current.scrollBy({ left: amount, behavior: 'smooth' })
        }
    }

    return (
        <section className="mb-8 group/row">
            <h2 className="text-white font-semibold text-lg sm:text-xl px-8 sm:px-16 mb-3">
                {title}
            </h2>

            <div className="relative px-8 sm:px-16">
                {/* Left arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 focus:outline-none"
                    aria-label="Scroll left"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Loading skeleton */}
                {loading && (
                    <div className="flex gap-3 overflow-hidden">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-36 sm:w-44 aspect-[2/3] bg-dark-card rounded-md animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="flex items-center gap-3 py-6 text-gray-500 text-sm">
                        <svg className="w-5 h-5 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Could not load movies — check your TMDB API key in <code className="text-gray-400">client/.env</code></span>
                    </div>
                )}

                {/* Movie cards */}
                {!loading && !error && movies.length > 0 && (
                    <div ref={rowRef} className="row-scroll">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && movies.length === 0 && (
                    <div className="py-6 text-gray-600 text-sm">No movies found.</div>
                )}

                {/* Right arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 focus:outline-none"
                    aria-label="Scroll right"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    )
}

export default MovieRow
