import React from 'react';
import { Flex } from '@chakra-ui/react';
import Footer from '~/components/Footer';
import RoleBasedNavbar from '~/components/Navbars/RoleBasedNavbar';

const RoleBasedPageLayout = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <RoleBasedNavbar />

      <Flex direction="column" flex="1">
        {children}
      </Flex>

      <Footer />
    </Flex>
  );
};

export default RoleBasedPageLayout;
