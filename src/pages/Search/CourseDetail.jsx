import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Flex,
  Button,
  Icon,
  Avatar,
  Stack,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { FaClock, FaBook, FaHeart, FaShareAlt, FaStar } from 'react-icons/fa';
import FAQ from './FAQ';
import Reviews from './Reviews';
import Curriculum from './Curriculum';
import Announcement from './Announcement';
import Description from './Description';
import CourseRandom from './CourseRandom';
import RelateCourse from './RelateCourse';
import { useNavigate, useParams } from 'react-router-dom';
import courseService from '~/services/courseService';
import cartService from '~/services/cartService';
import enrollmentService from '~/services/enrollmentService';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import websocketService from '~/services/websocketService';
import { websocketConstants } from '~/utils/websocketConstants';
import authService from '~/services/authService';
import { getUsername } from '~/utils/authUtils';

function CourseDetails() {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [buttonState, setButtonState] = useState('loading'); // State to control the button text
  const { courseId } = useParams();

  const loadCourseData = async () => {
    const response = await courseService.fetchMainCourse({ id: courseId });
    if (response) setCourseData(response);
  };

  useEffect(() => {
    websocketService.connect(() => {});

    // Cleanup function to unsubscribe and disconnect WebSocket on unmount
    return () => {
      websocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    // Load course data on mount
    loadCourseData();
  }, [courseId]);

  useEffect(() => {
    // Logic for determining button state
    const checkEnrollmentStatus = async () => {
      try {
        const canAdd = await cartService.canAddToCart(courseId);
        if (canAdd) {
          setButtonState('add-to-cart'); // Show "Add to Cart" if applicable
        } else {
          // If can't add to cart, check enrollment
          const enrollment = await enrollmentService.isEnrolled(courseId);
          if (enrollment && enrollment.progress === 0) {
            setButtonState('start-course'); // Show "Start Course" if progress is 0
          } else if (enrollment && enrollment.progress > 0) {
            setButtonState('continue-course'); // Show "Continue Course" if progress > 0
          }
        }
      } catch (error) {
        // If there's an error (e.g., 500 error), show "In Cart"
        setButtonState('in-cart');
      }
    };

    if (courseData) {
      checkEnrollmentStatus();
    }
  }, [courseData]);

  const handleButtonClick = async () => {
    switch (buttonState) {
      case 'add-to-cart':
        try {
          await cartService.addItemToCart(courseId);
          const addRequest = {
            username: getUsername(),
          };
          websocketService.send(websocketConstants.cartItemCountDestination, addRequest);
          setButtonState('in-cart');
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
        break;
      case 'start-course':
      case 'continue-course':
        navigate(`/learn/${courseId}`);
        break;
      case 'in-cart':
        navigate('/cart');
        break;
      default:
        break;
    }
  };

  if (!courseData) return <Text>Loading...</Text>;

  return (
    <RoleBasedPageLayout>
      <Box maxW="1200px" mx="auto" py={10} px={5}>
        <Flex justify="space-between" direction={['column', 'column', 'row']}>
          <Box flex="2">
            <Text color="gray.500" fontSize="sm">
              {courseData.topic.name}
            </Text>
            <Text fontSize="3xl" fontWeight="bold" mt={2}>
              {courseData.title}
            </Text>
            <Text fontSize="md" mt={4} color="gray.600">
              {courseData.descriptionPreview}
            </Text>

            <Text color="blue.500" mt={2} cursor="pointer">
              Show less
            </Text>

            <Flex align="center" mt={5}>
              <Avatar
                name={courseData.ownerUsername || 'Instructor Name'}
                src="https://bit.ly/ryan-florence"
                size="lg"
              />
              <Box ml={4}>
                <Text fontWeight="bold">Instructor</Text>
                <Text color="blue.500">
                  {courseData.ownerUsername || 'Instructor Name'}
                </Text>
              </Box>
              <Box ml={10}>
                <Text fontWeight="bold">{courseData.countStudent}</Text>
                <Text>Students enrolled</Text>
              </Box>
              <Box ml={10}>
                <Flex align="center">
                  {[...Array(Math.round(courseData.rating))].map((_, i) => (
                    <Icon key={i} as={FaStar} color="orange.400" />
                  ))}
                  {[...Array(5 - Math.round(courseData.rating))].map((_, i) => (
                    <Icon key={i + 5} as={FaStar} color="gray.300" />
                  ))}
                  <Text ml={2}>
                    {courseData.ratingCount} review
                    {courseData.ratingCount !== 1 ? 's' : ''}
                  </Text>
                </Flex>
              </Box>
            </Flex>

            <Box mt={10}>
              <Tabs variant="unstyled">
                <TabList>
                  <Tab
                    _selected={{
                      color: 'blue.500',
                      borderBottom: '2px solid',
                      borderColor: 'blue.500',
                    }}
                  >
                    Description
                  </Tab>
                  <Tab
                    _selected={{
                      color: 'blue.500',
                      borderBottom: '2px solid',
                      borderColor: 'blue.500',
                    }}
                  >
                    Curriculum
                  </Tab>
                  <Tab
                    _selected={{
                      color: 'blue.500',
                      borderBottom: '2px solid',
                      borderColor: 'blue.500',
                    }}
                  >
                    FAQ
                  </Tab>
                  <Tab
                    _selected={{
                      color: 'blue.500',
                      borderBottom: '2px solid',
                      borderColor: 'blue.500',
                    }}
                  >
                    Announcement
                  </Tab>
                  <Tab
                    _selected={{
                      color: 'blue.500',
                      borderBottom: '2px solid',
                      borderColor: 'blue.500',
                    }}
                  >
                    Reviews
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Description courseId={courseId} />
                  </TabPanel>
                  <TabPanel>
                    <Curriculum courseId={courseId} />
                  </TabPanel>
                  <TabPanel>
                    <FAQ courseId={courseId} />
                  </TabPanel>
                  <TabPanel>
                    <Announcement courseId={courseId} />
                  </TabPanel>
                  <TabPanel>
                    <Reviews
                      courseId={courseId}
                      instructorName={courseData.ownerUsername}
                      buttonState={buttonState}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
            <Box mt={10}>
              <RelateCourse />
            </Box>
          </Box>

          <Box flex="1" mt={[8, 8, 0]} pl={[0, 0, 10]}>
            <Flex justify="space-between" mb={4}>
              <Button leftIcon={<FaHeart />} variant="ghost" colorScheme="gray">
                Add to wishlist
              </Button>
              <Button
                leftIcon={<FaShareAlt />}
                variant="ghost"
                colorScheme="gray"
              >
                Share
              </Button>
            </Flex>

            <Button
              colorScheme="blue"
              size="lg"
              w="100%"
              onClick={handleButtonClick}
              isDisabled={buttonState === 'loading'}
            >
              {buttonState === 'loading' && 'Loading...'}
              {buttonState === 'add-to-cart' && 'Add to Cart'}
              {buttonState === 'in-cart' && 'In Cart'}
              {buttonState === 'start-course' && 'Start Course'}
              {buttonState === 'continue-course' && 'Continue Course'}
            </Button>

            <Box mt={6}>
              <Text fontWeight="bold" fontSize="lg" mb={4}>
                Course details
              </Text>
              <Stack spacing={3}>
                <HStack>
                  <Icon as={FaClock} color="gray.500" />
                  <Text>Duration</Text>
                  <Text ml="auto" fontWeight="bold">
                    {courseData.duration} hours
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FaBook} color="gray.500" />
                  <Text>Lectures</Text>
                  <Text ml="auto" fontWeight="bold">
                    {courseData.countSection}
                  </Text>
                </HStack>

                <HStack>
                  <Icon as={FaBook} color="gray.500" />
                  <Text>Level</Text>
                  <Text ml="auto" fontWeight="bold">
                    {courseData.level.name}
                  </Text>
                </HStack>
              </Stack>
            </Box>
            <Box mt={6}>
              <Text fontWeight="bold" fontSize="lg" mb={4}>
                Related Courses
              </Text>
              <CourseRandom />
            </Box>
          </Box>
        </Flex>
      </Box>
    </RoleBasedPageLayout>
  );
}

export default CourseDetails;
