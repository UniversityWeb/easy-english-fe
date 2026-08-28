import { del, get, post, put } from '@/lib/axios';

const SUFFIX_CATEGORY_API_URL = '/categories';

let cachedCategories: any = null;
let curCategoriesPromise: Promise<any> | null = null;

export const clearCategoryCache = () => {
  cachedCategories = null;
  curCategoriesPromise = null;
};

const fetchAllCategory = async () => {
  if (cachedCategories) return cachedCategories;
  if (curCategoriesPromise) return curCategoriesPromise;

  curCategoriesPromise = get(`${SUFFIX_CATEGORY_API_URL}/get-all`)
    .then((response) => {
      curCategoriesPromise = null;
      if (response?.status !== 200) return null;
      cachedCategories = response.data;
      return response.data;
    })
    .catch((error) => {
      curCategoriesPromise = null;
      throw error;
    });

  return curCategoriesPromise;
};

const getCategoryById = async (categoryId) => {
  const response = await get(
    `${SUFFIX_CATEGORY_API_URL}/get-by-id/${categoryId}`,
  );
  if (response?.status !== 200) {
    return null;
  }
  return response.data;
};

const createCategory = async (categoryData) => {
  const response = await post(`${SUFFIX_CATEGORY_API_URL}/add`, categoryData);
  if (response?.status !== 201) {
    return null;
  }
  clearCategoryCache();
  return response.data;
};

const updateCategory = async (categoryId, categoryData) => {
  const response = await put(
    `${SUFFIX_CATEGORY_API_URL}/update/${categoryId}`,
    categoryData,
  );
  if (response?.status !== 200) {
    return null;
  }
  clearCategoryCache();
  return response.data;
};

const deleteCategory = async (categoryId) => {
  const response = await del(`${SUFFIX_CATEGORY_API_URL}/delete/${categoryId}`);
  if (response?.status !== 204) {
    return null;
  }
  clearCategoryCache();
  return true;
};

const categoryService = {
  fetchAllCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
