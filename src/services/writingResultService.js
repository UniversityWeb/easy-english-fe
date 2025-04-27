import { get, post, put, del } from '~/utils/httpRequest';

const SUFFIX_WRITING_RESULT_TASK_API_URL = '/writing-results';

const supportWriting = async (writingRequest) => {
  const path = `${SUFFIX_WRITING_RESULT_TASK_API_URL}/support-by-ai`;
  const response = await post(path, writingRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const imageToText = async (formData) => {
  const path = `${SUFFIX_WRITING_RESULT_TASK_API_URL}/image-to-text`;
  const response = await post(path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is set
    },
  });

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const chatWithAI = async (writingRequest) => {
  const path = `${SUFFIX_WRITING_RESULT_TASK_API_URL}/chat-with-ai`;
  const response = await post(path, writingRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const writingResultService = { chatWithAI, supportWriting, imageToText };

export default writingResultService;
