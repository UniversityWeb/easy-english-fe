import config from '~/config';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import ForgotPassword from '~/pages/ForgotPassword';
import UserProfileEdit from '~/pages/UserProfileEdit';
import OtpValidation from '~/pages/OtpValidation';
import CourseManagementForStudent from '~/pages/CourseManagementForStudent';
import NotificationsForStudent from '~/pages/NotificationsForStudent';
import TakeTest from '~/pages/TakeTest';
import PreviewTest from '~/pages/PreviewTest';
import Cart from '~/pages/Cart';
import PaymentResult from '~/pages/PaymentResult';
import Curriculum from '~/pages/Teacher/CourseDetail/Curriculum/Curriculum';
import CourseManagementForTeacher from '~/pages/Teacher/CourseManagementForTeacher';
import Search from '~/pages/Search/Search';
import Favourite from '~/pages/Search/Favourite';
import EnrollCourse from '~/pages/Search/EnrollCourse';
import CourseViewDetail from '~/pages/Search/CourseDetail';
import ManagementCourse from '~/pages/Teacher/DoiMoi/ManagementCourse';
import Setting from '~/pages/Teacher/DoiMoi/Setting';
import Orders from '~/pages/Orders';
import OrderDetail from '~/pages/OrderDetail';
import Learn from '~/pages/Search/Learn';
import Category from '~/pages/Admin/Category';

const publicRoutes = [
  { path: config.routes.login, component: Login },
  { path: config.routes.register, component: Register },
  { path: config.routes.forgot_password, component: ForgotPassword },
  { path: config.routes.user_profile_edit, component: UserProfileEdit },
  { path: config.routes.otp_validation, component: OtpValidation },
  {
    path: config.routes.course_management_for_student,
    component: CourseManagementForStudent,
  },
  {
    path: config.routes.notifications_for_student,
    component: NotificationsForStudent,
  },
  { path: config.routes.preview_test, component: PreviewTest },
  { path: config.routes.take_test, component: TakeTest },
  { path: config.routes.cart, component: Cart },
  { path: config.routes.payment_result, component: PaymentResult },
  { path: config.routes.curriculum, component: Curriculum },
  { path: config.routes.maincourse, component: Setting },
  { path: config.routes.course_detail, component: ManagementCourse },
  {
    path: config.routes.course_management_for_teacher,
    component: CourseManagementForTeacher,
  },
  { path: config.routes.search, component: Search },
  { path: config.routes.favourite, component: Favourite },
  { path: config.routes.enroll_course, component: EnrollCourse },
  { path: config.routes.course_view_detail, component: CourseViewDetail },
  { path: config.routes.test, component: ManagementCourse },

  { path: config.routes.orders, component: Orders },
  { path: config.routes.order_detail, component: OrderDetail },
  { path: config.routes.learn(':courseId'), component: Learn },
  { path: config.routes.category, component: Category },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
