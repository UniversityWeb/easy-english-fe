import React, { lazy } from 'react';
import config from '~/config';

const AddCoursePage = lazy(() => import('~/pages/Common/AddCoursePage'));
const LoginPage = lazy(() => import('~/pages/Common/LoginPage'));
const RegisterPage = lazy(() => import('~/pages/Common/RegisterPage'));
const ForgotPasswordPage = lazy(
  () => import('~/pages/Common/ForgotPasswordPage'),
);
const UserProfileEditPage = lazy(
  () => import('~/pages/Common/UserProfileEditPage'),
);
const OtpValidationPage = lazy(
  () => import('~/pages/Common/OtpValidationPage'),
);
const CourseManagementForStudentPage = lazy(
  () => import('~/pages/Student/CourseManagementForStudentPage'),
);
const Notifications = lazy(
  () => import('~/pages/Student/Notifications'),
);
const TakeTestPage = lazy(() => import('~/pages/Student/TakeTestPage'));
const PreviewTestPage = lazy(() => import('~/pages/Student/PreviewTestPage'));
const CartPage = lazy(() => import('~/pages/Student/CartPage'));
const PaymentResultPage = lazy(
  () => import('~/pages/Student/PaymentResultPage'),
);
const CourseManagementForTeacherPage = lazy(
  () => import('~/pages/Teacher/CourseManagementForTeacherPage'),
);
const SearchPage = lazy(() => import('~/pages/Student/SearchPage'));
const FavouritePage = lazy(() => import('~/pages/Student/FavouritePage'));
const EnrollCoursePage = lazy(() => import('~/pages/Student/EnrollCoursePage'));
const CourseViewDetailPage = lazy(
  () => import('~/pages/Student/CourseDetailPage'),
);
const CourseDetailPage = lazy(() => import('~/pages/Teacher/CourseDetailPage'));
const Setting = lazy(() => import('~/components/Teacher/CourseDetail/Setting'));
const OrdersPage = lazy(() => import('~/pages/Student/OrdersPage'));
const OrderDetailPage = lazy(() => import('~/pages/Student/OrderDetailPage'));
const LearnPage = lazy(() => import('~/pages/Student/LearnPage'));
const CategoryPage = lazy(() => import('~/pages/Admin/CategoryPage'));
const TopicAndLevelPage = lazy(() => import('~/pages/Admin/TopicAndLevelPage'));
const TestResultPage = lazy(() => import('~/pages/Common/TestResultPage'));
const CourseLineChartPage = lazy(
  () => import('~/pages/Admin/CourseLineChartPage'),
);
const ReviewAnalystPage = lazy(() => import('~/pages/Admin/ReviewAnalystPage'));
const UserManagement = lazy(() => import('~/pages/Admin/UserManagementPage'));
const ChatPage = lazy(() => import('~/pages/Common/ChatPage'));
const CourseManagementForAdminPage = lazy(
  () => import('~/pages/Admin/CourseManagementPage'),
);

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
    path: config.routes.notifications,
    component: Notifications,
  },
  { path: config.routes.preview_test, component: PreviewTestPage },
  { path: config.routes.take_test(':testId'), component: TakeTestPage },
  { path: config.routes.cart, component: CartPage },
  { path: config.routes.payment_result, component: PaymentResultPage },
  { path: config.routes.maincourse, component: AddCoursePage },
  {
    path: config.routes.course_detail(':courseId'),
    component: CourseDetailPage,
  },
  {
    path: config.routes.course_management_for_teacher,
    component: CourseManagementForTeacherPage,
  },
  { path: config.routes.search, component: SearchPage },
  { path: config.routes.favourite, component: FavouritePage },
  { path: config.routes.enroll_course, component: EnrollCoursePage },
  { path: config.routes.course_view_detail, component: CourseViewDetailPage },
  { path: config.routes.test, component: CourseDetailPage },

  { path: config.routes.orders, component: OrdersPage },
  { path: config.routes.order_detail, component: OrderDetailPage },
  {
    path: config.routes.learn(':courseId', ':courseTitle'),
    component: LearnPage,
  },
  { path: config.routes.category_for_admin, component: CategoryPage },
  { path: config.routes.topic_level_for_admin, component: TopicAndLevelPage },
  {
    path: config.routes.test_result(':testResultId'),
    component: TestResultPage,
  },
  { path: config.routes.analytics_courses, component: CourseLineChartPage },
  { path: config.routes.analytics_reviews, component: ReviewAnalystPage },
  { path: config.routes.user_management, component: UserManagement },

  { path: config.routes.chat, component: ChatPage },
  {
    path: config.routes.course_management_for_admin,
    component: CourseManagementForAdminPage,
  },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
