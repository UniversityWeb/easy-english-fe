import axios, { type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { getToken } from '@/utils/authUtils';

const httpRequest = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpRequest.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

httpRequest.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        console.error('Unauthorized access - possibly due to an invalid token.');
      } else if (error.response.status === 403) {
        console.error('Forbidden - you do not have permission to access this resource.');
      } else if (error.response.status === 500) {
        console.error('Server error - something went wrong on the server.');
      }
    }
    return Promise.reject(error);
  },
);

export const get = async <T = unknown>(path: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
  try {
    return await httpRequest.get<T>(path, options);
  } catch (e: unknown) {
    const message = axios.isAxiosError(e) ? (e.response?.data?.message || e.message) : 'An unknown error occurred';
    console.error(`Error fetching data from ${path}:`, message);
    throw new Error(message, { cause: e });
  }
};

export const post = async <T = unknown>(path: string, data?: unknown, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
  try {
    return await httpRequest.post<T>(path, data, options);
  } catch (e: unknown) {
    const message = axios.isAxiosError(e) ? (e.response?.data?.message || e.message) : 'An unknown error occurred';
    console.error(`Error posting data to ${path}:`, message);
    throw new Error(message, { cause: e });
  }
};

export const put = async <T = unknown>(path: string, data?: unknown, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
  try {
    return await httpRequest.put<T>(path, data, options);
  } catch (e: unknown) {
    const message = axios.isAxiosError(e) ? (e.response?.data?.message || e.message) : 'An unknown error occurred';
    console.error(`Error updating data on ${path}:`, message);
    throw new Error(message, { cause: e });
  }
};

export const del = async <T = unknown>(path: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> => {
  try {
    return await httpRequest.delete<T>(path, options);
  } catch (e: unknown) {
    const message = axios.isAxiosError(e) ? (e.response?.data?.message || e.message) : 'An unknown error occurred';
    console.error(`Error deleting data from ${path}:`, message);
    throw new Error(message, { cause: e });
  }
};

export const handleResponse = <T = unknown>(response: AxiosResponse<T> | null | undefined, successCode: number): T | null => {
  return response?.status === successCode ? response.data : null;
};