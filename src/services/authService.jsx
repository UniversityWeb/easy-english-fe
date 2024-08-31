import { getToken, isLoggedIn, removeLoginResponse, saveLoginResponse } from '~/utils/authUtils';
import { post, get } from '~/utils/httpRequest';

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
  debugger
  return user;
};

const login = async (loginRequest) => {
  try {
    const path = `${SUFFIX_AUTH_API_URL}/login`;
    const response = await post(path, loginRequest);

    if (response?.status === 200) {
      console.log('Login successfully');
      const loginResponse = await response.data;
      saveLoginResponse(loginResponse);
      return loginResponse;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Login unsuccessfully', error);
    return null;
  }
};

const logout = async () => {
  try {
    const path = `${SUFFIX_AUTH_API_URL}/logout`;
    const response = await post(path);

    if (response?.status === 200) {
      removeLoginResponse();
      console.log('Logout successfully');
    } else {
      console.error('Logout unsuccessfully');
    }
  } catch (error) {
    console.error('Logout unsuccessfully', error);
  }
};

const AuthService = {
  getCurUser,
  login,
  logout
};

export default AuthService;
