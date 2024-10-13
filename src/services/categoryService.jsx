import { get, post } from '~/utils/httpRequest'; // Removed unused imports

const SUFFIX_CATEGORY_API_URL = '/category';

const fetchAllCategory = async () => {
  const response = await post(`${SUFFIX_CATEGORY_API_URL}/get-all-category`);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
};

const categoryService = {
    fetchAllCategory,

};

export default categoryService;