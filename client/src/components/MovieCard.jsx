import { useNavigate } from 'react-router-dom'
import { getPosterUrl } from '../services/tmdb'

function MovieCard({ movie }) {
    const navigate = useNavigate()

    if (!movie) return null

    const posterUrl = getPosterUrl(movie.poster_path)
    const year = movie.release_date?.slice(0, 4) || '—'
    const rating = movie.vote_average?.toFixed(1) || '—'

    return (
        <div
            id={`movie-card-${movie.id}`}
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="relative flex-shrink-0 w-36 sm:w-44 cursor-pointer group rounded-md overflow-hidden card-hover"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/movie/${movie.id}`)}
            aria-label={`View details for ${movie.title}`}
        >
            {/* Poster */}
            <img
                src={posterUrl}
                alt={movie.title}
                loading="lazy"
                className="w-full aspect-[2/3] object-cover"
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/342x513/1f1f1f/666666?text=No+Image'
                }}
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300 flex flex-col justify-end p-2.5 opacity-0 group-hover:opacity-100">
                <p className="text-white text-xs font-semibold leading-tight line-clamp-2 mb-1">
                    {movie.title}
                </p>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-0.5 text-yellow-400 text-xs font-medium">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {rating}
                    </span>
                    <span className="text-gray-400 text-xs">{year}</span>
                </div>
            </div>
        </div>
    )
}

export default MovieCard
