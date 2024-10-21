import React from 'react';
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
import PropTypes from 'prop-types';

import styles from './Drawer.module.scss';

import { useNavigate } from 'react-router-dom';
import {
  MdOutlineAssignment,
  MdOutlineShoppingBag,
  MdNotificationsNone,
  MdLogout,
  MdOutlineShoppingCart
} from 'react-icons/md';
import { PiCertificate } from "react-icons/pi";
import { IoBookOutline } from "react-icons/io5";
import config from '~/config';
import { isLoggedIn, removeLoginResponse } from '~/utils/authUtils';
import SidebarItem from '~/components/Drawers/SidebarItem';

DrawerRightDefault.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object,
  isUserLoading: PropTypes.bool,
};

DrawerRightDefault.defaultProps = {
  user: {
    username: 'john',
    fullName: 'john',
    email: 'john@gmail.com',
    phoneNumber: '+84972640891',
    bio: 'A student.',
    gender: 'MALE',
    dob: '2024-08-05',
    role: 'ADMIN',
    createdAt: '2024-08-05T13:47:06.794Z',
    avatarSrc: '',
  },
};

function DrawerRightDefault(props) {
  const user = props.user;
  const navigate = useNavigate();

  const handleLogout = () => {
    removeLoginResponse();
    navigate(config.routes.login);
  };

  return (
    <Drawer
      isOpen={props?.isOpen}
      placement="right"
      onClose={props.onClose}
      size={'sm'}
    >
      <DrawerOverlay />
      <DrawerContent backgroundColor={'var(--white)'}>
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
            <Avatar size="md" name={user?.fullName} src={user?.urlImage} />
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
              handleClick={() => navigate(config.routes.course_management_for_student)}
            />

            <SidebarItem
              icon={MdOutlineAssignment}
              text="My Assignments"
              handleClick={() => navigate('')}
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
              icon={PiCertificate}
              text="My Certificates"
              handleClick={() => navigate('')}
            />

            <SidebarItem
              icon={MdNotificationsNone}
              text="Notifications"
              handleClick={() => navigate(config.routes.notifications_for_student)}
            />

            <SidebarItem
              icon={MdLogout}
              text="Logout"
              handleClick={handleLogout}
            />>
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

export default DrawerRightDefault;
