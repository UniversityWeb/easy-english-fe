import React, { useEffect, useState } from 'react';
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Divider,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { TbClockHour4 } from 'react-icons/tb';
import { ChakraProvider } from '@chakra-ui/react';
import courseService from '~/services/courseService';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

const EnrollCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseRequest = { username: 'hungsam' };
        const response = await courseService.getEnrollCourse(courseRequest);
        if (response) {
          setCourses(response);
        } else {
          console.log('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <ChakraProvider>
        <Box p={5} textAlign="center">
          <Spinner size="xl" />
          <Text mt={4}>Loading courses...</Text>
        </Box>
      </ChakraProvider>
    );
  }

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
        <HStack spacing={5} wrap="wrap" justify="start">
          {courses.map((course) => (
            <Box
              key={course.id}
              width="300px"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              maxW="sm"
              height="450px"
              display="flex"
              flexDirection="column"
            >
              <Box height="200px" overflow="hidden">
                <Image
                  src={course.image || course.imagePreview}
                  alt={course.title}
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
              </Box>

              <Box p={6} flex="1" display="flex" flexDirection="column">
                <VStack align="start" spacing={2} flex="1">
                  <VStack align="start" spacing={1} minHeight="80px">
                    {' '}
                    {/* Adjust minHeight to equalize title area */}
                    <Text fontSize="sm" color="gray.500">
                      {course.topic.name || 'Uncategorized'}
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
                      {course.title}
                    </Text>
                  </VStack>

                  <HStack spacing={4} width="100%">
                    <Flex justify="space-between" width="100%">
                      <HStack>
                        <Icon as={TbClockHour4} />
                        <Text fontSize="sm">
                          {course.duration || 'N/A'} hours
                        </Text>
                      </HStack>
                      <Text fontSize="sm">
                        {course.progress || 0}% Complete
                      </Text>
                    </Flex>
                  </HStack>

                  <Box mt="auto" width="100%">
                    {' '}
                    {/* Forces the button to the bottom */}
                    <Button colorScheme="blue" width="full">
                      Start Course
                    </Button>
                  </Box>

                  <Divider />

                  <Text
                    fontSize="sm"
                    color="gray.500"
                    textAlign="center"
                    width="full"
                  >
                    Started{' '}
                    {course.createdAt
                      ? new Date(course.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </Text>
                </VStack>
              </Box>
            </Box>
          ))}
        </HStack>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default EnrollCoursePage;
