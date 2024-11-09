import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  Grid,
  GridItem,
  HStack,
  VStack,
  Text,
  Flex,
  Image,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { IoBookOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { LuBarChart } from 'react-icons/lu';
import { TbClockHour4 } from 'react-icons/tb';
import { PiStudent } from 'react-icons/pi';
import Pagination from '~/components/Student/Search/Page';
import Filter from '~/components/Student/Search/Filter';
import courseService from '~/services/courseService';
import favouriteService from '~/services/favouriteService';
import { useNavigate } from 'react-router-dom';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

const Rating = ({ rating }) => (
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

const CourseList = ({
  courses,
  hoveredCourseId,
  setHoveredCourseId,
  toggleWishlist,
  likedCourses,
}) => {
  const navigate = useNavigate();

  return (
    <HStack spacing={5} wrap="wrap" justify="flex-start">
      {courses.map((course) => {
        const isLiked = likedCourses.find((c) => c.id === course.id)?.liked;

        return (
          <Box
            style={{ zoom: 0.9 }}
            key={course.id}
            width="300px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            height="380px"
            position="relative"
            onMouseEnter={() => setHoveredCourseId(course.id)}
            onMouseLeave={() => setHoveredCourseId(null)}
            transition="transform 0.3s ease, box-shadow 0.3s ease"
            _hover={{
              transform: 'scale(1.05)',
              boxShadow: 'xl',
            }}
          >
            <Box height="180px" overflow="hidden">
              <Image
                src={course.imagePreview}
                alt={course.title}
                objectFit="cover"
                width="100%"
                height="100%"
                transition="transform 0.3s ease"
                _hover={{ transform: 'scale(1.0)' }}
              />
            </Box>

            <Box p={6}>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="gray.500">
                  {course.topic?.name || 'Unknown Topic'}
                </Text>
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  noOfLines={2}
                  minHeight="60px"
                >
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
                    <Icon as={IoBookOutline} boxSize={5} color="gray.600" />
                    <Text fontSize="sm" color="gray.500">
                      {course.countSection} Sections
                    </Text>
                  </HStack>
                </Flex>

                <Divider borderColor="gray.300" mb="10px" />

                <Flex justify="space-between" align="center" width="100%">
                  <Rating rating={course.rating} />
                  <Text fontWeight="bold" fontSize="lg" color="gray.700">
                    {course.price?.price ? `${course.price.price}đ` : 'Free'}
                  </Text>
                </Flex>

                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  zIndex="10"
                  opacity={hoveredCourseId === course.id ? 1 : 0}
                  transform={
                    hoveredCourseId === course.id ? 'scale(1)' : 'scale(0.95)'
                  }
                  transition="opacity 0.3s ease, transform 0.3s ease"
                  pointerEvents={hoveredCourseId === course.id ? 'all' : 'none'}
                >
                  <Text fontSize="sm" fontWeight="bold" mb={2}>
                    Instructor Information
                  </Text>
                  <Text fontWeight="bold" fontSize="lg" mb={3} minH="80px">
                    {course.title}
                  </Text>
                  <Text fontSize="sm" mt={3} noOfLines={3} minH="60px">
                    {course.descriptionPreview || 'No description available.'}
                  </Text>

                  <Flex mt={6} justify="space-between">
                    <HStack spacing="1">
                      <Icon as={LuBarChart} boxSize={5} color="gray.600" />
                      <Text fontSize="sm">
                        {course.level?.name || 'All Levels'}
                      </Text>
                    </HStack>
                    <HStack spacing="1">
                      <Icon as={IoBookOutline} boxSize={5} color="gray.600" />
                      <Text fontSize="sm">{course.countSection} Sections</Text>
                    </HStack>
                    <HStack spacing="1">
                      <Icon as={TbClockHour4} boxSize={5} color="gray.600" />
                      <Text fontSize="sm">{course.duration} Hours</Text>
                    </HStack>
                  </Flex>

                  <Button
                    mt={7}
                    colorScheme="blue"
                    size="sm"
                    width="full"
                    onClick={() => navigate(`/course-view-detail/${course.id}`)}
                  >
                    PREVIEW THIS COURSE
                  </Button>

                  <Button
                    mt={4}
                    width="full"
                    size="sm"
                    variant="ghost"
                    colorScheme={isLiked ? 'red' : 'gray'}
                    onClick={() => toggleWishlist(course.id, isLiked)}
                    leftIcon={
                      <Icon
                        as={FaHeart}
                        color={isLiked ? 'red.500' : 'gray.500'}
                      />
                    }
                  >
                    {isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                </Box>
              </VStack>
            </Box>
          </Box>
        );
      })}
    </HStack>
  );
};

const SearchPage = () => {
  const [courses, setCourses] = useState([]);
  const [hoveredCourseId, setHoveredCourseId] = useState(null);
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
  const [likedCourses, setLikedCourses] = useState([]);

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

        const likedCoursesStatus = await Promise.all(
          content.map(async (course) => {
            const isLiked = await favouriteService.checkCourseInFavourite(
              course.id,
            );
            return { id: course.id, liked: isLiked };
          }),
        );

        setLikedCourses(likedCoursesStatus);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, itemsPerPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCourses();
  };

  const toggleWishlist = async (id, isLiked) => {
    try {
      if (isLiked) {
        await favouriteService.deleteFavourite(id);
      } else {
        await favouriteService.addFavourite(id);
      }

      setLikedCourses((prev) =>
        prev.map((course) =>
          course.id === id ? { ...course, liked: !course.liked } : course,
        ),
      );
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
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
        </Flex>

        <Grid templateColumns={{ base: '1fr', md: '1fr 4fr' }} gap={6}>
          <GridItem>
            <Filter onFilterChange={setFilterOptions} />
          </GridItem>

          <GridItem>
            <CourseList
              courses={courses}
              hoveredCourseId={hoveredCourseId}
              setHoveredCourseId={setHoveredCourseId}
              toggleWishlist={toggleWishlist}
              likedCourses={likedCourses}
            />

            <Box mt={8}>
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalPages={totalPages}
              />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default SearchPage;
