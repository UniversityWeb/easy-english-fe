import React, { useState, useEffect } from 'react';
import './Navbar.scss';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import Button from '~/components/Buttons/Button';
import {
  useDisclosure,
  Avatar,
  Spacer,
  Badge,
  Box,
  Flex, Image,
} from '@chakra-ui/react';
import AuthService from '~/services/authService';
import { isLoggedIn } from '~/utils/authUtils';
import useCustomToast from '~/hooks/useCustomToast';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import RightSidebarForStudent from '~/components/Drawers/RightSidebarForStudent';
import { FiShoppingCart } from 'react-icons/fi';
import { Icon } from '@chakra-ui/icons';
import CartService from '~/services/cartService';

function HomeNavbar(props) {
  const navigate = useNavigate();
  const { errorToast } = useCustomToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [countedCartItems, setCountedCartItems] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      setIsUserLoading(true);
      AuthService.getCurUser()
        .then((user) => {
          setUser(user);
        })
        .catch((e) => {
          errorToast(e?.message);
        })
        .finally(() => {
          setIsUserLoading(false);
        });
    };

    fetchUser();

    const fetchCartItems = async () => {
      const count = await CartService.countCartItems();
      setCountedCartItems(count);
    };

    fetchCartItems();
  }, []);

  return (
    <div className="navbar">
      <Image
        src={TransientAppLogo}
        alt="Logo"
        style={{ width: '100px', height: '100px' }}
      />
      <div className="navbar--list">
        <div className="navbar--list__gap20" align="center">
          <Button
            id="courses"
            light
            onClick={() =>
              navigate(config.routes.course_management_for_student)
            }
          >
            Courses
          </Button>
          <Button id="assignment" light onClick={() => navigate('')}>
            Assignments
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
                  src={user?.urlImage}
                />
              </div>
              <RightSidebarForStudent
                user={user}
                isUserLoading={isUserLoading}
                isOpen={isOpen}
                onClose={onClose}
              ></RightSidebarForStudent>
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
}
export default React.memo(HomeNavbar);
