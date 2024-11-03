import { handleResponse, put } from '~/utils/httpRequest';

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
      'Content-Type': 'multipart/form-data'
    }
  });

  return handleResponse(response, 200);
};

const userService = {
  updateOwnProfile,
  uploadAvatar,
};

export default userService;
