import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MovieCard from '../components/MovieCard'
import { searchMovies } from '../services/tmdb'

function Search() {
    const [searchParams, setSearchParams] = useSearchParams()
    const initialQuery = searchParams.get('q') || ''
    const [query, setQuery] = useState(initialQuery)
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalResults, setTotalResults] = useState(0)
    const [searched, setSearched] = useState(false)

    const doSearch = useCallback(async (q) => {
        if (!q.trim()) {
            setResults([])
            setSearched(false)
            return
        }
        setLoading(true)
        setSearched(true)
        try {
            const data = await searchMovies(q)
            setResults(data.results || [])
            setTotalResults(data.total_results || 0)
        } catch {
            setResults([])
        } finally {
            setLoading(false)
        }
    }, [])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            doSearch(query)
            if (query.trim()) {
                setSearchParams({ q: query })
            } else {
                setSearchParams({})
            }
        }, 400)
        return () => clearTimeout(timer)
    }, [query, doSearch, setSearchParams])

    // Run search on initial load if query param exists
    useEffect(() => {
        if (initialQuery) doSearch(initialQuery)
    }, []) // eslint-disable-line

    return (
        <div className="min-h-screen bg-dark-bg">
            <Navbar />

            <div className="pt-24 pb-16 px-6 sm:px-16">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-6">Search Movies</h1>
                    <div className="relative max-w-2xl">
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            id="search-input"
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for movies, titles, genres..."
                            className="input-field pl-12 text-base"
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Results count */}
                {searched && !loading && (
                    <p className="text-gray-400 text-sm mb-6">
                        {results.length > 0
                            ? `${totalResults.toLocaleString()} results for "${query}"`
                            : `No results for "${query}"`}
                    </p>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-dark-card rounded-md animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Results grid */}
                {!loading && results.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
                        {results.map((movie) => (
                            <div key={movie.id} className="w-full">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && searched && results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
                        <svg className="w-16 h-16 text-dark-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-white font-semibold text-xl mb-2">No results found</h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                            Try different keywords or check your spelling.
                        </p>
                    </div>
                )}

                {/* Initial state */}
                {!loading && !searched && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <svg className="w-16 h-16 text-dark-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                        <h3 className="text-white font-semibold text-xl mb-2">Discover movies</h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                            Type a movie title, actor, or genre to start searching.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Search
