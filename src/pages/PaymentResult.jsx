import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Spinner,
  Flex,
  Container,
  Heading,
  Button,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import paymentService from '~/services/paymentService';
import NavbarForStudent from '~/components/Navbars/NavbarForStudent';
import Footer from '~/components/Footer';
import useCustomToast from '~/hooks/useCustomToast';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { errorToast } = useCustomToast();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`Payment Result: ${location.search}`);
    const queryParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(queryParams.entries());
    params.method = 'VN_PAY';

    if (params) {
      processPaymentResult(params);
    }
  }, []);

  const processPaymentResult = async (params) => {
    try {
      setLoading(true);
      const response = await paymentService.getResult(params);
      setPaymentStatus(response?.status || 'Unknown');
    } catch (error) {
      console.error(error?.message);
      errorToast('Error processing payment result');
      setPaymentStatus('Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  return (
    <Box>
      <NavbarForStudent />
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
              <Alert status="success" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
                <AlertIcon boxSize="40px" mr={0} />
                <Heading size="lg" mt={4} mb={1}>
                  Payment Successful!
                </Heading>
                <Text fontSize="xl">Thank you for your purchase!</Text>
              </Alert>
            ) : paymentStatus === 'FAILED' ? (
              <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
                <AlertIcon boxSize="40px" mr={0} />
                <Heading size="lg" mt={4} mb={1}>
                  Payment Failed
                </Heading>
                <Text fontSize="xl">Something went wrong. Please try again.</Text>
              </Alert>
            ) : (
              <Alert status="warning" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
                <AlertIcon boxSize="40px" mr={0} />
                <Heading size="lg" mt={4} mb={1}>
                  Payment Status Unknown
                </Heading>
                <Text fontSize="xl">We could not determine the payment result.</Text>
              </Alert>
            )}

            <Button mt={8} bg="cyan.600" color="white" onClick={handleBackToCart}>
              Back to Cart
            </Button>
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default PaymentResult;
