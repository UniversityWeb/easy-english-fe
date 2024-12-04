import React, { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Image,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Skeleton,
} from '@chakra-ui/react';
import styles from './Drawer.module.scss';
import { useNavigate } from 'react-router-dom';
import {
  MdOutlineAssignment,
  MdOutlineShoppingBag,
  MdNotificationsNone,
  MdLogout,
  MdOutlineShoppingCart,
} from 'react-icons/md';
import { PiCertificate } from 'react-icons/pi';
import {
  IoBarChartOutline,
  IoBookOutline,
  IoChatbubbleEllipsesOutline,
  IoListOutline,
} from 'react-icons/io5';
import config from '~/config';
import { isLoggedIn, removeLoginResponse } from '~/utils/authUtils';
import SidebarItem from '~/components/Drawers/SidebarItem';
import { FaRegStar } from 'react-icons/fa';
import AuthService from '~/services/authService';
import { FaUserEdit } from 'react-icons/fa';

const RightSidebarForAdmin = React.memo((props) => {
  const user = props.user;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      removeLoginResponse();
      navigate(config.routes.login);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer isOpen={props?.isOpen} placement="right" onClose={props.onClose}>
      <DrawerOverlay />
      <DrawerContent
        backgroundColor="var(--white)"
        maxWidth={'230px'}
        width="auto"
      >
        <DrawerHeader borderBottomWidth="1px">
          <Box
            display="flex"
            alignItems="center"
            gap="4%"
            justifyContent="start"
            onClick={() => navigate(config.routes.user_profile_edit)}
            _hover={{
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease',
              backgroundColor: '#f8f8f8',
              cursor: 'pointer',
            }}
          >
            <Avatar size="md" name={user?.fullName} src={user?.avatarPath} />
            {!isLoggedIn() || props?.isUserLoading ? (
              <Skeleton height="20px" width="200px" />
            ) : (
              <Text className={styles.drawer__heading}>{user?.fullName}</Text>
            )}
          </Box>
        </DrawerHeader>

        <DrawerBody padding={0}>
          <VStack ps="10px" align="stretch" padding="8px">
            {/* Management Section */}
            <Box paddingTop="10px" paddingBottom="5px">
              <Text
                fontWeight="bold"
                fontSize="sm"
                color="gray.500"
                paddingLeft="10px"
              >
                Management
              </Text>
            </Box>
            {/* Sidebar Items */}
            <SidebarItem
              icon={IoBookOutline}
              text="Courses"
              handleClick={() =>
                navigate(config.routes.course_management_for_admin)
              }
            />

            <SidebarItem
              icon={IoListOutline}
              text="Categories"
              handleClick={() => navigate(config.routes.category_for_admin)}
            />
            <SidebarItem
              icon={IoBarChartOutline}
              text="Topics And Levels"
              handleClick={() => navigate(config.routes.topic_level_for_admin)}
            />

            <SidebarItem
              icon={FaUserEdit}
              text="Users Management"
              handleClick={() => navigate(config.routes.user_management)}
            />

            {/* Analytics Section */}
            <Box paddingTop="10px" paddingBottom="5px">
              <Text
                fontWeight="bold"
                fontSize="sm"
                color="gray.500"
                paddingLeft="10px"
              >
                Analytics
              </Text>
            </Box>

            <SidebarItem
              icon={IoBarChartOutline}
              text="Courses"
              handleClick={() => navigate(config.routes.analytics_courses)}
            />
            <SidebarItem
              icon={FaRegStar}
              text="Reviews"
              handleClick={() => navigate(config.routes.analytics_reviews)}
            />

            {/* Account Section */}
            <Box paddingTop="10px" paddingBottom="5px">
              <Text
                fontWeight="bold"
                fontSize="sm"
                color="gray.500"
                paddingLeft="10px"
              >
                Account
              </Text>
            </Box>
            <SidebarItem
              icon={MdLogout}
              text="Logout"
              handleClick={handleLogout}
              isLoading={isLoading}
            />
          </VStack>
        </DrawerBody>

        <DrawerFooter padding={0}>
          <VStack>
            <Image width="100%" objectFit="cover" alt="" />
            <Image width="100%" objectFit="cover" alt="" />
          </VStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});

export default RightSidebarForAdmin;
