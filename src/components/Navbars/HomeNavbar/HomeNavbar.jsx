import React, { useState, useEffect } from 'react';
import '../Navbar.scss';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import Button from '~/components/Buttons/Button';
import { useDisclosure, Avatar } from '@chakra-ui/react';
import DrawerRightDefault from '~/components/Drawers/DrawerRightDefault';
import AuthService from '~/services/authService';
import { isLoggedIn } from '~/utils/authUtils';
import useCustomToast from '~/hooks/useCustomToast';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

function HomeNavbar(props) {
  const navigate = useNavigate();
  const { errorToast } = useCustomToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsUserLoading(true);
      AuthService.getCurUser()
        .then(user => {
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
      <img className="navbar--logo" src={TransientAppLogo} alt="Logo" style={{ width: '100px', height: '100px' }} />
      <div className="navbar--list">
        <div className="navbar--list__gap20">
          <Button id="course" light onClick={() => navigate(config.routes.course)}>
            Course
          </Button>
          {isLoggedIn() ? (
            <>
              <div className="navbar__group">
                <Avatar size="lg" cursor="pointer" name={user?.fullName} onClick={onOpen} src={user?.urlImage} />
              </div>
              <DrawerRightDefault user={user} isUserLoading={isUserLoading} isOpen={isOpen} onClose={onClose}></DrawerRightDefault>
            </>
          ) : (
            <Button id="login" light onClick={() => navigate(config.routes.login)}>
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
export default React.memo(HomeNavbar);
