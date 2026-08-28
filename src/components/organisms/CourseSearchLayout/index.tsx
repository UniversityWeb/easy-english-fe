import React, { useState } from 'react';
import {
  Box,
  Heading,
  Flex,
  Input,
  Button,
  Grid,
  GridItem,
  Text,
  VStack,
  Skeleton,
  Spinner,
  Fade,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import { FiFilter } from 'react-icons/fi';
import RoleBasedPageLayout from '@/components/organisms/RoleBasedPageLayout';
import Filter from '@/components/organisms/Filter';
import Pagination from '@/components/organisms/Page';
import CourseCard from '@/components/organisms/StudentSearchCourseCard';

const SkeletonCardList = ({ itemsPerPage }) => {
  return (
    <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} width="100%">
      {Array(itemsPerPage).fill('').map((_, index) => (
        <Box
          key={index}
          width="100%"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          height="380px"
          bg="white"
        >
          <Skeleton height="180px" width="100%" />
          
          <Box p={6}>
            <VStack align="start" spacing={1}>
              <Skeleton height="16px" width="40%" />
              <Skeleton height="60px" width="100%" />
              
              <Flex justify="space-between" align="center" width="100%" pt={1}>
                <Skeleton height="20px" width="35%" />
                <Skeleton height="20px" width="35%" />
              </Flex>

              <Divider borderColor="gray.300" mb="10px" mt="6px" />

              <Flex justify="space-between" align="center" width="100%">
                <Skeleton height="20px" width="40%" />
                <Skeleton height="24px" width="30%" />
              </Flex>
            </VStack>
          </Box>
        </Box>
      ))}
    </Grid>
  );
};

const CourseSearchLayout = ({
  searchState,
  searchPlaceholder = 'Search for courses...',
  pageTitle,
  headerExtra,
  renderCard,
  showFilter = true,
  customFilter,
  emptyMessage = 'No courses found',
  defaultIsLiked = false,
}) => {
  const {
    courses,
    loading,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    likedCourses,
    setFilterOptions,
    handleSearch,
    handleWishlistToggle,
    handlePreview,
    navigate,
  } = searchState;

  const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  return (
    <RoleBasedPageLayout>
      <Box p={{ base: 4, md: 6 }} maxW="1440px" mx="auto" width="100%">
        {pageTitle && (
          <Heading size="lg" mb={6} color="gray.800">
            {pageTitle}
          </Heading>
        )}

        <Flex mb={6} justify="space-between" align="center" gap={3}>
          {showFilter && (
            <IconButton
              aria-label="Toggle Filter"
              icon={<FiFilter />}
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              variant={isFilterVisible ? 'solid' : 'outline'}
              colorScheme="blue"
              borderRadius="lg"
            />
          )}
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
          />
          <Button colorScheme="blue" onClick={handleSearch} px={6} borderRadius="lg">
            Search
          </Button>
        </Flex>

        {headerExtra && <Box mb={6}>{headerExtra}</Box>}

        <Grid
          templateColumns={showFilter && isFilterVisible ? { base: '1fr', lg: '280px 1fr' } : '1fr'}
          gap={8}
          mt={4}
        >
          {showFilter && isFilterVisible && (
            <GridItem>
              <Box bg="white" p={4} borderRadius="xl" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
                {customFilter || <Filter onFilterChange={setFilterOptions} />}
              </Box>
            </GridItem>
          )}

          <GridItem
            minW={0}
            w="100%"
            flex="1"
            mx={(!showFilter || !isFilterVisible) ? 'auto' : '0'}
            maxW={{ lg: (!showFilter || !isFilterVisible) ? '1080px' : '100%' }}
            transition="all 0.3s ease"
          >
            <Flex direction="column" justify="flex-start" height="100%">
              <Box mb={6}>
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalPages={totalPages}
                />
              </Box>

              <Box position="relative" minH="400px">
                <Fade in={loading && !courses?.length} unmountOnExit>
                  <Box position={courses?.length > 0 ? "absolute" : "relative"} top={0} left={0} w="100%" zIndex={2}>
                    <SkeletonCardList itemsPerPage={itemsPerPage} />
                  </Box>
                </Fade>
                
                <Fade in={courses?.length > 0} unmountOnExit>
                  <Box
                    transition="opacity 0.3s ease"
                    opacity={loading ? 0.4 : 1}
                    pointerEvents={loading ? 'none' : 'auto'}
                  >
                    <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} width="100%">
                      {courses?.map((item) => {
                        const c = item.course ? item.course : item;
                        const isLiked = defaultIsLiked ? true : !!likedCourses.find((l) => l.id === c.id)?.liked;

                        return renderCard ? (
                          renderCard(item, {
                            isLiked,
                            toggleWishlist: handleWishlistToggle,
                            isHovered: hoveredCourseId === c.id,
                            onHover: setHoveredCourseId,
                            navigate,
                          })
                        ) : (
                          <CourseCard
                            key={c.id || item.id}
                            course={c}
                            onPreview={() => handlePreview(c)}
                            onWishlistToggle={handleWishlistToggle}
                            isLiked={isLiked}
                            onHover={setHoveredCourseId}
                            isHovered={hoveredCourseId === c.id}
                          />
                        );
                      })}
                    </Grid>
                  </Box>
                </Fade>

                <Fade in={!loading && !courses?.length} unmountOnExit>
                  <Box p={12} textAlign="center" bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200">
                    <Text fontSize="lg" color="gray.500" fontWeight="medium">
                      {emptyMessage}
                    </Text>
                  </Box>
                </Fade>
              </Box>
              
              {courses?.length > 0 && (
                <Box mt={8} mb={4}>
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    totalPages={totalPages}
                    showItemsPerPage={false}
                  />
                </Box>
              )}
            </Flex>
          </GridItem>
        </Grid>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default CourseSearchLayout;
