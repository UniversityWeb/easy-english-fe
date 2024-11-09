import {post } from '~/utils/httpRequest';

const SUFFIX_LESSON_TRACKER_API_URL = '/lesson-trackers';

const createCompleteLesson = async (lessonData) => {
  const response = await post(`${SUFFIX_LESSON_TRACKER_API_URL}/add`, lessonData);
  if (response?.status !== 201) {
    return null;
  }
  return response.data;
};

const lessonTrackerService = {
  createCompleteLesson,
};

export default lessonTrackerService;