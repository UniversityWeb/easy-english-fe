import { handleResponse, get, post, put } from '~/utils/httpRequest'; // Removed unused imports

const SUFFIX_COURSE_API_URL = '/course';

const fetchAllCourses = async () => {
  const response = await get(`${SUFFIX_COURSE_API_URL}/get-all-course`);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const createCourse = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/create-course`,
    courseRequest,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  if (response?.status !== 201) {
    return null;
  }

  return response.data;
};

const updateCourse = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/update-course`,
    courseRequest,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const deleteCourse = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/delete-course`,
    courseRequest,
  );

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const fetchAllCourseOfTeacher = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/get-all-course-of-teacher`,
    courseRequest,
  );

  if (response?.status !== 200) {
    return null;
  }
  return response.data.content;
};

const getCourseByFilter = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/get-course-by-filter`,
    courseRequest,
  );

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const getCourseOfFavourite = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/get-all-course-favorite-of-student`,
    courseRequest,
  );

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const deleteCourseOfFavourite = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/remove-course-from-favorite`,
    courseRequest,
  );
  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const getEnrollCourse = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/get-all-course-of-student`,
    courseRequest,
  );
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const fetchMainCourse = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/get-main-course`,
    courseRequest,
  );

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const addCourseToFavourite = async (courseRequest) => {
  const response = await post(
    `${SUFFIX_COURSE_API_URL}/add-course-to-favorite`,
    courseRequest,
  );
  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const getAllCourseForAdmin = async (filterReq) => {
  const path = `${SUFFIX_COURSE_API_URL}/admin/get`;
  const response = await post(path, filterReq);
  return handleResponse(response, 200);
};

const updateCourseStatus = async (courseId, status) => {
  const path = `${SUFFIX_COURSE_API_URL}/update-status/${courseId}/${status}`;
  const response = await put(path);
  return handleResponse(response, 200);
};

const courseService = {
  updateCourseStatus,
  addCourseToFavourite,
  fetchAllCourseOfTeacher,
  fetchAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  fetchMainCourse,
  getCourseByFilter,
  getCourseOfFavourite,
  deleteCourseOfFavourite,
  getEnrollCourse,
  getAllCourseForAdmin,
};

export default courseService;
