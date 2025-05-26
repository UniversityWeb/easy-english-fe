import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  List,
  ListItem,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaRedoAlt, FaTimesCircle } from 'react-icons/fa';
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineQuestionMarkCircle,
  HiOutlineTrophy,
} from 'react-icons/hi2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import testResultService from '~/services/testResultService';
import QuestionItem from '~/components/Test/ReadOnlyQuestion/QuestionItem';
import config from '~/config';
import { MdArrowBack } from 'react-icons/md';
import NavbarWithBackBtn from '~/components/Navbars/NavbarWithBackBtn';
import { Badge } from 'lucide-react';
import { getDataCourse } from '~/store/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import courseService from '~/services/courseService';

const suggestedCourses = [
  {
    minScore: 0,
    maxScore: 7,
    title: 'Essential Business English Vocabulary (FREE)',
    image:
      'http://www.ee-fe-final-project.store:9000/easy-english-prod/e956c4c6-f1d0-451a-b9f8-be66f1560244.png',
    level: 'Beginner',
    id: 1,
    description:
      'Perfect starting point for beginners to build essential vocabulary for business contexts.',
  },
  {
    minScore: 8,
    maxScore: 14,
    title: 'Enhance English Vocabulary, Idioms, Improve Speaking (Free)',
    image:
      'http://www.ee-fe-final-project.store:9000/easy-english-prod/223fff5d-0100-49ce-84cf-a10068921e7c.png',
    level: 'Intermediate',
    id: 2,
    description:
      'Expand your vocabulary and learn common idioms to sound more natural when speaking.',
  },
  {
    minScore: 15,
    maxScore: 20,
    title: 'How to have fluent listening skills in English',
    image:
      'http://www.ee-fe-final-project.store:9000/easy-english-prod/471688a1-3d1a-4839-8130-9bfcfebd9115.png',
    level: 'Advanced',
    id: 3,
    description:
      'Master listening comprehension with advanced techniques for real-world situations.',
  },
];
const RoadmapStep = ({ course, isActive, isLast }) => {
  const activeBorderColor = isActive ? 'blue.500' : 'gray.200';
  const bgColor = isActive ? 'blue.50' : 'white';

  return (
    <Flex direction="column" align="center">
      <Box
        w="280px"
        borderWidth="2px"
        borderColor={activeBorderColor}
        borderRadius="lg"
        overflow="hidden"
        bg={bgColor}
        boxShadow={isActive ? 'md' : 'sm'}
        transition="all 0.3s"
      >
        <Image
          src={course.image}
          alt={course.title}
          h="160px"
          w="full"
          objectFit="cover"
        />
        <Box p={4}>
          <Badge
            colorScheme={
              course.level === 'Beginner'
                ? 'green'
                : course.level === 'Intermediate'
                  ? 'orange'
                  : 'red'
            }
            mb={2}
          >
            {course.level}
          </Badge>
          <Heading size="sm" mb={2}>
            {course.title}
          </Heading>
          <Text fontSize="sm" color="gray.600">
            {course.description}
          </Text>
        </Box>
      </Box>

      {!isLast && (
        <Flex direction="column" align="center" my={3}>
          <Box h="24px" w="2px" bg="gray.300"></Box>
          <Box
            w="12px"
            h="12px"
            borderRadius="full"
            bg="gray.300"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box w="6px" h="6px" borderRadius="full" bg="white"></Box>
          </Box>
          <Box h="24px" w="2px" bg="gray.300"></Box>
        </Flex>
      )}
    </Flex>
  );
};

