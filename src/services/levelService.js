import { get, post } from '~/utils/httpRequest'; // Removed unused imports

const SUFFIX_LEVEL_API_URL = '/level';

const fetchAllLevelByTopic = async (levelRequest) => {
  const response = await post(`${SUFFIX_LEVEL_API_URL}/get-all-level-by-topic`,levelRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const levelService = {
    fetchAllLevelByTopic,

};

export default levelService;