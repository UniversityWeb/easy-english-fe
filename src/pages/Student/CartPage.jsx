// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Text,
//   Button,
//   Stack,
//   Spinner,
//   Flex,
//   Container,
//   Heading,
// } from '@chakra-ui/react';
// import useCustomToast from '~/hooks/useCustomToast';
// import NavbarForStudent from '~/components/Navbars/NavbarForStudent';
// import Footer from '~/components/Footer';
// import { getUsername } from '~/utils/authUtils';
// import cartService from '~/services/cartService';
// import CartItem from '~/components/CartItem';
// import paymentService from '~/services/paymentService';
// import config from '~/config';
// import StudentPageLayout from '~/components/StudentPageLayout';

// const CartPage = () => {
//   const username = getUsername();
//   const { successToast, errorToast } = useCustomToast();
//   const [cart, setCart] = useState({
//     id: 1,
//     totalAmount: 150.75,
//     updatedAt: '2024-10-04T02:31:21.787Z',
//     username: 'john_doe',
//     items: [
//       {
//         id: 1001,
//         status: 'ACTIVE',
//         price: 99.99,
//         discountPercent: 10,
//         updatedAt: '2024-10-04T02:31:21.787Z',
//         courseId: 200,
//         cartId: 1,
//       },
//     ],
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     setLoading(true);
//     try {
//       const cart = await cartService.getCart(username);
//       setCart(cart);
//     } catch (error) {
//       console.error(error?.message);
//       errorToast('Error fetching courses in the cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemoveFromCart = async (courseId) => {
//     try {
//       await cartService.removeItemFromCart(courseId);
//       successToast('Course removed from cart');
//       await fetchCart();
//     } catch (error) {
//       console.error(error?.message);
//       errorToast('Error removing course from cart');
//     }
//   };

//   const handleCheckout = async () => {
//     try {
//       const urlReturn = `${window.location.protocol}//${window.location.host}${config.routes.payment_result}`;
//       const paymentRequest = {
//         username: username,
//         method: 'VN_PAY',
//         urlReturn: urlReturn,
//       };

//       const paymentResponse =
//         await paymentService.createPaymentOrder(paymentRequest);
//       successToast('Checkout successful! Redirecting to payment...');
//       window.location.href = paymentResponse?.paymentUrl;
//     } catch (error) {
//       console.error(error?.message);
//       errorToast('Error during checkout. Please try again.');
//     }
//   };

//   return (
//     <StudentPageLayout>
//       <Container maxW="80%" mb="50px">
//         <Heading fontSize="3xl" fontWeight="bold" textAlign="start" mt={10}>
//           Course Cart
//         </Heading>

//         {loading ? (
//           <Flex justify="center" align="center" height="200px">
//             <Spinner size="lg" />
//           </Flex>
//         ) : (
//           <Stack spacing={4} mt={6} px={6}>
//             {cart.items === null || cart.items.length === 0 ? (
//               <Text fontSize="xl" color="gray.500" textAlign="center">
//                 Your cart is empty.
//               </Text>
//             ) : (
//               cart.items.map((cartItem) => (
//                 <CartItem
//                   key={cartItem.id}
//                   cartItem={cartItem}
//                   handleRemoveFromCart={handleRemoveFromCart}
//                 />
//               ))
//             )}
//           </Stack>
//         )}

//         <Heading fontSize="2xl" mt="50px">
//           Total:{' '}
//           {new Intl.NumberFormat('vi-VN', {
//             style: 'currency',
//             currency: 'VND',
//           }).format(cart?.totalAmount)}
//         </Heading>
//         <Button
//           bg="cyan.600"
//           color="white"
//           loadingText="Loading"
//           width="full"
//           size="lg"
//           borderRadius="xl"
//           p={6}
//           disabled={true}
//           onClick={handleCheckout}
//         >
//           Checkout
//         </Button>
//       </Container>
//     </StudentPageLayout>
//   );
// };

// export default CartPage;

