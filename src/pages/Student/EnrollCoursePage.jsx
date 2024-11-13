import React, { useState, useEffect } from 'react';
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
  Input,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { TbClockHour4 } from 'react-icons/tb';
import { ChakraProvider } from '@chakra-ui/react';
import enrollmentService from '~/services/enrollmentService';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import Pagination from '~/components/Student/Search/Page'; // Assuming you have a Pagination component
import Filter from '~/components/Student/Search/Filter'; // Assuming you have a Filter component

const EnrollCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    categoryIds: [],
    topicId: null,
    levelId: null,
    rating: null,
  });

  // Fetch courses with filters, search, and pagination
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const courseRequest = {
        pageNumber: currentPage - 1,
        size: itemsPerPage,
        title: searchTerm || null,
        categoryIds:
          filterOptions.categoryIds.length > 0
            ? filterOptions.categoryIds
            : null,
        rating: filterOptions.rating || null,
        topicId: filterOptions.topicId || null,
        levelId: filterOptions.levelId || null,
      };

      const response = await enrollmentService.getEnrollByFilter(courseRequest);
      if (response) {
        setCourses(response.content);
        setTotalPages(response.totalPages);
      } else {
        console.log('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, itemsPerPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchCourses();
  };

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
        {/* Search Section */}
        <Flex mb={5} justify="space-between">
          <Input
            placeholder="Search for enrolled courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mr={2}
          />
          <Button colorScheme="blue" onClick={handleSearch}>
            Search
          </Button>
        </Flex>

        {/* Main Grid Layout */}
        <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={6}>
          {/* Filter Section */}
          <GridItem>
            <Filter onFilterChange={setFilterOptions} />
          </GridItem>

          {/* Enrolled Courses Section */}
          <GridItem>
            <Flex direction="column" justify="space-between" height="100%">
              <HStack spacing={5} wrap="wrap" justify="start">
                {courses.map((course) => (
                  <Box
                    style={{ zoom: 0.9 }}
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
                          <Text fontSize="sm" color="gray.500">
                            {course.topic?.name || 'Uncategorized'}
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

              {/* Pagination */}
              <Box mt={8}>
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalPages={totalPages}
                />
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default EnrollCoursePage;
