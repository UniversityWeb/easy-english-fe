import React, { useState, useEffect } from 'react';
import './Navbar.scss';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import Button from '~/components/Buttons/Button';
import {
  useDisclosure,
  Avatar,
  Spacer,
  Image,
  Badge,
  Box,
} from '@chakra-ui/react';
import AuthService from '~/services/authService';
import { isLoggedIn } from '~/utils/authUtils';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import RightSidebarForStudent from '~/components/Drawers/RightSidebarForStudent';
import RightSidebarForAdmin from '~/components/Drawers/RightSidebarForAdmin';
import { FiShoppingCart, FiBell } from 'react-icons/fi';
import { Icon } from '@chakra-ui/icons';

const NavbarForAdmin = React.memo((props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.getCurUser();
        setUser(user);
      } catch (e) {
        console.log(e?.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="navbar">
      <Image
        src={TransientAppLogo}
        alt="Logo"
        style={{ width: '100px', height: '100px' }}
        ms={5}
      />
      <div className="navbar--list">
        <div className="navbar--list__gap20" align="center">
          <Button
            id="courses"
            light
            onClick={() => navigate(config.routes.search)}
          >
            Search
          </Button>

          <Spacer />
          <Box display="flex" alignItems="center" gap={4}>
            {/* Notification Icon */}
            <Box
              position="relative"
              cursor="pointer"
              onClick={() => navigate(config.routes.notifications)}
              _hover={{
                transform: 'scale(1.1)',
                transition: '0.2s ease-in-out',
              }}
            >
              <Icon as={FiBell} boxSize={6} />
              {notificationCount > 0 && (
                <Badge
                  position="absolute"
                  top="-4"
                  right="-4"
                  colorScheme="red"
                  borderRadius="full"
                  px={2}
                >
                  {notificationCount}
                </Badge>
              )}
            </Box>
          </Box>
          <Spacer />
          {isLoggedIn() ? (
            <>
              <div className="navbar__group">
                <Avatar
                  size="md"
                  cursor="pointer"
                  name={user?.fullName}
                  onClick={onOpen}
                  src={user?.avatarPath}
                />
              </div>
              <RightSidebarForAdmin
                user={user}
                isUserLoading={user === null || user === undefined}
                isOpen={isOpen}
                onClose={onClose}
              />
            </>
          ) : (
            <Button
              id="login"
              light
              onClick={() => navigate(config.routes.login)}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

export default NavbarForAdmin;
