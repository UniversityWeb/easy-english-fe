import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Stack,
  Spinner,
  Flex,
  Container,
  IconButton,
  useToast,
  Badge,
} from '@chakra-ui/react';
import { FaTrashAlt } from 'react-icons/fa';
import useCustomToast from '~/hooks/useCustomToast';
import NavbarForStudent from '~/components/Navbars/NavbarForStudent';
import Footer from '~/components/Footer';
import { getUsername } from '~/utils/authUtils';
import cartService from '~/services/cartService';

const Cart = () => {
  const username = getUsername();
  const { successToast, errorToast } = useCustomToast();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCartItems(username);
      setCartItems(response);
    } catch (error) {
      console.error(error?.message);
      errorToast('Error fetching courses in the cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (courseId) => {
    try {
      await cartService.removeItemFromCart(username, courseId);
      successToast('Course removed from cart');
      await fetchCartItems();
    } catch (error) {
      console.error(error?.message);
      errorToast('Error removing course from cart');
    }
  };

  const handleCheckout = async () => {
    try {
      await cartService.checkout(username);
      successToast('Checkout successful!');
      await fetchCartItems();
    } catch (error) {
      console.error(error?.message);
      errorToast('Error during checkout');
    }
  };

  return (
    <Box>
      <NavbarForStudent />

      <Container maxW="80%">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={10}>
          Your Course Cart
        </Text>

        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <Stack spacing={4} mt={6} px={6}>
            {cartItems.length === 0 ? (
              <Text fontSize="xl" color="gray.500" textAlign="center">
                Your cart is empty.
              </Text>
            ) : (
              cartItems.map((course) => (
                <Box
                  key={course.id}
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
                      {course.title}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {course.description}
                    </Text>
                    <Text mt={2} fontSize="sm">
                      Instructor: {course.instructor.name}
                    </Text>
                  </Box>
                  <Flex alignItems="center">
                    <Badge colorScheme="blue" fontSize="lg" mr={4}>
                      ${course.price}
                    </Badge>
                    <IconButton
                      aria-label="Remove course"
                      icon={<FaTrashAlt />}
                      colorScheme="red"
                      onClick={() => handleRemoveFromCart(course.id)}
                    />
                  </Flex>
                </Box>
              ))
            )}
            {cartItems.length > 0 && (
              <Flex justify="center" align="center" mt={6} mb={50}>
                <Button onClick={handleCheckout} colorScheme="green" size="lg">
                  Checkout
                </Button>
              </Flex>
            )}
          </Stack>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default Cart;
