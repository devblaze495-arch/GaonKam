export function successResponse<T>(data: T, message = 'Request successful') {
  return {
    success: true,
    message,
    data,
  }
}

export function errorResponse(message: string, errorCode = 'BAD_REQUEST') {
  return {
    success: false,
    message,
    errorCode,
  }
}
