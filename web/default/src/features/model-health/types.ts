export type ModelHealthHourlyRow = {
  model_name: string
  hour_start_ts: number
  success_requests: number
  error_requests: number
  total_requests: number
  success_slices: number
  total_slices: number
  success_rate: number
  success_tokens: number
}

export type ModelHealthHourlyResponse = {
  start_hour: number
  end_hour: number
  rows: ModelHealthHourlyRow[]
}

export type ModelHealthCell = ModelHealthHourlyRow & {
  has_data: boolean
}

export type ModelHealthModel = {
  model_name: string
  cells: ModelHealthCell[]
  success_tokens: number
  success_slices: number
  total_slices: number
  success_rate: number
  total_requests: number
  error_requests: number
}
