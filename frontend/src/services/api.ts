import axios, { type AxiosInstance, type AxiosError } from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
})

// Request interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      toast.error('Session expired. Please login again.')
    } else if (error.response?.status === 403) {
      toast.error('Access denied.')
    } else if (typeof error.response?.status === 'number' && error.response.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.')
    }
    return Promise.reject(error)
  }
)

export default api
