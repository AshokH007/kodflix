import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getMovieDetails, getMovieCredits, getPosterUrl, getBackdropUrl } from '../services/tmdb'

function MovieDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [movie, setMovie] = useState(null)
    const [credits, setCredits] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        setLoading(true)
        setError('')
        Promise.all([getMovieDetails(id), getMovieCredits(id)])
            .then(([movieData, creditsData]) => {
                setMovie(movieData)
                setCredits(creditsData)
            })
            .catch(() => setError('Failed to load movie details.'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg">
                <Navbar />
                <div className="pt-20 px-8 sm:px-16 animate-pulse">
                    <div className="h-72 sm:h-96 bg-dark-card rounded-xl mb-8" />
                    <div className="flex gap-6">
                        <div className="hidden sm:block w-48 h-72 bg-dark-card rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-4">
                            <div className="h-8 bg-dark-card rounded w-2/3" />
                            <div className="h-4 bg-dark-card rounded w-1/3" />
                            <div className="h-4 bg-dark-card rounded w-full" />
                            <div className="h-4 bg-dark-card rounded w-5/6" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <Navbar />
                <div className="text-center mt-20">
                    <p className="text-gray-400 text-lg mb-4">{error || 'Movie not found.'}</p>
                    <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
                </div>
            </div>
        )
    }

    const cast = credits?.cast?.slice(0, 6) || []
    const runtime = movie.runtime
        ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
        : null

    return (
        <div className="min-h-screen bg-dark-bg">
            <Navbar />

            {/* Backdrop */}
            <div className="relative w-full h-72 sm:h-[480px] overflow-hidden">
                <img
                    src={getBackdropUrl(movie.backdrop_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/80 to-transparent" />

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-20 left-6 sm:left-16 flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </div>

            {/* Details */}
            <div className="px-6 sm:px-16 -mt-32 relative z-10 pb-16 animate-slide-up">
                <div className="flex flex-col sm:flex-row gap-8">
                    {/* Poster */}
                    <div className="hidden sm:block flex-shrink-0">
                        <img
                            src={getPosterUrl(movie.poster_path, 'w342')}
                            alt={movie.title}
                            className="w-48 rounded-lg shadow-2xl shadow-black/60"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/342x513/1f1f1f/666666?text=No+Image' }}
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 leading-tight">
                            {movie.title}
                        </h1>

                        {/* Tagline */}
                        {movie.tagline && (
                            <p className="text-gray-400 italic text-base mb-4">"{movie.tagline}"</p>
                        )}

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            {movie.vote_average > 0 && (
                                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {movie.vote_average.toFixed(1)} / 10
                                </span>
                            )}
                            {movie.release_date && (
                                <span className="text-gray-400 text-sm">{movie.release_date.slice(0, 4)}</span>
                            )}
                            {runtime && (
                                <span className="text-gray-400 text-sm">{runtime}</span>
                            )}
                            {movie.original_language && (
                                <span className="bg-dark-surface text-gray-300 text-xs px-2 py-0.5 rounded uppercase">
                                    {movie.original_language}
                                </span>
                            )}
                        </div>

                        {/* Genres */}
                        {movie.genres?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                {movie.genres.map((g) => (
                                    <span
                                        key={g.id}
                                        className="border border-dark-border text-gray-300 text-xs px-3 py-1 rounded-full"
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Overview */}
                        {movie.overview && (
                            <div className="mb-6">
                                <h2 className="text-white font-semibold text-lg mb-2">Overview</h2>
                                <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                            </div>
                        )}

                        {/* Cast */}
                        {cast.length > 0 && (
                            <div>
                                <h2 className="text-white font-semibold text-lg mb-3">Cast</h2>
                                <div className="flex flex-wrap gap-3">
                                    {cast.map((actor) => (
                                        <div key={actor.id} className="flex items-center gap-2 bg-dark-card rounded-lg px-3 py-2">
                                            {actor.profile_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                                                    alt={actor.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-dark-surface flex items-center justify-center text-gray-500 text-xs font-bold">
                                                    {actor.name?.[0]}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-white text-xs font-medium">{actor.name}</p>
                                                <p className="text-gray-500 text-xs">{actor.character}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieDetails
