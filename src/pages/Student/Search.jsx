import React, { useState } from 'react';
import {
  Box,
  Image,
  Text,
  Flex,
  HStack,
  Button,
  Icon,
  VStack,
  Divider,
  Container,
  Grid,
  GridItem,
  Input,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { IoBookOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { LuBarChart } from 'react-icons/lu';
import { TbClockHour4 } from 'react-icons/tb';
import { LuEye } from 'react-icons/lu';
import { PiStudent } from 'react-icons/pi';
import courseService from '~/services/courseService';
import Filter from '../../components/Student/Search/Filter';
import Pagination from '../../components/Student/Search/Page';
import { useNavigate } from 'react-router-dom';
import StudentPageLayout from '~/components/StudentPageLayout';

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

const CourseList = ({
  filterOptions,
  searchTerm,
  onSearchTermChange,
  onSearch,
}) => {
  const [courses, setCourses] = useState([]);
  const [likedCourses, setLikedCourses] = useState([]);
  const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const handleSearch = () => {
    // Reset pagination settings to default
    setCurrentPage(1); // for page 0
    setItemsPerPage(10);
    fetchCourses();
  };

  const fetchCourses = async () => {
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
      const response = await courseService.getCourseByFilter(courseRequest);

      if (response) {
        const { content, totalPages } = response;
        setCourses(content);
        setTotalPages(totalPages);
        setLikedCourses(
          content.map((course) => ({ id: course.id, liked: false })),
        );
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Initialize fetch on mount and when page changes
  React.useEffect(() => {
    if (onSearch) {
      onSearch(fetchCourses);
    }
  }, [currentPage, itemsPerPage]);

  const toggleWishlist = (id) => {
    setLikedCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, liked: !course.liked } : course,
      ),
    );
  };

  return (
    <Box p={5}>
      <Flex mb={5}>
        <Input
          placeholder="Search for courses..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          mr={2}
        />
        <Button colorScheme="blue" onClick={handleSearch}>
          Search
        </Button>
      </Flex>

      <HStack spacing={5} wrap="wrap" justify="center">
        {courses.map((course) => {
          const isLiked = likedCourses.find((c) => c.id === course.id)?.liked;

          return (
            <Box
              key={course.id}
              width="300px"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              height="420px"
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
                    {course.topic?.name || 'Unknown Topic'}
                  </Text>
                  <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
                    {course.title}
                  </Text>

                  <Flex justify="space-between" align="center" width="100%">
                    <HStack spacing="1">
                      <Icon as={PiStudent} boxSize={5} color="gray.600" />
                      <Text fontSize="sm" color="gray.500">
                        {course.countStudent} Students
                      </Text>
                    </HStack>
                    <HStack spacing="1">
                      <Icon as={LuEye} boxSize={5} color="gray.600" />
                      <Text fontSize="sm" color="gray.500">
                        {course.countView} Views
                      </Text>
                    </HStack>
                  </Flex>

                  <Divider borderColor="gray.300" />

                  <Flex justify="space-between" align="center" width="100%">
                    <Rating rating={course.rating} />
                    <Text fontWeight="bold" fontSize="lg" color="gray.700">
                      {course.price?.price ? `$${course.price.price}` : 'Free'}
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
                        Instructor Information
                      </Text>
                      <Text fontWeight="bold" fontSize="lg" mb="3">
                        {course.title}
                      </Text>

                      <Rating rating={course.rating} />
                      <Text fontSize="sm" mt="3" noOfLines={3}>
                        {course.descriptionPreview ||
                          'No description available.'}
                      </Text>

                      <Flex mt="6" justify="space-between">
                        <HStack spacing="1">
                          <Icon as={LuBarChart} boxSize={5} color="gray.600" />
                          <Text fontSize="sm">
                            {course.level?.name || 'All Levels'}
                          </Text>
                        </HStack>
                        <HStack spacing="1">
                          <Icon
                            as={IoBookOutline}
                            boxSize={5}
                            color="gray.600"
                          />
                          <Text fontSize="sm">
                            {course.countSection} Sections
                          </Text>
                        </HStack>
                        <HStack spacing="1">
                          <Icon
                            as={TbClockHour4}
                            boxSize={5}
                            color="gray.600"
                          />
                          <Text fontSize="sm">{course.duration} Hours</Text>
                        </HStack>
                      </Flex>

                      <Button
                        mt="7"
                        colorScheme="blue"
                        size="sm"
                        width="full"
                        onClick={() =>
                          navigate(`/course-view-detail/${course.id}`)
                        } // Chuyển hướng đến trang chi tiết khóa học
                      >
                        PREVIEW THIS COURSE
                      </Button>

                      <Flex mt="5" justify="space-between">
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme={isLiked ? 'red' : 'gray'}
                          onClick={() => toggleWishlist(course.id)}
                          leftIcon={
                            <Icon
                              as={FaHeart}
                              color={isLiked ? 'red.500' : 'gray.500'}
                            />
                          }
                        >
                          {isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </Button>
                        <Text fontWeight="bold" color="gray.700">
                          {course.price?.price
                            ? `$${course.price.price}`
                            : 'Free'}
                        </Text>
                      </Flex>
                    </Box>
                  )}
                </VStack>
              </Box>
            </Box>
          );
        })}
      </HStack>

      <Box mt={8}>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalPages={totalPages}
        />
      </Box>
    </Box>
  );
};

const SearchPage = () => {
  const [filterOptions, setFilterOptions] = useState({
    categoryIds: [],
    topicId: null,
    levelId: null,
    rating: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFunction, setSearchFunction] = useState(null);

  const handleFilterChange = (newFilterOptions) => {
    setFilterOptions(newFilterOptions);
  };

  return (
    <StudentPageLayout>
      <Container maxW="80%">
        <Grid templateColumns="300px 1fr" gap={6} p={5}>
          <GridItem>
            <Filter onFilterChange={handleFilterChange} />
          </GridItem>
          <GridItem>
            <CourseList
              filterOptions={filterOptions}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              onSearch={setSearchFunction}
            />
          </GridItem>
        </Grid>
      </Container>
    </StudentPageLayout>
  );
};

export default SearchPage;
