import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import './Home.scss';
import Navbar from '~/components/Navbars/HomeNavbar';
import Footer from '~/components/Footer';
import config from '~/config';

function Home() {
  const navigate = useNavigate();
  const handleSelectBtn = useCallback((id) => {
    switch (id) {
      case 'login':
        navigate(config.routes.login);
        break;
      default:
        console.error('Action is invalid');
    }
  }, []);

  return (
    <div className="container">
      <Navbar onSelectBtn={handleSelectBtn}></Navbar>
      This is my Home page
      <Footer />
    </div>
  );
}

export default Home;
