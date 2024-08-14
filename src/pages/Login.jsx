import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Checkbox,
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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';
import GoogleIcon from '~/assets/icons/GoogleIcon.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '~/services/AuthService';
import config from '~/config';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRememberMe, setIsRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const [isLogging, setIsLogging] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();

    setUsername(username?.trim());
    setPassword(password?.trim());
    if (username === '' || password === '') {
      return;
    }

    const loginRequest = {
      username: `${username}`,
      password: `${password}`,
    };

    AuthService.login(loginRequest)
      .then((loginResponse) => {
        if (!loginResponse) {
          toast({
            title: `Login unsuccessfully`,
            position: 'top-right',
            status: 'error',
            isClosable: true,
          });
          return;
        }

        toast({
          title: `Login successfully`,
          position: 'top-right',
          status: 'success',
          isClosable: true,
        });

        navigate(config.routes.home[0]);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (event) => {
    setIsRememberMe(event.target.checked);
  };

  return (
    <Center height="100vh">
      <VStack spacing={4} align="center">
        <Image boxSize="200px" src={TransientAppLogo} alt="Logo" />
        <Heading size="md">Login in to your account</Heading>
        <Text>
          Don’t have an account?{' '}
          <Link color="cyan.400" href="register">
            Register
          </Link>
        </Text>
        <Card mt={6} p="2rem">
          <CardBody>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                id="username"
                type="username"
                size="lg"
                value={username}
                onChange={(e) => setUsername(e?.target?.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel mt={6}>Password</FormLabel>
              <InputGroup>
                <Input
                  id="password"
                  placeholder="********"
                  type={showPassword ? 'text' : 'password'}
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e?.target?.value)}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={togglePasswordVisibility}
                    cursor="pointer">
                    {showPassword ? <ViewIcon color="cyan.700" /> : <ViewOffIcon color="cyan.700" />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Checkbox
                  id="remember-me"
                  colorScheme="cyan"
                  size="md"
                  isChecked={isRememberMe}
                  onChange={handleRememberMeChange}
                >
                  Remember me
                </Checkbox>
                <Link color="cyan.400" href={config.routes.forgot_password}>
                  Forgot password?
                </Link>
              </Stack>
              <Button
                bg="cyan.600"
                color="white"
                loadingText="Loading"
                width="full"
                size="lg"
                borderRadius="xl"
                p={6}
                disabled={true}
                onClick={handleLogin}
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

            <Flex m={4} justifyContent="center">
              <Button
                width="50px"
                size="50px"
                colorScheme="gray"
                variant="outline"
              >
                <Image src={GoogleIcon} alt="Google Icon" />
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </VStack>
    </Center>
  );
};

export default Login;
