import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  HStack,
  Icon,
  Avatar,
  Flex,
  AvatarBadge,
} from '@chakra-ui/react';
import { IoArrowBack } from "react-icons/io5";
import servicesService from "~/services/messageService";
import { useNavigate, useLocation } from "react-router-dom";
import config from "~/config";
import Chat from '~/components/Chat';
import WebSocketService from '~/services/websocketService';
import { websocketConstants } from '~/utils/websocketConstants';
import { getUsername } from '~/utils/authUtils';


const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseData } = location.state || {}; // Retrieve course data from state
  const [recentUsers, setRecentUsers] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  // Fetch recent conversations list from the API
  useEffect(() => {
    const username = getUsername();
    let wsService;

    const initializeWebsocket = async () => {
      try {
        wsService = await WebSocketService.getIns();

        wsService.subscribe(websocketConstants.recentChatsTopic(username), (message) => {
          try {
            const { senderUsername, recipientUsername, content, sendingTime } = message;

            // Determine the chat partner (exclude the logged-in user)
            const chatPartner = senderUsername === username ? recipientUsername : senderUsername;

            // Update the recent chats list dynamically
            setRecentUsers((prevUsers) => {
              const existingUserIndex = prevUsers.findIndex((user) => user.username === chatPartner);

              // If the user already exists in the list, update them and move them to the top
              if (existingUserIndex !== -1) {
                const updatedUser = {
                  ...prevUsers[existingUserIndex],
                  lastMessage: content,
                  lastMessageTime: sendingTime,
                };
                const updatedUsers = [...prevUsers];
                updatedUsers.splice(existingUserIndex, 1); // Remove the existing user
                return [updatedUser, ...updatedUsers]; // Add the updated user to the top
              }

              // If the user doesn't exist, add them to the top of the list
              return [
                {
                  username: chatPartner,
                  lastMessage: content,
                  lastMessageTime: sendingTime,
                  fullName: chatPartner, // Adjust if additional data is available
                },
                ...prevUsers,
              ];
            });
          } catch (error) {
            console.error("Failed to process WebSocket message:", error);
          }
        });

        wsService.subscribe(websocketConstants.onlineUsersTopic, (onlineUsernames) => {
          setRecentUsers((prevUsers) =>
            prevUsers.map((user) => ({
              ...user,
              isOnline: onlineUsernames.includes(user.username),
            }))
          );
        });

      } catch (error) {
        console.error('WebSocket initialization failed:', error);
      }
    }

    const fetchRecentChats = async () => {
      try {
        const response = await servicesService.getRecentChats(0, 10);
        setRecentUsers(response.content || []);
      } catch (error) {
        console.error("Failed to fetch recent chats:", error);
      }
    };

    initializeWebsocket();
    fetchRecentChats();

    return () => {
      if (wsService) {
        wsService.unsubscribe(websocketConstants.recentChatsTopic(username));
        wsService.unsubscribe(websocketConstants.onlineUsersTopic);
      }
    }
  }, []);

  // Handle recipient selection
  const handleRecipientSelect = (recipient) => {
    setSelectedRecipient(recipient);
  };

  // Automatically open a chat with the course owner if `courseData` is provided
  useEffect(() => {
    if (courseData?.ownerUsername) {
      handleRecipientSelect({
        username: courseData.ownerUsername,
        fullName: courseData.ownerUsername, // Update based on your data structure
      });
    }
  }, [courseData]);

  const handleBack = () => {
    setSelectedRecipient(null);
    navigate(config.routes.home[0]);
  };

  return (
    <Flex h="100vh" w="100vw" bg="gray.100" overflow="hidden">
      {/* User List (Recent Conversations) */}
      <Box
        w="300px"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        overflowY="auto"
        p={4}
      >
        <HStack mb={4}>
          <Icon as={IoArrowBack} boxSize={5} color="gray.600" onClick={handleBack} />
          <Text fontSize="xl" fontWeight="bold">
            Recent Chats
          </Text>
        </HStack>
        <VStack align="stretch" spacing={3}>
          {recentUsers.map((user) => (
            <HStack
              key={user?.username}
              p={3}
              bg={
                selectedRecipient?.username === user?.username
                  ? "blue.100"
                  : "gray.50"
              }
              borderRadius="md"
              cursor="pointer"
              onClick={() => handleRecipientSelect(user)}
            >
              <Flex position="relative" w="fit-content">
                {/* Avatar Component */}
                <Avatar
                  size="sm"
                  name={user?.fullName || user?.username || "User"}
                  src={user?.avatarPath || undefined}
                />

                {/* Online Dot */}
                {user?.isOnline && (
                  <Box
                    position="absolute"
                    bottom="0"
                    right="0"
                    bg="green.400"
                    borderWidth="2px"
                    borderColor="white"
                    borderRadius="full"
                    width="12px"
                    height="12px"
                  />
                )}
              </Flex>
              <Box flex="1">
                <Text fontWeight="bold">
                  {user?.fullName || user?.username}
                </Text>
              </Box>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* Chat Window */}
      <Flex flex="1" direction="column" bg="gray.50">
        {selectedRecipient ? (
          <Chat recipient={selectedRecipient} courseData={courseData} />
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