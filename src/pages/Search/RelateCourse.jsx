import { Box, Image, Text, Stack, Badge, HStack, Icon, VStack, SimpleGrid } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

// Mock data for related courses
const courses = [
  {
    title: "Basics of Masterstudy",
    price: "Free",
    rating: 5,
    instructor: "Demo Instructor",
    imageUrl: "https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003825/cld-sample-3.jpg",
    isHot: true,
    isSpecial: false,
  },
  {
    title: "How to be a DJ? Make Electronic Music",
    price: "$49.99",
    rating: 4,
    instructor: "Demo Instructor",
    imageUrl: "https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003825/cld-sample-5.jpg",
    isHot: false,
    isSpecial: true,
  },
  {
    title: "Real Things Art Painting by Jason Ni",
    price: "Free",
    rating: 4,
    instructor: "Demo Instructor",
    imageUrl: "https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003825/cld-sample-3.jpg",
    isHot: false,
    isSpecial: false,
  },
];

const RelateCourse = () => {
  return (
    <VStack spacing={5} align="stretch">
      <Text fontWeight="bold" fontSize="xl" mb={4}>
        Related courses
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
        {courses.map((course, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            padding="4"
            boxShadow="sm"
          >
            <Box position="relative">
              <Image
                w="100%"
                h="150px"
                objectFit="cover"
                src={course.imageUrl}
                alt={course.title}
                borderRadius="md"
              />
              
              {/* Badge for HOT */}
              {course.isHot && (
                <Badge
                  position="absolute"
                  top="2"
                  right="2"
                  colorScheme="red"
                  fontSize="0.8em"
                >
                  HOT
                </Badge>
              )}
              
              {/* Badge for SPECIAL */}
              {course.isSpecial && (
                <Badge
                  position="absolute"
                  top="2"
                  right="2"
                  colorScheme="green"
                  fontSize="0.8em"
                >
                  SPECIAL
                </Badge>
              )}
            </Box>
            <Stack spacing={2} pt={4}>
              <Text fontWeight="bold" fontSize="lg">
                {course.title}
              </Text>
              <Text fontSize="md" color={course.price === "Free" ? "green.500" : "black"}>
                {course.price}
              </Text>
              <HStack spacing={1}>
                {Array(5)
                  .fill('')
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      color={i < course.rating ? 'yellow.400' : 'gray.300'}
                    />
                  ))}
              </HStack>
              <Text fontSize="sm" color="gray.500">
                By {course.instructor}
              </Text>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default RelateCourse;