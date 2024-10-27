import { Box, Image, Text, Stack, Badge, HStack, Icon, VStack } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

// Mock data for courses
const courses = [
    {
        title: "Basics of Masterstudy",
        price: "Free",
        rating: 5,
        instructor: "Demo Instructor",
        imageUrl: "https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003825/cld-sample-3.jpg",
    },
    {
        title: "How to get comfortable on camera",
        price: "Free",
        rating: 4,
        instructor: "Demo Instructor",
        imageUrl: "https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003825/cld-sample-5.jpg",
    },
    {
        title: "How to be a DJ? Make Electronic Music",
        price: "$49.99",
        rating: 4,
        instructor: "Demo Instructor",
        imageUrl: "https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003825/cld-sample-4.jpg",
    },
    {
        title: "Learning Jazz like in San Francisco",
        price: "Free",
        rating: 3,
        instructor: "George Richards",
        imageUrl: "https://res.cloudinary.com/dq7y35u7s/image/upload/v1729003825/cld-sample-4.jpg",
    },
];

const RandomCourse = () => {
    return (
        <VStack spacing={5} align="stretch">
            {courses.map((course, index) => (
                <Box
                    key={index}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    padding="4"
                    boxShadow="sm"
                >
                    <HStack>
                        <Image
                            boxSize="100px"
                            objectFit="cover"
                            src={course.imageUrl}
                            alt={course.title}
                            borderRadius="md"
                        />
                        <Stack spacing={2} pl={4}>
                            <Text fontWeight="bold" fontSize="lg">
                                {course.title}
                            </Text>
                            <Text fontSize="md" color="green.500">
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
                    </HStack>
                </Box>
            ))}
        </VStack>
    );
};

export default RandomCourse;