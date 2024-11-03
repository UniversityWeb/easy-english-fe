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
import useCustomToast from '~/hooks/useCustomToast';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import RightSidebarForTeacher from '~/components/Drawers/RightSidebarForTeacher';

const NavbarForTeacher = React.memo((props) => {
  const navigate = useNavigate();
  const { errorToast } = useCustomToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

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
            id="dashboard"
            light
            onClick={() => navigate('')}
          >
            Dashboard
          </Button>
          <Button
            id="add-course"
            light
            onClick={() => navigate(config.routes.course_management_for_teacher)}
          >
            Add Course
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
                  src={user?.urlImage}
                />
              </div>
              <RightSidebarForTeacher
                user={user}
                isUserLoading={isUserLoading}
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
})

export default NavbarForTeacher;
