import React, { useEffect, useState } from 'react';
import config from '~/config';
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
import {
  FaClock,
  FaBook,
  FaVideo,
  FaClipboardCheck,
  FaLevelUpAlt,
  FaHeart,
  FaShareAlt,
  FaStar,
} from 'react-icons/fa';
import FAQ from './FAQ';
import Reviews from './Reviews';
import Curriculum from './Curriculum';
import Announcement from './Announcement';
import Description from './Description';
import CourseRandom from './CourseRandom';
import RelateCourse from './RelateCourse';
import { useNavigate, useParams } from 'react-router-dom';
import courseService from '~/services/courseService';

function CourseDetails() {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const { courseId } = useParams();

  const loadCourseData = async () => {
    const response = await courseService.fetchMainCourse({ id: courseId });
    if (response) setCourseData(response);
  };

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  // Add refresh handler to update course data
  const handleReviewUpdate = async () => {
    await loadCourseData();
  };

  if (!courseData) return <Text>Loading...</Text>;

  if (!courseData) return <Text>Loading...</Text>;

  return (
    <ChakraProvider>
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
                      onReviewUpdate={handleReviewUpdate}
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
              onClick={() => navigate(`/learn/${courseId}`)}
            >
              START COURSE
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
                  <Icon as={FaLevelUpAlt} color="gray.500" />
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
    </ChakraProvider>
  );
}

export default CourseDetails;
