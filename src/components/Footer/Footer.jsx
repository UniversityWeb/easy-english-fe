import React from 'react';
import { Box, Text, Center } from '@chakra-ui/react';

function Footer() {
  return (
    <Box p={4} bg="var(--secondary-color)">
      <Center flexDirection="column" color="white">
        <Text fontSize="sm" as="i">
          Created by An & Hung
        </Text>
      </Center>
    </Box>
  );
}
export default Footer;
