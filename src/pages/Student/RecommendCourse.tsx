import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  Image,
  Button,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { getDataCourseAll } from '@/store/courseSlice';
import { useNavigate } from 'react-router-dom';
import enrollmentService from '@/services/enrollmentService';

function RecommendCourse() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const dispatch = useDispatch();
  const { courseDataAll } = useSelector((state: any) => state.course);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmpty(courseDataAll)) {
      dispatch(getDataCourseAll() as any);
    }
  }, [dispatch, courseDataAll]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRequest = {
          pageNumber: 0,
          size: 1000,
          title: null,
          categoryIds: null,
          rating: null,
          topicId: null,
          levelId: null,
        };

        const enrollResponse =
          await enrollmentService.getEnrollByFilter(courseRequest);

        const enrolledCourseIds =
          enrollResponse?.content?.map((enrollment: any) => enrollment.id) || [];
        setEnrolledCourses(enrolledCourseIds);

        const recommendationResponse = await axios.get(
          'http://localhost:8000/recommendations/vanan',
        );
        setData(recommendationResponse.data);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCourseDetails = (courseId: any) => {
    if (!courseDataAll || courseDataAll.length === 0) return null;
    return courseDataAll.find((course: any) => course.id === courseId);
  };

  const isCourseEnrolled = (courseId: any) => {
    return enrolledCourses.includes(courseId);
  };

  if (loading) {
    return (
      <ChakraProvider>
        <Box p={6} textAlign="center">
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Loading recommendations...</Text>
        </Box>
      </ChakraProvider>
    );
  }

  if (error) {
    return (
      <ChakraProvider>
        <Box p={6}>
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        </Box>
      </ChakraProvider>
    );
  }

  const recommendations = data?.recommendations || [];

  const validRecommendations =
    recommendations.filter((recommendation: any) => {
      const courseDetails = getCourseDetails(recommendation.course_id);
      const hasValidDetails =
        courseDetails !== null && courseDetails !== undefined;
      const isNotEnrolled = !isCourseEnrolled(recommendation.course_id);

      return hasValidDetails && isNotEnrolled;
    });

  return (
    <ChakraProvider>
      <Box p={6}>
        <Box mb={8}>
          <Heading size="lg">Recommended Courses for you</Heading>
          {enrolledCourses.length > 0 && (
            <Text fontSize="sm" color="gray.600" mt={2}>
              Showing recommendations excluding {enrolledCourses.length}{' '}
              enrolled course(s)
            </Text>
          )}
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {validRecommendations.map((recommendation: any) => {
            const courseDetails = getCourseDetails(recommendation.course_id);

            return (
              <Box
                key={recommendation.course_id}
                borderWidth="1px"
                borderRadius="xl"
                boxShadow="md"
                p={5}
                _hover={{ shadow: 'lg', borderColor: 'blue.300' }}
                transition="all 0.2s"
                bg="white"
              >
                {courseDetails?.imagePreview && (
                  <Image
                    src={courseDetails.imagePreview}
                    alt={courseDetails.title}
                    borderRadius="md"
                    mb={4}
                    h="180px"
                    w="100%"
                    objectFit="cover"
                  />
                )}

                <Heading size="md" mb={3} noOfLines={2} minH="3em">
                  {courseDetails?.title}
                </Heading>

                <Text fontSize="sm" color="gray.600" mb={4}>
                  Instructor: {courseDetails?.owner?.fullName || 'Unknown'}
                </Text>

                <Button
                  colorScheme="blue"
                  size="md"
                  width="100%"
                  onClick={() => {
                    navigate(`/course-view-detail/${recommendation.course_id}`);
                  }}
                >
                  View Details
                </Button>
              </Box>
            );
          })}
        </SimpleGrid>

        {validRecommendations.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">
              {enrolledCourses.length > 0
                ? 'No new recommendations available. You may have enrolled in all recommended courses!'
                : 'No valid recommendations available at the moment.'}
            </Text>
          </Box>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default RecommendCourse;
