import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import MovieRow from '../components/MovieRow'
import {
    getTrending,
    getPopular,
    getTopRated,
    getUpcoming,
    getNowPlaying,
    getMoviesByGenre,
    isTmdbKeyMissing,
} from '../services/tmdb'

// Genre IDs from TMDB
const GENRE_ACTION = 28
const GENRE_DRAMA = 18
const GENRE_COMEDY = 35
const GENRE_SCIFI = 878

function Home() {
    const keyMissing = isTmdbKeyMissing()

    return (
        <div className="min-h-screen bg-dark-bg">
            <Navbar />

            {/* TMDB API Key Warning */}
            {keyMissing && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-yellow-500 text-black px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 shadow-2xl">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                        <span className="font-bold">TMDB API Key Missing — </span>
                        <span>Open </span>
                        <code className="bg-black/20 px-1 rounded font-mono text-sm">client/.env</code>
                        <span> and set </span>
                        <code className="bg-black/20 px-1 rounded font-mono text-sm">VITE_TMDB_API_KEY=your_real_key</code>
                        <span className="ml-1">then restart the frontend.</span>
                    </div>
                    <a
                        href="https://www.themoviedb.org/settings/api"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 bg-black text-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-gray-900 transition-colors"
                    >
                        Get Free Key →
                    </a>
                </div>
            )}

            {/* Hero Banner */}
            <Banner />

            {/* Movie Rows */}
            <div className="pb-20 -mt-16 relative z-10">
                <MovieRow title="Trending Now" fetchFn={getTrending} />
                <MovieRow title="Popular Movies" fetchFn={getPopular} />
                <MovieRow title="Top Rated" fetchFn={getTopRated} />
                <MovieRow title="Now Playing" fetchFn={getNowPlaying} />
                <MovieRow title="Upcoming" fetchFn={getUpcoming} />
                <MovieRow title="Action" fetchFn={() => getMoviesByGenre(GENRE_ACTION)} />
                <MovieRow title="Drama" fetchFn={() => getMoviesByGenre(GENRE_DRAMA)} />
                <MovieRow title="Comedy" fetchFn={() => getMoviesByGenre(GENRE_COMEDY)} />
                <MovieRow title="Sci-Fi" fetchFn={() => getMoviesByGenre(GENRE_SCIFI)} />
            </div>
        </div>
    )
}

export default Home
