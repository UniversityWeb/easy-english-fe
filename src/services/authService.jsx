import { getToken, isLoggedIn, removeLoginResponse, saveLoginResponse } from '~/utils/authUtils';
import { get, post } from '~/utils/httpRequest';

const SUFFIX_AUTH_API_URL = '/auth';

const getCurUser = async () => {
  if (!isLoggedIn()) {
    return null;
  }

  const tokenStr = getToken();
  const path = `${SUFFIX_AUTH_API_URL}/get-user-by-token?tokenStr=${tokenStr}`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  const user = response.data;
  return user;
};

const login = async (loginRequest) => {
  const path = `${SUFFIX_AUTH_API_URL}/login`;
  const response = await post(path, loginRequest);

  if (response?.status !== 200) {
    return null;
  }

  const loginResponse = await response.data;
  saveLoginResponse(loginResponse);
  return loginResponse;
};

const register = async (registerRequest) => {
  const path = `${SUFFIX_AUTH_API_URL}/register`;
  const response = await post(path, registerRequest);

  if (response?.status !== 201) {
    return null;
  }

  return response.data;
};

const logout = async () => {
  const path = `${SUFFIX_AUTH_API_URL}/logout`;
  const response = await post(path);

  if (response?.status !== 200) {
    console.error('Logout unsuccessfully');
    return;
  }

  removeLoginResponse();
  console.log('Logout successfully');
};

const AuthService = {
  getCurUser,
  login,
  register,
  logout
};

export default AuthService;
