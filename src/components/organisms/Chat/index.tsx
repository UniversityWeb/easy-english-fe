import React from 'react';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Text,
  Icon,
  Tooltip,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
} from '@chakra-ui/react';
import { 
  FiImage, FiSend, FiPhone, FiVideo, FiInfo, FiPlusCircle, 
  FiSmile, FiMapPin, FiFileText, FiAlertCircle, FiCornerUpLeft, 
  FiX, FiMoreVertical, FiPaperclip, FiMessageSquare, FiUser, FiArrowDown, FiTrash2, FiRotateCcw
} from 'react-icons/fi';
import { 
  Tabs, TabList, TabPanels, Tab, TabPanel 
} from '@chakra-ui/react';
import messageService from '@/services/messageService';
import WebSocketService from '@/services/websocketService';
import { websocketConstants } from '@/utils/websocketConstants';
import useCustomToast from '@/hooks/useCustomToast';
import { getUsername } from '@/utils/authUtils';
import PriceDisplay from '@/components/molecules/PriceDisplay';
import { useNavigate } from 'react-router-dom';
import config from '@/config';
import debounce from 'lodash.debounce';
import ImagePreview from '@/components/molecules/ImagePreview';

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

// Define message types as constants
const MESSAGE_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  COURSE_INFO: 'COURSE_INFO',
  FILE: 'FILE',
  LOCATION: 'LOCATION',
  CONTACT: 'CONTACT',
};

const EMOJIS = ['😀', '😂', '🥺', '❤️', '🔥', '👍', '🙏', '🎉', '😡', '🤔', '😎', '😭', '😍', '👋', '👏', '💔'];

const STICKER_PACKS = {
  'Mèo': [
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Cat%20Face.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Cat%20with%20Tears%20of%20Joy.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Cat%20with%20Heart-Eyes.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Pouting%20Cat.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Cat%20with%20Wry%20Smile.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Weary%20Cat.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Cat%20with%20Smiling%20Eyes.png',
  ],
  'Khỉ': [
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/See-No-Evil%20Monkey.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Hear-No-Evil%20Monkey.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Speak-No-Evil%20Monkey.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Monkey%20Face.png',
  ],
  'Tình yêu': [
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Hearts.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Heart-Eyes.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20Blowing%20a%20Kiss.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Sparkling%20Heart.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Heart%20on%20Fire.png',
  ],
  'Buồn bã': [
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Loudly%20Crying%20Face.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Crying%20Face.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Pleading%20Face.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Disappointed%20Face.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Downcast%20Face%20with%20Sweat.png',
  ],
  'Tức giận': [
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Pouting%20Face.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Angry%20Face.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Symbols%20on%20Mouth.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20Exhaling.png',
  ],
  'Vui nhộn': [
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Rolling%20on%20the%20Floor%20Laughing.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Squinting%20Face.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Squinting%20Face%20with%20Tongue.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Zany%20Face.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Upside-Down%20Face.png',
  ],
  'Cử chỉ': [
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Thumbs%20Up.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Thumbs%20Down.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Clapping%20Hands.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Folded%20Hands.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Waving%20Hand.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/OK%20Hand.png',
  ],
  'Chó': [
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dog%20Face.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dog.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Poodle.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Guide%20Dog.png',
  ],
  'Gấu': [
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Polar%20Bear.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Panda.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Koala.png',
  ],
  'Tiệc tùng': [
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Partying%20Face.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Confetti%20Ball.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Balloon.png',
    'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food%20and%20Drink/Clinking%20Glasses.png',
  ]
};

const MESSAGE_TEMPLATES = {
  'Chào hỏi': [
    'Xin chào, tôi có thể giúp gì cho bạn?',
    'Chào bạn, bạn cần tư vấn về khóa học nào?',
    'Cảm ơn bạn đã liên hệ với chúng tôi.',
    'Dạ, mình là tư vấn viên, mình hỗ trợ bạn nhé.'
  ],
  'Tư vấn': [
    'Khóa học này sẽ kéo dài trong 3 tháng.',
    'Học phí của khóa học là 1.500.000 VND.',
    'Bạn có thể học thử 1 buổi miễn phí nhé.',
    'Lịch học linh hoạt, bạn có thể chọn ca phù hợp.'
  ],
  'Hỗ trợ': [
    'Vui lòng cung cấp thêm thông tin để tôi hỗ trợ.',
    'Tôi đã ghi nhận vấn đề và sẽ xử lý sớm nhất.',
    'Xin lỗi bạn vì sự bất tiện này.',
    'Bạn vui lòng kiểm tra lại email nhé.'
  ]
};

const getMessageSuggestions = (input) => {
  const predefinedSuggestions = [
    'Hello, how can I help you?',
    'Can you provide more details?',
    'I"m available for a chat.',
    'Let me know if you have any questions.',
    'I would love to assist you!',
  ];

  return predefinedSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(input.toLowerCase()),
  );
};

