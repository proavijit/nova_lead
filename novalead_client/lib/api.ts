import axios from 'axios'

const defaultApiUrl =
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api/v1'
    : 'https://novaleadserver.vercel.app/api/v1'
const fallbackApiUrl = 'https://novaleadserver.vercel.app/api/v1'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || defaultApiUrl,
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
  async (error) => {
    const isNetworkError = !error?.response && (error?.code === 'ECONNREFUSED' || error?.message?.includes('Network Error'));
    const config = error?.config;
    const baseUrl = api.defaults.baseURL || '';
    const shouldRetryOnFallback =
      isNetworkError &&
      typeof window !== 'undefined' &&
      baseUrl.includes('localhost:5000') &&
      !config?._retriedWithFallback &&
      !process.env.NEXT_PUBLIC_API_URL;

    if (shouldRetryOnFallback && config) {
      config._retriedWithFallback = true;
      config.baseURL = fallbackApiUrl;
      return api.request(config);
    }

    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      localStorage.removeItem('nova_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
