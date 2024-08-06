import axios from 'axios';

const AUTH_API_URL = `${process.env.REACT_APP_BASE_API_URL}/v1/auth`;

const getCurUser = () => {};

const login = async (contest) => {
  try {
    const restUrl = `${AUTH_API_URL}/add-contest`;
    const response = await axios.post(restUrl, contest);

    if (response.status === 201) {
      console.log('Add successful');
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Add failed', error);
    return null;
  }
};

const AuthService = {
  getCurUser,
  login,
};

export default AuthService;
