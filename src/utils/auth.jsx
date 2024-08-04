export const isLoggedIn = () => {
    let data = localStorage.getItem('data');
    if (data != null) return true;
    else return false;
  };
  
  export const doLogin = (data, next) => {
    localStorage.setItem('data', JSON.stringify(data));
    next();
  };
  export const doLogout = (next) => {
    localStorage.removeItem('data');
    next();
  };
  
  export const getCurrentUserDetail = () => {
    if (isLoggedIn()) {
      const data = localStorage.getItem('data');
      const jsonData = JSON.parse(data);
  
      const user = jsonData.user;
      return user;
    } else {
      return undefined;
    }
  };
  
  export const getToken = () => {
    if (isLoggedIn()) {
      return JSON.parse(localStorage.getItem('data')).token;
    } else {
      return null;
    }
  };
  