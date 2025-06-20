const routes = {
  home: ['/', '/home'],
  login: '/login',
  register: '/register',
  forgot_password: '/forgot-password',
  user_profile_edit: '/profile',
  otp_validation: '/otp-validation',
  notifications: '/notifications',
  preview_test: '/preview-test',
  take_test: (testId) => `/take-test/${testId}`,
  cart: '/cart',
  payment_result: '/payment/result',
  curriculum: '/curriculum/:courseId',
  maincourse: '/maincourse',
  course_detail: (courseId) => `/course-detail/${courseId}`,
  course_management_for_teacher: '/course-management-for-teacher',
  search: '/search',
  favourite: '/favourite',
  enroll_course: '/enroll-course',
  course_view_detail: '/course-view-detail/:courseId',
  orders: '/orders',
  order_detail: '/order-detail/:orderId',
  learn: (courseId, courseTitle) => `/learn/${courseId}/${courseTitle}`,
  category_for_admin: '/admin/category',
  topic_level_for_admin: '/admin/topic-vs-level',
  test_result: (testResultId) => `/test-result/${testResultId}`,
  entrance_test_result: (testResultId) =>
    `/entrance-test-result/${testResultId}`,
  analytics_courses: '/admin/analytics/courses',
  analytics_reviews: '/admin/analytics/reviews',
  user_management: '/admin/user-management',
  chat: '/chat',
  course_management_for_admin: '/admin/course-management',
  homepage: '/homepage',
  bundle: '/bundle',
  bundle_detail: (bundleId) => `/bundle-detail/${bundleId}`,
  bundle_add: '/new-bundle',
  gradebook: '/teacher/gradebook',
  writing_task: (writingTaskId) => `/writing-task/${writingTaskId}`,
  chat_ai: '/chat-ai',
  entrance_test: '/entrance-test',
  student_drop: '/student-drop',
  teacher: (username) => `/teacher/${username}`,
};

export default routes;
