import { useNavigate } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import React from 'react';

const NavbarWithBackBtn = ({ returnUrl, backBtnTitle }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    // if (returnUrl) {
    //   navigate(returnUrl);
    // } else {
      navigate(-1);
    // }
  };

  return (
    <Flex
      bg="gray.800"
      color="white"
      px="8"
      py="4"
      alignItems="center"
      w="full"
    >
      <Button
        leftIcon={<MdArrowBack />}
        variant="ghost"
        colorScheme="whiteAlpha"
        onClick={handleBackClick}
      >
        {backBtnTitle || 'Back to course'}
      </Button>
    </Flex>
  );
};

export default NavbarWithBackBtn;