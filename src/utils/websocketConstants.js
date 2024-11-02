const notificationTopic = (username) => `/topic/notifications/${username}`;

const notificationDestination = '/app/notifications';

const cartItemCountTopic = (username) => `/topic/cart-item-count/${username}`;

const cartItemCountDestination = '/app/cart-item-count';

export const websocketConstants = {
  notificationTopic,
  notificationDestination,
  cartItemCountTopic,
  cartItemCountDestination,
};
