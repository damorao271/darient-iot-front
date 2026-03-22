import type { AxiosRequestConfig } from 'axios'
import { api } from './api'
import { ApiError } from './errors'
import type { ApiErrorEnvelope, ApiSuccessEnvelope } from '../types/api.types'

function assertSuccessEnvelope<T>(
  data: ApiSuccessEnvelope<T> | ApiErrorEnvelope | undefined
): asserts data is ApiSuccessEnvelope<T> {
  if (!data) {
    throw new Error('Empty API response')
  }
  if (data.success === false) {
    throw new ApiError(data)
  }
}

/**
 * Typed API client that unwraps the backend envelope.
 * All methods return only the payload (data), never the full envelope.
 */
export const client = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.get<ApiSuccessEnvelope<T>>(url, config)
    assertSuccessEnvelope(data)
    return data.data
  },

  async post<T, D = unknown>(url: string, body?: D, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.post<ApiSuccessEnvelope<T>>(url, body, config)
    assertSuccessEnvelope(data)
    return data.data
  },

  async put<T, D = unknown>(url: string, body?: D, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.put<ApiSuccessEnvelope<T>>(url, body, config)
    assertSuccessEnvelope(data)
    return data.data
  },

  async patch<T, D = unknown>(url: string, body?: D, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.patch<ApiSuccessEnvelope<T>>(url, body, config)
    assertSuccessEnvelope(data)
    return data.data
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.delete<ApiSuccessEnvelope<T>>(url, config)
    assertSuccessEnvelope(data)
    return data.data
  },
}
