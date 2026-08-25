import { del, get, post, put } from '~/utils/httpRequest'; // Removed unused imports

const SUFFIX_TOPIC_API_URL = '/topics';

let cachedTopics: any = null;
let curTopicsPromise: Promise<any> | null = null;

export const clearTopicCache = () => {
  cachedTopics = null;
  curTopicsPromise = null;
};

const fetchAllTopic = async () => {
  if (cachedTopics) return cachedTopics;
  if (curTopicsPromise) return curTopicsPromise;

  curTopicsPromise = get(`${SUFFIX_TOPIC_API_URL}/get-all`)
    .then((response) => {
      curTopicsPromise = null;
      if (response?.status !== 200) return null;
      cachedTopics = response.data;
      return response.data;
    })
    .catch((error) => {
      curTopicsPromise = null;
      throw error;
    });

  return curTopicsPromise;
};

const getTopicById = async (topicId) => {
  const response = await get(`${SUFFIX_TOPIC_API_URL}/get-by-id/${topicId}`);
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const createTopic = async (topicData) => {
  const response = await post(`${SUFFIX_TOPIC_API_URL}/add`, topicData);
  if (response?.status !== 201) {
    return null;
  }
  clearTopicCache();
  return response.data;
};

const updateTopic = async (topicId, topicData) => {
  const response = await put(
    `${SUFFIX_TOPIC_API_URL}/update/${topicId}`,
    topicData,
  );
  if (response?.status !== 200) {
    return null;
  }
  clearTopicCache();
  return response.data;
};

const deleteTopic = async (topicId) => {
  const response = await del(`${SUFFIX_TOPIC_API_URL}/delete/${topicId}`);
  if (response?.status !== 204) {
    return null;
  }
  clearTopicCache();
  return true;
};

const topicService = {
  fetchAllTopic,
  deleteTopic,
  getTopicById,
  createTopic,
  updateTopic,
};

export default topicService;
