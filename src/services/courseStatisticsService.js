import { handleResponse, get } from '~/utils/httpRequest';

const SUFFIX_COURSE_ANA_API_URL = '/course-statistics';

const getRevenueByYear = async (year) => {
  const url = `${SUFFIX_COURSE_ANA_API_URL}/top3/by-year/${year}`;
  const response = await get(url);
  return handleResponse(response, 200);
};

const courseStatisticsService = {
  getRevenueByYear,
};

export default courseStatisticsService;