import React from 'react';
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Divider,
  Heading,
  Badge,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

const ShoppingCart = () => {
  return (
    <Box p={8} maxW="1200px" mx="auto">
      <Heading size="lg" mb={6}>
        Shopping Cart
      </Heading>

      <Flex>
        {/* Left Side - Course Cards */}
        <Box flex="1" pr={8}>
          <Text fontSize="lg" mb={4}>
            2 Courses in Cart
          </Text>

          <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
            <Flex align="center" mb={4}>
              <Image
                src="https://via.placeholder.com/150"
                alt="Course"
                boxSize="100px"
                objectFit="cover"
                borderRadius="md"
                mr={4}
              />
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  The Complete AI-Powered Copywriting Course & ChatGPT
                </Text>
                <Text fontSize="sm" color="gray.500">
                  By Ing. Tomas Moravek and 1 other
                </Text>
                <Badge colorScheme="green" mt={2}>
                  Updated Recently
                </Badge>
                <Text mt={1}>
                  <strong>4.4</strong> ⭐️ (1,681 ratings)
                </Text>
                <Text fontSize="sm" color="gray.500">
                  26.5 total hours • 187 lectures • All Levels
                </Text>
              </Box>
              <Box ml="auto" textAlign="right">
                <Text color="purple.600" fontWeight="bold" fontSize="lg">
                  đ349,000
                </Text>
                <Text as="s" color="gray.500">
                  đ1,899,000
                </Text>
              </Box>
            </Flex>
            <HStack spacing={4} mt={2}>
              <Button variant="link" colorScheme="purple">
                Remove
              </Button>
              <Button variant="link" colorScheme="purple">
                Save for Later
              </Button>
            </HStack>
          </Box>

          {/* Repeat for second course */}
          <Box borderWidth="1px" borderRadius="md" p={4} mb={4}>
            <Flex align="center" mb={4}>
              <Image
                src="https://via.placeholder.com/150"
                alt="Course"
                boxSize="100px"
                objectFit="cover"
                borderRadius="md"
                mr={4}
              />
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  ChatGPT Complete Guide: Learn Generative AI, ChatGPT & More
                </Text>
                <Text fontSize="sm" color="gray.500">
                  By Julian Melanson and 2 others
                </Text>
                <Badge colorScheme="yellow" mt={2}>
                  Bestseller
                </Badge>
                <Text mt={1}>
                  <strong>4.6</strong> ⭐️ (40,272 ratings)
                </Text>
                <Text fontSize="sm" color="gray.500">
                  26.5 total hours • 415 lectures • All Levels
                </Text>
              </Box>
              <Box ml="auto" textAlign="right">
                <Text color="purple.600" fontWeight="bold" fontSize="lg">
                  đ249,000
                </Text>
                <Text as="s" color="gray.500">
                  đ1,699,000
                </Text>
              </Box>
            </Flex>
            <HStack spacing={4} mt={2}>
              <Button variant="link" colorScheme="purple">
                Remove
              </Button>
              <Button variant="link" colorScheme="purple">
                Save for Later
              </Button>
            </HStack>
          </Box>
        </Box>

        {/* Right Side - Payment Summary */}
        <Box w="300px" borderWidth="1px" borderRadius="md" p={4}>
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Total:
          </Text>
          <Text fontSize="3xl" color="purple.600" fontWeight="bold">
            đ598,000
          </Text>
          <Text as="s" color="gray.500">
            đ3,598,000
          </Text>
          <Text fontSize="sm" color="gray.500">
            83% off
          </Text>
          <Button colorScheme="purple" w="full" mt={4}>
            Checkout
          </Button>

          <Divider my={4} />

          <Heading size="md" mb={4}>
            Promotions
          </Heading>
          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.500">
              24T2MT111524 is applied
            </Text>
            <InputGroup>
              <Input placeholder="Enter Coupon" />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" colorScheme="purple">
                  Apply
                </Button>
              </InputRightElement>
            </InputGroup>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default ShoppingCart;
