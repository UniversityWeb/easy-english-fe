import { get } from '~/utils/httpRequest';

const SUFFIX_ORDER_API_URL = '/orders';

const getOrdersByUsername = async (username, page = 0, size = 10) => {
  const path = `${SUFFIX_ORDER_API_URL}/${username}`;
  const response = await get(path, {
    params: {
      page: page,
      size: size
    }
  });
  return response?.status !== 200 ? null : response.data;
};

const getOrdersByStatus = async (username, status, page = 0, size = 10) => {
  const path = `${SUFFIX_ORDER_API_URL}/${username}/status/${status}`;
  const response = await get(path, {
    params: {
      page: page,
      size: size
    }
  });
  return response?.status !== 200 ? null : response.data;
};

const getOrderItemsByOrderId = async (orderId, page = 0, size = 10) => {
  const path = `${SUFFIX_ORDER_API_URL}/${orderId}/items`;
  const response = await get(path, {
    params: {
      page: page,
      size: size
    }
  });
  return response?.status !== 200 ? null : response.data;
};

const orderService = {
  getOrdersByUsername,
  getOrdersByStatus,
  getOrderItemsByOrderId,
};

export default orderService;
