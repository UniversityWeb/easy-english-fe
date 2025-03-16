import React, { useEffect, useState } from 'react';
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Divider,
  Container,
  Heading,
  Flex,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { getDataCourse } from '~/store/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
const MotionBox = motion(Box);

export const bundles = [
  {
    title: 'The Complete Communication Skills Master Class for Life',
    totalCourses: 5,
    courses: [
      {
        name: 'Vector Design Basics Masterclass',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$90.99',
      },
      {
        name: 'How to Make Beautiful Landscape photos?',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$39.99',
      },
      {
        name: 'Learning Jazz like in San Francisco',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$0',
      },
      {
        name: 'Introduction to Digital Marketing',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$49.99',
      },
      {
        name: 'Public Speaking Fundamentals',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$29.99',
      },
    ],
    price: { current: '$49.99', old: '$143.97', rating: 4.2, reviews: 5 },
  },
  {
    title: 'The Complete Stock Trading Bundle Course',
    totalCourses: 5,
    courses: [
      {
        name: 'Road Bike Manual',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$12.99',
        oldPrice: '$49.99',
      },
      {
        name: 'How to get comfortable on camera',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$0',
      },
      {
        name: 'Fashion Photography',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$49.99',
      },
      {
        name: 'Learning Jazz like in San Francisco',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$0',
      },
      {
        name: 'Engine Creating on Unity from PRO',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$45.99',
      },
    ],
    price: { current: '$79.99', old: '$108.97', rating: 4.7, reviews: 5 },
  },
  {
    title: 'Master "Technical Analysis and Chart reading skills" Bundle',
    totalCourses: 4,
    courses: [
      {
        name: 'How to be a DJ? Make Electronic Music',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$49.99',
      },
      {
        name: 'Vector Design Basics Masterclass',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$90.99',
      },
      {
        name: 'Road Bike Manual',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$12.99',
        oldPrice: '$49.99',
      },
      {
        name: 'Technical Analysis Fundamentals',
        image:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
        price: '$39.99',
      },
    ],
    price: { current: '$69', old: '$193.96', rating: 4.13, reviews: 4 },
  },
];

const CourseBundle = ({
  title,
  courses,
  totalCourses,
  price,
  isHovered,
  setHovered,
}) => {
  const navigate = useNavigate();

  return (
    <MotionBox
      w="300px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s"
      position="relative"
      bg="white"
      onMouseEnter={() => setHovered(title)}
      onMouseLeave={() => setHovered(null)}
      animate={{ height: isHovered ? 'auto' : 320 }}
    >
      {/* Header */}
      <Box bg="blue.600" color="white" p={4} textAlign="center">
        <VStack spacing={2}>
          <Box>
            <Text fontWeight="bold" fontSize="lg">
              {title}
            </Text>
            <Text fontSize="sm">{totalCourses} Courses</Text>
          </Box>
          {/* Thêm các nút Draft, Edit, Delete với hiệu ứng hover */}
          <HStack justify="center" spacing={2}>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue.600"
              color="white"
              borderColor="white"
              _hover={{
                bg: 'white',
                color: 'blue.600',
                borderColor: 'blue.600',
              }}
            >
              Draft
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue.600"
              color="white"
              borderColor="white"
              _hover={{
                bg: 'white',
                color: 'blue.600',
                borderColor: 'blue.600',
              }}
              onClick={() => navigate(config.routes.bundle_detail(1))}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue.600"
              color="white"
              borderColor="white"
              _hover={{
                bg: 'white',
                color: 'blue.600',
                borderColor: 'blue.600',
              }}
            >
              Delete
            </Button>
          </HStack>
        </VStack>
      </Box>

      {/* Course List */}
      <VStack spacing={3} align="stretch" p={3}>
        {courses
          .slice(0, isHovered ? courses.length : 3)
          .map((course, index) => (
            <HStack key={index} spacing={3} align="center">
              <Image
                boxSize="40px"
                objectFit="cover"
                src={course.image}
                borderRadius="md"
                fallbackSrc="https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg"
              />
              <VStack align="start" spacing={0} flex="1">
                <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                  {course.name}
                </Text>
                <HStack spacing={1}>
                  <Text fontSize="sm" color="gray.600">
                    {course.price}
                  </Text>
                  {course.oldPrice && (
                    <Text
                      fontSize="xs"
                      color="gray.400"
                      textDecoration="line-through"
                    >
                      {course.oldPrice}
                    </Text>
                  )}
                </HStack>
              </VStack>
            </HStack>
          ))}
      </VStack>

      <Divider />

      {/* Footer - Always visible */}
      <Box
        p={3}
        position={!isHovered && courses.length > 3 ? 'absolute' : 'relative'}
        bottom="0"
        left="0"
        right="0"
        bg="white"
      >
        <HStack justify="space-between">
          <Text fontSize="sm">
            ⭐ {price.rating} ({price.reviews})
          </Text>
          <HStack>
            <Text fontWeight="bold" color="green.600">
              {price.current}
            </Text>
            <Text fontSize="sm" color="gray.500" textDecoration="line-through">
              {price.old}
            </Text>
          </HStack>
        </HStack>
      </Box>
    </MotionBox>
  );
};

const BundleList = () => {
  const [hoveredBundle, setHoveredBundle] = useState(null);
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.course);

  useEffect(() => {
    if (isEmpty(courseData)) {
      dispatch(getDataCourse());
    }
  }, []);
  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h2" size="xl" mb={6}>
        Course Bundles
      </Heading>
      <Flex wrap="wrap" gap={6} justify="center">
        {bundles.map((bundle) => (
          <CourseBundle
            key={bundle.title}
            {...bundle}
            isHovered={hoveredBundle === bundle.title}
            setHovered={setHoveredBundle}
          />
        ))}
      </Flex>
    </Container>
  );
};

export default BundleList;
