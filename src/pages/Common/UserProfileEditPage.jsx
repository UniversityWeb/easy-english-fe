import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Skeleton,
  Progress,
} from '@chakra-ui/react';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import userService from '~/services/userService';
import UploadAvatar from '~/components/User/UploadAvatar';
import AuthService from '~/services/authService';
import authService from '~/services/authService';
import useCustomToast from '~/hooks/useCustomToast';
import VerifyOtpModal from '~/components/VerifyOtpModal';
import { validatePassword } from '~/utils/methods';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import ValidationErrors from '~/components/ValidationErrors';
import UserSettings from '~/components/UserSettings';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '~/components/LanguageSwitcher';
import { USER_ROLES } from '~/utils/constants';
import { getCurrentUserRole } from '~/utils/authUtils';

const UpdatePassword = () => {
  const { t } = useTranslation();
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [isOpenVerifyOtpModel, setIsOpenVerifyOtpModel] = useState(false);
  const { successToast, errorToast } = useCustomToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });

    if (name === 'password' || name === 'confirmPassword') {
      const errors = validatePassword(
        name === 'password' ? value : passwordData.password,
        name === 'confirmPassword' ? value : passwordData.confirmPassword,
      );
      setValidationErrors(errors);
    }
  };

  const generateOtpToUpdatePassword = async (e) => {
    e.preventDefault();
    const errors = validatePassword(
      passwordData.password,
      passwordData.confirmPassword,
    );
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
      errorToast('Error generating otp');
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
      };
      await authService.updatePasswordWithOtp(updatePassReq);
      setPasswordData({
        password: '',
        confirmPassword: '',
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
            <FormLabel>{t('common.new_password')}</FormLabel>
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
            <FormLabel>{t('common.confirm_password')}</FormLabel>
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
            {loadingPassword ? (
              <Spinner size="sm" />
            ) : (
              t('common.update_password')
            )}
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
        <ValidationErrors errors={validationErrors} />
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

const ActiveSessions = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [revokeAllLoading, setRevokeAllLoading] = useState(false);
  const { successToast, errorToast } = useCustomToast();

  const [filterDevice, setFilterDevice] = useState('');
  const [filterIp, setFilterIp] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState('expiryDate');
  const [sortDirection, setSortDirection] = useState('DESC');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const filters = [];
      if (filterDevice.trim()) {
        filters.push({ field: 'deviceInfo', operator: 'CONTAINS', value: filterDevice.trim() });
      }
      if (filterIp.trim()) {
        filters.push({ field: 'ipAddress', operator: 'CONTAINS', value: filterIp.trim() });
      }
      if (filterLocation.trim()) {
        filters.push({ field: 'loginLocation', operator: 'CONTAINS', value: filterLocation.trim() });
      }

      const searchRequest = {
        page,
        size: 5,
        sort: [{ field: sortField, direction: sortDirection }],
        filters
      };

      const data = await AuthService.getActiveSessions(searchRequest);
      if (data) {
        setSessions(data.content || []);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSessions();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, filterDevice, filterIp, filterLocation, sortField, sortDirection]);

  useEffect(() => {
    setPage(0);
  }, [filterDevice, filterIp, filterLocation]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortField(field);
      setSortDirection('ASC');
    }
    setPage(0);
  };

  const renderSortHeader = (field, labelKey, defaultLabel) => {
    const isCurrent = sortField === field;
    return (
      <Th
        cursor="pointer"
        onClick={() => handleSort(field)}
        userSelect="none"
        _hover={{ color: 'cyan.600' }}
      >
        {t(labelKey, defaultLabel)}
        {isCurrent ? (sortDirection === 'ASC' ? ' ▲' : ' ▼') : ' ⇅'}
      </Th>
    );
  };

  const handleRevoke = async (id) => {
    setActionLoading(id);
    try {
      await AuthService.revokeSession(id);
      successToast(t('session.revoked_success', 'Session revoked successfully'));
      fetchSessions();
    } catch (error) {
      errorToast(error.message || t('session.revoked_failed', 'Failed to revoke session'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeAll = async () => {
    setRevokeAllLoading(true);
    try {
      await AuthService.revokeAllSessions();
      successToast(t('session.revoke_all_success', 'All other sessions revoked successfully'));
      fetchSessions();
    } catch (error) {
      errorToast(error.message || t('session.revoke_all_failed', 'Failed to revoke other sessions'));
    } finally {
      setRevokeAllLoading(false);
    }
  };

  const parseUserAgent = (ua) => {
    if (!ua) return t('session.unknown_device', 'Unknown Device');
    if (ua.includes('Mobi') || ua.includes('Android') || ua.includes('iPhone')) {
      return t('session.mobile_device', 'Mobile Device');
    }
    let browser = t('session.browser', 'Browser');
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    let os = t('session.os', 'OS');
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';

    return `${browser} on ${os}`;
  };

  return (
    <Box
      borderWidth={1}
      borderRadius="lg"
      p={5}
      mt={4}
      bg="white"
      boxShadow="sm"
      position="relative"
      overflow="hidden"
    >
      {loading && (
        <Progress
          size="xs"
          isIndeterminate
          colorScheme="cyan"
          position="absolute"
          top={0}
          left={0}
          right={0}
        />
      )}
      <Stack
        spacing={4}
        opacity={loading ? 0.6 : 1}
        pointerEvents={loading ? 'none' : 'auto'}
        transition="opacity 0.2s"
      >
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={3} mb={3}>
          <Input
            placeholder={t('session.filter_device_placeholder', 'Filter by Device (e.g. Chrome)...')}
            value={filterDevice}
            onChange={(e) => setFilterDevice(e.target.value)}
            size="sm"
            borderRadius="md"
          />
          <Input
            placeholder={t('session.filter_ip_placeholder', 'Filter by IP Address...')}
            value={filterIp}
            onChange={(e) => setFilterIp(e.target.value)}
            size="sm"
            borderRadius="md"
          />
          <Input
            placeholder={t('session.filter_location_placeholder', 'Filter by Location...')}
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            size="sm"
            borderRadius="md"
          />
        </Grid>

        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              {renderSortHeader('deviceInfo', 'session.device', 'Device')}
              {renderSortHeader('ipAddress', 'session.ip_address', 'IP Address')}
              {renderSortHeader('loginLocation', 'session.location', 'Location')}
              <Th>{t('session.status', 'Status')}</Th>
              <Th textAlign="right">{t('session.action', 'Action')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sessions.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center" py={4} color="gray.500">
                  {t('session.no_sessions_found', 'No active sessions found matching criteria.')}
                </Td>
              </Tr>
            ) : (
              sessions.map((session) => {
                const isCurrent = session.current || session.isCurrent;
                return (
                  <Tr key={session.id}>
                    <Td fontWeight="medium">{parseUserAgent(session.deviceInfo)}</Td>
                    <Td color="gray.600">{session.ipAddress || 'Unknown'}</Td>
                    <Td color="gray.600">{session.loginLocation || 'Unknown'}</Td>
                    <Td>
                      {isCurrent ? (
                        <Badge colorScheme="green" variant="solid" borderRadius="full" px={2}>
                          {t('session.current_device', 'Current Device')}
                        </Badge>
                      ) : (
                        <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={2}>
                          {t('session.active', 'Active')}
                        </Badge>
                      )}
                    </Td>
                    <Td textAlign="right">
                      {!isCurrent && (
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="outline"
                          isLoading={actionLoading === session.id}
                          onClick={() => handleRevoke(session.id)}
                        >
                          {t('session.revoke', 'Revoke')}
                        </Button>
                      )}
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>

        {totalPages > 1 && (
          <Flex justifyContent="space-between" alignItems="center" mt={2}>
            <Button
              size="xs"
              colorScheme="cyan"
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              isDisabled={page === 0}
            >
              {t('session.previous', 'Previous')}
            </Button>
            <Text fontSize="xs" color="gray.600">
              {t('session.page', 'Page')} {page + 1} {t('session.of', 'of')} {totalPages}
            </Text>
            <Button
              size="xs"
              colorScheme="cyan"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              isDisabled={page >= totalPages - 1}
            >
              {t('session.next', 'Next')}
            </Button>
          </Flex>
        )}

        {sessions.length > 1 && (
          <Button
            size="sm"
            colorScheme="red"
            variant="solid"
            width="fit-content"
            isLoading={revokeAllLoading}
            onClick={handleRevokeAll}
            alignSelf="flex-end"
          >
            {t('session.logout_other_devices', 'Logout from All Other Devices')}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

const UserProfileEditPage = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    gender: 'MALE',
    dob: '',
  });
  const [loadingUser, setLoadingUser] = useState(true);
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
        const currentUser = await AuthService.getCurUser();
        setUser(currentUser);

        if (currentUser && currentUser.avatarPath) {
          await new Promise((resolve) => {
            const img = new window.Image();
            img.src = currentUser.avatarPath;
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }
      } catch (e) {
        console.log(e?.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  if (loadingUser) {
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
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start"
              >
                <Skeleton borderRadius="full" boxSize="150px" mb={4} />
                <Skeleton height="20px" width="100px" />
              </Box>
            </GridItem>

            <GridItem>
              <Skeleton height="30px" width="200px" mb={6} />
              <Stack spacing={6}>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <Box><Skeleton height="20px" width="100px" mb={2} /><Skeleton height="40px" /></Box>
                  <Box><Skeleton height="20px" width="100px" mb={2} /><Skeleton height="40px" /></Box>
                </Grid>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <Box><Skeleton height="20px" width="100px" mb={2} /><Skeleton height="40px" /></Box>
                  <Box><Skeleton height="20px" width="100px" mb={2} /><Skeleton height="40px" /></Box>
                </Grid>
                <Box><Skeleton height="20px" width="100px" mb={2} /><Skeleton height="80px" /></Box>
                <Box><Skeleton height="20px" width="100px" mb={2} /><Skeleton height="30px" width="300px" /></Box>
                <Box><Skeleton height="20px" width="100px" mb={2} /><Skeleton height="40px" /></Box>
                <Skeleton height="40px" width="150px" />
              </Stack>
            </GridItem>
          </Grid>
        </Box>
      </RoleBasedPageLayout>
    );
  }

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
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-start"
            >
              <UploadAvatar user={user} setUser={setUser} mb={4} />
              <Text fontSize="sm" color="gray.500">
                {t('common.role')}: {user?.role}
              </Text>
            </Box>
          </GridItem>

          <GridItem>
            <Heading as="h5" size="lg" mb={4}>
              {t('common.information')}
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
                    {t('common.username')}
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
                    {t('common.full_name')}
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
                    {t('common.email')}
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
                    {t('common.phone_number')}
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
                  {t('common.bio')}
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
                  {t('common.gender')}
                </FormLabel>
                <RadioGroup
                  name="gender"
                  value={user.gender}
                  onChange={handleUserChange}
                >
                  <Stack direction="row" spacing={8}>
                    <Radio value="MALE" size="md">
                      {t('common.male')}
                    </Radio>
                    <Radio value="FEMALE" size="md">
                      {t('common.female')}
                    </Radio>
                    <Radio value="OTHER" size="md">
                      {t('common.other')}
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl id="dob" mb={6}>
                <FormLabel fontSize="md" fontWeight="medium">
                  {t('common.dob')}
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
                {updateProfileLoading ? (
                  <Spinner size="sm" />
                ) : (
                  t('common.save_changes')
                )}
              </Button>
            </form>

            {/* Password Update Section */}
            <Box mt={20}>
              <Heading as="h5" size="lg" mb={4}>
                {t('common.update_password')}
              </Heading>
              <UpdatePassword />
            </Box>

            {(getCurrentUserRole() === USER_ROLES.TEACHER ||
              getCurrentUserRole() === USER_ROLES.ADMIN) && (
              <Box mt={20}>
                <Heading as="h5" size="lg" mb={4}>
                  {t('profile.settings')}
                </Heading>
                <UserSettings user={user} />
              </Box>
            )}

            <Box mt={20}>
              <Heading as="h5" size="lg" mb={4}>
                {t('profile.active_sessions', 'Active Sessions')}
              </Heading>
              <ActiveSessions />
            </Box>

            <Box mt={20}>
              <Heading as="h5" size="lg" mb={4}>
                {t('common.language')}
              </Heading>
              <LanguageSwitcher />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default UserProfileEditPage;
