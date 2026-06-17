import axios from 'axios';
import { getToken, getRefreshToken, saveLoginResponse, removeLoginResponse } from './authUtils';

const httpRequest = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpRequest.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Keep track of refresh state to queue concurrent requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Avoid infinite loop if auth requests fail
      if (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return httpRequest(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/auth/refresh`, {
          refreshTokenStr: refreshToken,
        });

        if (response.status === 200 && response.data) {
          saveLoginResponse(response.data);
          const newToken = response.data.tokenStr;

          processQueue(null, newToken);
          isRefreshing = false;

          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return httpRequest(originalRequest);
        } else {
          throw new Error('Failed to refresh token');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear local storage and redirect to login
        removeLoginResponse();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    if (error.response && error.response.status === 403) {
      console.error('Forbidden - you do not have permission to access this resource.');
    }
    if (error.response && error.response.status === 500) {
      console.error('Server error - something went wrong on the server.');
    }
    return Promise.reject(error);
  },
);

export const get = async (path, options = {}) => {
  try {
    return await httpRequest.get(path, options);
  } catch (e) {
    console.error(`Error fetching data from ${path}:`, e?.message);
    const errorResponse = e?.response?.data;
    const errorMsg = errorResponse?.message || 'An unknown error occurred';
    throw new Error(errorMsg);
  }
};

export const post = async (path, data, options = {}) => {
  try {
    return await httpRequest.post(path, data, options);
  } catch (e) {
    console.error(`Error posting data to ${path}:`, e?.message);
    const errorResponse = e?.response?.data;
    const errorMsg = errorResponse?.message || 'An unknown error occurred';
    throw new Error(errorMsg);
  }
};

export const put = async (path, data, options = {}) => {
  try {
    return await httpRequest.put(path, data, options);
  } catch (e) {
    console.error(`Error updating data on ${path}:`, e?.message);
    const errorResponse = e?.response?.data;
    const errorMsg = errorResponse?.message || 'An unknown error occurred';
    throw new Error(errorMsg);
  }
};

export const del = async (path, options = {}) => {
  try {
    return await httpRequest.delete(path, options);
  } catch (e) {
    console.error(`Error deleting data from ${path}:`, e?.message);
    const errorResponse = e?.response?.data;
    const errorMsg = errorResponse?.message || 'An unknown error occurred';
    throw new Error(errorMsg);
  }
};

export const handleResponse = (response, successCode) => {
  return response?.status === successCode ? response.data : null;
};