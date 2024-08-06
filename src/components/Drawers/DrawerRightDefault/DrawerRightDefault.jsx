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
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

import styles from '../Drawer.module.scss';

import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SourceIcon from '@mui/icons-material/Source';
import ForumIcon from '@mui/icons-material/Forum';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

DrawerRightDefault.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object,
};

DrawerRightDefault.defaultProps = {
  user: {
    username: '',
    fullName: 'User',
    phoneNumber: '',
    dateOfBirth: '',
    email: '',
    avatarSrc: '',
  },
};

function DrawerRightDefault(props) {
  const user = props.user;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('data');
    navigate('/sign-in');
  };

  return (
    <Drawer isOpen={props.isOpen} placement="right" onClose={props.onClose} size={'sm'}>
      <DrawerOverlay />
      <DrawerContent backgroundColor={'var(--white)'}>
        <DrawerHeader borderBottomWidth="1px">
          <Box display="flex" alignItems="center" gap="4%" justifyContent="start">
            <Avatar size="xl" name={user.fullName} src={user.urlImage} />
            <Text className={styles.drawer__heading}>{user.fullName}</Text>
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
                navigate(`/problems`);
              }}
              className={styles.drawer__item}
              style={{ textDecoration: 'none', border: 'none' }}
            >
              <SourceIcon sx={{ fontSize: 24 }}></SourceIcon>
              <p>Problems</p>
            </div>
            <div
              onClick={() => {
                navigate(`/profile`, {
                  state: { tab: 1 },
                });
              }}
              className={styles.drawer__item}
              style={{ textDecoration: 'none', border: 'none' }}
            >
              <IntegrationInstructionsIcon sx={{ fontSize: 24 }}></IntegrationInstructionsIcon>
              <p>Your Problems</p>
            </div>

            <div
              onClick={() => {
                navigate(`/contests-management`);
              }}
              className={styles.drawer__item}
              style={{ textDecoration: 'none', border: 'none' }}
            >
              <EmojiEventsIcon sx={{ fontSize: 24 }}></EmojiEventsIcon>
              <p>Contests Management</p>
            </div>
            <div
              onClick={() => {
                navigate(`/discuss`);
              }}
              className={styles.drawer__item}
              style={{ textDecoration: 'none', border: 'none' }}
            >
              <ForumIcon sx={{ fontSize: 24 }}></ForumIcon>
              <p>Discuss</p>
            </div>
            <div
              onClick={() => {
                navigate(`/user/${user?.id}/posts`);
              }}
              className={styles.drawer__item}
              style={{ textDecoration: 'none', border: 'none' }}
            >
              <ForumIcon sx={{ fontSize: 24 }}></ForumIcon>
              <p>Your Discuss</p>
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
