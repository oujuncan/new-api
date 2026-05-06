import { api } from '@/lib/api'
import type { ModelHealthHourlyResponse } from './types'

type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
}

export async function getModelHealthHourlyLast24h(): Promise<ModelHealthHourlyResponse> {
  const response = await api.get<ApiResponse<ModelHealthHourlyResponse>>(
    '/api/public/model_health/hourly_last24h',
    { skipBusinessError: true } as Record<string, unknown>
  )
  const payload = response.data
  if (!payload.success || !payload.data) {
    throw new Error(payload.message || 'Failed to load model health data')
  }
  return payload.data
}
