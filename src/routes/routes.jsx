import config from '~/config';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import ForgotPassword from '~/pages/ForgotPassword';
import UserProfileEdit from '~/pages/UserProfileEdit';
import OtpValidation from '~/pages/OtpValidation';
import CourseManagementForStudent from "~/pages/CourseManagementForStudent";
import NotificationsForStudent from '~/pages/NotificationsForStudent';
import TakeTest from '~/pages/TakeTest';
import PreviewTest from '~/pages/PreviewTest';
import Cart from '~/pages/Cart';
import PaymentResult from '~/pages/PaymentResult';
import Curriculum from '~/pages/Teacher/CourseDetail/Curriculum/Curriculum';
import MainCourse from '~/pages/Teacher/CourseDetail/Main/Main';
import CourseDetail from '~/pages/Teacher/CourseDetail/CourseDetail';
import CourseManagementForTeacher from '~/pages/Teacher/CourseManagementForTeacher';
import Orders from '~/pages/Orders';
import OrderDetail from '~/pages/OrderDetail';

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
  { path: config.routes.preview_test, component: PreviewTest },
  { path: config.routes.take_test, component: TakeTest },
  { path: config.routes.cart, component: Cart },
  { path: config.routes.payment_result, component: PaymentResult },
  { path: config.routes.curriculum, component: Curriculum },
  { path: config.routes.maincourse, component: MainCourse },
  { path: config.routes.course_detail, component: CourseDetail },
  { path: config.routes.course_management_for_teacher, component: CourseManagementForTeacher },
  { path: config.routes.orders, component: Orders },
  { path: config.routes.order_detail, component: OrderDetail },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
