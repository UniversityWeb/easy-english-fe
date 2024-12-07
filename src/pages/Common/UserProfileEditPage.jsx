import React, { useState, useEffect, useCallback } from 'react';
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
  Grid,
  GridItem,
  Heading,
  Text,
  Spinner, InputGroup, InputRightElement, HStack,
} from '@chakra-ui/react';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import userService from '~/services/userService';
import UploadAvatar from '~/components/User/UploadAvatar';
import AuthService from '~/services/authService';
import useCustomToast from '~/hooks/useCustomToast';
import authService from '~/services/authService';
import VerifyOtpModal from '~/components/VerifyOtpModal';
import { validatePassword } from '~/utils/methods';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import ValidationErrors from '~/components/ValidationErrors';

const UpdatePassword = () => {
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [isOpenVerifyOtpModel, setIsOpenVerifyOtpModel] = useState(false);
  const {successToast, errorToast} = useCustomToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });

    if (name === "password" || name === "confirmPassword") {
      const errors = validatePassword(
        name === "password" ? value : passwordData.password,
        name === "confirmPassword" ? value : passwordData.confirmPassword
      );
      setValidationErrors(errors);
    }
  };

  const generateOtpToUpdatePassword = async (e) => {
    e.preventDefault();
    const errors = validatePassword(passwordData.password, passwordData.confirmPassword);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoadingPassword(true);
    try {
      await authService.generateOtpToUpdatePassword(passwordData);
      successToast('Otp generated successfully');
      setIsOpenVerifyOtpModel(true);
    } catch (error) {
      errorToast("Error generating otp");
      console.error('Error saving data:', error);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleUpdatePassWithOtp = useCallback(async (otp) => {
    setLoadingPassword(true);
    try {
      const updatePassReq = {
        otp: otp,
        newPassword: passwordData?.password,
      }
      await authService.updatePasswordWithOtp(updatePassReq);
      setPasswordData({
        password: "",
        confirmPassword: "",
      });
      successToast('Password updated successfully');
      setIsOpenVerifyOtpModel(false);
    } catch (error) {
      errorToast('Invalid OTP. Please try again.');
      console.error('OTP verification failed:', error);
    } finally {
      setLoadingPassword(false);
    }
  }, []);

  return (
    <Box>
      <form onSubmit={generateOtpToUpdatePassword}>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={6} mb={6}>
          <FormControl isRequired mb={6}>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                id="password"
                name="password"
                placeholder="********"
                type={showPassword ? 'text' : 'password'}
                size="lg"
                value={passwordData.password}
                onChange={handlePasswordChange}
              />
              <InputRightElement h={'full'}>
                <Button
                  variant={'ghost'}
                  onClick={togglePasswordVisibility}
                  cursor="pointer"
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

          <FormControl isRequired mb={6}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="********"
                type={showPassword ? 'text' : 'password'}
                size="lg"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
              <InputRightElement h={'full'}>
                <Button
                  variant={'ghost'}
                  onClick={toggleConfirmPasswordVisibility}
                  cursor="pointer"
                >
                  {showConfirmPassword ? (
                    <ViewIcon color="cyan.700" />
                  ) : (
                    <ViewOffIcon color="cyan.700" />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </Box>

        <HStack spacing={10}>
          <Button
            type="submit"
            bg="cyan.600"
            color="white"
            size="md"
            width="fit-content"
            isLoading={loadingPassword}
            isDisabled={loadingPassword}
          >
            {loadingPassword ? <Spinner size="sm" /> : 'Update Password'}
          </Button>

          <Button
            bg="cyan.600"
            color="white"
            size="md"
            width="fit-content"
            onClick={() => setIsOpenVerifyOtpModel(true)}
            hidden={!loadingPassword}
            isLoading={!loadingPassword}
            isDisabled={!loadingPassword}
          >
            Verify Otp
          </Button>
        </HStack>

      </form>

      <Box mt={5}>
        <ValidationErrors
          errors={validationErrors}
        />
      </Box>

      <VerifyOtpModal
        isOpen={isOpenVerifyOtpModel}
        onClose={() => setIsOpenVerifyOtpModel(false)}
        isSubmitLoading={loadingPassword}
        onOtpSubmitted={handleUpdatePassWithOtp}
      />
    </Box>
  );
};

const UserProfileEditPage = () => {
  const [user, setUser] = useState({
    username: 'john',
    fullName: 'john',
    email: 'john@gmail.com',
    phoneNumber: '+84972640891',
    bio: 'A student.',
    gender: 'MALE',
    dob: '2024-09-02',
  });
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
  const { successToast } = useCustomToast();

  const handleUserChange = (e) => {
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateProfileLoading(true);

    try {
      await userService.updateOwnProfile(user);
      successToast('Profile updated successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setUpdateProfileLoading(false);
    }
  };

  return (
    <RoleBasedPageLayout>
      <Box
        maxW="1500px"
        mx="auto"
        p={6}
        mt={10}
        mb={50}
        borderWidth={1}
        borderRadius="md"
        boxShadow="lg"
        width="80%"
      >
        <Grid
          templateColumns="30% 70%"
          gap={10}
          mb={10}
          alignItems="center"
          p={10}
        >
          <GridItem alignSelf="start">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
              <UploadAvatar
                user={user}
                setUser={setUser}
                mb={4}
              />
              <Text fontSize="sm" color="gray.500">
                Role: {user?.role}
              </Text>
            </Box>
          </GridItem>

          <GridItem>
            <Heading as="h5" size="lg" mb={4}>
              Information
            </Heading>

            <form onSubmit={handleUpdateProfile}>
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
                    onChange={handleUserChange}
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
                    onChange={handleUserChange}
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
                    onChange={handleUserChange}
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
                    onChange={handleUserChange}
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
                  onChange={handleUserChange}
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
                  onChange={handleUserChange}
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
                  onChange={handleUserChange}
                  size="md"
                />
              </FormControl>

              <Button
                type="submit"
                bg="cyan.600"
                color="white"
                loadingText="Loading"
                size="md"
                width="fit-content"
                mt={4}
                isLoading={updateProfileLoading}
                isDisabled={updateProfileLoading}
              >
                {updateProfileLoading ? <Spinner size="sm" /> : 'Save Changes'}
              </Button>
            </form>

            {/* Password Update Section */}
            <Box mt={20}>
              <Heading as="h5" size="lg" mb={4}>
                Update Password
              </Heading>
              <UpdatePassword />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default UserProfileEditPage;
