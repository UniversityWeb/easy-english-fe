import axios from 'axios';
import { ORIGINAL_API_URL } from '~/utils/Const';
import { getToken } from './auth';

export const httpRequest = axios.create({
  baseURL: ORIGINAL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateHttpRequest = axios.create({
  baseURL: ORIGINAL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const get = async (path, options = {}) => {
  const response = await httpRequest.get(path, options);
  return response.data;
};

privateHttpRequest.interceptors.request.use(
  (config) => {
    const token = getToken();
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  },
  (error) => Promise.reject(error),
);
export default { httpRequest, privateHttpRequest };
