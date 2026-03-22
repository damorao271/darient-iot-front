import axios from 'axios'
import { ApiError } from './errors'
import type { ApiErrorEnvelope } from '../types/api.types'

const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL
  const baseUrl = url ? String(url).replace(/\/$/, '') : 'http://localhost:3000'
  return baseUrl
}

/**
 * Shared API instance for all backend endpoints.
 * Use this for any HTTP request to the backend (places, spaces, etc.).
 */
export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_API_KEY
  if (apiKey) {
    config.headers.set('Authorization', `Bearer ${String(apiKey)}`)
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const envelope = error.response?.data as ApiErrorEnvelope | undefined
    if (envelope?.success === false) {
      console.error('[API Error]', envelope.message)
      return Promise.reject(new ApiError(envelope, error))
    }
    const message = error.response?.data?.message ?? error.message
    console.error('[API Error]', message)
    return Promise.reject(error)
  },
)
