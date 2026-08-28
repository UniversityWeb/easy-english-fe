import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import {
  FaBook,
  FaClock,
  FaHeart,
  FaStar,
} from 'react-icons/fa';
import { IoChatbox } from 'react-icons/io5';
import FAQ from '@/components/organisms/FAQ';
import Reviews from '@/components/organisms/Reviews';
import Curriculum from '@/components/organisms/StudentCourseDetailCurriculum';
import Announcement from '@/components/organisms/Announcement';
import Description from '@/components/organisms/Description';
import CourseRandom from '@/components/organisms/CourseRandom';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import courseService from '@/services/courseService';
import cartService from '@/services/cartService';
import RoleBasedPageLayout from '@/components/organisms/RoleBasedPageLayout';
import { websocketConstants } from '@/utils/websocketConstants';
import { getUsername } from '@/utils/authUtils';
import config from '@/config';
import WebsocketService from '@/services/websocketService';
import favouriteService from '@/services/favouriteService';
import useCustomToast from '@/hooks/useCustomToast';
import PriceDisplay from '@/components/atoms/PriceDisplay';
import RelatedBundle from '@/components/organisms/RelateBundle';

const CourseDetailBtnStat = {
  START_COURSE: 'START_COURSE',
  CONTINUE_COURSE: 'CONTINUE_COURSE',
  IN_CART: 'IN_CART',
  ADD_TO_CART: 'ADD_TO_CART',
  LOADING: 'LOADING',
  COMPLETED: 'COMPLETED',
};

function CourseDetailsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courseData, setCourseData] = useState<any>(null);
  const [buttonState, setButtonState] = useState(CourseDetailBtnStat.LOADING);
  const { courseId } = useParams<{ courseId: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const { successToast, errorToast } = useCustomToast();

  const activeTab = searchParams.get('tab') || 'description';

  const loadCourseData = async () => {
    try {
      const response = await courseService.fetchMainCourse({ id: courseId });
      if (response) setCourseData(response);
    } catch (e) {
      errorToast('Error loading course data');
    }
  };

  const checkCourseInFavourite = async () => {
    try {
      const response = await favouriteService.checkCourseInFavourite(courseId);
      if (response) setIsLiked(response);
    } catch (e) {
      errorToast('Error checking course in favourite');
    }
  };

  const fetchButtonStat = async () => {
    try {
      const btnStat = await courseService.getCourseDetailButtonStatus(courseId);
      setButtonState(btnStat);
    } catch (e) {
      setButtonState(CourseDetailBtnStat.LOADING);
    }
  };

  const toggleWishlist = async (id: any, liked: boolean) => {
    try {
      if (liked) {
        await favouriteService.deleteFavourite(id);
        setIsLiked(false);
        successToast('Removed from wishlist');
      } else {
        await favouriteService.addFavourite(id);
        setIsLiked(true);
        successToast('Added to wishlist');
      }
    } catch (error) {
      errorToast('Error toggling wishlist');
    }
  };

  const addToCart = async () => {
    try {
      await cartService.addItemToCart(courseId);
      successToast('Added to cart');
      const addRequest = {
        username: getUsername(),
      };
      const wsService = await WebsocketService.getIns();
      wsService.send(websocketConstants.cartItemCountDestination, addRequest);
      setButtonState(CourseDetailBtnStat.IN_CART);
    } catch (error) {
      errorToast('Error adding to cart');
    }
  };

  useEffect(() => {
    loadCourseData();
    fetchButtonStat();
    checkCourseInFavourite();

    window.scrollTo(0, 0);
  }, [courseId]);

  const handleButtonClick = async () => {
    switch (buttonState) {
      case CourseDetailBtnStat.ADD_TO_CART:
        await addToCart();
        break;
      case CourseDetailBtnStat.START_COURSE:
      case CourseDetailBtnStat.CONTINUE_COURSE:
      case CourseDetailBtnStat.COMPLETED:
        localStorage.setItem('previousPageMain', window.location.href);
        navigate(config.routes.learn(courseId, courseData?.title));
        break;
      case CourseDetailBtnStat.IN_CART:
        navigate(config.routes.cart);
        break;
      default:
        break;
    }
  };

  const handleTabChange = (index: number) => {
    const tabMapping = [
      'description',
      'curriculum',
      'faq',
      'announcement',
      'reviews',
    ];
    setSearchParams({ tab: tabMapping[index] });
  };

  const getTabIndex = () => {
    const tabMapping: Record<string, number> = {
      description: 0,
      curriculum: 1,
      faq: 2,
      announcement: 3,
      reviews: 4,
    };
    return tabMapping[activeTab] || 0;
  };

  if (!courseData) return <Text p={8}>Loading course details...</Text>;

  return (
    <RoleBasedPageLayout>
      <Box maxW="1200px" mx="auto" py={10} px={5}>
        <Flex justify="space-between" direction={['column', 'column', 'row']} gap={8}>
          <Box flex="2">
            <Text color="blue.600" fontSize="sm" fontWeight="bold" textTransform="uppercase">
              {courseData?.topic?.name}
            </Text>

            <Text fontSize="3xl" fontWeight="bold" mt={2} color="gray.900">
              {courseData?.title}
            </Text>

            <Text fontSize="md" mt={4} color="gray.600">
              {courseData?.descriptionPreview}
            </Text>

            <Flex align="center" mt={5} wrap="wrap" gap={6}>
              <Flex align="center">
                <Avatar
                  name={courseData?.owner?.fullName || 'Teacher Name'}
                  src={courseData?.owner?.avatarPath}
                  size="md"
                />
                <Box ml={3}>
                  <Text fontSize="xs" color="gray.500">Instructor</Text>
                  <Text
                    fontWeight="bold"
                    color="blue.600"
                    cursor="pointer"
                    onClick={() =>
                      navigate(config.routes.teacher(courseData?.owner?.username))
                    }
                  >
                    {courseData?.owner?.fullName || 'Teacher Name'}
                  </Text>
                </Box>
              </Flex>

              <Box>
                <Text fontWeight="bold" fontSize="md">{courseData?.countStudent || 0}</Text>
                <Text fontSize="xs" color="gray.500">Students enrolled</Text>
              </Box>

              <Box>
                <Flex align="center">
                  {[...Array(Math.round(courseData?.rating || 0))].map((_, i) => (
                    <Icon key={i} as={FaStar} color="orange.400" boxSize={3.5} />
                  ))}
                  {[...Array(5 - Math.round(courseData?.rating || 0))].map(
                    (_, i) => (
                      <Icon key={i + 5} as={FaStar} color="gray.300" boxSize={3.5} />
                    ),
                  )}
                  <Text ml={2} fontSize="sm" fontWeight="semibold">
                    {courseData?.rating ? Number(courseData.rating).toFixed(1) : '0.0'} ({courseData?.ratingCount || 0} reviews)
                  </Text>
                </Flex>
              </Box>
            </Flex>

            <Box mt={10}>
              <Tabs
                variant="unstyled"
                index={getTabIndex()}
                onChange={handleTabChange}
              >
                <TabList borderBottom="1px solid" borderColor="gray.200">
                  <Tab
                    pb={3}
                    fontWeight="semibold"
                    _selected={{
                      color: 'blue.600',
                      borderBottom: '2px solid',
                      borderColor: 'blue.600',
                    }}
                  >
                    Description
                  </Tab>
                  <Tab
                    pb={3}
                    fontWeight="semibold"
                    _selected={{
                      color: 'blue.600',
                      borderBottom: '2px solid',
                      borderColor: 'blue.600',
                    }}
                  >
                    Curriculum
                  </Tab>
                  <Tab
                    pb={3}
                    fontWeight="semibold"
                    _selected={{
                      color: 'blue.600',
                      borderBottom: '2px solid',
                      borderColor: 'blue.600',
                    }}
                  >
                    FAQ
                  </Tab>
                  <Tab
                    pb={3}
                    fontWeight="semibold"
                    _selected={{
                      color: 'blue.600',
                      borderBottom: '2px solid',
                      borderColor: 'blue.600',
                    }}
                  >
                    Announcement
                  </Tab>
                  <Tab
                    pb={3}
                    fontWeight="semibold"
                    _selected={{
                      color: 'blue.600',
                      borderBottom: '2px solid',
                      borderColor: 'blue.600',
                    }}
                  >
                    Reviews
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <Description courseId={courseId} />
                  </TabPanel>
                  <TabPanel px={0}>
                    <Curriculum courseId={courseId} />
                  </TabPanel>
                  <TabPanel px={0}>
                    <FAQ courseId={courseId} />
                  </TabPanel>
                  <TabPanel px={0}>
                    <Announcement courseId={courseId} />
                  </TabPanel>
                  <TabPanel px={0}>
                    <Reviews
                      courseId={courseId}
                      instructorName={courseData?.ownerUsername}
                      buttonState={buttonState}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
            <Box mt={10}>
              <RelatedBundle
                courseId={courseId}
                numberOfCourses={3}
                type={'LEVEL'}
              />
            </Box>
          </Box>

          {/* Right Sticky Sidebar with Price Card */}
          <Box flex="1" minW={{ base: '100%', md: '340px' }} maxW={{ base: '100%', md: '380px' }}>
            <Box
              p={6}
              bg="white"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="gray.200"
              boxShadow="lg"
              position="sticky"
              top="100px"
            >
              {/* Prominent Price Display */}
              <Box mb={6} pb={4} borderBottom="1px solid" borderColor="gray.100">
                <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase" letterSpacing="wide" mb={1}>
                  Tuition Fee
                </Text>
                <PriceDisplay
                  priceResponse={courseData?.price}
                  primaryColor="blue.600"
                  fontSize="3xl"
                  fontWeight="extrabold"
                  showFreeBadge
                />
              </Box>

              <Flex justify="space-between" mb={4} gap={2}>
                <Button
                  flex="1"
                  variant="outline"
                  size="sm"
                  colorScheme={isLiked ? 'red' : 'gray'}
                  onClick={() => toggleWishlist(courseId, isLiked)}
                  leftIcon={
                    <Icon as={FaHeart} color={isLiked ? 'red.500' : 'gray.400'} />
                  }
                >
                  {isLiked ? 'Wishlisted' : 'Wishlist'}
                </Button>
                <Button
                  flex="1"
                  leftIcon={<IoChatbox />}
                  variant="outline"
                  size="sm"
                  colorScheme="blue"
                  onClick={() => {
                    navigate(config.routes.chat, {
                      state: {
                        returnUrl: config.routes.course_view_detail.replace(
                          ':courseId',
                          courseData?.id,
                        ),
                        targetCourse: courseData,
                      },
                    });
                  }}
                >
                  Chat
                </Button>
              </Flex>

              <Button
                colorScheme="blue"
                size="lg"
                w="100%"
                borderRadius="xl"
                fontWeight="bold"
                onClick={handleButtonClick}
                isDisabled={buttonState === CourseDetailBtnStat.LOADING}
                _hover={{ bg: 'blue.600' }}
              >
                {buttonState === CourseDetailBtnStat.LOADING && 'Loading...'}
                {buttonState === CourseDetailBtnStat.ADD_TO_CART && 'Add to Cart'}
                {buttonState === CourseDetailBtnStat.IN_CART && 'In Cart'}
                {buttonState === CourseDetailBtnStat.START_COURSE &&
                  'Start Course'}
                {buttonState === CourseDetailBtnStat.CONTINUE_COURSE &&
                  'Continue Course'}
                {buttonState === CourseDetailBtnStat.COMPLETED && 'Completed'}
              </Button>

              <Box mt={6} pt={4} borderTop="1px solid" borderColor="gray.100">
                <Text fontWeight="bold" fontSize="md" mb={4} color="gray.800">
                  Course Features
                </Text>
                <Stack spacing={3} fontSize="sm">
                  <HStack justify="space-between">
                    <HStack spacing={2} color="gray.600">
                      <Icon as={FaClock} color="blue.500" />
                      <Text>Duration</Text>
                    </HStack>
                    <Text fontWeight="bold">
                      {courseData?.duration ? `${courseData.duration} hours` : 'Self-paced'}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <HStack spacing={2} color="gray.600">
                      <Icon as={FaBook} color="blue.500" />
                      <Text>Lessons</Text>
                    </HStack>
                    <Text fontWeight="bold">
                      {courseData?.countSection || 0}
                    </Text>
                  </HStack>

                  <HStack justify="space-between">
                    <HStack spacing={2} color="gray.600">
                      <Icon as={FaBook} color="blue.500" />
                      <Text>Level</Text>
                    </HStack>
                    <Text fontWeight="bold">
                      {courseData?.level?.name || 'All Levels'}
                    </Text>
                  </HStack>
                </Stack>
              </Box>

              <Box mt={6}>
                <Text fontWeight="bold" fontSize="md" mb={3} color="gray.800">
                  Recommended For You
                </Text>
                <CourseRandom
                  courseId={courseId}
                  numberOfCourses={3}
                  type={'TOPIC'}
                />
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>
    </RoleBasedPageLayout>
  );
}

export default CourseDetailsPage;
