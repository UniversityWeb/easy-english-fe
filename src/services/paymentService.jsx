import { get, post, put } from '~/utils/httpRequest';

const SUFFIX_PAYMENT_API_URL = '/payment';

const getCartItems = async (username) => {
  const path = `${SUFFIX_PAYMENT_API_URL}/${username}`;
  const response = await get(path);

  if (response?.status !== 200) {
    return null;
  }

  return response.data;
}

const cartService = {
  getCartItems,
}

export default cartService;