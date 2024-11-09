import { get, post, put } from '~/utils/httpRequest';

const SUFFIX_ENROLLMENT_API_URL = '/enrollments';

const isEnrolled = async (courseId) => {
  const path = `${SUFFIX_ENROLLMENT_API_URL}/is-enrolled/${courseId}`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const getAllEnrolls = async (page = 0, size = 10) => {
  const path = `${SUFFIX_ENROLLMENT_API_URL}/`;
  const response = await get(path, {
    params: {
      page: page,
      size: size,
    },
  });
  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const getEnrollByFilter = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_ENROLLMENT_API_URL}/filter`,
    courseRequest,
  );

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const enrollmentService = {
  isEnrolled,
  getAllEnrolls,
  getEnrollByFilter,
};

export default enrollmentService;
