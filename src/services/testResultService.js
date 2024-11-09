import { post, handleResponse } from '~/utils/httpRequest';

const SUFFIX_TEST_RESULT_API_URL = '/test-results';

const submit = async (submitTestRequest) => {
  const path = `${SUFFIX_TEST_RESULT_API_URL}/submit-test`;
  const response = await post(path, submitTestRequest);
  return handleResponse(response, 201);
};

const testResultService = {
  submit,
};

export default testResultService;