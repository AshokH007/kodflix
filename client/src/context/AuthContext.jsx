import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('nm_token')
        const storedUser = localStorage.getItem('nm_user')
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch {
                localStorage.removeItem('nm_token')
                localStorage.removeItem('nm_user')
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password })
        const { token, user: userData } = res.data
        localStorage.setItem('nm_token', token)
        localStorage.setItem('nm_user', JSON.stringify(userData))
        setUser(userData)
        return userData
    }

    const register = async (email, password) => {
        const res = await axios.post(`${API_BASE}/api/auth/register`, { email, password })
        return res.data
    }

    const logout = () => {
        localStorage.removeItem('nm_token')
        localStorage.removeItem('nm_user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
