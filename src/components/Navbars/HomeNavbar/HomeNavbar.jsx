import React, { useState, useEffect } from 'react';
import '../Navbar.scss';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import Button from '~/components/Buttons/Button';
import { useDisclosure, Avatar, Text } from '@chakra-ui/react';
import DrawerRightDefault from '~/components/Drawers/DrawerRightDefault';
import AuthService from '~/services/AuthService';
import { isLoggedIn } from '~/utils/authUtils';

function HomeNavbar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurUser();
    setUser(user);
    debugger
  }, []);

  return (
    <div className="navbar">
      <img className="navbar--logo" src={TransientAppLogo} alt="Logo" style={{ width: '100px', height: '100px' }} />
      <div className="navbar--list">
        <div className="navbar--list__gap20">
          <Button id="course" light onClick={props.onSelectBtn}>
            Course
          </Button>
          {isLoggedIn() ? (
            <>
              <div className="navbar__group">
                <Avatar size="lg" cursor="pointer" name={user?.fullName} onClick={onOpen} src={user?.urlImage} />
              </div>
              <DrawerRightDefault user={user} isOpen={isOpen} onClose={onClose}></DrawerRightDefault>
            </>
          ) : (
            <Button id="login" light onClick={props.onSelectBtn}>
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
export default React.memo(HomeNavbar);
