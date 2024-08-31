import axios from 'axios';
import { getToken } from './authUtils';

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

httpRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - possibly due to an invalid token.');
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
    console.error(`Error fetching data from ${path}:`, e.message);
    return { error: e.message };
  }
};

export const post = async (path, data, options = {}) => {
  try {
    return await httpRequest.post(path, data, options);
  } catch (e) {
    console.error(`Error posting data to ${path}:`, e.message);
    return { error: e.message };
  }
};