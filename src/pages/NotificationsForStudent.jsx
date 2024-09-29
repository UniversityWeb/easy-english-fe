import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Stack,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import notificationService from '~/services/notificationService';
import useCustomToast from '~/hooks/useCustomToast';
import HomeNavbar from '~/components/Navbars/HomeNavbar';
import Footer from '~/components/Footer';
import NavbarForStudent from '~/components/Navbars/NavbarForStudent';

const NotificationsForStudent = ({ username }) => {
  const { successToast, errorToast, warningToast } = useCustomToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchNotifications();
  }, [username]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotificationsByUsername(username);
      setNotifications(response.data.content);
    } catch (error) {
      toast({
        title: 'Error fetching notifications',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      toast({
        title: 'Notification marked as read',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchNotifications(); // Refresh notifications after marking as read
    } catch (error) {
      toast({
        title: 'Error marking notification as read',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <NavbarForStudent />

      <Text fontSize="2xl" fontWeight="bold">Your Notifications</Text>
      {loading ? (
        <Spinner />
      ) : (
        <Stack spacing={4}>
          {notifications.map((notification) => (
            <Box
              key={notification.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              backgroundColor={notification.read ? 'gray.100' : 'white'}
            >
              <Text>{notification.message}</Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(notification.createdAt).toLocaleString()}
              </Text>
              {!notification.read && (
                <Button
                  mt={2}
                  colorScheme="blue"
                  size="sm"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  Mark as Read
                </Button>
              )}
            </Box>
          ))}
        </Stack>
      )}

      <Footer/>
    </Box>
  );
};

export default NotificationsForStudent;
