import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  HStack,
  Image,
  Text,
  Button,
  Collapse,
  Table,
  Tbody,
  Tr,
  Td,
  Divider,
  Link,
  Spinner,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import enrollmentService from '~/services/enrollmentService';

const courses = [
  {
    id: 1,
    title: 'How to Speak English Fluently',
    image:
      'http://192.168.1.90:9000/easy-english/fa336830-d75c-4e71-a8af-cc0207c0b91d.png',
    stats: {
      students: 18929,
      progress: '0.49%',
      quizzes: '1.21%',
      lessons: '0.44%',
      subscriptions: 0,
      assignments: '0%',
    },
    students: [
      {
        name: 'Demo Instructor',
        email: 'instructor@stylemixthemes.com',
        started: '22 February, 2024',
        lessons: '9/9',
        quizzes: '0/3',
        assignments: '1/1',
        progress: '92%',
        avatar:
          'https://res.cloudinary.com/dq7y35u7s/image/upload/v1743083580/fdxwkrf5gr62wesbcb3h.jpg',
      },
      {
        name: 'info',
        email: 'info@gmail.com',
        started: '7 October, 2022',
        lessons: '0/9',
        quizzes: '0/3',
        assignments: '0/1',
        progress: '0%',
        avatar:
          'https://res.cloudinary.com/dq7y35u7s/image/upload/v1743083580/h9rasmn4gyxevwchmors.jpg',
      },
    ],
  },
  {
    id: 2,
    title: 'English Launch: Learn English for Free - Upgrade all areas',
    image:
      'http://192.168.1.90:9000/easy-english/cfd9fe72-4e11-4657-a118-11e31d6fcd8c.png',
    stats: {
      students: 24500,
      progress: '3.5%',
      quizzes: '2.1%',
      lessons: '1.8%',
      subscriptions: 120,
      assignments: '0.7%',
    },
    students: [
      {
        name: 'Emily Blunt',
        email: 'emily.blunt@example.com',
        started: '10 March, 2024',
        lessons: '5/10',
        quizzes: '1/5',
        assignments: '1/2',
        progress: '50%',
        avatar:
          'https://res.cloudinary.com/dq7y35u7s/image/upload/v1743083580/fdxwkrf5gr62wesbcb3h.jpg',
      },
    ],
  },
  {
    id: 3,
    title: 'Improve Your English with Best Learning Tools (Free course)',
    image:
      'http://192.168.1.90:9000/easy-english/40b44705-1a25-4d2b-90de-700b97e923ed.png',
    stats: {
      students: 31200,
      progress: '5.2%',
      quizzes: '3.0%',
      lessons: '2.3%',
      subscriptions: 200,
      assignments: '1.2%',
    },
    students: [
      {
        name: 'Robert Pattinson',
        email: 'robert.p@example.com',
        started: '15 February, 2024',
        lessons: '7/15',
        quizzes: '2/6',
        assignments: '2/3',
        progress: '60%',
        avatar:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
      },
    ],
  },
  {
    id: 4,
    title: 'Natural English Conversations',
    image:
      'http://192.168.1.90:9000/easy-english/9ce56646-d45e-43a5-8822-61ee3755eaa0.png',
    stats: {
      students: 18000,
      progress: '4.1%',
      quizzes: '1.8%',
      lessons: '1.5%',
      subscriptions: 90,
      assignments: '0.5%',
    },
    students: [
      {
        name: 'Scarlett Johansson',
        email: 'scarlett.j@example.com',
        started: '20 January, 2024',
        lessons: '8/12',
        quizzes: '3/5',
        assignments: '1/2',
        progress: '70%',
        avatar:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
      },
    ],
  },
  {
    id: 5,
    title: 'Free IELTS Essentials Course Achieve Band 7+ Score',
    image:
      'http://192.168.1.90:9000/easy-english/c6bf3969-8e05-468a-b313-5bc0d476531a.jpg',
    stats: {
      students: 22000,
      progress: '6.0%',
      quizzes: '2.5%',
      lessons: '3.0%',
      subscriptions: 150,
      assignments: '1.5%',
    },
    students: [
      {
        name: 'Chris Pratt',
        email: 'chris.p@example.com',
        started: '25 December, 2023',
        lessons: '10/15',
        quizzes: '4/7',
        assignments: '3/4',
        progress: '80%',
        avatar:
          'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-4.jpg',
      },
    ],
  },
  {
    id: 6,
    title: 'Present and Future English Tenses - INTERMEDIATE Level',
    image:
      'http://192.168.1.90:9000/easy-english/3672c676-f6fa-4505-aa7b-9ef0b7899c1b.png',
    stats: {
      students: 15000,
      progress: '4.3%',
      quizzes: '1.7%',
      lessons: '1.9%',
      subscriptions: 85,
      assignments: '0.8%',
    },
    students: [
      {
        name: 'Rihanna',
        email: 'rihanna@example.com',
        started: '5 April, 2024',
        lessons: '6/10',
        quizzes: '2/4',
        assignments: '1/2',
        progress: '65%',
        avatar:
          'https://res.cloudinary.com/dq7y35u7s/image/upload/v1743083580/fdxwkrf5gr62wesbcb3h.jpg',
      },
    ],
  },
];

