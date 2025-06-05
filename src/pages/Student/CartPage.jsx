import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
  Divider,
} from '@chakra-ui/react';
import useCustomToast from '~/hooks/useCustomToast';
import cartService from '~/services/cartService';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import { formatVNDMoney } from '~/utils/methods';
import paymentService from '~/services/paymentService';
import { getUsername } from '~/utils/authUtils';
import config from '~/config';
import { PAYMENT_STATUES } from '~/utils/constants';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { successToast, errorToast } = useCustomToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error(error.message);
      errorToast('Failed to fetch cart data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (courseId) => {
    try {
      await cartService.removeItemFromCart(courseId);
      successToast('Course removed from cart.');
      fetchCart();
    } catch (error) {
      console.error(error.message);
      errorToast('Error removing course from cart.');
    }
  };

  const handleRemoveBundle = async (bundle) => {
    try {
      // Remove all courses in bundle
      const removePromises = bundle.courses.map((item) =>
        cartService.removeItemFromCart(item.id),
      );

      await Promise.all(removePromises);
      successToast(`Bundle removed from cart.`);
      fetchCart();
    } catch (error) {
      console.error(error.message);
      errorToast('Error removing bundle from cart.');
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

      if (paymentResponse?.status === PAYMENT_STATUES.SUCCESS) {
        if (!paymentResponse?.orderId) {
          return;
        }

        navigate(
          config.routes.order_detail.replace(
            ':orderId',
            paymentResponse?.orderId,
          ),
        );
        return;
      }
      window.location.href = paymentResponse?.paymentUrl;
    } catch (error) {
      console.error(error?.message);
      errorToast('Error during checkout. Please try again.');
    }
  };

  // Group items by bundleId
  const groupItemsByBundle = (items) => {
    const grouped = {
      bundles: {},
      individualCourses: [],
    };

    items.forEach((item) => {
      if (item.bundleId && item.bundleId !== null) {
        if (!grouped.bundles[item.bundleId]) {
          grouped.bundles[item.bundleId] = {
            bundleId: item.bundleId,
            bundleName: item.bundleName || `Bundle ${item.bundleId}`,
            bundleDescription: item.bundleDescription || '',
            courses: [],
            totalPrice: 0,
            totalDiscountedPrice: 0,
          };
        }

        const discountedPrice = calculateDiscountedPrice(
          item.course.price.price,
          item.discountPercent,
        );

        grouped.bundles[item.bundleId].courses.push(item);
        grouped.bundles[item.bundleId].totalPrice += item.course.price.price;
        grouped.bundles[item.bundleId].totalDiscountedPrice += discountedPrice;
      } else {
        grouped.individualCourses.push(item);
      }
    });

    return grouped;
  };

  const calculateDiscountedPrice = (price, discountPercent) => {
    return price - (price * discountPercent) / 100;
  };

  const renderCourseCard = (item, isInBundle = false) => {
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
      <Box
        key={id}
        borderWidth={isInBundle ? '0' : '1px'}
        borderRadius="md"
        p={4}
        mb={isInBundle ? 2 : 4}
        bg={isInBundle ? 'gray.50' : 'white'}
      >
        <Flex align="center" mb={4}>
          <Image
            src={imagePreview || 'https://via.placeholder.com/150'}
            alt={title}
            boxSize={isInBundle ? '80px' : '100px'}
            objectFit="cover"
            borderRadius="md"
            mr={4}
          />
          <Box>
            <Text
              fontWeight="bold"
              fontSize={isInBundle ? 'md' : 'lg'}
              minWidth="370px"
            >
              {title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              By {ownerUsername}
            </Text>
            <Badge
              colorScheme="green"
              mt={2}
              visibility={countStudent || countStudent === 0}
            >
              {countStudent} Students
            </Badge>
            <Text mt={1}>
              <strong>{rating.toFixed(1)}</strong> ⭐️ ({ratingCount} ratings)
            </Text>
            <Text fontSize="sm" color="gray.500">
              {duration} total hours
            </Text>
          </Box>
          <Box ml="auto" textAlign="right">
            <Text
              color="purple.600"
              fontWeight="bold"
              fontSize={isInBundle ? 'md' : 'lg'}
            >
              đ{discountedPrice.toLocaleString()}
            </Text>
            {discountPercent > 0 && (
              <Text as="s" color="gray.500" fontSize="sm">
                đ{price.toLocaleString()}
              </Text>
            )}
          </Box>
        </Flex>
        {!isInBundle && (
          <HStack spacing={4} mt={2}>
            <Button
              variant="link"
              colorScheme="purple"
              onClick={() => handleRemoveItem(id)}
            >
              Remove
            </Button>
          </HStack>
        )}
      </Box>
    );
  };

  const renderBundle = (bundle) => {
    return (
      <Box
        key={bundle.bundleId}
        borderWidth="2px"
        borderColor="purple.200"
        borderRadius="lg"
        p={4}
        mb={4}
        bg="purple.50"
      >
        {/* Bundle Header */}
        <Flex justify="space-between" align="center" mb={4}>
          <VStack align="start" spacing={1}>
            <Heading size="md" color="purple.700">
              📦 {bundle.bundleName}
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Bundle contains {bundle.courses.length} courses
            </Text>
            {bundle.bundleDescription && (
              <Text fontSize="sm" color="gray.500">
                {bundle.bundleDescription}
              </Text>
            )}
          </VStack>
          <VStack align="end" spacing={1}>
            <Text fontSize="xl" fontWeight="bold" color="purple.600">
              đ{bundle.totalDiscountedPrice.toLocaleString()}
            </Text>
            {bundle.totalPrice > bundle.totalDiscountedPrice && (
              <Text as="s" color="gray.500" fontSize="sm">
                đ{bundle.totalPrice.toLocaleString()}
              </Text>
            )}
            <Badge colorScheme="green" fontSize="xs">
              Bundle Discount
            </Badge>
          </VStack>
        </Flex>

        <Divider mb={4} />

        {/* Bundle Courses */}
        <VStack spacing={2} align="stretch">
          {bundle.courses.map((item) => renderCourseCard(item, true))}
        </VStack>

        {/* Bundle Actions */}
        <HStack
          spacing={4}
          mt={4}
          pt={2}
          borderTop="1px"
          borderColor="gray.200"
        >
          <Button
            variant="outline"
            colorScheme="red"
            size="sm"
            onClick={() => handleRemoveBundle(bundle)}
          >
            Remove Bundle
          </Button>
          <Text fontSize="sm" color="gray.500">
            Removing bundle will remove all courses in this bundle
          </Text>
        </HStack>
      </Box>
    );
  };

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <RoleBasedPageLayout>
        <Box p={8} maxW="1200px" mx="auto" textAlign="center">
          <Heading size="lg" mb={4}>
            Your Cart is Empty
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Add some courses to your cart to get started!
          </Text>
        </Box>
      </RoleBasedPageLayout>
    );
  }

  const groupedItems = groupItemsByBundle(cart.items);
  const bundleCount = Object.keys(groupedItems.bundles).length;
  const individualCourseCount = groupedItems.individualCourses.length;

  return (
    <RoleBasedPageLayout>
      <Box p={8} maxW="1200px" mx="auto">
        <Heading size="lg" mb={6}>
          Shopping Cart
        </Heading>

        <Flex>
          {/* Left Side - Course Cards and Bundles */}
          <Box flex="1" pr={8}>
            <Text fontSize="lg" mb={4}>
              {bundleCount > 0 &&
                `${bundleCount} ${bundleCount > 1 ? 'Bundles' : 'Bundle'}`}
              {bundleCount > 0 && individualCourseCount > 0 && ', '}
              {individualCourseCount > 0 &&
                `${individualCourseCount} Individual ${individualCourseCount > 1 ? 'Courses' : 'Course'}`}{' '}
              in Cart
            </Text>

            {/* Render Bundles */}
            {Object.values(groupedItems.bundles).map((bundle) =>
              renderBundle(bundle),
            )}

            {/* Render Individual Courses */}
            {groupedItems.individualCourses.length > 0 && (
              <>
                {bundleCount > 0 && (
                  <Heading size="md" mt={6} mb={4} color="gray.700">
                    Individual Courses
                  </Heading>
                )}
                {groupedItems.individualCourses.map((item) =>
                  renderCourseCard(item, false),
                )}
              </>
            )}
          </Box>

          {/* Right Side - Payment Summary */}
          <Box w="300px" borderWidth="1px" borderRadius="md" p={4}>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Total:
            </Text>
            <Text fontSize="3xl" color="purple.600" fontWeight="bold">
              {formatVNDMoney(cart?.totalAmount || 0)}
            </Text>

            {/* Summary breakdown */}
            <VStack align="stretch" mt={4} spacing={2}>
              {bundleCount > 0 && (
                <Text fontSize="sm" color="gray.600">
                  {bundleCount} Bundle{bundleCount > 1 ? 's' : ''}
                </Text>
              )}
              {individualCourseCount > 0 && (
                <Text fontSize="sm" color="gray.600">
                  {individualCourseCount} Individual Course
                  {individualCourseCount > 1 ? 's' : ''}
                </Text>
              )}
            </VStack>

            <Button
              colorScheme="purple"
              w="full"
              mt={4}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </Box>
        </Flex>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default CartPage;
