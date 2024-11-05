import { Category } from "@mui/icons-material";

const routes = {
  home: ['/', '/home'],
  login: '/login',
  register: '/register',
  forgot_password: '/forgot-password',
  user_profile_edit: '/profile',
  otp_validation: '/otp-validation',
  course_management_for_student: '/course-management-for-student',
  notifications_for_student: '/notifications-for-student',
  preview_test: '/preview-test',
  take_test: '/take-test',
  cart: '/cart',
  payment_result: '/payment/result',
  curriculum: '/curriculum/:courseId',
  maincourse: '/maincourse',
  course_detail: '/course-detail/:courseId',
  course_management_for_teacher: '/course-management-for-teacher',
  search: '/search',
  favourite: '/favourite',
  enroll_course: '/enroll-course',
  course_view_detail: '/course-view-detail/:courseId',
  test: '/test',
  orders: '/orders',
  order_detail: '/order-detail/:orderId',
  learn: (courseId) => `/learn/${courseId}`,
  category: '/category',
  topic_level: '/topic-level',
};

export default routes;
