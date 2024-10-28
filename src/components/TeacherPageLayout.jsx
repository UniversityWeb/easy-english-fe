import React from 'react';
import { Flex } from '@chakra-ui/react';
import NavbarForTeacher from '~/components/Navbars/NavbarForTeacher';
import Footer from '~/components/Footer';

const TeacherPageLayout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <NavbarForTeacher />

      <Flex direction="column" flex="1">
        {children}
      </Flex>

      <Footer />
    </Flex>
  );
};

export default TeacherPageLayout;
