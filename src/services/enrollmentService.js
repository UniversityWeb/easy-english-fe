import { get, post, put } from '~/utils/httpRequest';

const SUFFIX_ENROLLMENT_API_URL = '/enrollments';

const isEnrolled = async (courseId) => {
  const path = `${SUFFIX_ENROLLMENT_API_URL}/is-enrolled/${courseId}`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
}

const enrollmentService = {
    isEnrolled,
}

export default enrollmentService;