import { handleResponse, put, post, get } from '~/utils/httpRequest';

const SUFFIX_USER_API_URL = '/users';

const updateOwnProfile = async (updateProfileRequest) => {
  const path = `${SUFFIX_USER_API_URL}/update-own-profile`;
  const response = await put(path, updateProfileRequest);
  return handleResponse(response, 200);
};

const uploadAvatar = async (avatar) => {
  const path = `${SUFFIX_USER_API_URL}/upload-avatar`;
  const formData = new FormData();
  formData.append('avatar', avatar);

  const response = await put(path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return handleResponse(response, 200);
};

const updateUserForAdmin = async (username, userForAdminReq) => {
  const path = `${SUFFIX_USER_API_URL}/update-user-for-admin/${username}`;
  const response = await put(path, userForAdminReq);
  return handleResponse(response, 200);
};

const getUsersWithoutAdmin = async (filterReq) => {
  const path = `${SUFFIX_USER_API_URL}/admin/get`;
  const response = await post(path, filterReq);
  return handleResponse(response, 200);
};

const userService = {
  updateOwnProfile,
  uploadAvatar,
  getUsersWithoutAdmin,
  updateUserForAdmin,
};

export default userService;
