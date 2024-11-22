import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  HStack,
  Icon,
  Avatar,
  Flex,
  Image,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { FiSend, FiImage } from "react-icons/fi"; // Added FiImage for image sending
import { IoArrowBack } from "react-icons/io5"; // Back icon
import websocketService from "~/services/websocketService";
import { getUsername } from "~/utils/authUtils";
import { websocketConstants } from "~/utils/websocketConstants";
import servicesService from "~/services/messageService";
import { useNavigate } from 'react-router-dom';
import config from '~/config';

const ChatPage = () => {
  const navigate = useNavigate();
  const [recentUsers, setRecentUsers] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');

  // Fetch recent conversations list from the API
  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const response = await servicesService.getRecentChats(0, 10);
        setRecentUsers(response.content);
      } catch (error) {
        console.error("Failed to fetch recent chats:", error);
      }
    };

    fetchRecentChats();
  }, []);

  const handleRecipientSelect = (recipient) => {
    setSelectedRecipient(recipient);
  };

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
          <Icon as={IoArrowBack} boxSize={5} color="gray.600" onClick={handleBack}/>
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
              <Avatar
                size="sm"
                name={user?.fullName || user?.username || "User"}
                src={user?.avatarPath || undefined}
              />
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
          <Chat recipient={selectedRecipient} />
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

const Chat = ({ recipient }) => {
  const curUsername = getUsername();
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // For image upload
  const toast = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await servicesService.getAllMessages(
          curUsername,
          recipient?.username,
          0,
          20
        );
        setMessages(response.content); // Assuming `response.content` contains the messages
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (recipient) {
      fetchMessages();
    }
  }, [recipient, curUsername]);

  // WebSocket setup
  useEffect(() => {
    websocketService.disconnect();
    websocketService.connect(() => {
      websocketService.subscribe(
        websocketConstants.messageTopic(curUsername),
        (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      );
    });

    return () => {
      websocketService.disconnect();
    };
  }, [curUsername]);

  const sendMessage = async () => {
    if (messageContent.trim() === "" && !selectedImage) return;

    const message = {
      type: selectedImage ? "IMAGE" : "TEXT",
      content: selectedImage
        ? await convertToBase64(selectedImage) // Convert image to base64
        : messageContent,
      senderUsername: curUsername,
      recipientUsername: recipient?.username,
    };

    websocketService.send(websocketConstants.messageDestination, message);
    setMessages((prevMessages) => [...prevMessages, message]);

    setMessageContent("");
    setSelectedImage(null); // Clear the selected image
  };

  // Convert image file to base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      toast({
        title: "Image selected.",
        description: file.name,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex h="100%" direction="column">
      {/* Chat Header */}
      <HStack
        bg="white"
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        shadow="sm"
        justify="space-between"
        align="center"
      >
        <HStack>
          <Avatar
            size="md"
            name={recipient?.username || "User"} // Fallback to "User" if username is not available
            src={recipient?.avatarPath || undefined} // Use avatarPath if available, otherwise fallback to undefined
          />
          <Text fontSize="lg" fontWeight="bold">
            {recipient?.fullName || recipient?.username}
          </Text>
        </HStack>
      </HStack>

      {/* Messages Section */}
      <Box
        flex="1"
        overflowY="auto"
        p={4}
        bg="white"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
      >
        {messages.map((msg, index) => (
          <HStack
            key={index}
            justify={
              msg.senderUsername === curUsername ? "flex-end" : "flex-start"
            }
            mb={2}
          >
            {msg?.senderUsername !== curUsername && (
                <Avatar
                  size="sm"
                  name={msg?.senderUsername || "User"}
                  src={msg?.avatarPath || undefined} // If avatarPath exists, it will use it as the image source
                />
            )}
            <Box
              p={3}
              bg={
                msg.senderUsername === curUsername ? "blue.100" : "gray.200"
              }
              borderRadius="md"
              maxWidth="70%"
            >
              {msg.type === "IMAGE" ? (
                <Image src={msg.content} alt="Image" maxH="200px" />
              ) : (
                <Text>{msg.content}</Text>
              )}
            </Box>
          </HStack>
        ))}
      </Box>

      {/* Message Input */}
      <HStack
        p={4}
        bg="white"
        borderTop="1px solid"
        borderColor="gray.200"
        shadow="sm"
      >
        <Input
          placeholder="Type a message"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <IconButton
            as="span"
            icon={<FiImage />}
            colorScheme="teal"
            aria-label="Upload Image"
          />
        </label>
        <Button colorScheme="blue" onClick={sendMessage}>
          <Icon as={FiSend} />
        </Button>
      </HStack>
    </Flex>
  );
};

export default ChatPage;