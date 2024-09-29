import config from '~/config';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import ForgotPassword from '~/pages/ForgotPassword';
import UserProfileEdit from '~/pages/UserProfileEdit';
import OtpValidation from '~/pages/OtpValidation';
import CourseManagementForStudent from "~/pages/CourseManagementForStudent";
import NotificationsForStudent from '~/pages/NotificationsForStudent';

const publicRoutes = [
  { path: config.routes.home[0], component: Home },
  { path: config.routes.home[1], component: Home },
  { path: config.routes.login, component: Login },
  { path: config.routes.register, component: Register },
  { path: config.routes.forgot_password, component: ForgotPassword },
  { path: config.routes.user_profile_edit, component: UserProfileEdit },
  { path: config.routes.otp_validation, component: OtpValidation },
  { path: config.routes.course_management_for_student, component: CourseManagementForStudent },
  { path: config.routes.notifications_for_student, component: NotificationsForStudent },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
