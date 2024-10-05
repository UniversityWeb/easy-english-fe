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
  Badge, Heading,
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
  const [cart, setCart] = useState({
    id: 1,
    totalAmount: 150.75,
    updatedAt: "2024-10-04T02:31:21.787Z",
    username: "john_doe",
    items: [
      {
        id: 1001,
        status: "ACTIVE",
        price: 99.99,
        discountPercent: 10,
        updatedAt: "2024-10-04T02:31:21.787Z",
        courseId: 200,
        cartId: 1
      }
    ]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const cart = await cartService.getCart(username);
      setCart(cart);
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
      await fetchCart();
    } catch (error) {
      console.error(error?.message);
      errorToast('Error removing course from cart');
    }
  };

  const handleCheckout = async () => {
    try {
      // await cartService.checkout(username);
      successToast('Checkout successful!');
      await fetchCart();
    } catch (error) {
      console.error(error?.message);
      errorToast('Error during checkout');
    }
  };

  return (
    <Box>
      <NavbarForStudent />

      <Container maxW="80%" mb="50px">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={10}>
          Your Course Cart
        </Text>

        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <Stack spacing={4} mt={6} px={6}>
            {cart.items.length === 0 ? (
              <Text fontSize="xl" color="gray.500" textAlign="center">
                Your cart is empty.
              </Text>
            ) : (
              cart.items.map((course) => (
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
            {cart.items.length > 0 && (
              <Flex justify="center" align="center" mt={6} mb={50}>
                <Button onClick={handleCheckout} colorScheme="green" size="lg">
                  Checkout
                </Button>
              </Flex>
            )}
          </Stack>
        )}

        <Heading>Total: ${cart?.totalAmount}</Heading>
        <Button
          bg="cyan.600"
          color="white"
          loadingText="Loading"
          width="full"
          size="lg"
          borderRadius="xl"
          p={6}
          disabled={true}
          onClick={handleCheckout()}
        >
          Checkout
        </Button>
      </Container>

      <Footer />
    </Box>
  );
};

export default Cart;
