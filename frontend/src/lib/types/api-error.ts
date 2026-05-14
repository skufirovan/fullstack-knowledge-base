export type ApiErrorResponse = {
  code: string
  message: string
  details: Record<string, any> | string | string[] | null
}

export function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    typeof (error as any).code === 'string' &&
    typeof (error as any).message === 'string'
  )
}