const EntranceTestResultPage = () => {
  const { testResultId } = useParams();
  const { state } = useLocation();
  const [courses, setCourses] = useState(null);
  const fetchCourses = async () => {
    try {
      const courseRequest = {
        pageNumber: 0,
        size: 100,
        title: null,
        categoryIds: null,
        rating: null,
        topicId: null,
        levelId: null,
      };

      const response = await courseService.getCourseByFilter(courseRequest);

      if (response) {
        const { content } = response;

        setCourses(content);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  console.log('courses', courses);
  // const returnUrl = state?.returnUrl || config.routes.home[0];
  const returnUrl = config.routes.homepage;
  const navigate = useNavigate();
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  // Thêm vào đầu component
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch test result when the component mounts
  useEffect(() => {
    const fetchTestResult = async () => {
      try {
        const result = await testResultService.getById(testResultId);
        setTestResult(result);
      } catch (error) {
        console.error('Error fetching test result:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestResult();
  }, [testResultId]);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading test result...</Text>
      </Box>
    );
  }

  if (!testResult) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="xl">No result found for this test.</Text>
      </Box>
    );
  }

  // Format the date
  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  // Calculate the test duration in minutes and seconds
  const calculateDuration = (start, end) => {
    const duration = (new Date(end) - new Date(start)) / 1000; // duration in seconds
    const hours = Math.floor(duration / 3600); // hours
    const minutes = Math.floor((duration % 3600) / 60); // minutes
    const seconds = Math.floor(duration % 60); // seconds

    // Format with leading zeros for single digits
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedTime;
  };

  const {
    result,
    test,
    correctPercent,
    status,
    startedAt,
    finishedAt,
    userAnswers,
    courseId,
  } = testResult;

  // Render the answer section for each question
  const renderAnswerSection = (userAnswer) => {
    const userAnswers = userAnswer.answers;

    return (
      <QuestionItem
        question={userAnswer?.testQuestion}
        userAnswers={userAnswers}
      />
    );
  };

  const handleRetake = () => {
    // Navigate to the retake test page or start a new test
    navigate(config.routes.take_test(testResult?.testId));
  };

  const isPassed = correctPercent >= test?.passingGrade;

  return (
    <Box>
      <NavbarWithBackBtn returnUrl={returnUrl} backBtnTitle={'Back to home'} />
      <Container maxW="800px" mx="auto" p={5}>
        {/* Quiz Title */}
        <Heading as="h2" size="lg" mb={4}>
          Title: {testResult?.test?.title}
        </Heading>

        <VStack spacing={6} mb={10} align="center">
          <CircularProgress
            value={correctPercent}
            size="120px"
            thickness="8px"
            color="blue.500"
          >
            <CircularProgressLabel>
              <VStack spacing={0}>
                <Text fontWeight="bold" fontSize="xl">
                  {result}
                </Text>
                <Text fontSize="xs">of {userAnswers.length}</Text>
              </VStack>
            </CircularProgressLabel>
          </CircularProgress>

          <Box textAlign="center">
            <Heading size="lg" mb={2}>
              Quiz Completed!
            </Heading>
            <Text fontSize="lg">
              You scored{' '}
              <Text as="span" fontWeight="bold" color="blue.500">
                {result}
              </Text>{' '}
              out of {userAnswers.length}
            </Text>
            <Text color="gray.600" mt={2}>
              Based on your score, here's your recommended learning path:
            </Text>
          </Box>
        </VStack>

        {/* Test Details */}
        <VStack spacing={4} align="start" mb={6}>
          <HStack>
            <Icon as={HiOutlineTrophy} color="cyan.600" boxSize={6} />
            <Text color="gray.700">Result: {testResult?.result}</Text>
          </HStack>
          <HStack>
            <Icon as={HiOutlineClock} color="cyan.600" boxSize={6} />
            <Text color="gray.700">
              Time limit: {calculateDuration(startedAt, finishedAt)}
            </Text>
          </HStack>
          <HStack>
            <Icon as={HiOutlineClock} color="cyan.600" boxSize={6} />
            <Text color="gray.700">Started At: {formatDate(startedAt)}</Text>
          </HStack>
          <HStack>
            <Icon as={HiOutlineClock} color="cyan.600" boxSize={6} />
            <Text color="gray.700">Finished At: {formatDate(finishedAt)}</Text>
          </HStack>
        </VStack>
        <Box my={10}>
          <Heading size="md" textAlign="center" mb={6}>
            Your Learning Roadmap
          </Heading>
          <VStack spacing={0} align="center">
            {suggestedCourses.map((course, index) => (
              <RoadmapStep
                key={course.id}
                course={course}
                isActive={
                  // course.id === activeCourseId || course.id < activeCourseId
                  true
                }
                isLast={index === suggestedCourses.length - 1}
              />
            ))}
          </VStack>
        </Box>
        {/* Divider */}
        <Divider mb={6} />

        <Heading as="h3" size="md" mb={4}>
          Questions and Answers
        </Heading>

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          size="sm"
          mb={4}
          leftIcon={
            isExpanded ? <FaTimesCircle /> : <HiOutlineQuestionMarkCircle />
          }
          colorScheme={isExpanded ? 'blue' : 'blue'}
          variant="outline"
        >
          {isExpanded ? 'Hide Answers' : 'Show Answers'}
        </Button>

        {isExpanded && (
          <List spacing={4} w="100%">
            {userAnswers?.map((userAnswer, index) => (
              <ListItem
                key={userAnswer?.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
              >
                {renderAnswerSection(userAnswer)}
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
};

export default EntranceTestResultPage;
