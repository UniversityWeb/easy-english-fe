import { isLoggedIn, saveLoginResponse } from '~/utils/authUtils';
import { post } from '~/utils/httpRequest';

const SUFFIX_AUTH_API_URL = '/auth';

const getCurUser = () => {
  if (isLoggedIn()) {
  }
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

const AuthService = {
  getCurUser,
  login,
};

export default AuthService;
