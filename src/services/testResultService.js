import { post, handleResponse, get } from '~/utils/httpRequest';

const SUFFIX_TEST_RESULT_API_URL = '/test-results';

const getById = async (testResultId) => {
  const path = `${SUFFIX_TEST_RESULT_API_URL}/get-by-id/${testResultId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const submit = async (submitTestRequest) => {
  const path = `${SUFFIX_TEST_RESULT_API_URL}/submit-test`;
  const response = await post(path, submitTestRequest);
  return handleResponse(response, 200);
};

const testResultService = {
  getById,
  submit,
};

export default testResultService;