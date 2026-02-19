import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const authApi = axios.create({
    baseURL: `${API_BASE}/api/auth`,
    headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request if available
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('nm_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
