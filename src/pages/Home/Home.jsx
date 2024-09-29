import React from 'react';

import './Home.scss';
import Navbar from '~/components/Navbars/HomeNavbar';
import Footer from '~/components/Footer';
import config from '~/config';
import Course from '../Course/Course';
function Home() {
  return (
    <div className="container">
      <Navbar />
      This is my Home page
      <Course />
      <Footer />
    </div>
  );
}

export default Home;
