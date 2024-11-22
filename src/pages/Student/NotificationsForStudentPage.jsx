import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Stack,
  Spinner,
  Flex,
  Badge,
  Container,
} from '@chakra-ui/react';
import { motion } from 'framer-motion'; // Import motion
import notificationService from '~/services/notificationService';
import useCustomToast from '~/hooks/useCustomToast';
import Footer from '~/components/Footer';
import NavbarForStudent from '~/components/Navbars/NavbarForStudent';
import { getUsername } from '~/utils/authUtils';
import { formatDate } from '~/utils/methods';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import websocketService from '~/services/websocketService';
import { websocketConstants } from '~/utils/websocketConstants';
import StudentPageLayout from '~/components/StudentPageLayout';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

const MotionBox = motion(Box);

const NotificationsForStudentPage = () => {
  const username = getUsername();
  const { successToast, errorToast, infoToast } = useCustomToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    websocketService.disconnect();
    websocketService.connect(() => {
      websocketService.subscribe(websocketConstants.notificationTopic(username), (notification) => {
        console.log(`Received message: ${JSON.stringify(notification)}`);
        setNotifications((prev) => [notification, ...prev]);
        infoToast("You have a new message");
      });
    });

    // Cleanup function to unsubscribe and disconnect WebSocket on unmount
    return () => {
      websocketService.unsubscribe(websocketConstants.notificationTopic(username));
      websocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchNotifications(page).catch((error) => {
      console.error('Error fetching notifications:', error);
    });
  }, [page, username]);

  const fetchNotifications = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await notificationService.getNotificationsByUsername(
        username,
        pageNumber,
        10
      );
      const notifications = response.content;
      console.log(`data: ${notifications}`);
      setNotifications(notifications || []);
      setTotalPages(response?.totalPages || 0);
    } catch (error) {
      console.log(error?.message);
      errorToast('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage((prevPage) => prevPage - 1);
  };

  const handleNotificationClick = async (notificationId, read) => {
    if (!read) {
      try {
        await notificationService.markNotificationAsRead(notificationId);
        successToast('Notification marked as read');
        await fetchNotifications(page);
      } catch (error) {
        console.log(error?.message);
        errorToast('Error marking notification as read');
      }
    }
  };

  return (
    <RoleBasedPageLayout>
      <Container maxW="80%">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={10}>
          Your Notifications
        </Text>

        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <Stack spacing={4} mt={6} px={6}>
            {notifications.length === 0 ? (
              <Text fontSize="xl" color="gray.500" textAlign="center">
                No notifications available.
              </Text>
            ) : (
              notifications.map((notification) => (
                <MotionBox
                  key={notification.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  shadow="md"
                  backgroundColor={notification.read ? 'gray.100' : 'white'}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  cursor="pointer"
                  onClick={() =>
                    handleNotificationClick(notification.id, notification.read)
                  }
                  _hover={{
                    backgroundColor: notification.read ? 'white' : 'blue.50',
                    boxShadow: notification.read ? 'none' : 'lg',
                  }}
                  initial={{ opacity: 0, x: 50 }} // Initial state (invisible, offset)
                  animate={{ opacity: 1, x: 0 }} // Animate to this state (visible, no offset)
                  transition={{ duration: 0.5 }} // Animation duration
                >
                  <Box flex="1">
                    <Text>{notification.message}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {formatDate(notification.createdDate)}
                    </Text>
                  </Box>
                  <Badge
                    ml={2}
                    colorScheme={notification.read ? 'green' : 'red'}
                  >
                    {notification.read ? 'READ' : 'UNREAD'}
                  </Badge>
                </MotionBox>
              ))
            )}
            <Flex justify="center" align="center" mt={6} mb={50} gap={10}>
              <Button
                onClick={handlePreviousPage}
                disabled={page === 0}
                colorScheme={page === 0 ? 'gray' : 'blue'}
                size="md"
                variant="outline"
                leftIcon={page > 0 ? <FaArrowLeft /> : null}
                _hover={{
                  bg: page > 0 ? 'blue.500' : '',
                  color: page > 0 ? 'white' : '',
                }}
              >
                Prev
              </Button>

              <Text fontSize="sm" color="gray.600">
                Page {page + 1} of {totalPages}
              </Text>

              <Button
                onClick={handleNextPage}
                disabled={page === totalPages - 1}
                colorScheme={page === totalPages - 1 ? 'gray' : 'blue'}
                size="md"
                variant="outline"
                rightIcon={page < totalPages - 1 ? <FaArrowRight /> : null}
                _hover={{
                  bg: page < totalPages - 1 ? 'blue.500' : '',
                  color: page < totalPages - 1 ? 'white' : '',
                }}
              >
                Next
              </Button>
            </Flex>
          </Stack>
        )}
      </Container>
    </RoleBasedPageLayout>
  );
};

export default NotificationsForStudentPage;
