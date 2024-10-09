import { get, del,post } from '~/utils/httpRequest'; // Removed unused imports

const SUFFIX_LESSON_API_URL = '/lesson';

const deleteLesson = async (lessonRequest) => {
  const path = `${SUFFIX_LESSON_API_URL}`;
  const response = await post(path,lessonRequest);
  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const fetchLessons = async (lessonRequest) => {
  const path = `${SUFFIX_LESSON_API_URL}/get-all-lesson-by-section`;
  const response = await post(path,lessonRequest);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const lessonService = {
  fetchLessons,
  deleteLesson,
};

export default lessonService;