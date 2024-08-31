import {
  Button,
  Card,
  CardBody,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Select,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import config from '~/config';
import TransientAppLogo from '~/assets/images/TransientAppLogo.svg';

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [registerRequest, setRegisterRequest] = useState({
    username: 'john',
    password: 'P@123456789',
    fullName: 'john',
    email: 'john@gmail.com',
    phoneNumber: '+84972640891',
    gender: 'MALE',
    dob: '2024-08-05T13:47:06.794Z',
  });

  const handleRegister = () => {
    console.log('handleRegister method onClick');
  };

  const handleDateTimeChange = (e) => {
    e.preventDefault();
    const timeValue = e.target.value;
    const date = new Date(registerRequest.dob);
    const [hours, minutes, seconds] = timeValue.split(':');

    date.setHours(hours, minutes, seconds);

    setRegisterRequest({
      ...registerRequest,
      dob: date.toISOString(),
    });
  };

  return (
    <Center height="100vh">
      <VStack spacing={4} align="center">
        <Image boxSize="200px" src={TransientAppLogo} alt="Logo" />
        <Heading size="md">Create an account</Heading>
        <Text>Start making your dreams come true</Text>
        <Card mt={6} p="2rem" w={'400px'}>
          <CardBody>
            <Stack spacing={6}>
              <FormControl id="fullName" isRequired>
                <FormLabel>Full name</FormLabel>
                <Input type="text" size="lg" />
              </FormControl>

              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" size="lg" />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} size="lg" />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? (
                        <ViewIcon color="cyan.700" />
                      ) : (
                        <ViewOffIcon color="cyan.700" />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input type="email" size="lg" />
              </FormControl>

              <FormControl id="phoneNumber">
                <FormLabel>Phone number</FormLabel>
                <Input type="text" size="lg" />
              </FormControl>

              <FormControl id="dob">
                <FormLabel>Date of birth: </FormLabel>
                <Input
                  name="dob"
                  placeholder="Select Time"
                  size="lg"
                  type="time"
                  mr={4}
                  value={new Date(registerRequest.dob)
                    .toISOString()
                    .substr(11, 8)}
                  onChange={handleDateTimeChange}
                />
              </FormControl>

              <FormControl id="gender">
                <FormLabel>Gender</FormLabel>
                <Select placeholder="Select option" size="lg">
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Select>
              </FormControl>

              <Button
                bg="cyan.600"
                color="white"
                loadingText="Loading"
                width="full"
                size="lg"
                borderRadius="xl"
                mt={6}
                p={6}
                disabled={true}
                onClick={handleRegister}
              >
                Register
              </Button>

              <Text align={'center'} mt={6}>
                Already a user?{' '}
                <Link color={'blue.400'} href={config.routes.login}>
                  Login
                </Link>
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </VStack>
    </Center>
  );
}