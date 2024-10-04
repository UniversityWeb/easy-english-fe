import { get, post, put } from '~/utils/httpRequest';

const SUFFIX_CART_API_URL = '/cart';

const getCartItems = async (username) => {
  const path = `${SUFFIX_CART_API_URL}/${username}`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
}

const addItemToCart = async (username, courseId) => {
  const path = `${SUFFIX_CART_API_URL}/add/${username}/${courseId}`;
  const response = await post(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
}

const removeItemFromCart = async (username, courseId) => {
  const path = `${SUFFIX_CART_API_URL}/remove/${username}/${courseId}`;
  const response = await put(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
}

const clearCart = async (username) => {
  const path = `${SUFFIX_CART_API_URL}/clear/${username}`;
  const response = await put(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
}

const cartService = {
  getCartItems,
  addItemToCart,
  removeItemFromCart,
  clearCart
}

export default cartService;