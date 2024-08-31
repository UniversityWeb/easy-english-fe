import React, { useEffect } from 'react';
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
  DrawerContent, Skeleton, Stack,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

import styles from '../Drawer.module.scss';

import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import config from '~/config';
import { isLoggedIn, removeLoginResponse } from '~/utils/authUtils';

DrawerRightDefault.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object,
};

DrawerRightDefault.defaultProps = {
  user: {
    username: "john",
    fullName: "john",
    email: "john@gmail.com",
    phoneNumber: "+84972640891",
    bio: "A student.",
    gender: "MALE",
    dob: "2024-08-05T13:47:06.794Z",
    role: "ADMIN",
    createdAt: "2024-08-05T13:47:06.794Z",
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
    <Drawer isOpen={props?.isOpen} placement="right" onClose={props.onClose} size={'sm'}>
      <DrawerOverlay />
      <DrawerContent backgroundColor={'var(--white)'}>
        <DrawerHeader borderBottomWidth="1px">
          <Box display="flex" alignItems="center" gap="4%" justifyContent="start">
            <Avatar size="xl" name={user?.fullName} src={user?.urlImage} />
            {isLoggedIn() ? (
              <Text className={styles.drawer__heading}>{user?.fullName}</Text>
            ) : (
              <Skeleton height='20px' width='100vh' />
            )}
          </Box>
        </DrawerHeader>

        <DrawerBody padding={0}>
          <VStack>
            <div
              onClick={() => {
                navigate(`/home`);
              }}
              className={styles.drawer__item}
              style={{ textDecoration: 'none', border: 'none' }}
            >
              <HomeIcon sx={{ fontSize: 24 }}></HomeIcon>
              <p>Home</p>
            </div>
            <div
              onClick={() => {
                navigate(`/profile`, {
                  state: { tab: 0 },
                });
              }}
              className={styles.drawer__item}
              style={{ textDecoration: 'none', border: 'none' }}
            >
              <PersonIcon sx={{ fontSize: 24 }}></PersonIcon>
              <p>Profile</p>
            </div>

            <div
              onClick={() => {
                handleLogout();
              }}
              className={styles.drawer__item}
              style={{ textDecoration: 'none', border: 'none' }}
            >
              <LogoutIcon sx={{ fontSize: 24 }}></LogoutIcon>
              <p>Logout</p>
            </div>
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
