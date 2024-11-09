import config from '~/config';
import LoginPage from '~/pages/Common/LoginPage';
import RegisterPage from '~/pages/Common/RegisterPage';
import ForgotPasswordPage from '~/pages/Common/ForgotPasswordPage';
import UserProfileEditPage from '~/pages/Common/UserProfileEditPage';
import OtpValidationPage from '~/pages/Common/OtpValidationPage';
import CourseManagementForStudentPage from '~/pages/Student/CourseManagementForStudentPage';
import NotificationsForStudentPage from '~/pages/Student/NotificationsForStudentPage';
import TakeTestPage from '~/pages/Student/TakeTestPage';
import PreviewTestPage from '~/pages/Student/PreviewTestPage';
import CartPage from '~/pages/Student/CartPage';
import PaymentResultPage from '~/pages/Student/PaymentResultPage';
import CourseManagementForTeacher from '~/pages/Teacher/CourseManagementForTeacherPage';
import Search from '~/pages/Student/SearchPage';
import Favourite from '~/pages/Student/FavouritePage';
import EnrollCoursePage from '~/pages/Student/EnrollCoursePage';
import CourseViewDetail from '~/pages/Student/CourseDetailPage';
import CourseDetailPage from '~/pages/Teacher/CourseDetailPage';
import Setting from '~/components/Teacher/CourseDetail/Setting';
import OrdersPage from '~/pages/Student/OrdersPage';
import OrderDetailPage from '~/pages/Student/OrderDetailPage';
import LearnPage from '~/pages/Student/LearnPage';
import CategoryPage from '~/pages/Admin/CategoryPage';
import TopicAndLevelPage from '~/pages/Admin/TopicAndLevelPage';

const publicRoutes = [
  { path: config.routes.login, component: LoginPage },
  { path: config.routes.register, component: RegisterPage },
  { path: config.routes.forgot_password, component: ForgotPasswordPage },
  { path: config.routes.user_profile_edit, component: UserProfileEditPage },
  { path: config.routes.otp_validation, component: OtpValidationPage },
  {
    path: config.routes.course_management_for_student,
    component: CourseManagementForStudentPage,
  },
  {
    path: config.routes.notifications_for_student,
    component: NotificationsForStudentPage,
  },
  { path: config.routes.preview_test, component: PreviewTestPage },
  { path: config.routes.take_test(':testId'), component: TakeTestPage },
  { path: config.routes.cart, component: CartPage },
  { path: config.routes.payment_result, component: PaymentResultPage },
  { path: config.routes.maincourse, component: Setting },
  { path: config.routes.course_detail, component: CourseDetailPage },
  {
    path: config.routes.course_management_for_teacher,
    component: CourseManagementForTeacher,
  },
  { path: config.routes.search, component: Search },
  { path: config.routes.favourite, component: Favourite },
  { path: config.routes.enroll_course, component: EnrollCoursePage },
  { path: config.routes.course_view_detail, component: CourseViewDetail },
  { path: config.routes.test, component: CourseDetailPage },

  { path: config.routes.orders, component: OrdersPage },
  { path: config.routes.order_detail, component: OrderDetailPage },
  { path: config.routes.learn(':courseId'), component: LearnPage },
  { path: config.routes.category_for_admin, component: CategoryPage },
  { path: config.routes.topic_level_for_admin, component: TopicAndLevelPage },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
