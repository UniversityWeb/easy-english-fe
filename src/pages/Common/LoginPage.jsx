import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import GoogleIcon from '~/assets/icons/GoogleIcon.svg';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import AuthService from '~/services/authService';
import { USER_ROLES, USER_STATUSES } from '~/utils/constants';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import useCustomToast from '~/hooks/useCustomToast';
import { isLoggedIn } from '~/utils/authUtils';

const LoginPage = () => {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRememberMe, setIsRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { successToast, errorToast, warningToast } = useCustomToast();
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    if (isLoggedIn()) {
      AuthService.getCurUser()
        .then((user) => {
          if (user) {
            // Navigate based on user role
            navigateByRole(user?.role);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
        });
    }
  }, [navigate]);

  const navigateByRole = (role) => {
    if (role === USER_ROLES.STUDENT) {
      navigate(config.routes.search);
    } else if (role === USER_ROLES.TEACHER) {
      navigate(config.routes.course_management_for_teacher);
    } else if (role === USER_ROLES.ADMIN) {
      navigate(config.routes.course_management_for_teacher);
    } else {
      console.log("Role not found");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setUsernameOrEmail(usernameOrEmail?.trim());
    setPassword(password?.trim());

    if (usernameOrEmail === '' || password === '') {
      warningToast(`Please fill in both the username and password fields`);
      return;
    }

    setIsLogging(true); // Start loading

    const loginRequest = {
      usernameOrEmail: `${usernameOrEmail}`,
      password: `${password}`,
    };

    try {
      const loginResponse = await AuthService.login(loginRequest);
      if (!loginResponse) {
        errorToast(`Login unsuccessfully`);
        return;
      }

      if (loginResponse?.accountStatus === USER_STATUSES.INACTIVE) {
        navigate(config.routes.otp_validation, { state: { username: loginResponse?.user?.username } });
      }

      successToast(`Login successfully`);
      const user = loginResponse?.user;
      navigateByRole(user?.role);
    } catch (e) {
      errorToast(e?.message);
    } finally {
      setIsLogging(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSuccess = async (response) => {
    // Send the response token to your Spring Boot backend for validation
    setIsLogging(true)
    try {
      const loginResponse = await AuthService.loginWithGoogle(response?.credential);
      const user = loginResponse?.user;
      navigateByRole(user?.role);
      successToast('Login successfully');
    } catch (e) {
      errorToast('Failed to login with Google');
      console.error(e);
    } finally {
      setIsLogging(false);
    }
  };

  const handleGoogleFailure = (response) => {
    errorToast('Google login failed');
    console.error(response);
  };

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Center height="100vh">
        <VStack spacing={4} align="center">
          <Image boxSize="200px" src={TransientAppLogo} alt="Logo" />
          <Heading size="md">Login in to your account</Heading>
          <Text>
            Don’t have an account?{' '}
            <Link color="cyan.400" href={config.routes.register}>
              Register
            </Link>
          </Text>
          <Card mt={6} p="2rem">
            <CardBody>
              <FormControl isRequired>
                <FormLabel>Username Or Email</FormLabel>
                <Input
                  id="usernameOrEmail"
                  type="text"
                  size="lg"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel mt={6}>Password</FormLabel>
                <InputGroup>
                  <Input
                    id="password"
                    placeholder="********"
                    type={showPassword ? 'text' : 'password'}
                    size="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={togglePasswordVisibility}
                      cursor="pointer"
                    >
                      {showPassword ? <ViewIcon color="cyan.700" /> : <ViewOffIcon color="cyan.700" />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Stack spacing={10} mt={4}>
                <Stack direction={{ base: 'column', sm: 'row' }} align={'end'} justify={'end'}>
                  <Link color="cyan.400" href={config.routes.forgot_password}>
                    Forgot password?
                  </Link>
                </Stack>
                <Button
                  bg="cyan.600"
                  color="white"
                  loadingText="Loading"
                  width="full"
                  size="md"
                  borderRadius="xl"
                  p={6}
                  isLoading={isLogging}
                  onClick={handleLogin}
                  disabled={usernameOrEmail === '' || password === ''}
                >
                  Login
                </Button>
              </Stack>

              <Flex align="center" mt={8}>
                <Box w="100px">
                  <Divider />
                </Box>
                <Text>or continue with</Text>
                <Box w="100px">
                  <Divider />
                </Box>
              </Flex>

              <Flex m={4} justifyContent="center" mt={5}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onFailure={handleGoogleFailure}
                  render={(renderProps) => (
                    <Button
                      width="50px"
                      size="50px"
                      colorScheme="gray"
                      variant="outline"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <Image src={GoogleIcon} alt="Google Icon" />
                    </Button>
                  )}
                />
              </Flex>
            </CardBody>
          </Card>
        </VStack>
      </Center>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;