function Gradebook() {
  const [courses, setCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState({});
  const [loadedStudents, setLoadedStudents] = useState({});

  const fetchCoursesStats = async () => {
    setLoading(true);
    try {
      const courseStatsFilter = {
        pageNumber: 0,
        size: 10,
      };

      const response =
        await enrollmentService.getCoursesStatistics(courseStatsFilter);
      setCourses(response);
    } catch (error) {
      console.error('Error fetching enroll courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const loadStudents = (courseId) => {
    setLoadingStudents((prev) => ({ ...prev, [courseId]: true }));

    setTimeout(() => {
      setLoadedStudents((prev) => ({ ...prev, [courseId]: true }));
      setLoadingStudents((prev) => ({ ...prev, [courseId]: false }));
    }, 1000); // Giả lập API gọi dữ liệu trong 1 giây
  };

  return (
    <RoleBasedPageLayout>
      <Box p={6} maxW="800px" mx="auto">
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">The Gradebook</Heading>
          <InputGroup maxW="250px">
            <Input placeholder="Enter keyword here" />
            <InputRightElement>
              <IconButton aria-label="Search" icon={<SearchIcon />} size="sm" />
            </InputRightElement>
          </InputGroup>
        </HStack>

        <VStack spacing={4} align="stretch">
          {courses.map((course) => (
            <Box key={course.id} borderWidth="1px" borderRadius="md" p={4}>
              <HStack justify="space-between">
                <HStack>
                  <Image src={course.image} boxSize="50px" borderRadius="md" />
                  <Text fontWeight="bold">{course.title}</Text>
                </HStack>
                <Button
                  rightIcon={
                    expandedCourse === course.id ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon />
                    )
                  }
                  onClick={() => toggleCourse(course.id)}
                  variant="outline"
                >
                  {expandedCourse === course.id ? 'Show less' : 'More info'}
                </Button>
              </HStack>

              <Collapse in={expandedCourse === course.id} animateOpacity>
                <Box mt={4} p={4} borderWidth="1px" borderRadius="md">
                  <Table variant="simple">
                    <Tbody>
                      <Tr>
                        <Td>All time course students:</Td>
                        <Td fontWeight="bold">{course.stats.students}</Td>
                        <Td>Course average progress:</Td>
                        <Td fontWeight="bold">{course.stats.progress}</Td>
                      </Tr>
                      <Tr>
                        <Td>Course passed quizzes:</Td>
                        <Td fontWeight="bold">{course.stats.quizzes}</Td>
                        <Td>Course passed lessons:</Td>
                        <Td fontWeight="bold">{course.stats.lessons}</Td>
                      </Tr>
                      <Tr>
                        <Td>Course enrolled by subscription:</Td>
                        <Td fontWeight="bold">{course.stats.subscriptions}</Td>
                        <Td>Course passed assignments:</Td>
                        <Td fontWeight="bold">{course.stats.assignments}</Td>
                      </Tr>
                    </Tbody>
                  </Table>

                  {!loadedStudents[course.id] ? (
                    <Text mt={4} color="blue.500" fontSize="sm">
                      <Link
                        onClick={() => loadStudents(course.id)}
                        cursor="pointer"
                      >
                        {loadingStudents[course.id] ? (
                          <Spinner size="xs" mr={2} />
                        ) : (
                          'Load Students Statistics'
                        )}
                      </Link>
                    </Text>
                  ) : (
                    <>
                      <Divider my={4} />
                      <Heading size="md">Students Statistics</Heading>
                      {course.students.map((student, index) => (
                        <Box
                          key={index}
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                          mt={4}
                        >
                          <HStack spacing={4}>
                            <Image
                              src={student.avatar}
                              boxSize="50px"
                              borderRadius="full"
                            />
                            <Box>
                              <Text fontWeight="bold">{student.name}</Text>
                              <Text fontSize="sm" color="blue.500">
                                {student.email}
                              </Text>
                              <Text fontSize="sm" fontStyle="italic">
                                Started: {student.started}
                              </Text>
                            </Box>
                          </HStack>
                          <HStack mt={2} spacing={2}>
                            <Button size="sm" colorScheme="green">
                              Lessons Passed: {student.lessons}
                            </Button>
                            <Button size="sm" colorScheme="gray">
                              Quizzes Passed: {student.quizzes}
                            </Button>
                            <Button size="sm" colorScheme="green">
                              Assignments Passed: {student.assignments}
                            </Button>
                            <Button size="sm" colorScheme="green">
                              Progress: {student.progress}
                            </Button>
                          </HStack>
                        </Box>
                      ))}
                    </>
                  )}
                </Box>
              </Collapse>
            </Box>
          ))}
        </VStack>
      </Box>
    </RoleBasedPageLayout>
  );
}

export default Gradebook;
