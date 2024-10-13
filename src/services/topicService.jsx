import { get, post } from '~/utils/httpRequest'; // Removed unused imports

const SUFFIX_TOPIC_API_URL = '/topic';

const fetchAllTopic = async () => {
  const response = await post(`${SUFFIX_TOPIC_API_URL}/get-all-topic`);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const topicService = {
    fetchAllTopic,

};

export default topicService;