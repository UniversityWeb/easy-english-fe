import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Heading,
  Badge,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import useCustomToast from "~/hooks/useCustomToast";
import cartService from "~/services/cartService";
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import { formatVNDMoney } from '~/utils/methods';
import paymentService from '~/services/paymentService';
import { getUsername } from '~/utils/authUtils';
import config from '~/config';

const CartPage = () => {
  const { successToast, errorToast } = useCustomToast();
  const [cart, setCart] = useState(null); // Initialize as null to handle loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart(); // Assume `username` is handled internally
      setCart(data);
    } catch (error) {
      console.error(error.message);
      errorToast("Failed to fetch cart data.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (courseId) => {
    try {
      await cartService.removeItemFromCart(courseId);
      successToast("Course removed from cart.");
      fetchCart(); // Refresh cart data
    } catch (error) {
      console.error(error.message);
      errorToast("Error removing course from cart.");
    }
  };

  const handleCheckout = async () => {
    const username = getUsername();
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

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  const calculateDiscountedPrice = (price, discountPercent) => {
    return price - (price * discountPercent) / 100;
  };

  return (
    <RoleBasedPageLayout>
      <Box p={8} maxW="1200px" mx="auto">
        {!cart || cart.items.length === 0 ? (
          <Box p={8} maxW="1200px" mx="auto" textAlign="center">
            <Heading size="lg" mb={4}>
              Your Cart is Empty
            </Heading>
            <Text fontSize="lg" color="gray.500">
              Add some courses to your cart to get started!
            </Text>
          </Box>
        ) : (
          <>
            <Heading size="lg" mb={6}>
              Shopping Cart
            </Heading>

            <Flex>
              {/* Left Side - Course Cards */}
              <Box flex="1" pr={8}>
                <Text fontSize="lg" mb={4}>
                  {cart.items.length} {cart.items.length > 1 ? "Courses" : "Course"} in
                  Cart
                </Text>

                {cart.items.map((item) => {
                  const {
                    id,
                    course: {
                      title,
                      ownerUsername,
                      imagePreview,
                      duration,
                      countStudent,
                      rating,
                      ratingCount,
                      price: { price, salePrice },
                    },
                    discountPercent,
                  } = item;

                  const discountedPrice = calculateDiscountedPrice(price, discountPercent);

                  return (
                    <Box key={id} borderWidth="1px" borderRadius="md" p={4} mb={4}>
                      <Flex align="center" mb={4}>
                        <Image
                          src={imagePreview || "https://via.placeholder.com/150"}
                          alt={title}
                          boxSize="100px"
                          objectFit="cover"
                          borderRadius="md"
                          mr={4}
                        />
                        <Box>
                          <Text fontWeight="bold" fontSize="lg">
                            {title}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            By {ownerUsername}
                          </Text>
                          <Badge colorScheme="green" mt={2} visibility={countStudent || countStudent === 0}>
                            {countStudent} Students
                          </Badge>
                          <Text mt={1}>
                            <strong>{rating.toFixed(1)}</strong> ⭐️ ({ratingCount}{" "}
                            ratings)
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {duration} total hours
                          </Text>
                        </Box>
                        <Box ml="auto" textAlign="right">
                          <Text color="purple.600" fontWeight="bold" fontSize="lg">
                            đ{discountedPrice.toLocaleString()}
                          </Text>
                          {discountPercent > 0 && (
                            <Text as="s" color="gray.500">
                              đ{price.toLocaleString()}
                            </Text>
                          )}
                        </Box>
                      </Flex>
                      <HStack spacing={4} mt={2}>
                        <Button
                          variant="link"
                          colorScheme="purple"
                          onClick={() => handleRemoveItem(id)}
                        >
                          Remove
                        </Button>
                      </HStack>
                    </Box>
                  );
                })}
              </Box>

              {/* Right Side - Payment Summary */}
              <Box w="300px" borderWidth="1px" borderRadius="md" p={4}>
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  Total:
                </Text>
                <Text fontSize="3xl" color="purple.600" fontWeight="bold">
                  {formatVNDMoney(cart?.totalAmount || 0)}
                </Text>
                <Button colorScheme="purple" w="full" mt={4} onClick={handleCheckout}>
                  Checkout
                </Button>
              </Box>
            </Flex>
          </>
        )}

      </Box>
    </RoleBasedPageLayout>
  );
};

export default CartPage;