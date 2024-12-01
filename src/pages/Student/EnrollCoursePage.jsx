import React, { useState, useEffect } from 'react';
import {
  Box,
  Image,
  Text,
  Flex,
  HStack,
  VStack,
  Input,
  Button,
  Icon,
  Grid,
  GridItem,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  IconButton,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { TbClockHour4 } from 'react-icons/tb';
//import { FiFilter } from 'react-icons/fi';
import Pagination from '~/components/Student/Search/Page';
import Filter from '~/components/Student/Search/Filter';
import { useNavigate } from 'react-router-dom';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import enrollmentService from '~/services/enrollmentService';
import config from '~/config';

const EnrollmentSkeleton = ({ itemsPerPage }) => (
  <Grid templateColumns="repeat(4, 1fr)" gap={6}>
    {Array(itemsPerPage)
      .fill('')
      .map((_, index) => (
        <Box
          key={index}
          width="100%"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          height="300px"
          position="relative"
          p={6}
        >
          <Skeleton height="180px" width="100%" />
          <VStack align="start" spacing={3} mt={4}>
            <SkeletonText noOfLines={2} width="80%" />
            <SkeletonText noOfLines={1} width="60%" />
          </VStack>
        </Box>
      ))}
  </Grid>
);

const Enrollment = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  //const [showFilter, setShowFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categoryIds: [],
    topicId: null,
    levelId: null,
    rating: null,
    enrollmentStatus: null, // ACTIVE or COMPLETED
  });
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ACTIVE'); // New state for tabs
  const navigate = useNavigate();

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
        enrollmentStatus: statusTab === 'ACTIVE' ? null : statusTab, // Use statusTab to filter
      };

      const response = await enrollmentService.getEnrollByFilter(courseRequest);
      if (response) {
        setCourses(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error('Error fetching enroll courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, itemsPerPage, statusTab]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchCourses();
  };

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
        {/* Search Section */}
        <Flex mb={5} justify="space-between">
          <Input
            placeholder="Search for courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mr={2}
          />
          <Button colorScheme="blue" onClick={handleSearch}>
            Search
          </Button>

          {/* <IconButton
            icon={<FiFilter />}
            aria-label="Toggle Filter"
            colorScheme="gray"
            variant="outline"
            onClick={() => setShowFilter(!showFilter)}
            ml={2}
          /> */}
        </Flex>

        {/* Tabs for Status Filter */}

        <Grid templateColumns={{ base: '1fr', md: '1fr 4fr' }} gap={6} mt={4}>
          <GridItem>
            <Filter onFilterChange={setFilterOptions} />
          </GridItem>

          <GridItem mx={0} maxWidth="none" flex="1">
            <Flex direction="column" justify="space-between" height="100%">
              <Tabs
                variant="enclosed"
                onChange={
                  (index) => setStatusTab(index === 0 ? 'ACTIVE' : 'COMPLETED') // Update statusTab based on selected tab
                }
              >
                <TabList>
                  <Tab>All</Tab>
                  <Tab>Completed</Tab>
                </TabList>
              </Tabs>
              {loading ? (
                <EnrollmentSkeleton itemsPerPage={itemsPerPage} />
              ) : (
                <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                  {courses.map((course) => (
                    <Box
                      style={{ zoom: 0.85 }}
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
                            <Button
                              colorScheme="blue"
                              width="full"
                              onClick={() =>
                                navigate(
                                  config.routes.learn(course.id, course.title),
                                )
                              }
                            >
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
                </Grid>
              )}

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

export default Enrollment;
