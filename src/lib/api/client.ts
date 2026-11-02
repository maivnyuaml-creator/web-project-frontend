import { getAuthToken } from '@/lib/auth/token';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number = 500, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, body, headers, ...customConfig } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Retrieve JWT Token if available to satisfy Backend Authorization header requirement
  const token = typeof window !== 'undefined' ? getAuthToken() : null;
  const authHeaders: Record<string, string> = {};
  if (token && !((headers as Record<string, string>)?.['Authorization'])) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method || (body ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...authHeaders,
      ...headers,
    },
    // Credentials included for cookies alongside Bearer Authorization header
    credentials: 'include',
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return { success: true, data: null as unknown as T };
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && data !== null && 'message' in data)
          ? Array.isArray((data as { message: string | string[] }).message)
            ? (data as { message: string[] }).message.join(', ')
            : String((data as { message: string }).message)
          : response.statusText || 'An API error occurred';

      throw new ApiError(errorMessage, response.status, data);
    }

    return typeof data === 'object' && data !== null && 'data' in data
      ? (data as ApiResponse<T>)
      : { success: true, data: data as T };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('NetworkError'))) {
      throw new ApiError(
        `Unable to reach backend server at ${API_BASE_URL}. Please make sure the backend is running on port 4000.`,
        0
      );
    }
    const message = error instanceof Error ? error.message : 'Network connection failed';
    throw new ApiError(message, 0);
  }
}
