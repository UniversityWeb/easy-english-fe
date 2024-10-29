import { get, post, put, del, handleResponse } from '~/utils/httpRequest';

const SUFFIX_QUESTION_GROUP_API_URL = '/question-groups';

const create = async (addTestRequest) => {
  const path = `${SUFFIX_QUESTION_GROUP_API_URL}/add`;
  const response = await post(path, addTestRequest);
  return handleResponse(response, 201);
};

const update = async (id, updateTestRequest) => {
  const path = `${SUFFIX_QUESTION_GROUP_API_URL}/update/${id}`;
  const response = await put(path, updateTestRequest);
  return handleResponse(response, 200);
};

const getAll = async () => {
  const path = `${SUFFIX_QUESTION_GROUP_API_URL}/get-all`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const getById = async (testId) => {
  const path = `${SUFFIX_QUESTION_GROUP_API_URL}/get-by-id/${testId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const remove = async (testId) => {
  const path = `${SUFFIX_QUESTION_GROUP_API_URL}/delete/${testId}`;
  const response = await del(path);
  return handleResponse(response, 204);
}

const getByTestPart = async (testPartId) => {
  const path = `${SUFFIX_QUESTION_GROUP_API_URL}/get-by-test-part/${testPartId}`;
  const response = await get(path);
  return handleResponse(response, 200);
};

const questionGroupService = {
  create,
  update,
  getAll,
  getById,
  remove,
  getByTestPart,
};

export default questionGroupService;