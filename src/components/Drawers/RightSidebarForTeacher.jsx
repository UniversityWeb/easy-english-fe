import React, { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Avatar,
  Skeleton, Image,
} from '@chakra-ui/react';
import { MdDashboard, MdLogout, MdAdd, MdAnnouncement, MdChat } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { isLoggedIn, removeLoginResponse } from '~/utils/authUtils';
import SidebarItem from '~/components/Drawers/SidebarItem';
import AuthService from '~/services/authService';

const menuItems = [
  { label: 'Dashboard', icon: MdDashboard, route: config.routes.course_management_for_teacher },
  { label: 'Add Course', icon: MdAdd, route: config.routes.maincourse },
  { label: 'Chat', icon: MdChat, route: config.routes.chat },
];

function RightSidebarForTeacher({ isOpen, onClose, user, isUserLoading }) {
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
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent
        backgroundColor="white"
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
            <Avatar
              size="md"
              cursor="pointer"
              name={user?.fullName}
              src={user?.avatarPath}
            />
            {!isLoggedIn() || isUserLoading ? (
              <Skeleton height="20px" width="100%" />
            ) : (
              <Text fontSize="lg">{user?.fullName}</Text>
            )}
          </Box>
        </DrawerHeader>

        <DrawerBody padding={0}>
          <VStack ps="10px">
            {menuItems.map((item, index) => (
              <SidebarItem
                icon={item.icon}
                  text={item.label}
                  handleClick={() => navigate(item.route)}
                />
            ))}

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

export default React.memo(RightSidebarForTeacher);
