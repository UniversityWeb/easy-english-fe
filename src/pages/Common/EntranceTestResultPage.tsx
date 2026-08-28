import { useEffect, useState } from 'react';
import {
  Badge,
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
import { FaTimesCircle } from 'react-icons/fa';
import {
  HiOutlineClock,
  HiOutlineQuestionMarkCircle,
  HiOutlineTrophy,
} from 'react-icons/hi2';
import { useNavigate, useParams } from 'react-router-dom';
import testResultService from '@/services/testResultService';
import QuestionItem from '@/components/organisms/TestReadOnlyQuestionQuestionItem';
import config from '@/config';
import NavbarWithBackBtn from '@/components/organisms/NavbarWithBackBtn';
import courseService from '@/services/courseService';

const getLevelColorScheme = (levelName?: string) => {
  if (levelName === 'Beginner') return 'green';
  if (levelName === 'Intermediate') return 'orange';
  return 'red';
};

const RoadmapStep = ({ course, isActive, isLast }: any) => {
  const activeBorderColor = isActive ? 'blue.500' : 'gray.200';
  const bgColor = isActive ? 'blue.50' : 'white';
  const navigate = useNavigate();
  return (
    <Flex direction="column" align="center">
      <Box
        cursor={'pointer'}
        onClick={() => {
          navigate(`/course-view-detail/${course.id}`);
        }}
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
          src={course.imagePreview}
          alt={course.title}
          h="160px"
          w="full"
          objectFit="cover"
        />
        <Box p={4}>
          <Badge
            colorScheme={getLevelColorScheme(course.level?.name)}
            mb={2}
          >
            {course.level?.name || 'All Levels'}
          </Badge>
          <Heading size="sm" mb={2}>
            {course.title}
          </Heading>
          <Text fontSize="sm" color="gray.600">
            {course.descriptionPreview}
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
  const [courses, setCourses] = useState<any[]>([]);
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
      if (response?.content) {
        setCourses(response.content.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const returnUrl = config.routes.homepage;
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  const calculateDuration = (start: string, end: string) => {
    const duration = (new Date(end).getTime() - new Date(start).getTime()) / 1000;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const {
    result,
    correctPercent,
    startedAt,
    finishedAt,
    userAnswers,
  } = testResult;

  const renderAnswerSection = (userAnswer: any) => {
    const answers = userAnswer.answers;

    return (
      <QuestionItem
        question={userAnswer?.testQuestion}
        userAnswers={answers}
      />
    );
  };

  return (
    <Box>
      <NavbarWithBackBtn returnUrl={returnUrl} backBtnTitle={'Back to home'} />
      <Container maxW="800px" mx="auto" p={5}>
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
                <Text fontSize="xs">of {userAnswers?.length || 0}</Text>
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
              out of {userAnswers?.length || 0}
            </Text>
            <Text color="gray.600" mt={2}>
              Based on your score, here's your recommended learning path:
            </Text>
          </Box>
        </VStack>

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
            {courses?.map((course, index) => (
              <RoadmapStep
                key={course.id}
                course={course}
                isActive={true}
                isLast={index === courses?.length - 1}
              />
            ))}
          </VStack>
        </Box>

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
          colorScheme="blue"
          variant="outline"
        >
          {isExpanded ? 'Hide Answers' : 'Show Answers'}
        </Button>

        {isExpanded && (
          <List spacing={4} w="100%">
            {userAnswers?.map((userAnswer: any) => (
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
