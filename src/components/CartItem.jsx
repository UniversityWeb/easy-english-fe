import React from 'react';
import { Box, Text, Badge, Flex, IconButton } from '@chakra-ui/react';
import { FaTrashAlt } from 'react-icons/fa';

const CartItem = ({ cartItem, handleRemoveFromCart }) => {
  return (
    <Box
      key={cartItem.id}
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      shadow="md"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="white"
    >
      <Box flex="1">
        <Text fontSize="lg" fontWeight="bold">
          {cartItem?.course?.title}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {cartItem?.course?.description}
        </Text>
        <Text mt={2} fontSize="sm">
          Teacher: {cartItem?.course?.createdBy}
        </Text>
      </Box>
      <Flex alignItems="center">
        <Text fontSize="lg" mr={4} p={1}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartItem?.price)}
        </Text>
        <IconButton
          aria-label="Remove course"
          icon={<FaTrashAlt />}
          colorScheme="red"
          onClick={() => handleRemoveFromCart(cartItem?.id)}
        />
      </Flex>
    </Box>
  );
};

export default CartItem;