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
  Input,
  Grid,
  GridItem,
  ChakraProvider,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { IoBookOutline } from 'react-icons/io5';
import { FaHeart } from 'react-icons/fa';
import { LuBarChart } from 'react-icons/lu';
import { TbClockHour4 } from 'react-icons/tb';
import Pagination from '~/components/Student/Search/Page'; // Assuming you have a Pagination component
import Filter from '~/components/Student/Search/Filter'; // Assuming you have a Filter component
import favouriteService from '~/services/favouriteService';
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
  const navigate = useNavigate();

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

      const response =
        await favouriteService.getFavouriteByFilter(courseRequest);
      if (response) {
        setCourses(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error('Error fetching favorite courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, itemsPerPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchCourses();
  };

  const removeFromWishlist = async (id) => {
    try {
      await favouriteService.deleteFavourite(id);
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
        {/* Search Section */}
        <Flex mb={5} justify="space-between">
          <Input
            placeholder="Search for favorite courses..."
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

          {/* Wishlist Courses Section */}
          <GridItem>
            <HStack spacing={5} wrap="wrap" justify="flex-start">
              {courses.map((course) => (
                <Box
                  style={{ zoom: 0.9 }}
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

                      <Text
                        fontWeight="bold"
                        fontSize="lg"
                        noOfLines={2}
                        minHeight="60px"
                      >
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
                            ? `${course.price.salePrice} VND`
                            : `${course.price.price} VND`}
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
                            {course.descriptionPreview ||
                              'No description available.'}
                          </Text>

                          <Flex
                            mt="4"
                            alignItems="center"
                            justify="space-between"
                          >
                            <HStack spacing="1">
                              <Icon
                                as={LuBarChart}
                                boxSize={5}
                                color="gray.600"
                              />
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
          </GridItem>
        </Grid>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default Wishlist;
