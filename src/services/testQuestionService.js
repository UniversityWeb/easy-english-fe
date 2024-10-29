import { get, post, put, del, handleResponse } from '~/utils/httpRequest';

const SUFFIX_TEST_QUESTION_API_URL = '/test-questions';

const create = async (addTestRequest) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/add`;
  const response = await post(path, addTestRequest);
  return handleResponse(response, 201);
};

const update = async (id, updateTestRequest) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/update/${id}`;
  const response = await put(path, updateTestRequest);
  return handleResponse(response, 200);
};

const getAll = async () => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/get-all`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const getById = async (testId) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/get-by-id/${testId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const remove = async (testId) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/delete/${testId}`;
  const response = await del(path);
  return handleResponse(response, 204);
}

const getByQuestionGroup = async (questionGroupId) => {
  const path = `${SUFFIX_TEST_QUESTION_API_URL}/get-by-question-group/${questionGroupId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const testQuestionService = {
  create,
  update,
  getAll,
  getById,
  remove,
  getByQuestionGroup,
};

export default testQuestionService;