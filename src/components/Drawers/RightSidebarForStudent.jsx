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
  MdOutlineShoppingBag,
  MdNotificationsNone,
  MdLogout,
  MdOutlineShoppingCart,
} from 'react-icons/md';
import { IoChatboxOutline } from "react-icons/io5";
import { IoBookOutline } from "react-icons/io5";
import config from '~/config';
import { isLoggedIn, removeLoginResponse } from '~/utils/authUtils';
import SidebarItem from '~/components/Drawers/SidebarItem';
import { FaRegStar } from 'react-icons/fa';
import AuthService from '~/services/authService';

const RightSidebarForStudent = (props) => {
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
    <Drawer
      isOpen={props?.isOpen}
      placement="right"
      onClose={props.onClose}
      size={'sm'}
    >
      <DrawerOverlay />
      <DrawerContent
        backgroundColor={'var(--white)'}
        maxWidth={"230px"}
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
              <Skeleton height="20px" width="100vh" />
            ) : (
              <Text className={styles.drawer__heading}>{user?.fullName}</Text>
            )}
          </Box>
        </DrawerHeader>

        <DrawerBody padding={0}>
          <VStack ps="10px">
            <SidebarItem
              icon={IoBookOutline}
              text="Enrolled Courses"
              handleClick={() => navigate(config.routes.enroll_course)}
            />

            <SidebarItem
              icon={MdOutlineShoppingCart}
              text="My Cart"
              handleClick={() => navigate(config.routes.cart)}
            />

            <SidebarItem
              icon={MdOutlineShoppingBag}
              text="My Orders"
              handleClick={() => navigate(config.routes.orders)}
            />

            <SidebarItem
              icon={FaRegStar}
              text="Wishlist"
              handleClick={() => navigate(config.routes.favourite)}
            />

            <SidebarItem
              icon={IoChatboxOutline}
              text="Chat"
              handleClick={() => navigate(config.routes.chat)}
            />

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
            <Image width={'100%'} objectFit="cover" alt="" />
            <Image width={'100%'} objectFit="cover" alt="" />
          </VStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default RightSidebarForStudent;
