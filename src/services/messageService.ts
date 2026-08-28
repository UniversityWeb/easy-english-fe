import { get, post, del, handleResponse } from '@/lib/axios';

const SUFFIX_NOTIFICATION_API_URL = '/messages';

const getAllMessages = async (
  senderUsername,
  recipientUsername,
  page = 0,
  size = 10,
) => {
  const path = `${SUFFIX_NOTIFICATION_API_URL}/${senderUsername}/${recipientUsername}`;
  const response = await get(path, {
    params: {
      page: page,
      size: size,
    },
  });
  return handleResponse(response, 200);
};

const getRecentChats = async (page = 0, size = 10) => {
  const path = `${SUFFIX_NOTIFICATION_API_URL}/get-recent-chats`;
  const response = await get(path, {
    params: {
      page: page,
      size: size,
    },
  });
  return handleResponse(response, 200);
};

const send = async (msgReq) => {
  const path = `${SUFFIX_NOTIFICATION_API_URL}/send`;
  const response = await post(path, msgReq);
  return handleResponse(response, 200);
};

const deleteMessage = async (id: string, type: string) => {
  const path = `${SUFFIX_NOTIFICATION_API_URL}/${id}`;
  const response = await del(path, {
    params: {
      type: type,
    },
  });
  return handleResponse(response, 200);
};

const messageService = {
  getAllMessages,
  getRecentChats,
  send,
  deleteMessage,
};

export default messageService;
