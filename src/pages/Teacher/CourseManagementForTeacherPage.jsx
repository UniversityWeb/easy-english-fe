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
import courseService from '~/services/courseService';
import CourseCard from '~/components/Teacher/CourseManagementForTeacher/CourseCard';

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
    status: null, // ACTIVE or COMPLETED
  });
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('All'); // New state for tabs
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
        status: statusTab === 'All' ? null : statusTab, // Use statusTab to filter
      };

      const response =
        await courseService.fetchAllCourseOfTeacher(courseRequest);
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
                onChange={(index) => {
                  const statusMapping = [
                    null,
                    'PUBLISHED',
                    'PENDING_APPROVAL',
                    'REJECTED',
                    'DRAFT',
                  ];
                  setStatusTab(statusMapping[index]);
                }}
              >
                <TabList>
                  <Tab>All</Tab>
                  <Tab>PUBLISHED</Tab>
                  <Tab>PENDING_APPROVAL</Tab>
                  <Tab>REJECTED</Tab>
                  <Tab>DRAFT</Tab>
                </TabList>
              </Tabs>
              {loading ? (
                <EnrollmentSkeleton itemsPerPage={itemsPerPage} />
              ) : (
                <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                  {courses?.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onMakeFeatured={() =>
                        navigate(`/course-detail/${course.id}`)
                      }
                    />
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
