import { get, post, put, del } from '~/utils/httpRequest';

const SUFFIX_WRITING_TASK_API_URL = '/writing-tasks';

const submitWriting = async (writingRequest) => {
  const path = `${SUFFIX_WRITING_TASK_API_URL}/submit`;
  const response = await post(path, writingRequest);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const writingService = {
  submitWriting,
};

export default writingService;
