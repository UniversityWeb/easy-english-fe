export const MIN_USERNAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 6;
export const OTP_LENGTH = 6;
export const USER_ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
};
export const QUESTION_TYPES = {
  SINGLE_CHOICE: 'single',
  MULTI_CHOICE: 'multiple',
  TRUE_FALSE: 'true-false',
  MATCHING: 'matching',
  FILL_BLANK: 'fill-blank',
};

export const SAVED_ORDERS_TAB_INDEX_KEY = 'selectedOrdersTabIndex';
export const ORDERS_TAB_STATUSES = ["All", "PENDING_PAYMENT", "PAID", "FAILED", "REFUNDED", "EXPIRED"];
export const getOrdersTabStatusByIndex = (index) => {
  return ORDERS_TAB_STATUSES[index] || ORDERS_TAB_STATUSES[0];
};

export const DEFAULT_LIST_SIZE = 10;