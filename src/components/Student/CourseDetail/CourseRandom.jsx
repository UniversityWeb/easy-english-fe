import React, { useEffect, useState } from 'react';
import {
    Box,
    Image,
    Text,
    Stack,
    Badge,
    HStack,
    VStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import courseService from '~/services/courseService';
import { formatVNDMoney } from '~/utils/methods';
import { useNavigate } from 'react-router-dom';

const RandomCourse = ({ courseId, numberOfCourses, type }) => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const requestPayload = { courseId, numberOfCourses, type };
                const relatedCourses = await courseService.getRelatedCourses(requestPayload);
                setCourses(relatedCourses);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [courseId, numberOfCourses, type]);

    const formatCoursePrice = (price) => {
        const now = new Date();
        const isOnSale =
          price.salePrice > 0 &&
          new Date(price.startDate) <= now &&
          now <= new Date(price.endDate);

        return isOnSale
          ? formatVNDMoney(price.salePrice)
          : formatVNDMoney(price.price);
    };

    if (loading) {
        return <Text>Loading courses...</Text>;
    }

    return (
      <VStack spacing={5} align="stretch">
          {courses.map((course) => (
            <Box
              key={course.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              padding="4"
              boxShadow="sm"
              cursor="pointer"
              _hover={{
                  transform: 'scale(1.05)',
                  transition: 'transform 0.2s ease-in-out',
              }}
              _active={{
                  transform: 'scale(1)',
                  transition: 'transform 0.1s ease-in-out',
              }}
              onClick={async () => {
                  const courseId = course.id;
                  try {
                      await courseService.countView(courseId)
                  } catch (e) {
                      console.error(e);
                  }
                  navigate(`/course-view-detail/${courseId}`);
              }}
            >
                <HStack>
                    <Image
                      boxSize="100px"
                      objectFit="cover"
                      src={course.imagePreview}
                      alt={course.title}
                      borderRadius="md"
                    />
                    <Stack spacing={2} pl={4}>
                        <Text fontWeight="bold" fontSize="lg">
                            {course.title}
                        </Text>
                        <Text fontSize="md" color={course.price.salePrice > 0 ? 'green.500' : 'black'}>
                            {formatCoursePrice(course.price)}
                        </Text>
                        <HStack spacing={1}>
                            {Array(5)
                              .fill('')
                              .map((_, i) => (
                                <StarIcon
                                  key={i}
                                  color={i < course.rating ? 'yellow.400' : 'gray.300'}
                                />
                              ))}
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                            By {course.owner?.fullName || 'Unknown'}
                        </Text>
                    </Stack>
                </HStack>
            </Box>
          ))}
      </VStack>
    );
};

export default RandomCourse;
