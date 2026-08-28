const LOGIN_RESPONSE_KEY = 'loginResponseData';

export const isLoggedIn = (): boolean => {
  const data = localStorage.getItem(LOGIN_RESPONSE_KEY);
  return data !== null;
};

export const saveLoginResponse = (loginResponse: any): void => {
  localStorage.setItem(LOGIN_RESPONSE_KEY, JSON.stringify(loginResponse));
};

export const removeLoginResponse = (): void => {
  localStorage.removeItem(LOGIN_RESPONSE_KEY);
};

export const getToken = (): string | null => {
  if (!isLoggedIn()) {
    return null;
  }
  try {
    const raw = localStorage.getItem(LOGIN_RESPONSE_KEY);
    return raw ? JSON.parse(raw).tokenStr : null;
  } catch {
    return null;
  }
};

export const getUsername = (): string | null => {
  if (!isLoggedIn()) {
    return null;
  }
  try {
    const raw = localStorage.getItem(LOGIN_RESPONSE_KEY);
    return raw ? JSON.parse(raw).user?.username : null;
  } catch {
    return null;
  }
};

export const getCurrentUserRole = (): string | null => {
  if (!isLoggedIn()) {
    return null;
  }
  try {
    const raw = localStorage.getItem(LOGIN_RESPONSE_KEY);
    return raw ? JSON.parse(raw).user?.role : null;
  } catch {
    return null;
  }
};
