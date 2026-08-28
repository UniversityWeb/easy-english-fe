import React from 'react';
import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Image,
  Progress,
  Text,
} from '@chakra-ui/react';
import { TbClockHour4 } from 'react-icons/tb';
import config from '@/config';

interface EnrolledCourseCardProps {
  enrollment: any;
  navigate: any;
}

const getButtonText = (progress: number) => {
  if (progress === 0) return 'Start Course';
  if (progress === 100) return 'Review Course';
  return 'Continue Learning';
};

const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({ enrollment, navigate }) => {
  const course = enrollment.course;
  const progress = enrollment.progress || 0;

  return (
    <Box
      width="100%"
      height="385px"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      bg="white"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      transition="transform 0.25s ease, box-shadow 0.25s ease"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
        borderColor: 'blue.300',
      }}
    >
      <Box>
        <Box height="160px" width="100%" position="relative" overflow="hidden" bg="gray.100">
          <Image
            src={course?.imagePreview || course?.image}
            alt={course?.title}
            objectFit="cover"
            width="100%"
            height="100%"
          />
          <Badge
            position="absolute"
            top="10px"
            right="10px"
            colorScheme={progress === 100 ? 'green' : progress > 0 ? 'blue' : 'gray'}
            px={2}
            py={0.5}
            borderRadius="md"
            fontSize="2xs"
            fontWeight="bold"
          >
            {progress === 100 ? 'COMPLETED' : `${progress}% COMPLETED`}
          </Badge>
        </Box>

        <Box p={4}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="blue.500"
            textTransform="uppercase"
            noOfLines={1}
            mb={1}
          >
            {course?.topic?.name || 'General English'}
          </Text>
          <Text
            fontWeight="bold"
            fontSize="sm"
            color="gray.800"
            noOfLines={2}
            lineHeight="1.35"
            minH="38px"
            title={course?.title}
          >
            {course?.title}
          </Text>

          <HStack justify="space-between" fontSize="xs" color="gray.500" mt={2} mb={3}>
            <HStack spacing={1}>
              <Icon as={TbClockHour4} color="gray.400" />
              <Text>{course?.duration || 0} Hours</Text>
            </HStack>
            <Text fontWeight="semibold" color="blue.600">
              {progress}% Done
            </Text>
          </HStack>

          <Progress
            value={progress}
            size="xs"
            colorScheme={progress === 100 ? 'green' : 'blue'}
            borderRadius="full"
          />
        </Box>
      </Box>

      <Box p={4} pt={0}>
        <Button
          colorScheme="blue"
          size="sm"
          width="full"
          borderRadius="lg"
          fontWeight="semibold"
          onClick={() => {
            localStorage.setItem('previousPageMain', window.location.href);
            navigate(config.routes.learn(course?.id, course?.title), {
              state: {
                returnUrl: config.routes.enroll_course,
              },
            });
          }}
        >
          {getButtonText(progress)}
        </Button>

        <Divider my={2} borderColor="gray.100" />

        <Text fontSize="2xs" color="gray.400" textAlign="center">
          Started:{' '}
          {enrollment.createdAt
            ? new Date(enrollment.createdAt).toLocaleDateString()
            : 'Recent'}
        </Text>
      </Box>
    </Box>
  );
};

export default EnrolledCourseCard;
