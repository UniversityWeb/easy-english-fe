import React, { useState, useEffect, useContext } from 'react';
import './Navbar.scss';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import Button from '~/components/Buttons/Button';
import {
  useDisclosure,
  Avatar,
  Spacer,
  Badge,
  Box,
  Image,
} from '@chakra-ui/react';
import AuthService from '~/services/authService';
import { getUsername, isLoggedIn } from '~/utils/authUtils';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import RightSidebarForStudent from '~/components/Drawers/RightSidebarForStudent';
import { FiShoppingCart } from 'react-icons/fi';
import { Icon } from '@chakra-ui/icons';
import CartService from '~/services/cartService';
import { websocketConstants } from '~/utils/websocketConstants';
import WebSocketService from '~/services/websocketService';

const NavbarForStudent = React.memo((props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [countedCartItems, setCountedCartItems] = useState(0);

  const fetchUser = async () => {
    try {
      const user = await AuthService.getCurUser();
      setUser(user);
    } catch (e) {
      console.log(e?.message);
    }
  };

  useEffect(() => {
    const username = getUsername();
    let wsService;

    const initializeWebsocket = async () => {
      try {
        wsService = await WebSocketService.getIns();

        wsService.subscribe(websocketConstants.cartItemCountTopic(username), async (notification) => {
          await fetchCartItems();
        });
      } catch (error) {
        console.error('WebSocket initialization failed:', error);
      }
    }

    initializeWebsocket();

    fetchUser();
    fetchCartItems();

    return () => {
      if (wsService) {
        wsService.unsubscribe(websocketConstants.cartItemCountTopic(username));
        wsService.disconnect();
      }
    }
  }, []);

  const fetchCartItems = async () => {
    const count = await CartService.countCartItems();
    setCountedCartItems(count);
  };

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
            onClick={() =>
              navigate(config.routes.search)
            }
          >
            Courses
          </Button>

          <Box
            position="relative"
            cursor="pointer"
            onClick={() => navigate(config.routes.cart)}
            _hover={{ transform: 'scale(1.1)', transition: '0.2s ease-in-out' }}
          >
            <Icon as={FiShoppingCart} boxSize={6} />
            {countedCartItems > 0 && (
              <Badge
                position="absolute"
                top="-4"
                right="-4"
                colorScheme="red"
                borderRadius="full"
                px={2}
              >
                {countedCartItems}
              </Badge>
            )}
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
              <RightSidebarForStudent
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

export default NavbarForStudent;
