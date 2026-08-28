import React from 'react';
import { Box } from '@chakra-ui/react';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <Box className="default-layout" minH="100vh" w="100%">
      {children}
    </Box>
  );
}