const CourseCard = ({ courseData }) => {
  const navigate = useNavigate();
  return (
    <Flex justify="center" mt={4}>
      <Box
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={4}
        maxW="fit-content"
        bg="white"
        boxShadow="sm"
        width="100%"
        _hover={{
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease',
          backgroundColor: '#f8f8f8',
          cursor: 'pointer',
        }}
        onClick={() =>
          navigate(
            config.routes.course_view_detail.replace(
              ':courseId',
              courseData?.id,
            ),
          )
        }
      >
        <Text fontSize="sm" color="gray.600" mb={3} textAlign="center">
          Are you discussing this product with the seller?
        </Text>

        <Flex align="center" flexWrap="wrap">
          <Image
            src={courseData.imagePreview}
            alt={courseData.title}
            borderRadius="md"
            mr={3}
            maxW="80px"
            maxH="80px"
          />
          <Box flex="1" minW="200px">
            <Text fontSize="sm" fontWeight="bold">
              {courseData.title}
            </Text>
            <PriceDisplay
              priceResponse={courseData?.price}
              primaryColor={'red.500'}
              fontWeight={'regular'}
            />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

const Chat = ({ recipient, courseData, setCourseData }) => {
  const curUsername = getUsername();
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isViewerImageOpen, setViewerImageOpen] = useState(false);
  const [imageViewerUrl, setImageViewerUrl] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [replyingToMsg, setReplyingToMsg] = useState(null);
  const [stickerSearch, setStickerSearch] = useState('');
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  const { infoToast } = useCustomToast();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const handleReplyClick = (msg) => {
    setReplyingToMsg(msg);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleScrollToMessage = (msgId) => {
    const element = document.getElementById(`message-${msgId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMsgId(msgId);
      setTimeout(() => {
        setHighlightedMsgId(null);
      }, 2500);
    } else {
      infoToast('Tin nhắn này ở quá xa hoặc không còn tồn tại.');
    }
  };

  const prevMessagesLengthRef = useRef(0);
  const isAutoScrolling = useRef(false);

  const scrollToBottom = (smooth = true) => {
    if (scrollRef.current) {
      isAutoScrolling.current = true;
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 800);
    }
  };

  useEffect(() => {
    // Check if new messages were added
    if (messages.length > prevMessagesLengthRef.current) {
      const isNearBottom = scrollRef.current && (scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight < 150);
      const isMyMessage = messages.length > 0 && messages[messages.length - 1].senderUsername === curUsername;

      if (prevMessagesLengthRef.current === 0) {
        scrollToBottom(false);
      } else if (isNearBottom || isMyMessage) {
        scrollToBottom(true);
        setNewMessagesCount(0);
      } else {
        setShowScrollBottomBtn(true);
        if (!isMyMessage) {
          setNewMessagesCount(prev => prev + (messages.length - prevMessagesLengthRef.current));
        }
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, curUsername]);

  const handleScroll = (e) => {
    if (isAutoScrolling.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    
    if (isNearBottom) {
      if (showScrollBottomBtn) {
        setShowScrollBottomBtn(false);
        setNewMessagesCount(0);
      }
    } else {
      if (!showScrollBottomBtn) {
        setShowScrollBottomBtn(true);
      }
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!recipient?.username) return;

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
  }, [curUsername, recipient?.username]);

  useEffect(() => {
    if (recipient) {
      setMessages([]); // Clear previous chat's messages while loading
      fetchMessages();
    }
  }, [fetchMessages, recipient]);

  const handleIncomingMessage = useCallback(
    (message) => {
      const recipientUsername = recipient?.username;
      if (
        recipientUsername === message?.recipientUsername ||
        recipientUsername === message?.senderUsername
      ) {
        setMessages((prevMessages) => {
          if (message.id) {
            const existingIndex = prevMessages.findIndex(m => m.id === message.id);
            if (existingIndex !== -1) {
              return prevMessages.map((msg, index) => {
                if (index === existingIndex) return message;
                if (message.isRecalled && msg.replyToId === message.id) {
                  return { ...msg, replyToContent: 'Tin nhắn đã thu hồi' };
                }
                return msg;
              });
            }
          }
          
          if (message.senderUsername === curUsername) {
            let tempIndex = prevMessages.findIndex(m => m.isTemp && m.tempId === message.tempId);
            if (tempIndex === -1) {
              // Fallback for older messages
              tempIndex = prevMessages.findIndex(m => m.isTemp && m.type === message.type && m.content === message.content);
            }
            if (tempIndex !== -1) {
              const newMessages = [...prevMessages];
              newMessages[tempIndex] = message;
              return newMessages;
            }
          }
          return [...prevMessages, message];
        });
      }
    },
    [recipient?.username, curUsername],
  );

  useEffect(() => {
    let wsService;

    const initializeWebsocket = async () => {
      try {
        wsService = await WebSocketService.getIns();

        wsService.subscribe(
          websocketConstants.messageTopic(curUsername),
          handleIncomingMessage,
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
  }, [curUsername, handleIncomingMessage]);

  const handleDeleteMessage = async (msgId, type) => {
    try {
      await messageService.deleteMessage(msgId, type);
      if (type === 'FOR_ME') {
        setMessages((prev) => 
          prev
            .filter((m) => m.id !== msgId)
            .map((m) => (m.replyToId === msgId ? { ...m, replyToContent: 'Tin nhắn đã bị xóa' } : m))
        );
      } else {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === msgId) return { ...m, isRecalled: true, content: '' };
            if (m.replyToId === msgId) return { ...m, replyToContent: 'Tin nhắn đã thu hồi' };
            return m;
          })
        );
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const sendMessage = async (type = MESSAGE_TYPES.TEXT, content = '') => {
    if (type === MESSAGE_TYPES.TEXT && content.trim() === '' && !selectedImage)
      return;

    if (type === MESSAGE_TYPES.IMAGE && selectedImage) {
      content = await convertToBase64(selectedImage);
      console.log(`image base64 Str: ${content}`);
    }

    const tempId = Date.now().toString();
    
    const message = {
      type,
      content: content,
      tempId,
      senderUsername: curUsername,
      recipientUsername: recipient?.username,
      sendingTime: new Date().toISOString(),
      ...(replyingToMsg ? {
        replyToId: replyingToMsg.id || replyingToMsg.tempId,
        replyToContent: replyingToMsg.type === MESSAGE_TYPES.TEXT ? replyingToMsg.content : (replyingToMsg.type === MESSAGE_TYPES.IMAGE ? 'Hình ảnh' : (replyingToMsg.type === MESSAGE_TYPES.FILE ? 'Tệp đính kèm' : (replyingToMsg.type === MESSAGE_TYPES.LOCATION ? 'Vị trí' : 'Tin nhắn'))),
        replyToType: replyingToMsg.type,
        replyToSender: replyingToMsg.senderUsername,
      } : {})
    };

    const tempMessage = { ...message, isTemp: true, status: 'sending' };

    if (courseData) {
      const course = {
        id: courseData.id,
        title: courseData.title,
        imagePreview: courseData.imagePreview,
        price: courseData.price,
        owner: courseData.owner,
        createdAt: courseData.createdAt,
        updatedAt: courseData.updatedAt,
        status: courseData.status,
        countStudent: courseData.countStudent,
        rating: courseData.rating,
        ratingCount: courseData.ratingCount,
        topic: courseData.topic,
        level: courseData.level,
        categories: courseData.categories,
      };

      const courseInfo = {
        type: MESSAGE_TYPES.COURSE_INFO,
        content: JSON.stringify(course),
        senderUsername: curUsername,
        recipientUsername: recipient?.username,
        sendingTime: new Date().toISOString(),
      };
      const tempCourseId = Date.now().toString() + "_course";
      const tempCourseMessage = { ...courseInfo, isTemp: true, status: 'sending', tempId: tempCourseId };
      setMessages((prev) => [...prev, tempCourseMessage]);

      messageService.send(courseInfo).catch(() => {
        setMessages((prev) => prev.map(m => m.tempId === tempCourseId ? { ...m, status: 'failed' } : m));
      });
      setCourseData(null);
    }

    setMessages((prev) => [...prev, tempMessage]);
    setMessageContent('');
    setSelectedImage(null);
    setImagePreview(null);
    setReplyingToMsg(null);

    try {
      await messageService.send(message);
    } catch (error) {
      setMessages((prev) => prev.map(m => m.tempId === tempId ? { ...m, status: 'failed' } : m));
    }
  };

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
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
      infoToast('Image selected.');
    }
  };

  const handleFileAttachment = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        infoToast("File size must be less than 20MB");
        return;
      }
      const base64Data = await convertToBase64(file);
      const contentObj = {
        fileName: file.name,
        size: file.size,
        base64Data: base64Data
      };
      
      const message = {
        type: MESSAGE_TYPES.FILE,
        content: JSON.stringify(contentObj),
        senderUsername: curUsername,
        recipientUsername: recipient?.username,
        sendingTime: new Date().toISOString(),
      };
      
      const tempId = Date.now().toString();
      const tempMessage = { ...message, isTemp: true, status: 'sending', tempId };
      setMessages((prev) => [...prev, tempMessage]);

      messageService.send(message).then(() => {
        infoToast("Đã gửi tệp đính kèm");
      }).catch(() => {
        setMessages((prev) => prev.map(m => m.tempId === tempId ? { ...m, status: 'failed' } : m));
      });
    }
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      infoToast("Trình duyệt không hỗ trợ chia sẻ vị trí");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const contentObj = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const tempId = Date.now().toString();
        const message = {
          type: MESSAGE_TYPES.LOCATION,
          content: JSON.stringify(contentObj),
          senderUsername: curUsername,
          recipientUsername: recipient?.username,
          sendingTime: new Date().toISOString(),
          tempId: tempId,
        };
        const tempMessage = { ...message, isTemp: true, status: 'sending' };
        setMessages((prev) => [...prev, tempMessage]);

        messageService.send(message).then(() => {
          infoToast("Đã chia sẻ vị trí");
        }).catch(() => {
          setMessages((prev) => prev.map(m => m.tempId === tempId ? { ...m, status: 'failed' } : m));
        });
      },
      () => infoToast("Không thể lấy vị trí của bạn")
    );
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

  const debouncedSetSuggestions = useMemo(
    () =>
      debounce((input) => {
        if (input) {
          setSuggestions(getMessageSuggestions(input));
        } else {
          setSuggestions([]);
        }
      }, 300),
    [],
  );

  const handleInputChange = (e) => {
    const newMessageContent = e.target.value;
    setMessageContent(newMessageContent);
    debouncedSetSuggestions(newMessageContent);
  };

  const handleSuggestionClick = (suggestion) => {
    setMessageContent(suggestion); // Insert suggestion into input
    setSuggestions([]); // Clear suggestions
  };

  const SENSITIVE_WORDS = [
    // English
    'fuck',
    'shit',
    'bitch',
    'asshole',
    'bastard',
    'damn',
    'crap',
    'dumb',
    'stupid',
    'hell',
    'slut',
    'whore',
    'nigger',
    'faggot',
    'cunt',
    'dick',
    'cock',
    'pussy',
    'motherfucker',
    'son of a bitch',
    'bullshit',
    'retard',
    'idiot',
    'moron',

    // Vietnamese
    'cấm',
    'chửi',
    'địt',
    'cặc',
    'lồn',
    'buồi',
    'đụ',
    'chó',
    'mẹ kiếp',
    'con mẹ mày',
    'đĩ',
    'đểu',
    'ngu',
    'đần',
    'dốt',
    'khốn nạn',
    'chó chết',
    'vãi',
    'vl',
    'bố láo',
    'vkl',
    'cc',
    'dm',
    'đm',
    'đjt',
    'dkm',
    'mẹ mày',
    'ngu như bò',
    'ngu như chó',
    'mặt lồn',
  ];

  const filterSensitiveContent = (text) => {
    if (!text || typeof text !== 'string') return text;
    const regex = new RegExp(SENSITIVE_WORDS.join('|'), 'gi');
    return text.replace(regex, '***');
  };

  return (
    <Flex h="100%" direction="column" bg="white" position="relative">
      {/* Header */}
      <HStack
        bg="white"
        p={3}
        borderBottom="1px solid"
        borderColor="gray.100"
        justify="space-between"
        align="center"
        boxShadow="sm"
        zIndex={2}
      >
        <HStack spacing={3}>
          <Box position="relative">
            <Avatar size="sm" name={recipient?.username || 'User'} src={recipient?.avatarPath} />
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
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontSize="md" fontWeight="bold" color="gray.800">
              {recipient?.fullName || recipient?.username}
            </Text>
            <Text fontSize="xs" color="gray.500">
              Active now
            </Text>
          </VStack>
        </HStack>
        <HStack spacing={1}>
          <IconButton icon={<FiPhone />} variant="ghost" color="#0084ff" aria-label="Call" borderRadius="full" onClick={() => infoToast('Tính năng gọi thoại đang được phát triển')} />
          <IconButton icon={<FiVideo />} variant="ghost" color="#0084ff" aria-label="Video Call" borderRadius="full" onClick={() => infoToast('Tính năng gọi video đang được phát triển')} />
          <IconButton icon={<FiInfo />} variant="ghost" color="#0084ff" aria-label="Information" borderRadius="full" onClick={() => infoToast('Tính năng xem thông tin chi tiết đang được phát triển')} />
        </HStack>
      </HStack>

      <Box flex="1" overflowX="hidden" p={4} bg="white" ref={scrollRef} onScroll={handleScroll} sx={overlayScrollbarStyles}>
        <>
          {useMemo(() => messages.map((msg, index) => {
            const prevMsg = messages[index - 1];
            const nextMsg = messages[index + 1];
            const showTimeGap =
              prevMsg &&
              new Date(msg.sendingTime).getTime() - new Date(prevMsg.sendingTime).getTime() >
                24 * 60 * 60 * 1000; // 1 day in milliseconds
            const isLastInGroup = !nextMsg || nextMsg.senderUsername !== msg.senderUsername || (new Date(nextMsg.sendingTime).getTime() - new Date(msg.sendingTime).getTime() > 24 * 60 * 60 * 1000);

            return (
              <React.Fragment key={index}>
                {showTimeGap && (
                  <Text
                    textAlign="center"
                    color="gray.500"
                    my={4}
                    fontSize="sm"
                  >
                    {formatDateTime(msg.sendingTime)}
                  </Text>
                )}

                <HStack
                  id={`message-${msg.id || msg.tempId}`}
                  justify={
                    msg.senderUsername === curUsername
                      ? 'flex-end'
                      : 'flex-start'
                  }
                  align="flex-end"
                  mb={1}
                  role="group"
                  transition="all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  transform={highlightedMsgId === (msg.id || msg.tempId) ? 'scale(1.05)' : 'scale(1)'}
                  zIndex={highlightedMsgId === (msg.id || msg.tempId) ? 10 : 1}
                >
                  {msg.senderUsername === curUsername && !msg.isTemp && (
                    <HStack spacing={1} mb={1} mr={1} opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.2s">
                      <Menu placement="top-end">
                        <MenuButton as={IconButton} icon={<FiMoreVertical />} size="sm" variant="ghost" color="gray.500" aria-label="More options" />
                        <MenuList 
                          minWidth="180px" 
                          boxShadow="0 10px 30px rgba(0,0,0,0.15)" 
                          borderRadius="xl" 
                          border="none" 
                          p={2}
                        >
                          <MenuItem 
                            onClick={() => handleDeleteMessage(msg.id, 'FOR_ME')}
                            icon={<FiTrash2 size={16} />}
                            borderRadius="md"
                            _hover={{ bg: "red.50", color: "red.600" }}
                            color="gray.700"
                            fontSize="sm"
                            fontWeight="medium"
                            transition="all 0.2s"
                          >
                            Xóa ở phía tôi
                          </MenuItem>
                          <MenuItem 
                            onClick={() => handleDeleteMessage(msg.id, 'FOR_ALL')}
                            icon={<FiRotateCcw size={16} />}
                            borderRadius="md"
                            _hover={{ bg: "gray.100", color: "gray.900" }}
                            color="gray.700"
                            fontSize="sm"
                            fontWeight="medium"
                            mt={1}
                            transition="all 0.2s"
                          >
                            Thu hồi tin nhắn
                          </MenuItem>
                        </MenuList>
                      </Menu>
                      <IconButton
                        icon={<FiCornerUpLeft />}
                        size="sm"
                        variant="ghost"
                        color="gray.500"
                        aria-label="Reply"
                        onClick={() => handleReplyClick(msg)}
                      />
                    </HStack>
                  )}
                  {msg.status === 'failed' && msg.senderUsername === curUsername && (
                    <Tooltip label="Gửi thất bại">
                      <Box display="flex" alignItems="center" mb={1} mr={1}>
                        <Icon as={FiAlertCircle} color="red.500" cursor="pointer" />
                      </Box>
                    </Tooltip>
                  )}
                  
                  {msg.status === 'sending' && msg.senderUsername === curUsername && (
                    <Box display="flex" alignItems="center" mb={1} mr={1}>
                      <Spinner size="xs" color="gray.400" />
                    </Box>
                  )}

                  {msg.senderUsername !== curUsername && (
                    <Avatar 
                      size="sm" 
                      name={msg.senderUsername || 'User'} 
                      src={recipient?.avatarPath}
                      mr={2} 
                      visibility={isLastInGroup ? 'visible' : 'hidden'}
                    />
                  )}

                  {msg.type === MESSAGE_TYPES.COURSE_INFO ? (
                    <Box opacity={msg.status === 'sending' ? 0.6 : 1}>
                      <CourseCard courseData={JSON.parse(msg.content)} />
                    </Box>
                  ) : (
                    <Tooltip label={formatDateTime(msg?.sendingTime)} placement={msg.senderUsername === curUsername ? 'left' : 'right'} hasArrow>
                      <Box
                        px={4}
                        py={2}
                        opacity={msg.status === 'sending' ? 0.6 : 1}
                        bg={
                          highlightedMsgId === (msg.id || msg.tempId)
                            ? (msg.senderUsername === curUsername ? '#0056b3' : '#c0c6d1')
                            : msg.senderUsername === curUsername
                            ? '#0084ff'
                            : '#e4e6eb'
                        }
                        color={
                          msg.senderUsername === curUsername
                            ? 'white'
                            : 'black'
                        }
                        boxShadow={
                          highlightedMsgId === (msg.id || msg.tempId) 
                            ? (msg.senderUsername === curUsername ? '0 0 15px rgba(0, 132, 255, 0.6)' : '0 0 15px rgba(192, 198, 209, 0.8)') 
                            : 'none'
                        }
                        transition="all 0.5s ease-out"
                        borderRadius="18px"
                        borderBottomRightRadius={msg.senderUsername === curUsername ? '4px' : '18px'}
                        borderBottomLeftRadius={msg.senderUsername !== curUsername ? '4px' : '18px'}
                        maxWidth="70%"
                      >
                        {msg.replyToId && (
                          <Box 
                            bg="rgba(0,0,0,0.15)" 
                            p={2} 
                            borderRadius="md" 
                            mb={2} 
                            borderLeft="3px solid" 
                            borderColor={msg.senderUsername === curUsername ? "white" : "#0084ff"}
                            cursor="pointer"
                            onClick={() => handleScrollToMessage(msg.replyToId)}
                            _hover={{ bg: "rgba(0,0,0,0.25)" }}
                            transition="background 0.2s"
                          >
                            <Text fontSize="xs" fontWeight="bold" color={msg.senderUsername === curUsername ? "white" : "gray.700"}>
                              {msg.replyToSender === curUsername ? 'Bạn' : msg.replyToSender}
                            </Text>
                            <Text fontSize="xs" noOfLines={1} color={msg.senderUsername === curUsername ? "whiteAlpha.900" : "gray.600"}>
                              {msg.replyToType === MESSAGE_TYPES.TEXT ? filterSensitiveContent(msg.replyToContent) : msg.replyToContent}
                            </Text>
                          </Box>
                        )}
                        {(() => {
                          if (msg.isRecalled) {
                            return <Text fontSize="md" fontStyle="italic" color={msg.senderUsername === curUsername ? "whiteAlpha.800" : "gray.500"}>Tin nhắn đã bị thu hồi</Text>;
                          }
                          if (msg.type === MESSAGE_TYPES.IMAGE && msg.content) {
                            return (
                              <Image
                                src={msg.content}
                                alt="Image"
                                maxH="400px"
                                borderRadius="10px"
                                onClick={() => showPreviewImage(msg.content)}
                                cursor="pointer"
                              />
                            );
                          }
                          if (msg.type === MESSAGE_TYPES.FILE) {
                            let fileObj;
                            try { fileObj = JSON.parse(msg.content); } catch (e) { return <Text>Lỗi hiển thị tệp</Text>; }
                            const fileUrl = fileObj.url || fileObj.base64Data;
                            const sizeInMB = (fileObj.size / (1024 * 1024)).toFixed(2);
                            return (
                              <a href={fileUrl} download={fileObj.fileName} target="_blank" rel="noopener noreferrer">
                                <HStack spacing={2} p={2} bg="rgba(0,0,0,0.05)" borderRadius="md" cursor="pointer" _hover={{ bg: "rgba(0,0,0,0.1)" }}>
                                  <Icon as={FiFileText} boxSize={6} color={msg.senderUsername === curUsername ? "white" : "#0084ff"} />
                                  <VStack align="start" spacing={0}>
                                    <Text fontWeight="bold" noOfLines={1} maxW="200px" color={msg.senderUsername === curUsername ? "white" : "#0084ff"}>{fileObj.fileName}</Text>
                                    <Text fontSize="xs" color={msg.senderUsername === curUsername ? "whiteAlpha.800" : "gray.500"}>{sizeInMB} MB</Text>
                                  </VStack>
                                </HStack>
                              </a>
                            );
                          }
                          if (msg.type === MESSAGE_TYPES.LOCATION) {
                            let locObj;
                            try { locObj = JSON.parse(msg.content); } catch (e) { return <Text>Lỗi hiển thị vị trí</Text>; }
                            return (
                              <Box 
                                w="350px" 
                                h="250px" 
                                borderRadius="md" 
                                overflow="hidden" 
                                position="relative" 
                                boxShadow="sm"
                              >
                                <iframe 
                                  src={`https://maps.google.com/maps?q=${locObj.lat},${locObj.lng}&z=15&output=embed`}
                                  width="100%" 
                                  height="100%" 
                                  style={{ border: 0 }}
                                  allowFullScreen="" 
                                  loading="lazy"
                                />
                                <Box 
                                  position="absolute" 
                                  bottom="10px" 
                                  right="10px" 
                                  bg="blue.500" 
                                  color="white" 
                                  px={3}
                                  py={1.5}
                                  borderRadius="md"
                                  cursor="pointer" 
                                  onClick={() => window.open(`https://www.google.com/maps?q=${locObj.lat},${locObj.lng}`, '_blank')}
                                  fontSize="xs"
                                  fontWeight="semibold"
                                  boxShadow="md"
                                  _hover={{ bg: 'blue.600' }}
                                >
                                  Mở Google Maps
                                </Box>
                              </Box>
                            );
                          }
                          return <Text fontSize="md">{filterSensitiveContent(msg.content)}</Text>;
                        })()}
                      </Box>
                    </Tooltip>
                  )}
                  {msg.senderUsername !== curUsername && !msg.isTemp && (
                    <HStack spacing={1} mb={1} ml={1} opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.2s">
                      <IconButton
                        icon={<FiCornerUpLeft />}
                        size="sm"
                        variant="ghost"
                        color="gray.500"
                        aria-label="Reply"
                        onClick={() => handleReplyClick(msg)}
                      />
                      <Menu placement="top-start">
                        <MenuButton as={IconButton} icon={<FiMoreVertical />} size="sm" variant="ghost" color="gray.500" aria-label="More options" />
                        <MenuList 
                          minWidth="180px" 
                          boxShadow="0 10px 30px rgba(0,0,0,0.15)" 
                          borderRadius="xl" 
                          border="none" 
                          p={2}
                        >
                          <MenuItem 
                            onClick={() => handleDeleteMessage(msg.id, 'FOR_ME')}
                            icon={<FiTrash2 size={16} />}
                            borderRadius="md"
                            _hover={{ bg: "red.50", color: "red.600" }}
                            color="gray.700"
                            fontSize="sm"
                            fontWeight="medium"
                            transition="all 0.2s"
                          >
                            Xóa ở phía tôi
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  )}
                </HStack>
              </React.Fragment>
            );
          }), [messages, curUsername, highlightedMsgId, recipient])}

          {courseData && <CourseCard courseData={courseData} />}
        </>
      </Box>

      {showScrollBottomBtn && (
        <Box position="absolute" bottom="80px" left="50%" zIndex={10} style={{ transform: 'translateX(-50%)' }}>
          <style>{`
            @keyframes subtleBounceBtn {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
            }
          `}</style>
          <Box position="relative" animation="subtleBounceBtn 1.5s infinite ease-in-out">
            <Button
              colorScheme="blue"
              borderRadius="full"
              boxShadow="0 2px 10px rgba(0,0,0,0.2)"
              aria-label="Scroll to bottom"
              onClick={() => {
                scrollToBottom();
                setShowScrollBottomBtn(false);
                setNewMessagesCount(0);
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              w={newMessagesCount > 0 ? 'auto' : '40px'}
              h="40px"
              minW="40px"
              px={newMessagesCount > 0 ? 4 : 0}
              p={newMessagesCount === 0 ? 0 : undefined}
            >
              <FiArrowDown size={20} />
              {newMessagesCount > 0 && (
                <Text fontSize="13px" fontWeight="semibold" ml={2} whiteSpace="nowrap">
                  {newMessagesCount} tin nhắn mới
                </Text>
              )}
            </Button>
          </Box>
        </Box>
      )}

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

      {/* Suggestion Box */}
      {suggestions.length > 0 && (
        <Box
          bg="gray.50"
          borderTop="1px solid"
          borderColor="gray.200"
          px={4}
          py={2}
        >
          <Text mb={2} fontWeight="medium" color="gray.600">
            Quick Replies
          </Text>
          <Flex wrap="wrap" gap={2}>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                leftIcon={<FiSend />}
                onClick={() => handleSuggestionClick(suggestion)}
                _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                colorScheme="blue"
              >
                {suggestion}
              </Button>
            ))}
          </Flex>
        </Box>
      )}

      {/* Reply Preview Box */}
      {replyingToMsg && (
        <Box px={4} py={3} bg="gray.50" borderTop="1px solid" borderColor="gray.200" position="relative">
          <Text fontSize="xs" fontWeight="bold" color="gray.700">
            Đang trả lời {replyingToMsg.senderUsername === curUsername ? 'chính mình' : replyingToMsg.senderUsername}
          </Text>
          <Text fontSize="sm" noOfLines={1} color="gray.600">
            {replyingToMsg.type === MESSAGE_TYPES.TEXT ? filterSensitiveContent(replyingToMsg.content) : 
             (replyingToMsg.type === MESSAGE_TYPES.IMAGE ? 'Hình ảnh' : 
             (replyingToMsg.type === MESSAGE_TYPES.FILE ? 'Tệp đính kèm' : 
             (replyingToMsg.type === MESSAGE_TYPES.LOCATION ? 'Vị trí' : 'Tin nhắn')))}
          </Text>
          <IconButton 
            icon={<Icon as={FiX} />} 
            size="xs" 
            position="absolute" 
            top={2} 
            right={4} 
            variant="ghost" 
            onClick={() => setReplyingToMsg(null)} 
            aria-label="Cancel reply"
          />
        </Box>
      )}

      {/* Input Area */}
      <HStack
        p={3}
        bg="white"
        spacing={2}
        align="flex-end"
      >
        <HStack spacing={1} color="#0084ff">
          <Menu placement="top-start">
            <MenuButton as={IconButton} icon={<FiPlusCircle />} variant="ghost" colorScheme="blue" aria-label="More" borderRadius="full" size="sm" />
            <MenuList>
              <MenuItem onClick={() => infoToast('Tính năng gửi danh thiếp đang được phát triển')}>Gửi danh thiếp</MenuItem>
              <MenuItem onClick={() => infoToast('Tính năng tạo bình chọn đang được phát triển')}>Tạo bình chọn</MenuItem>
            </MenuList>
          </Menu>

          <Popover placement="top-start">
            <PopoverTrigger>
              <IconButton icon={<FiMessageSquare />} variant="ghost" colorScheme="blue" aria-label="Templates" borderRadius="full" size="sm" />
            </PopoverTrigger>
            <PopoverContent width="300px" p={2}>
              <PopoverBody>
                <Tabs size="sm" variant="soft-rounded" colorScheme="blue">
                  <TabList mb={2}>
                    {Object.keys(MESSAGE_TEMPLATES).map(cat => (
                      <Tab key={cat} py={1} px={2}>{cat}</Tab>
                    ))}
                  </TabList>
                  <TabPanels>
                    {Object.entries(MESSAGE_TEMPLATES).map(([cat, templates]) => (
                      <TabPanel key={cat} p={0}>
                        <VStack align="stretch" spacing={2}>
                          {templates.map((tmpl, idx) => (
                            <Button 
                              key={idx} 
                              size="sm" 
                              variant="ghost" 
                              justifyContent="flex-start" 
                              fontWeight="normal"
                              height="auto"
                              py={2}
                              whiteSpace="normal"
                              textAlign="left"
                              onClick={() => {
                                setMessageContent(tmpl);
                              }}
                            >
                              {tmpl}
                            </Button>
                          ))}
                        </VStack>
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Tooltip label="Gửi ảnh">
            <label htmlFor="image-upload">
              <IconButton
                as="span"
                icon={<FiImage />}
                colorScheme="blue"
                variant="ghost"
                borderRadius="full"
                size="sm"
                aria-label="Upload image"
              />
            </label>
          </Tooltip>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="image-upload"
          />

          <Tooltip label="Đính kèm tệp">
            <IconButton
              icon={<FiPaperclip />}
              colorScheme="blue"
              variant="ghost"
              borderRadius="full"
              size="sm"
              aria-label="Attach file"
              onClick={() => document.getElementById('file-attachment')?.click()}
            />
          </Tooltip>
          <input
            type="file"
            id="file-attachment"
            style={{ display: 'none' }}
            onChange={handleFileAttachment}
          />

          <Tooltip label="Chia sẻ vị trí">
            <IconButton
              icon={<FiMapPin />}
              colorScheme="blue"
              variant="ghost"
              borderRadius="full"
              size="sm"
              aria-label="Share location"
              onClick={handleShareLocation}
            />
          </Tooltip>
        </HStack>

        <Flex flex={1} bg="#f0f2f5" borderRadius="20px" align="center" px={3} py={1}>
          <Input
            ref={inputRef}
            disabled={selectedImage}
            placeholder="Aa"
            value={messageContent}
            onChange={handleInputChange}
            onKeyDown={async (e) => {
              if (e.key === 'Enter') {
                setMessageContent(messageContent.trim());
                if (selectedImage) {
                  await sendMessage(MESSAGE_TYPES.IMAGE);
                } else {
                  await sendMessage(MESSAGE_TYPES.TEXT, messageContent);
                }
              } else if (e.key === 'Escape') {
                setReplyingToMsg(null);
              }
            }}
            variant="unstyled"
            bg="transparent"
            px={2}
            py={1}
            autoFocus
          />
          <Popover placement="top-end" onOpen={() => setStickerSearch('')}>
            <PopoverTrigger>
              <IconButton icon={<FiSmile />} variant="ghost" colorScheme="blue" aria-label="Emoji and Stickers" borderRadius="full" size="sm" />
            </PopoverTrigger>
            <PopoverContent width="340px" p={2}>
              <PopoverBody p={1}>
                <Input 
                  size="sm" 
                  placeholder="Tìm kiếm nhãn dán..." 
                  mb={3}
                  value={stickerSearch}
                  onChange={(e) => setStickerSearch(e.target.value)}
                  borderRadius="full"
                  bg="gray.100"
                  border="none"
                  _focus={{ bg: "gray.200" }}
                />
                
                {stickerSearch.trim() !== '' ? (
                  <Box h="220px" overflowY="auto">
                    <SimpleGrid columns={4} spacing={3} p={1}>
                      {Object.values(STICKER_PACKS)
                        .flat()
                        .filter(url => decodeURIComponent(url).toLowerCase().includes(stickerSearch.toLowerCase()))
                        .map((url, idx) => (
                          <Image 
                            key={idx} 
                            src={url} 
                            alt="sticker" 
                            boxSize="65px" 
                            objectFit="contain"
                            cursor="pointer"
                            _hover={{ transform: 'scale(1.1)' }}
                            transition="transform 0.1s"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            onClick={() => {
                              sendMessage(MESSAGE_TYPES.IMAGE, url);
                            }}
                          />
                        ))}
                    </SimpleGrid>
                  </Box>
                ) : (
                  <Tabs size="sm" variant="enclosed" colorScheme="blue" isLazy>
                    <TabList mb={2} overflowX="auto" overflowY="hidden" whiteSpace="nowrap" css={{
                      '&::-webkit-scrollbar': { height: '4px' },
                      '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
                      '&::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: '4px' }
                    }}>
                      <Tab flexShrink={0}>Emoji</Tab>
                      {Object.keys(STICKER_PACKS).map(pack => (
                        <Tab key={pack} flexShrink={0}>{pack}</Tab>
                      ))}
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0} h="220px" overflowY="auto">
                        <SimpleGrid columns={6} spacing={2}>
                          {EMOJIS.map(emoji => (
                            <Button key={emoji} variant="ghost" size="sm" onClick={() => setMessageContent(prev => prev + emoji)}>
                              {emoji}
                            </Button>
                          ))}
                        </SimpleGrid>
                      </TabPanel>
                      {Object.entries(STICKER_PACKS).map(([pack, stickers]) => (
                        <TabPanel key={pack} p={0} h="220px" overflowY="auto">
                          <SimpleGrid columns={4} spacing={3} p={1}>
                            {stickers.map((url, idx) => (
                              <Image 
                                key={idx} 
                                src={url} 
                                alt="sticker" 
                                boxSize="65px" 
                                objectFit="contain"
                                cursor="pointer"
                                _hover={{ transform: 'scale(1.1)' }}
                                transition="transform 0.1s"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                onClick={() => {
                                  sendMessage(MESSAGE_TYPES.IMAGE, url);
                                }}
                              />
                            ))}
                          </SimpleGrid>
                        </TabPanel>
                      ))}
                    </TabPanels>
                  </Tabs>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>

        <IconButton
          icon={<FiSend />}
          variant="ghost"
          color="#0084ff"
          onClick={async () => {
            setMessageContent(messageContent.trim());
            if (selectedImage) {
              await sendMessage(MESSAGE_TYPES.IMAGE);
            } else {
              await sendMessage(MESSAGE_TYPES.TEXT, messageContent);
            }
          }}
          borderRadius="full"
          aria-label="Send message"
        />

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
