import React, { useState, useEffect } from 'react';
import {
  Box,
  Image,
  Text,
  Flex,
  HStack,
  Button,
  Icon,
  VStack,
  ChakraProvider,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { IoBookOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { LuBarChart } from 'react-icons/lu';
import { TbClockHour4 } from 'react-icons/tb';
import courseService from '~/services/courseService';
import { useNavigate } from 'react-router-dom';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

const Rating = ({ rating }) => {
  return (
    <HStack spacing="1">
      {Array(5)
        .fill('')
        .map((_, i) => (
          <StarIcon key={i} color={i < rating ? 'yellow.400' : 'gray.300'} />
        ))}
      <Text fontSize="sm" ml="2">
        {rating}
      </Text>
    </HStack>
  );
};

const Wishlist = () => {
  const [courses, setCourses] = useState([]);
  const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseRequest = { username: 'hungsam' };
        const response =
          await courseService.getCourseOfFavourite(courseRequest);
        if (response) {
          setCourses(response);
        }
      } catch (error) {
        console.error('Error fetching courses', error);
      }
    };

    fetchCourses();
  }, []);

  const removeFromWishlist = async (id) => {
    try {
      const courseRequest = { username: 'hungsam', id: id };
      await courseService.deleteCourseOfFavourite(courseRequest);

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id),
      );
    } catch (error) {
      console.error('Error removing course from wishlist', error);
    }
  };

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
        <HStack spacing={5} wrap="wrap" justify="center">
          {courses.map((course) => (
            <Box
              key={course.id}
              width="300px"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              height="370px"
              position="relative"
              onMouseEnter={() => setHoveredCourseId(course.id)}
              onMouseLeave={() => setHoveredCourseId(null)}
            >
              <Box height="200px" overflow="hidden">
                <Image
                  src={course.imagePreview}
                  alt={course.title}
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
              </Box>

              <Box p={6}>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.500">
                    {course.topic.name || 'No topic'}
                  </Text>

                  <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
                    {course.title}
                  </Text>

                  <Flex justify="space-between" align="center" width="100%">
                    <Rating rating={course.rating} />
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      color="gray.700"
                      _hover={{ color: 'blue.500' }}
                    >
                      {course.price?.salePrice > 0
                        ? `$${course.price.salePrice}`
                        : `$${course.price.price}`}
                    </Text>
                  </Flex>
                  {hoveredCourseId === course.id && (
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      bg="white"
                      p="6"
                      borderRadius="lg"
                      boxShadow="md"
                      zIndex="10"
                    >
                      <Text fontSize="sm" fontWeight="bold" mb="2">
                        Demo Instructor
                      </Text>

                      <Text fontWeight="bold" fontSize="lg" mb="3">
                        {course.title}
                      </Text>

                      <Rating rating={course.rating} />

                      <Text fontSize="sm" mt="3" noOfLines={3}>
                        {course.description || 'No description available.'}
                      </Text>

                      <Flex mt="4" alignItems="center" justify="space-between">
                        <HStack spacing="1">
                          <Icon as={LuBarChart} boxSize={5} color="gray.600" />
                          <Text fontSize="sm">
                            {course.level?.name || 'No level'}
                          </Text>
                        </HStack>
                        <HStack spacing="1">
                          <Icon
                            as={IoBookOutline}
                            boxSize={5}
                            color="gray.600"
                          />
                          <Text fontSize="sm">
                            {course.countSection} Lectures
                          </Text>
                        </HStack>
                        <HStack spacing="1">
                          <Icon
                            as={TbClockHour4}
                            boxSize={5}
                            color="gray.600"
                          />
                          <Text fontSize="sm">{course.duration} hours</Text>
                        </HStack>
                      </Flex>

                      <Button
                        mt="4"
                        colorScheme="blue"
                        size="sm"
                        width="full"
                        onClick={() =>
                          navigate(`/course-view-detail/${course.id}`)
                        }
                      >
                        PREVIEW THIS COURSE
                      </Button>

                      <Flex mt="2" justify="space-between">
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => removeFromWishlist(course.id)}
                          leftIcon={<Icon as={FaHeart} color="red.500" />}
                        >
                          Remove from Wishlist
                        </Button>
                        <Text fontWeight="bold" color="gray.700">
                          {course.price?.salePrice > 0
                            ? `$${course.price.salePrice}`
                            : `$${course.price.price}`}
                        </Text>
                      </Flex>
                    </Box>
                  )}
                </VStack>
              </Box>
            </Box>
          ))}
        </HStack>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default Wishlist;
