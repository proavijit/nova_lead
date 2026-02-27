import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const url = config.url || ''
  const isPublicAuthRoute = url.includes('/auth/register') || url.includes('/auth/login')

  if (isPublicAuthRoute) {
    if (config.headers?.Authorization) {
      delete config.headers.Authorization
    }
    return config
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nova_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      localStorage.removeItem('nova_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
