import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  Divider,
  List,
  ListItem,
  Spinner,
  Button,
  Icon,
  Flex, Container,
} from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle, FaRedoAlt } from 'react-icons/fa';
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineCheckCircle,
  HiOutlineTrophy,
  HiOutlineClock,
} from 'react-icons/hi2';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import testResultService from '~/services/testResultService';
import QuestionItem from '~/components/Test/ReadOnlyQuestion/QuestionItem';
import config from '~/config';
import { MdArrowBack } from 'react-icons/md';

const TestResultPage = () => {
  const { testResultId } = useParams();
  const { state } = useLocation();
  const returnUrl = state?.returnUrl || config.routes.home[0];
  const navigate = useNavigate();
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const Navbar = ({ returnUrl }) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
      navigate(returnUrl);
    };

    return (
      <Flex
        bg="gray.800"
        color="white"
        px="8"
        py="4"
        alignItems="center"
        w="full"
      >
        <Button
          leftIcon={<MdArrowBack />}
          variant="ghost"
          colorScheme="whiteAlpha"
          onClick={handleBackClick}
        >
          Back to course
        </Button>
      </Flex>
    );
  };

  return (
    <Box>
      <Navbar returnUrl={returnUrl} />
      <Container maxW="800px" mx="auto" p={5}>
        {/* Quiz Title */}
        <Heading as="h2" size="lg" mb={4}>
          Title: {testResult?.test?.title}
        </Heading>

        {/* Incorrect Answer Box */}
        <Box bg="red.100" p={5} borderRadius="md" textAlign="center" mb={6}>
          <Heading size="2xl" color="red.500">
            {new Intl.NumberFormat('en-US', {
              style: 'percent',
              maximumFractionDigits: 2,
            }).format(correctPercent / 100)}
          </Heading>
          <HStack justifyContent="center" mt={2}>
            <Text fontSize="lg" color="gray.700">
              {result} out of {userAnswers.length} questions answered correctly
            </Text>
            {/* Red icon for incorrect answers */}
            <Icon as={FaTimesCircle} color="red.600" boxSize={7} />
          </HStack>

          {/* Retake Button */}
          <Button
            textColor="white"
            mt={4}
            onClick={handleRetake}
            bg="cyan.600"
            _hover={{ bg: 'cyan.700' }}
            borderRadius="full"
            shadow="md"
          >
            <Icon as={FaRedoAlt} mr={2} color="white" boxSize={5} />
            Retake
          </Button>
        </Box>

        {/* Test Details */}
        <VStack spacing={4} align="start" mb={6}>
          <HStack>
            <Icon as={HiOutlineQuestionMarkCircle} color="cyan.600" boxSize={6} />
            <Text color="gray.700">Status: {status}</Text>
          </HStack>
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

        {/* Pass or Fail Display */}
        <HStack spacing={4} mb={6}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={isPassed ? 'green.600' : 'red.600'}
          >
            {isPassed ? 'You Passed!' : 'You Failed!'}
          </Text>
          <Icon
            as={isPassed ? HiOutlineCheckCircle : FaTimesCircle}
            color={isPassed ? 'green.600' : 'red.600'}
            boxSize={8}
          />
        </HStack>

        {/* Divider */}
        <Divider mb={6} />

        {/* Questions and Answers */}
        <Heading as="h3" size="md" mb={4}>
          Questions and Answers
        </Heading>

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
      </Container>
    </Box>
  );
};

export default TestResultPage;
