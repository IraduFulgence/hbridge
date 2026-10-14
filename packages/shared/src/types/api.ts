/**
 * Standard API envelope — matches the TransformInterceptor in the backend.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

/**
 * Standard error response — matches HttpExceptionFilter.
 */
export interface ApiError {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
}