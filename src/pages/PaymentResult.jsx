import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Spinner,
  Flex,
  Heading,
  Button,
  Alert,
  AlertIcon,
  HStack,
  Progress,
  VStack,
  AlertTitle,
  AlertDescription, Image, Container,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import paymentService from '~/services/paymentService';
import useCustomToast from '~/hooks/useCustomToast';
import { CheckCircleIcon, Icon } from '@chakra-ui/icons';
import StudentPageLayout from '~/components/StudentPageLayout';
import config from '~/config';

const PaymentDetails = ({ paymentData }) => (
  paymentData && (
    <Box mt={4}>
      <Text><strong>Method:</strong> {paymentData.method}</Text>
      <Text><strong>Transaction No:</strong> {paymentData.transactionNo}</Text>
      <Text><strong>Amount Paid:</strong> {paymentData.amountPaid} {paymentData.currency}</Text>
      <Text><strong>Payment Time:</strong> {new Date(paymentData.paymentTime).toLocaleString()}</Text>
      <Text><strong>Order ID:</strong> {paymentData.orderId}</Text>
    </Box>
  )
);

const PaymentButtons = ({ navigate, isSuccess }) => (
  <HStack spacing={4} mt={6}>
    <Button colorScheme="green" onClick={() => navigate(config.routes.orders)}>
      My Orders
    </Button>
    <Button
      variant="outline"
      colorScheme="green"
      onClick={() => navigate(isSuccess ? config.routes.home : config.routes.course_management_for_student)}
    >
      Back Home
    </Button>
  </HStack>
);

const PaymentSuccess = ({ paymentData }) => {
  const navigate = useNavigate();

  return (
    <Box
      p={8}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      maxW="900px"
      mx="auto"
    >
      {/* Alert */}
      <Alert status="success" mb={6} borderRadius="md">
        <AlertIcon />
        <AlertTitle mr={2}>Almost there!</AlertTitle>
        <AlertDescription>Your payment was successful!</AlertDescription>
      </Alert>

      <HStack justify="space-between" align="center">
        {/* Left Side: Text and Progress */}
        <VStack spacing={4} align="flex-start">
          <Text fontSize="2xl" fontWeight="bold">
            Payment successful
          </Text>
          <Text color="gray.500">Thank you for choosing our service.</Text>

          {/* Progress bar */}
          <HStack spacing={4} w="full" align="center">
            <HStack>
              <Icon as={CheckCircleIcon} color="green.500" />
              <Text>Payment received</Text>
            </HStack>
          </HStack>

          <PaymentDetails paymentData={paymentData} />
          <PaymentButtons navigate={useNavigate()} isSuccess />
        </VStack>

        {/* Right Side: Image */}
        <Image
          src="/payment-success.png" // Đường dẫn gốc từ thư mục public
          alt="Success illustration"
          boxSize="250px"
          objectFit="cover"
        />
      </HStack>
    </Box>
  );
};

const PaymentFail = ({ paymentData }) => {
  const navigate = useNavigate();

  return (
    <Box
      p={8}
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
      maxW="900px"
      mx="auto"
    >
      {/* Alert */}
      <Alert status="error" mb={6} borderRadius="md">
        <AlertIcon />
        <AlertTitle mr={2}>Oh no!</AlertTitle>
        <AlertDescription>
          Something went wrong with your payment.
        </AlertDescription>
      </Alert>

      <HStack justify="space-between" align="center">
        {/* Left Side: Text and Progress */}
        <VStack spacing={4} align="flex-start">
          <Text fontSize="2xl" fontWeight="bold">
            You're almost there!
          </Text>
          <Text color="gray.500">
            Sorry, we had an issue confirming your payment. Please try again.
          </Text>

          {/* Progress bar */}
          <HStack spacing={4} w="full" align="center">
            <HStack>
              <Progress value={50} size="sm" colorScheme="green" w="40px" />
              <Text>Payment failed</Text>
            </HStack>
          </HStack>

          <PaymentDetails paymentData={paymentData} />
          <PaymentButtons navigate={useNavigate()} />
        </VStack>

        {/* Right Side: Image */}
        <Image
          src="/payment-fail.png" // Replace with the actual image URL of the girl
          alt="Failure illustration"
          boxSize="250px"
          objectFit="cover"
        />
      </HStack>
    </Box>
  );
};

const PaymentResult = () => {
  const location = useLocation();
  const { errorToast } = useCustomToast();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    console.log(`Payment Result: ${location.search}`);
    const queryParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(queryParams.entries());
    params.method = 'VN_PAY';

    processPaymentResult(params);
  }, []);

  const processPaymentResult = async (params) => {
    try {
      setLoading(true);
      const response = await paymentService.getResult(params, null, { params });
      setPaymentStatus(response?.status || 'Unknown');
      setPaymentData(response);
    } catch (error) {
      console.error(error?.message);
      errorToast('Error processing payment result');
      setPaymentStatus('FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentPageLayout>
      <Container maxW="80%" mb="50px">
        <Heading fontSize="3xl" fontWeight="bold" textAlign="center" mt={10}>
          Payment Result
        </Heading>

        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <Box mt={6} textAlign="center">
            {paymentStatus === 'SUCCESS' ? (
              <PaymentSuccess paymentData={paymentData}/>
            ) : paymentStatus === 'FAILED' ? (
              <PaymentFail paymentData={paymentData}/>
            ) : (
              <Alert
                status="warning"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
              >
                <AlertIcon boxSize="40px" mr={0} />
                <Heading size="lg" mt={4} mb={1}>
                  Payment Status Unknown
                </Heading>
                <Text fontSize="xl">
                  We could not determine the payment result.
                </Text>
              </Alert>
            )}
          </Box>
        )}
      </Container>
    </StudentPageLayout>
  );
};

export default PaymentResult;
