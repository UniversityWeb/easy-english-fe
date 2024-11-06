import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  Link,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for handling the password reset link
    console.log('Reset link sent to:', email);
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="100px"
      p="6"
      boxShadow="lg"
      borderRadius="md"
      textAlign="center"
      bg="white"
    >
      <HStack mb={4}>
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Go back"
          onClick={() => window.history.back()}
          variant="ghost"
        />
        <Heading size="lg">Restore password</Heading>
      </HStack>

      <VStack as="form" onSubmit={handleSubmit} spacing={4}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          bg="cyan.600"
          color="white"
          loadingText="Loading"
          type="submit"
          width="full"
          size="md"
          borderRadius="xl"
          p={6}
          isLoading={isLoading} // Add loading state
          disabled={username === '' || password === ''} // Enable/disable based on input
        >
          Send Reset Link
        </Button>
      </VStack>

      <Box mt={6} borderTop="1px solid #eaeaea" pt={4}>
        <Text>
          No account?{' '}
          <Link as={RouterLink} to="/signup" color="blue.500">
            Sign Up
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
