import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  Grid,
  Badge,
  VStack,
  Image,
  Divider,
  Container,
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons';
import {
  FaLayerGroup,
  FaUsers,
  FaStar,
  FaCertificate,
  FaTrophy,
} from 'react-icons/fa';
import Footer from '~/components/Footer';
import NavbarForStudent from '~/components/Navbars/NavbarForStudent';

const CourseManagementForStudentPage = () => {
  const [visibleCourses, setVisibleCourses] = useState(4);
  const stats = [
    { icon: FaLayerGroup, label: 'Bundles', value: 0 },
    { icon: FaUsers, label: 'Groups', value: 0 },
    { icon: FaStar, label: 'Reviews', value: 0 },
    { icon: FaCertificate, label: 'Certificates', value: 0 },
    { icon: FaTrophy, label: 'Points', value: 0 },
  ];

  const placeholderImage =
    'https://firebasestorage.googleapis.com/v0/b/ute-21110120-web-exercises.appspot.com/o/1.png?alt=media&token=bfd6d816-a3d3-4134-85ec-eda61054a927';

  const courses = [
    {
      title: 'Character Art School: Complete Drawing Course',
      category: 'Art',
      level: 'Beginner',
      imageUrl: '',
      duration: '20 hours',
      price: 100,
      description:
        'LearnPage how to draw characters like a pro in this comprehensive drawing course.',
      isPublish: true,
      createdBy: 'John Doe',
      createdAt: 'September 27, 2024',
    },
    {
      title: 'Learning Jazz like in San Francisco',
      category: 'Music',
      level: 'Intermediate',
      imageUrl: '',
      duration: '16 hours',
      price: 150,
      description:
        'Master jazz techniques and musical theory with a San Francisco twist.',
      isPublish: true,
      createdBy: 'Jane Smith',
      createdAt: 'September 27, 2024',
    },
    {
      title: 'The Right Set for Landscape Photography',
      category: 'Photography',
      level: 'Advanced',
      imageUrl: '',
      duration: '14 hours',
      price: 200,
      description: 'Get the perfect setup for capturing beautiful landscapes.',
      isPublish: true,
      createdBy: 'Alex Johnson',
      createdAt: 'September 27, 2024',
    },
    {
      title: 'Engine Creating on Unity from PRO',
      category: 'Programming',
      level: 'Professional',
      imageUrl: '',
      duration: '15 hours',
      price: 300,
      description: 'LearnPage advanced Unity techniques from industry pros.',
      isPublish: true,
      createdBy: 'Michael Green',
      createdAt: 'September 27, 2024',
    },
    {
      title: 'Introduction to Java Programming',
      category: 'Programming',
      level: 'Beginner',
      imageUrl: '',
      duration: '10 hours',
      price: 120,
      description:
        'LearnPage the fundamentals of Java programming with hands-on examples.',
      isPublish: true,
      createdBy: 'Sarah Brown',
      createdAt: 'September 27, 2024',
    },
    {
      title: 'Mastering React for Frontend Development',
      category: 'Web Development',
      level: 'Advanced',
      imageUrl: '',
      duration: '25 hours',
      price: 250,
      description:
        'Build powerful frontend web applications using React and Chakra UI.',
      isPublish: true,
      createdBy: 'David Martin',
      createdAt: 'September 27, 2024',
    },
    {
      title: 'Digital Marketing for Beginners',
      category: 'Marketing',
      level: 'Beginner',
      imageUrl: '',
      duration: '12 hours',
      price: 90,
      description:
        'LearnPage the basics of digital marketing, from SEO to social media strategies.',
      isPublish: true,
      createdBy: 'Emma Wilson',
      createdAt: 'September 27, 2024',
    },
    {
      title: 'Creative Writing: Master Storytelling',
      category: 'Writing',
      level: 'Intermediate',
      imageUrl: '',
      duration: '18 hours',
      price: 160,
      description:
        'Develop your storytelling skills with our hands-on creative writing course.',
      isPublish: true,
      createdBy: 'Lucas Brown',
      createdAt: 'September 27, 2024',
    },
    {
      title: 'Data Science with Python',
      category: 'Data Science',
      level: 'Advanced',
      imageUrl: '',
      duration: '30 hours',
      price: 350,
      description:
        'Explore the world of data science using Python, Numpy, and Pandas.',
      isPublish: true,
      createdBy: 'Sophia Davis',
      createdAt: 'September 27, 2024',
    },
    {
      title: 'Advanced Excel for Data Analysis',
      category: 'Business',
      level: 'Advanced',
      imageUrl: '',
      duration: '22 hours',
      price: 220,
      description: 'LearnPage how to analyze data using advanced Excel techniques.',
      isPublish: true,
      createdBy: 'Oliver Clark',
      createdAt: 'September 27, 2024',
    },
  ];

  const showMoreCourses = () => {
    setVisibleCourses((prevValue) => prevValue + 4);
  };

  return (
    <Box>
      <NavbarForStudent />

      <Container maxW="80%" mt="50px">
        <Text fontSize="2xl" fontWeight="bold" mb={2}>
          Enrolled Courses
        </Text>
        <Divider mt={10} mb={10} />

        <Grid templateColumns="repeat(5, 1fr)" gap={6} mb={6}>
          {stats.map((stat, index) => (
            <VStack
              key={index}
              align="center"
              p={4}
              borderWidth="1px"
              borderRadius="lg"
            >
              <Icon as={stat.icon} boxSize={8} color="blue.500" />
              <Text fontWeight="semibold">{stat.label}</Text>
              <Text fontSize="lg">{stat.value}</Text>
            </VStack>
          ))}
        </Grid>

        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          {courses.map((course, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg="white"
              display="flex"
              flexDirection="column"
            >
              <Box position="relative">
                <Image
                  src={course.imageUrl || placeholderImage}
                  alt={course.title}
                  objectFit="cover"
                  w="100%"
                  h="200px"
                />
                {course.isPublish && (
                  <Badge
                    position="absolute"
                    top="5px"
                    left="5px"
                    colorScheme="green"
                  >
                    Published
                  </Badge>
                )}
              </Box>

              <Box p={5} flexGrow={1}>
                <Text fontWeight="bold" fontSize="xl" mb={2}>
                  {course.title}
                </Text>
                <Text mb={4}>{course.description}</Text>
                <Flex justify="space-between">
                  <Text>{course.price} USD</Text>
                  <Text>Level: {course.level}</Text>
                </Flex>
              </Box>

              <Button colorScheme="teal" size="md" m={5} h="40px">
                View Course
              </Button>
            </Box>
          ))}
        </Grid>

        {visibleCourses < courses.length && (
          <Flex justifyContent="center" mt={6} mb={10}>
            <Button colorScheme="blue" onClick={showMoreCourses} h="50px">
              Show More
            </Button>
          </Flex>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default CourseManagementForStudentPage;
