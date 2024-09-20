import {
  Avatar,
  AvatarBadge,
  Button, Card, CardBody,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input, InputGroup, InputRightElement, Link, Select,
  Stack, Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { SmallCloseIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import config from '~/config';

const UserProfileEdit = () => {
  const [userProfile, setUserProfile] = useState({
    username: "john",
    fullName: "john",
    email: "john@gmail.com",
    phoneNumber: "+84972640891",
    bio: "A student.",
    gender: "MALE",
    dob: "2024-09-02"
  });

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Icon</FormLabel>
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" src="https://bit.ly/sage-adebayo">
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon />}
                />
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full">Change Icon</Button>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="userName" isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>

        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}
          >
            Cancel
          </Button>
          <Button
            bg={'blue.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'blue.500',
            }}
          >
            Submit
          </Button>
        </Stack>
      </Stack>


      <Card mt={6} p="2rem" w={'400px'}>
        <CardBody>
          <Stack spacing={6}>
            <FormControl id="fullName" isRequired>
              <FormLabel>Full name</FormLabel>
              <Input
                type="text"
                size="lg"
                name="fullName"
                value={registerRequest.fullName}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                size="lg"
                name="username"
                value={registerRequest.username}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  size="lg"
                  name="password"
                  value={registerRequest.password}
                  onChange={handleInputChange}
                />
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
              <FormLabel>Email (Optinal)</FormLabel>
              <Input
                type="email"
                size="lg"
                name="email"
              />
            </FormControl>

            <FormControl id="phoneNumber">
              <FormLabel>Phone number (Optional)</FormLabel>
              <Input
                type="text"
                size="lg"
                name="phoneNumber"
                value={registerRequest.phoneNumber}
              />
            </FormControl>

            <FormControl id="dob">
              <FormLabel>Date of birth: </FormLabel>
              <Input
                name="dob"
                placeholder="Select Time"
                size="lg"
                type="date"
                mr={4}
                value={new Date(registerRequest.dob)
                  .toISOString()
                  .substr(0, 10)}
              />
            </FormControl>

            <FormControl id="gender">
              <FormLabel>Gender</FormLabel>
              <Select
                size="lg"
                name="gender"
                value={registerRequest.gender}
              >
                <option value="MALE" defaultChecked={true}>
                  Male
                </option>
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
    </Flex>
  );
}

export default UserProfileEdit;