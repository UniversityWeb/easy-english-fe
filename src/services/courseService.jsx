import { get, post } from '~/utils/httpRequest'; // Removed unused imports

const SUFFIX_COURSE_API_URL = '/course';

const fetchAllCourses = async () => {
  const response = await get(`${SUFFIX_COURSE_API_URL}/get-all-course`);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const createCourse = async (courseRequest) => {
  const response = await post(`${SUFFIX_COURSE_API_URL}/create-course`, courseRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const updateCourse = async (courseRequest) => {
  const response = await post(`${SUFFIX_COURSE_API_URL}/update-course`, courseRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const deleteCourse = async (courseRequest) => {
  const response = await post(`${SUFFIX_COURSE_API_URL}/delete-course`, courseRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const fetchAllCourseOfTeacher = async (courseRequest) => {
  const response = await post(`${SUFFIX_COURSE_API_URL}/get-all-course-of-teacher`, courseRequest);

  if (response?.status !== 200) {
    return null;
  }
  return response.data.content;
}

const fetchMainCourse = async (courseRequest) => {
  const response = await post(`${SUFFIX_COURSE_API_URL}/get-main-course`, courseRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const courseService = {
  fetchAllCourseOfTeacher,
  fetchAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchMainCourse
};

export default courseService;