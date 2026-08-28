import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { IoArrowBack } from 'react-icons/io5';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import servicesService from '@/services/messageService';
import userService from '@/services/userService';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Chat from '@/components/organisms/Chat';
import NotFound from '@/components/organisms/NotFound';
import WebSocketService from '@/services/websocketService';
import { websocketConstants } from '@/utils/websocketConstants';
import { getUsername } from '@/utils/authUtils';
import { Button } from 'antd';
const overlayScrollbarStyles = {
  overflowY: 'overlay' as any,
  '&::-webkit-scrollbar': {
    width: '6px',
    background: 'transparent',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0,0,0,0.15)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'rgba(0,0,0,0.25)',
  },
  scrollbarWidth: 'thin' as any,
  scrollbarColor: 'rgba(0,0,0,0.15) transparent',
};

const PAGE_SIZE = 10;

const timeAgo = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Vừa xong';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;
  
  return date.toLocaleDateString();
};

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const encodedToUser = searchParams.get('to');
  const toUser = useMemo(() => {
    if (!encodedToUser) return null;
    try {
      return atob(encodedToUser);
    } catch (e) {
      return 'INVALID_BASE64';
    }
  }, [encodedToUser]);
  const { returnUrl, targetCourse } = location.state || {};
  const [courseData, setCourseData] = useState(targetCourse);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const queryClient = useQueryClient();
  const username = getUsername();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['recentChats', username],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await servicesService.getRecentChats(pageParam, PAGE_SIZE);
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.last ? undefined : allPages.length;
    },
    initialPageParam: 0,
    enabled: !!username,
  });

  const recentUsers = useMemo(() => {
    if (!data) return [];
    const allUsers = data.pages.flatMap((page: any) => page?.content || []);
    return Array.from(new Map(allUsers.map((user: any) => [user.username, user])).values());
  }, [data]);

  const handleRecentChatUpdate = useCallback((message: any) => {
    const { senderUsername, recipientUsername, content, sendingTime, type, isRecalled } = message;
    const chatPartner = senderUsername === username ? recipientUsername : senderUsername;

    queryClient.setQueryData(['recentChats', username], (oldData: any) => {
      if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

      let existingUser: any = null;
      const newPages = oldData.pages.map((page: any) => {
        if (!page || !page.content) return page;
        const newContent = [...page.content];
        const index = newContent.findIndex((u: any) => u.username === chatPartner);
        if (index !== -1) {
          existingUser = newContent[index];
          newContent.splice(index, 1);
        }
        return { ...page, content: newContent };
      });

      if (existingUser) {
        existingUser = { ...existingUser, lastMessage: content, lastMessageType: type, lastMessageIsRecalled: isRecalled, lastMessageTime: sendingTime };
      } else {
        existingUser = { username: chatPartner, fullName: chatPartner, lastMessage: content, lastMessageType: type, lastMessageIsRecalled: isRecalled, lastMessageTime: sendingTime, unreadCount: 0 };
      }

      if (senderUsername !== username && chatPartner !== toUser) {
        existingUser.unreadCount = (existingUser.unreadCount || 0) + 1;
      }

      newPages[0].content.unshift(existingUser);

      return {
        ...oldData,
        pages: newPages,
      };
    });
  }, [username, queryClient, toUser]);

  useEffect(() => {
    if (toUser && username) {
      queryClient.setQueryData(['recentChats', username], (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;
        let modified = false;
        const newPages = oldData.pages.map((page: any) => {
          if (!page || !page.content) return page;
          const newContent = page.content.map((u: any) => {
            if (u.username === toUser && u.unreadCount > 0) {
              modified = true;
              return { ...u, unreadCount: 0 };
            }
            return u;
          });
          return { ...page, content: newContent };
        });
        return modified ? { ...oldData, pages: newPages } : oldData;
      });
    }
  }, [toUser, username, queryClient]);

  const handleOnlineUsersUpdate = useCallback((onlineUsernames: string[]) => {
    queryClient.setQueryData(['recentChats', username], (oldData: any) => {
      if (!oldData || !oldData.pages) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => {
          if (!page || !page.content) return page;
          return {
            ...page,
            content: page.content.map((user: any) => ({
              ...user,
              isOnline: onlineUsernames.includes(user.username),
            })),
          };
        }),
      };
    });
  }, [username, queryClient]);

  useEffect(() => {
    let wsService: WebSocketService;

    const initializeWebsocket = async () => {
      if (!username) return;
      try {
        wsService = await WebSocketService.getIns();

        wsService.subscribe(
          websocketConstants.recentChatsTopic(username),
          handleRecentChatUpdate
        );

        wsService.subscribe(
          websocketConstants.onlineUsersTopic,
          handleOnlineUsersUpdate
        );
      } catch (error) {
        console.error('WebSocket initialization failed:', error);
      }
    };

    initializeWebsocket();

    return () => {
      if (wsService && username) {
        wsService.unsubscribe(websocketConstants.recentChatsTopic(username));
        wsService.unsubscribe(websocketConstants.onlineUsersTopic);
      }
    };
  }, [username, handleRecentChatUpdate, handleOnlineUsersUpdate]);

  const handleRecipientSelect = (recipient: any) => {
    setSelectedRecipient(recipient);
    setSearchParams({ to: btoa(recipient.username) });
  };

  useEffect(() => {
    if (toUser && !selectedRecipient && data) {
      if (toUser === 'INVALID_BASE64') {
        setIsNotFound(true);
        return;
      }
      const user = recentUsers.find((u: any) => u.username === toUser);
      if (user) {
        setSelectedRecipient(user);
      } else {
        userService.getUserByUsername(toUser)
          .then((res) => {
            if (res) {
              setSelectedRecipient({
                username: res.username,
                fullName: res.fullName || res.username,
                avatarPath: res.avatarPath,
              });
            } else {
              setIsNotFound(true);
            }
          })
          .catch(() => {
            setIsNotFound(true);
          });
      }
    }
  }, [toUser, recentUsers, selectedRecipient, data]);

  useEffect(() => {
    if (targetCourse?.ownerUsername || targetCourse?.owner?.username) {
      const targetUsername = targetCourse.owner?.username || targetCourse.ownerUsername;
      setSelectedRecipient({
        username: targetUsername,
        fullName: targetCourse.owner?.fullName || targetCourse.ownerFullName,
      });
      setSearchParams({ to: btoa(targetUsername) });
    }
  }, [targetCourse, setSearchParams]);

  const handleBack = () => {
    setSelectedRecipient(null);
    searchParams.delete('to');
    setSearchParams(searchParams);
    if (returnUrl) {
      navigate(returnUrl);
    } else {
      navigate(-1);
    }
  };

  if (isNotFound) {
    return <NotFound />;
  }

  return (
    <Flex h="100vh" w="100vw" bg="white" overflow="hidden">
      <Box
        w="360px"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        p={3}
        sx={overlayScrollbarStyles}
      >
        <HStack mb={4} px={2} justify="space-between">
          <HStack>
            <Icon
              as={IoArrowBack}
              boxSize={6}
              color="gray.600"
              onClick={handleBack}
              cursor="pointer"
              mr={2}
            />
            <Text fontSize="2xl" fontWeight="bold" color="black">
              Chats
            </Text>
          </HStack>
        </HStack>
        <VStack align="stretch" spacing={1}>
          {recentUsers.map((user) => (
              <HStack
                key={user?.username}
                p={2}
                px={3}
                bg={
                  selectedRecipient?.username === user?.username
                    ? '#ebf5ff' // Light blue for active chat
                    : 'transparent'
                }
                _hover={{ bg: selectedRecipient?.username === user?.username ? '#ebf5ff' : '#f0f2f5' }}
                borderRadius="lg"
                cursor="pointer"
                onClick={() => handleRecipientSelect(user)}
                spacing={3}
              >
                <Flex position="relative" w="fit-content">
                  <Avatar
                    size="lg"
                    name={user?.fullName || user?.username || 'User'}
                    src={user?.avatarPath || undefined}
                  />
                  {user?.isOnline ? (
                    <Box
                      position="absolute"
                      bottom="1"
                      right="1"
                      bg="green.400"
                      borderWidth="2px"
                      borderColor="white"
                      borderRadius="full"
                      width="16px"
                      height="16px"
                    />
                  ) : (
                    <Tooltip 
                      label={user?.lastLogin ? `Hoạt động ${timeAgo(user.lastLogin)}` : 'Ngoại tuyến'} 
                      hasArrow 
                      placement="top"
                    >
                      <Box
                        position="absolute"
                        bottom="1"
                        right="1"
                        bg="gray.300"
                        borderWidth="2px"
                        borderColor="white"
                        borderRadius="full"
                        width="16px"
                        height="16px"
                      />
                    </Tooltip>
                  )}
                </Flex>
                <Box flex="1" overflow="hidden">
                  <Flex justify="space-between" align="center" mb={1}>
                    <Text fontWeight="semibold" fontSize="md" noOfLines={1} color="black">
                      {user?.fullName || user?.username}
                    </Text>
                    {user?.unreadCount > 0 && (
                      <Flex
                        bg="red.500"
                        color="white"
                        borderRadius="full"
                        px={2}
                        h="20px"
                        fontSize="12px"
                        fontWeight="bold"
                        align="center"
                        justify="center"
                      >
                        {user.unreadCount > 99 ? '99+' : user.unreadCount}
                      </Flex>
                    )}
                  </Flex>
                  {(user?.lastMessage || user?.lastMessageType) && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.500" noOfLines={1} flex="1">
                        {(() => {
                          if (user.lastMessageIsRecalled) return "Tin nhắn đã bị thu hồi";
                          switch(user.lastMessageType) {
                            case 'IMAGE': return "Đã gửi 1 ảnh";
                            case 'COURSE_INFO': return "Đã chia sẻ 1 khóa học";
                            case 'FILE': return "Đã gửi 1 tệp";
                            case 'LOCATION': return "Đã chia sẻ vị trí";
                            default: return user.lastMessage;
                          }
                        })()}
                      </Text>
                      {user?.lastMessageTime && (
                        <Text fontSize="xs" color="gray.500" whiteSpace="nowrap" ml={2}>
                          · {timeAgo(user.lastMessageTime)}
                        </Text>
                      )}
                    </HStack>
                  )}
                </Box>
              </HStack>
          ))}
          {hasNextPage && (
            <div style={{ marginTop: '1rem' }}>
              <Button
                type="primary"
                onClick={() => fetchNextPage()}
                loading={isFetchingNextPage}
                disabled={isFetchingNextPage}
                style={{
                  transition: 'transform 0.3s, background-color 0.3s',
                }}
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
          {isLoading && (
            <Flex justify="center" py={4}>
              <Spinner size="sm" />
            </Flex>
          )}
        </VStack>
      </Box>

      <Flex flex="1" direction="column" bg="white">
        {selectedRecipient ? (
          <Chat
            recipient={selectedRecipient}
            courseData={courseData}
            setCourseData={setCourseData}
          />
        ) : (
          <Flex
            flex="1"
            align="center"
            justify="center"
            bg="white"
            borderRadius="md"
            shadow="md"
          >
            <Text fontSize="xl" color="gray.500">
              Select a conversation to start chatting.
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default ChatPage;
