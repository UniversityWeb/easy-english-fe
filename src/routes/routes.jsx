import config from '~/config';
import Login from '~/pages/Common/Login';
import Register from '~/pages/Common/Register';
import ForgotPassword from '~/pages/Common/ForgotPassword';
import UserProfileEdit from '~/pages/Common/UserProfileEdit';
import OtpValidation from '~/pages/Common/OtpValidation';
import CourseManagementForStudent from '~/pages/Student/CourseManagementForStudent';
import NotificationsForStudent from '~/pages/Student/NotificationsForStudent';
import TakeTest from '~/pages/Student/TakeTest';
import PreviewTest from '~/pages/Student/PreviewTest';
import Cart from '~/pages/Student/Cart';
import PaymentResult from '~/pages/Student/PaymentResult';
import CourseManagementForTeacher from '~/pages/Teacher/CourseManagementForTeacher';
import Search from '~/pages/Student/Search';
import Favourite from '~/pages/Student/Favourite';
import EnrollCourse from '~/pages/Student/EnrollCourse';
import CourseViewDetail from '~/pages/Student/CourseDetail';
import CourseDetail from '~/pages/Teacher/CourseDetail';
import Setting from '~/components/Teacher/CourseDetail/Setting';
import Orders from '~/pages/Student/Orders';
import OrderDetail from '~/pages/Student/OrderDetail';
import Learn from '~/pages/Student/Learn';
import Category from '~/pages/Admin/Category';
import TopicAndLevel from '~/pages/Admin/TopicAndLevel';

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
  { path: config.routes.maincourse, component: Setting },
  { path: config.routes.course_detail, component: CourseDetail },
  {
    path: config.routes.course_management_for_teacher,
    component: CourseManagementForTeacher,
  },
  { path: config.routes.search, component: Search },
  { path: config.routes.favourite, component: Favourite },
  { path: config.routes.enroll_course, component: EnrollCourse },
  { path: config.routes.course_view_detail, component: CourseViewDetail },
  { path: config.routes.test, component: CourseDetail },

  { path: config.routes.orders, component: Orders },
  { path: config.routes.order_detail, component: OrderDetail },
  { path: config.routes.learn(':courseId'), component: Learn },
  { path: config.routes.category_for_admin, component: Category },
  { path: config.routes.topic_level_for_admin, component: TopicAndLevel },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
