import config from '~/config';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import ForgotPassword from '~/pages/ForgotPassword';
import UserProfileEdit from '~/pages/UserProfileEdit';
import OtpValidation from '~/pages/OtpValidation';

const publicRoutes = [
  { path: config.routes.home[0], component: Home },
  { path: config.routes.home[1], component: Home },
  { path: config.routes.login, component: Login },
  { path: config.routes.register, component: Register },
  { path: config.routes.forgot_password, component: ForgotPassword },
  { path: config.routes.user_profile_edit, component: UserProfileEdit },
  { path: config.routes.otp_validation, component: OtpValidation },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
