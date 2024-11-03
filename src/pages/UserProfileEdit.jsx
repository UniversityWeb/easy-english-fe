import React, { useState, useEffect } from 'react';
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
  Spinner,
} from '@chakra-ui/react';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import userService from '~/services/userService';
import UploadAvatar from '~/components/User/UploadAvatar';
import AuthService from '~/services/authService';
import useCustomToast from '~/hooks/useCustomToast';

const UserProfileEdit = () => {
  const [user, setUser] = useState({
    username: 'john',
    fullName: 'john',
    email: 'john@gmail.com',
    phoneNumber: '+84972640891',
    bio: 'A student.',
    gender: 'MALE',
    dob: '2024-09-02',
  });
  const [loading, setLoading] = useState(false);
  const {successToast} = useCustomToast();

  const handleChange = (e) => {
    const name = e.target ? e.target.name : 'gender';
    const value = e.target ? e.target.value : e;
    setUser({
      ...user,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.getCurUser();
        setUser(user);
      } catch (e) {
        console.log(e?.message);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userService.updateOwnProfile(user);
      successToast('Profile updated successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleBasedPageLayout>
      <Box
        maxW="1500px"
        mx="auto"
        p={6}
        mt={10}
        borderWidth={1}
        borderRadius="md"
        boxShadow="lg"
      >
        <Grid
          templateColumns="30% 70%"
          gap={10}
          mb={10}
          alignItems="center"
          p={10}
        >
          <GridItem>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                size="md"
                name={user?.fullName}
                src={user?.avatarPath}
              />
              <UploadAvatar
                registerRequest={user}
                setRegisterRequest={setUser}
                mb={4}
              />
              <Heading
                fontSize="2xl"
                fontWeight="bold"
                textAlign="center"
                mb={4}
              >
                {user?.fullName}
              </Heading>
              <Text fontSize="lg" color="gray.500">
                Role: {user?.role}
              </Text>
            </Box>
          </GridItem>

          <GridItem>
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                gap={6}
                mb={6}
              >
                <FormControl id="username" isDisabled>
                  <FormLabel fontSize="md" fontWeight="medium">
                    Username
                  </FormLabel>
                  <Input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    size="md"
                  />
                </FormControl>

                <FormControl id="fullName" isRequired>
                  <FormLabel fontSize="md" fontWeight="medium">
                    Full Name
                  </FormLabel>
                  <Input
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                    size="md"
                  />
                </FormControl>
              </Box>

              <Box
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                gap={6}
                mb={6}
              >
                <FormControl id="email" isRequired>
                  <FormLabel fontSize="md" fontWeight="medium">
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    size="md"
                  />
                </FormControl>

                <FormControl id="phoneNumber" isRequired>
                  <FormLabel fontSize="md" fontWeight="medium">
                    Phone Number
                  </FormLabel>
                  <Input
                    type="text"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleChange}
                    size="md"
                  />
                </FormControl>
              </Box>

              <FormControl id="bio" mb={6}>
                <FormLabel fontSize="md" fontWeight="medium">
                  Bio
                </FormLabel>
                <Textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  size="md"
                  resize="vertical"
                />
              </FormControl>

              <FormControl id="gender" mb={6}>
                <FormLabel fontSize="md" fontWeight="medium">
                  Gender
                </FormLabel>
                <RadioGroup
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                >
                  <Stack direction="row" spacing={8}>
                    <Radio value="MALE" size="md">
                      Male
                    </Radio>
                    <Radio value="FEMALE" size="md">
                      Female
                    </Radio>
                    <Radio value="OTHER" size="md">
                      Other
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl id="dob" mb={6}>
                <FormLabel fontSize="md" fontWeight="medium">
                  Date of Birth
                </FormLabel>
                <Input
                  type="date"
                  name="dob"
                  value={user.dob}
                  onChange={handleChange}
                  size="md"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="md"
                width="full"
                mt={4}
                isDisabled={loading}
              >
                {loading ? <Spinner size="sm" /> : 'Save Changes'}
              </Button>
            </form>
          </GridItem>
        </Grid>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default UserProfileEdit;
