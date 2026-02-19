import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTrending, getBackdropUrl, getPosterUrl } from '../services/tmdb'

function Banner() {
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        getTrending()
            .then((movies) => {
                // Pick a random movie from top 10 trending
                const pick = movies[Math.floor(Math.random() * Math.min(10, movies.length))]
                setMovie(pick)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="relative w-full h-[75vh] bg-dark-card animate-pulse flex items-end pb-20 px-8 sm:px-16">
                <div className="space-y-3 max-w-xl">
                    <div className="h-10 bg-dark-surface rounded w-3/4" />
                    <div className="h-4 bg-dark-surface rounded w-full" />
                    <div className="h-4 bg-dark-surface rounded w-5/6" />
                    <div className="flex gap-3 mt-4">
                        <div className="h-10 bg-dark-surface rounded w-28" />
                        <div className="h-10 bg-dark-surface rounded w-36" />
                    </div>
                </div>
            </div>
        )
    }

    if (!movie) return null

    const backdropUrl = getBackdropUrl(movie.backdrop_path)
    const overview = movie.overview?.length > 180
        ? movie.overview.slice(0, 180) + '…'
        : movie.overview

    return (
        <div className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
            {/* Backdrop */}
            <img
                src={backdropUrl}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end pb-20 px-8 sm:px-16 max-w-3xl animate-slide-up">
                {/* Rating badge */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded">
                        TRENDING
                    </span>
                    {movie.vote_average > 0 && (
                        <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {movie.vote_average.toFixed(1)}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white text-shadow mb-4 leading-tight">
                    {movie.title}
                </h1>

                {/* Overview */}
                {overview && (
                    <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-6 text-shadow max-w-xl">
                        {overview}
                    </p>
                )}

                {/* Buttons */}
                <div className="flex flex-wrap gap-3">
                    <button
                        id="banner-more-info"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        More Info
                    </button>
                    <button
                        id="banner-watchlist"
                        className="btn-secondary flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add to Watchlist
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Banner
