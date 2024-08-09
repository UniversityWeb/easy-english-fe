import axios from 'axios';
import { getToken } from './authUtils';

const httpRequest = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API_URL}/`,
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

export const get = async (path, options = {}) => {
  const response = await httpRequest.get(path, options);
  return response.data;
};

export const post = async (path, data, options = {}) => {
  const response = await httpRequest.post(path, data, options);
  return response.data;
};

export default httpRequest;
