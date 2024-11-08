import React, { useState, useEffect } from 'react';
import './Navbar.scss';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import Button from '~/components/Buttons/Button';
import {
  useDisclosure,
  Avatar,
  Spacer,
  Image,
} from '@chakra-ui/react';
import AuthService from '~/services/authService';
import { isLoggedIn } from '~/utils/authUtils';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import RightSidebarForStudent from '~/components/Drawers/RightSidebarForStudent';
import RightSidebarForAdmin from '~/components/Drawers/RightSidebarForAdmin';

const NavbarForAdmin = React.memo((props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            Search
          </Button>

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
