import config from '~/config';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import ForgotPassword from '~/pages/ForgotPassword';
import UserProfileEdit from '~/pages/UserProfileEdit';
import Curriculum from '~/pages/Teacher/CourseDetail/Curriculum/Curriculum';
import MainCourse from '~/pages/Teacher/CourseDetail/Main/Main';
import CourseDetail from '~/pages/Teacher/CourseDetail/CourseDetail';
import CourseManagementForTeacher from '~/pages/Teacher/CourseManagementForTeacher';

const publicRoutes = [
  { path: config.routes.home[0], component: Home },
  { path: config.routes.home[1], component: Home },
  { path: config.routes.login, component: Login },
  { path: config.routes.register, component: Register },
  { path: config.routes.forgot_password, component: ForgotPassword },
  { path: config.routes.user_profile_edit, component: UserProfileEdit },
  { path: config.routes.curriculum, component: Curriculum },
  { path: config.routes.maincourse, component: MainCourse },
  { path: config.routes.course_detail, component: CourseDetail },
  { path: config.routes.course_management_for_teacher, component: CourseManagementForTeacher },

];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
