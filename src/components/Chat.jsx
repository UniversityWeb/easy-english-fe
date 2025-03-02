import { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import { FiImage, FiSend } from 'react-icons/fi';
import messageService from '~/services/messageService';
import WebSocketService from '~/services/websocketService';
import { websocketConstants } from '~/utils/websocketConstants';
import useCustomToast from '~/hooks/useCustomToast';
import { getUsername } from '~/utils/authUtils';
import ImagePreview from '~/components/ImagePreview';

// Define message types as constants
const MESSAGE_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  COURSE_INFO: 'COURSE_INFO',
};

const Chat = ({ recipient, courseData }) => {
  const curUsername = getUsername();
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isViewerImageOpen, setViewerImageOpen] = useState(false);
  const [imageViewerUrl, setImageViewerUrl] = useState(false);

  const { infoToast } = useCustomToast();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await messageService.getAllMessages(
          curUsername,
          recipient?.username,
          0,
          1000,
        );
        setMessages(response.content || []);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    if (recipient) {
      fetchMessages();
    }
  }, [recipient, curUsername]);

  useEffect(() => {
    let wsService;

    const initializeWebsocket = async () => {
      try {
        wsService = await WebSocketService.getIns();

        wsService.subscribe(
          websocketConstants.messageTopic(curUsername),
          (message) => {
            const recipientUsername = recipient?.username;
            if (
              recipientUsername === message?.recipientUsername ||
              recipientUsername === message?.senderUsername
            ) {
              setMessages((prevMessages) => [...prevMessages, message]);
            }
          },
        );
      } catch (error) {
        console.error('WebSocket initialization failed:', error);
      }
    };

    initializeWebsocket();

    return () => {
      if (wsService) {
        wsService.unsubscribe(websocketConstants.messageTopic(curUsername));
      }
    };
  }, []);

  const sendMessage = async (type = MESSAGE_TYPES.TEXT, content = '') => {
    if (type === MESSAGE_TYPES.TEXT && content.trim() === '' && !selectedImage)
      return;

    if (type === MESSAGE_TYPES.IMAGE) {
      content = await convertToBase64(selectedImage);
      console.log(`image base64 Str: ${content}`);
    }

    const message = {
      type,
      content: content,
      senderUsername: curUsername,
      recipientUsername: recipient?.username,
      sendingTime: new Date().toISOString(),
    };

    messageService.send(message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessageContent('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const sendCourseInfo = async () => {
    await sendMessage(MESSAGE_TYPES.COURSE_INFO, JSON.stringify(courseData));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
      infoToast('Image selected.');
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${day}-${month}-${year} ${time}`;
  };

  const showPreviewImage = (imageUrl) => {
    setViewerImageOpen(true);
    setImageViewerUrl(imageUrl);
  };

  return (
    <Flex h="100%" direction="column">
      <HStack
        bg="white"
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        justify="space-between"
        align="center"
      >
        <HStack>
          <Avatar size="md" name={recipient?.username || 'User'} />
          <Text fontSize="lg" fontWeight="bold">
            {recipient?.fullName || recipient?.username}
          </Text>
        </HStack>
        {courseData && (
          <Button colorScheme="teal" size="sm" onClick={sendCourseInfo}>
            Send Course Info
          </Button>
        )}
      </HStack>

      <Box flex="1" overflowY="auto" p={4} bg="white" ref={scrollRef}>
        {messages.map((msg, index) => (
          <HStack
            key={index}
            justify={
              msg.senderUsername === curUsername ? 'flex-end' : 'flex-start'
            }
            mb={2}
          >
            {msg.senderUsername !== curUsername && (
              <Avatar size="sm" name={msg.senderUsername || 'User'} />
            )}
            <Box
              p={3}
              bg={msg.senderUsername === curUsername ? 'blue.100' : 'gray.200'}
              borderRadius="md"
              maxWidth="70%"
            >
              {msg.type === MESSAGE_TYPES.IMAGE && msg.content ? (
                <Image
                  src={msg.content}
                  alt="Image"
                  maxH="400px"
                  onClick={() => showPreviewImage(msg.content)}
                />
              ) : msg.type === MESSAGE_TYPES.COURSE_INFO ? (
                <Box>
                  <Text fontWeight="bold">{JSON.parse(msg.content).title}</Text>
                  <Text>{JSON.parse(msg.content).description}</Text>
                </Box>
              ) : (
                <Text>{msg.content}</Text>
              )}
              <Text fontSize="xs" color="gray.500" mt={1}>
                {formatDateTime(msg?.sendingTime)}
              </Text>
            </Box>
          </HStack>
        ))}
      </Box>

      {imagePreview && (
        <Box p={4} bg="gray.50" borderTop="1px solid" borderColor="gray.200">
          <Text fontSize="sm" mb={2}>
            Image Preview:
          </Text>
          <Image src={imagePreview} alt="Preview" maxH="200px" mb={2} />
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => {
              setSelectedImage(null);
              setImagePreview(null); // Clear the preview
            }}
          >
            Remove Image
          </Button>
        </Box>
      )}

      <HStack p={4} bg="white" borderTop="1px solid" borderColor="gray.200">
        <Input
          disabled={selectedImage}
          placeholder="Type a message"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              setMessageContent(messageContent.trim());
              if (selectedImage) {
                await sendMessage(MESSAGE_TYPES.IMAGE);
              } else {
                await sendMessage(MESSAGE_TYPES.TEXT, messageContent);
              }
            }
          }}
        />

        {/* Images Button */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <IconButton as="span" icon={<FiImage />} colorScheme="teal" />
        </label>

        <Button
          colorScheme="blue"
          onClick={async () => {
            setMessageContent(messageContent.trim());
            if (selectedImage) {
              await sendMessage(MESSAGE_TYPES.IMAGE);
            } else {
              await sendMessage(MESSAGE_TYPES.TEXT, messageContent);
            }
          }}
        >
          <Icon as={FiSend} />
        </Button>

        <ImagePreview
          isOpen={isViewerImageOpen}
          onClose={setViewerImageOpen}
          imageUrl={imageViewerUrl}
        />
      </HStack>
    </Flex>
  );
};

export default Chat;
