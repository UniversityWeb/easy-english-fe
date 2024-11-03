import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  Stack,
  Avatar,
  Grid,
  GridItem,
  Heading,
  Text,
} from '@chakra-ui/react';
import Footer from '~/components/Footer';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

const UserProfileEdit = () => {
  const [registerRequest, setRegisterRequest] = useState({
    username: 'john',
    fullName: 'john',
    email: 'john@gmail.com',
    phoneNumber: '+84972640891',
    bio: 'A student.',
    gender: 'MALE',
    dob: '2024-09-02',
  });

  const handleChange = (e) => {
    const name = e.target ? e.target.name : 'gender';
    const value = e.target ? e.target.value : e;
    setRegisterRequest({
      ...registerRequest,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(registerRequest);
  };

  return (
    <RoleBasedPageLayout>
      <Grid templateColumns="30% 70%" gap={10} mb={10} alignItems="center">
        {/* Left: Avatar Section */}
        <GridItem>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar size="2xl" name={registerRequest.fullName} src="/avatar.png" mb={6} />
            <Heading fontSize="2xl" fontWeight="bold" textAlign="center">
              {registerRequest.fullName}
            </Heading>
            <Text fontSize="lg" color="gray.500">
              Student
            </Text>
          </Box>
        </GridItem>

        <GridItem>
          <form onSubmit={handleSubmit}>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={6} mb={6}>
              <FormControl id="username" isRequired>
                <FormLabel fontSize="lg" fontWeight="medium">Username</FormLabel>
                <Input
                  type="text"
                  name="username"
                  value={registerRequest.username}
                  onChange={handleChange}
                  size="lg"
                />
              </FormControl>

              <FormControl id="fullName" isRequired>
                <FormLabel fontSize="lg" fontWeight="medium">Full Name</FormLabel>
                <Input
                  type="text"
                  name="fullName"
                  value={registerRequest.fullName}
                  onChange={handleChange}
                  size="lg"
                />
              </FormControl>
            </Box>

            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={6} mb={6}>
              <FormControl id="email" isRequired>
                <FormLabel fontSize="lg" fontWeight="medium">Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={registerRequest.email}
                  onChange={handleChange}
                  size="lg"
                />
              </FormControl>

              <FormControl id="phoneNumber" isRequired>
                <FormLabel fontSize="lg" fontWeight="medium">Phone Number</FormLabel>
                <Input
                  type="text"
                  name="phoneNumber"
                  value={registerRequest.phoneNumber}
                  onChange={handleChange}
                  size="lg"
                />
              </FormControl>
            </Box>

            <FormControl id="bio" mb={6}>
              <FormLabel fontSize="lg" fontWeight="medium">Bio</FormLabel>
              <Textarea
                name="bio"
                value={registerRequest.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                size="lg"
                resize="vertical"
              />
            </FormControl>

            <FormControl id="gender" mb={6}>
              <FormLabel fontSize="lg" fontWeight="medium">Gender</FormLabel>
              <RadioGroup
                name="gender"
                value={registerRequest.gender}
                onChange={handleChange}
              >
                <Stack direction="row" spacing={8}>
                  <Radio value="MALE" size="lg">Male</Radio>
                  <Radio value="FEMALE" size="lg">Female</Radio>
                  <Radio value="OTHER" size="lg">Other</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl id="dob" mb={6}>
              <FormLabel fontSize="lg" fontWeight="medium">Date of Birth</FormLabel>
              <Input
                type="date"
                name="dob"
                value={registerRequest.dob}
                onChange={handleChange}
                size="lg"
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg" width="full" mt={4}>
              Save Changes
            </Button>
          </form>
        </GridItem>
      </Grid>
    </RoleBasedPageLayout>
  );
};

export default UserProfileEdit;
