import axios from 'axios'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
export const POSTER_SIZE = 'w342'
export const BACKDROP_SIZE = 'w1280'
export const FALLBACK_POSTER = 'https://placehold.co/342x513/1f1f1f/666666?text=No+Image'
export const FALLBACK_BACKDROP = 'https://placehold.co/1280x720/141414/333333?text=No+Image'

export const isTmdbKeyMissing = () =>
    !API_KEY || API_KEY === 'your_tmdb_api_key_here' || API_KEY.trim() === ''

const tmdb = axios.create({
    baseURL: TMDB_BASE,
    params: { api_key: API_KEY, language: 'en-US' },
})

// Intercept errors to give cleaner messages
tmdb.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            return Promise.reject(new Error('Invalid TMDB API key. Please update VITE_TMDB_API_KEY in client/.env'))
        }
        return Promise.reject(err)
    }
)

export const getPosterUrl = (path, size = POSTER_SIZE) =>
    path ? `${IMAGE_BASE_URL}/${size}${path}` : FALLBACK_POSTER

export const getBackdropUrl = (path, size = BACKDROP_SIZE) =>
    path ? `${IMAGE_BASE_URL}/${size}${path}` : FALLBACK_BACKDROP

// Movie lists
export const getTrending = () =>
    tmdb.get('/trending/movie/week').then((r) => r.data.results)

export const getPopular = () =>
    tmdb.get('/movie/popular').then((r) => r.data.results)

export const getTopRated = () =>
    tmdb.get('/movie/top_rated').then((r) => r.data.results)

export const getUpcoming = () =>
    tmdb.get('/movie/upcoming').then((r) => r.data.results)

export const getNowPlaying = () =>
    tmdb.get('/movie/now_playing').then((r) => r.data.results)

// Genre-based
export const getMoviesByGenre = (genreId) =>
    tmdb
        .get('/discover/movie', {
            params: { with_genres: genreId, sort_by: 'popularity.desc' },
        })
        .then((r) => r.data.results)

// Details
export const getMovieDetails = (id) =>
    tmdb.get(`/movie/${id}`).then((r) => r.data)

export const getMovieCredits = (id) =>
    tmdb.get(`/movie/${id}/credits`).then((r) => r.data)

// Search
export const searchMovies = (query, page = 1) =>
    tmdb
        .get('/search/movie', { params: { query, page } })
        .then((r) => r.data)

// Genres list
export const getGenres = () =>
    tmdb.get('/genre/movie/list').then((r) => r.data.genres)
