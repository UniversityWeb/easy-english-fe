import React from 'react';

import './Home.scss';
import Navbar from '~/components/Navbars/HomeNavbar';
import Footer from '~/components/Footer';
import config from '~/config';
function Home() {
  return (
    <div className="container">
      <Navbar />
      This is my Home page
      <Footer />
    </div>
  );
}

export default Home;
