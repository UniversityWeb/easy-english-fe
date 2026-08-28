// src/components/CourseCard.js
import React from 'react';
import { Box, Button, Divider, Flex, Grid, GridItem, HStack, Icon, Image, Text, Tooltip, VStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { IoBookOutline } from 'react-icons/io5';
import { PiStudent } from 'react-icons/pi';
import { LuChartBar } from 'react-icons/lu';
import { TbClockHour4 } from 'react-icons/tb';
import { formatVNDMoney } from '@/utils/methods';

const displayCount = (num) => (num > 100 ? '99+' : num);

const Rating = ({ rating }) => (
  <HStack spacing="1">
    {Array(5)
      .fill('')
      .map((_, i) => (
        <StarIcon key={i} color={i < rating ? 'yellow.400' : 'gray.300'} />
      ))}
    <Text fontSize="sm" ml="2">
      {rating || ''}
    </Text>
  </HStack>
);

const CourseCard = ({
  course,
  onPreview,
  onWishlistToggle,
  isLiked,
  onHover,
  isHovered,
}) => {
  const {
    id,
    title,
    imagePreview,
    countStudent,
    countSection,
    descriptionPreview,
    rating,
    price,
  } = course;

  return (
    <Box
      width="100%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      height="380px"
      position="relative"
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{
        transform: 'scale(1.05)',
        boxShadow: 'xl',
      }}
    >
      <Box height="180px" overflow="hidden">
        <Image
          src={imagePreview}
          alt={title}
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
          <Text fontWeight="bold" fontSize="lg" noOfLines={2} minHeight="60px">
            {title}
          </Text>

          <Flex justify="space-between" align="center" width="100%">
            <HStack spacing="1" align="center" minW="0">
              <Icon as={PiStudent} boxSize={5} color="gray.600" flexShrink={0} />
              <Text fontSize="sm" color="gray.500" lineHeight="1" isTruncated>
                {displayCount(countStudent)} Students
              </Text>
            </HStack>
            <HStack spacing="1" align="center" minW="0">
              <Icon as={IoBookOutline} boxSize={5} color="gray.600" flexShrink={0} />
              <Text fontSize="sm" color="gray.500" lineHeight="1" isTruncated>
                {displayCount(countSection)} Sections
              </Text>
            </HStack>
          </Flex>

          <Divider borderColor="gray.300" mb="10px" />

          <Flex justify="space-between" align="center" width="100%">
            <Rating rating={rating} />
            <Text fontWeight="bold" fontSize="lg" color="gray.700">
              {price?.price ? `${formatVNDMoney(price.price)}` : 'Free'}
            </Text>
          </Flex>

          {isHovered && (
            <Flex
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
              opacity={1}
              transform="scale(1)"
              transition="opacity 0.3s ease, transform 0.3s ease"
              direction="column"
              justify="center"
              align="center"
              textAlign="center"
            >
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                Instructor Information
              </Text>
              <Tooltip label={title} hasArrow placement="top" openDelay={400}>
                <Text fontWeight="bold" fontSize="lg" mb={3} noOfLines={2}>
                  {title}
                </Text>
              </Tooltip>
              <Tooltip label={descriptionPreview || 'No description available.'} hasArrow placement="top" openDelay={400}>
                <Text fontSize="sm" mt={3} noOfLines={2}>
                  {descriptionPreview || 'No description available.'}
                </Text>
              </Tooltip>
              <Grid templateColumns="repeat(2, 1fr)" gap={3} mt={6} w="100%">
                <GridItem colSpan={2}>
                  <HStack spacing="1" align="center" justify="center" minW="0">
                    <Icon as={LuChartBar} boxSize={5} color="gray.600" flexShrink={0} />
                    <Text fontSize="sm" lineHeight="1" isTruncated>
                      {course.level?.name || 'All Levels'}
                    </Text>
                  </HStack>
                </GridItem>
                <HStack spacing="1" align="center" minW="0">
                  <Icon as={IoBookOutline} boxSize={5} color="gray.600" flexShrink={0} />
                  <Text fontSize="sm" lineHeight="1" isTruncated>
                    {displayCount(course.countSection)} Sections
                  </Text>
                </HStack>
                <HStack spacing="1" align="center" minW="0">
                  <Icon as={TbClockHour4} boxSize={5} color="gray.600" flexShrink={0} />
                  <Text fontSize="sm" lineHeight="1" isTruncated>
                    {displayCount(course.duration)} Hours
                  </Text>
                </HStack>
              </Grid>
              <Button
                mt={7}
                colorScheme="blue"
                size="sm"
                width="full"
                onClick={onPreview}
              >
                PREVIEW THIS COURSE
              </Button>
            </Flex>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default CourseCard;
