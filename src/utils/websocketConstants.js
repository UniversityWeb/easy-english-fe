const notificationTopic = (username) => `/topic/notifications/${username}`;

const notificationDestination = '/app/notifications';

export const websocketConstants = {
  notificationTopic,
  notificationDestination,
};
