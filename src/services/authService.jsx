import { getToken, isLoggedIn, removeLoginResponse, saveLoginResponse } from '~/utils/authUtils';
import { get, post, put } from '~/utils/httpRequest';

const SUFFIX_AUTH_API_URL = '/auth';

const getCurUser = async () => {
  if (!isLoggedIn()) {
    return null;
  }

  const path = `${SUFFIX_AUTH_API_URL}/get-user-by-token`;
  const tokenStr = getToken();
  const response = await get(path, {
    params: { tokenStr }
  });

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
    return true;
  }

  removeLoginResponse();
  console.log('Logout successfully');
  return false;
};

const activeAccount = async (activeAccountRequest) => {
  const path = `${SUFFIX_AUTH_API_URL}/active-account`;
  const response = await put(path, activeAccountRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
}

const resendOTPToActiveAccount = async (username) => {
  const path = `${SUFFIX_AUTH_API_URL}/resend-otp-to-active-account/${username}`;
  const response = await post(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
}

const AuthService = {
  getCurUser,
  login,
  register,
  logout,
  activeAccount,
  resendOTPToActiveAccount
};

export default AuthService;
