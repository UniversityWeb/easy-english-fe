import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Stack,
  Spinner,
  Flex,
  Container,
  Heading,
} from '@chakra-ui/react';
import useCustomToast from '~/hooks/useCustomToast';
import NavbarForStudent from '~/components/Navbars/NavbarForStudent';
import Footer from '~/components/Footer';
import { getUsername } from '~/utils/authUtils';
import cartService from '~/services/cartService';
import CartItem from '~/components/CartItem';
import paymentService from '~/services/paymentService';
import config from '~/config';
import StudentPageLayout from '~/components/StudentPageLayout';

const Cart = () => {
  const username = getUsername();
  const { successToast, errorToast } = useCustomToast();
  const [cart, setCart] = useState({
    id: 1,
    totalAmount: 150.75,
    updatedAt: '2024-10-04T02:31:21.787Z',
    username: 'john_doe',
    items: [
      {
        id: 1001,
        status: 'ACTIVE',
        price: 99.99,
        discountPercent: 10,
        updatedAt: '2024-10-04T02:31:21.787Z',
        courseId: 200,
        cartId: 1,
      },
    ],
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
      await cartService.removeItemFromCart(courseId);
      successToast('Course removed from cart');
      await fetchCart();
    } catch (error) {
      console.error(error?.message);
      errorToast('Error removing course from cart');
    }
  };

  const handleCheckout = async () => {
    try {
      const urlReturn = `${window.location.protocol}//${window.location.host}${config.routes.payment_result}`;
      const paymentRequest = {
        username: username,
        method: 'VN_PAY',
        urlReturn: urlReturn,
      };

      const paymentResponse =
        await paymentService.createPaymentOrder(paymentRequest);
      successToast('Checkout successful! Redirecting to payment...');
      window.location.href = paymentResponse?.paymentUrl;
    } catch (error) {
      console.error(error?.message);
      errorToast('Error during checkout. Please try again.');
    }
  };

  return (
    <StudentPageLayout>
      <Container maxW="80%" mb="50px">
        <Heading fontSize="3xl" fontWeight="bold" textAlign="start" mt={10}>
          Course Cart
        </Heading>

        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <Stack spacing={4} mt={6} px={6}>
            {cart.items === null || cart.items.length === 0 ? (
              <Text fontSize="xl" color="gray.500" textAlign="center">
                Your cart is empty.
              </Text>
            ) : (
              cart.items.map((cartItem) => (
                <CartItem
                  key={cartItem.id}
                  cartItem={cartItem}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              ))
            )}
          </Stack>
        )}

        <Heading fontSize="2xl" mt="50px">
          Total:{' '}
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(cart?.totalAmount)}
        </Heading>
        <Button
          bg="cyan.600"
          color="white"
          loadingText="Loading"
          width="full"
          size="lg"
          borderRadius="xl"
          p={6}
          disabled={true}
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </Container>
    </StudentPageLayout>
  );
};

export default Cart;
