import React from 'react';
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
import { MdDashboard, MdLogout, MdAdd, MdAnnouncement, MdGrade, MdAssignment, MdAttachMoney } from 'react-icons/md';
import { BsLayers } from 'react-icons/bs';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { isLoggedIn, removeLoginResponse } from '~/utils/authUtils';
import SidebarItem from '~/components/Drawers/SidebarItem';

const menuItems = [
  { label: 'Dashboard', icon: MdDashboard, route: '' },
  { label: 'Add Course', icon: MdAdd, route: config.routes.course_management_for_teacher },
  { label: 'Announcement', icon: MdAnnouncement, route: '' },
  { label: 'Gradebook', icon: MdGrade, route: '' },
  { label: 'Assignments', icon: MdAssignment, route: '' },
  { label: 'Payout', icon: MdAttachMoney, route: '' },
  { label: 'Bundles', icon: BsLayers, route: '' },
];

function DrawerRightDefault({ isOpen, onClose, user, isUserLoading }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeLoginResponse();
    navigate(config.routes.login);
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent backgroundColor="white">
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
            <Avatar size="md" name={user?.fullName} src={user?.avatarSrc} />
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

DrawerRightDefault.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object,
  isUserLoading: PropTypes.bool,
};

DrawerRightDefault.defaultProps = {
  user: {
    fullName: 'John Doe',
    avatarSrc: '',
  },
};

export default DrawerRightDefault;
