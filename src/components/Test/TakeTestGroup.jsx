import React, { useState, useRef, useEffect } from 'react';
import { ChakraProvider, Box, VStack, Text, Button, Icon, HStack } from '@chakra-ui/react';
import { FaHeadphones } from 'react-icons/fa';
import QuestionItem from '~/components/Test/Question/QuestionItem';

function TakeTestGroup({ scrollToQuestion, onQuestionAnswered }) {
  // Example data for questions
  const questionsData = [
    {
      question: "What is the capital of France?",
      options: [
        { value: "A", label: "A. Berlin" },
        { value: "B", label: "B. Paris" },
        { value: "C", label: "C. Madrid" },
      ],
      questionNumber: 1,
    },
    {
      question: "What is the largest planet?",
      options: [
        { value: "A", label: "A. Earth" },
        { value: "B", label: "B. Jupiter" },
        { value: "C", label: "C. Saturn" },
      ],
      questionNumber: 2,
    },
    {
      question: "Which element has the chemical symbol O?",
      options: [
        { value: "A", label: "A. Oxygen" },
        { value: "B", label: "B. Gold" },
        { value: "C", label: "C. Iron" },
      ],
      questionNumber: 3,
    },
  ];

  // State to track answers
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = {};
    [...Array(questionsData.length).keys()].forEach((i) => {
      const questionNumber = i + 1;
      const savedAnswer = localStorage.getItem(`Q${questionNumber}`);
      if (savedAnswer) {
        savedAnswers[questionNumber] = savedAnswer;
      }
    });
    return savedAnswers;
  });

  const questionRefs = useRef([]);

  const handleQuestionAnswered = (questionNumber, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionNumber]: answer,
    }));

    // Save answer to localStorage
    localStorage.setItem(`Q${questionNumber}`, answer);

    // Callback for parent components (if any)
    if (onQuestionAnswered) {
      onQuestionAnswered(questionNumber, answer);
    }
  };

  useEffect(() => {
    if (scrollToQuestion) {
      const questionIndex = scrollToQuestion - 1;
      if (questionRefs.current[questionIndex]) {
        questionRefs.current[questionIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [scrollToQuestion]);

  return (
    <ChakraProvider>
      <Box w="100%" p={6} bg="white" boxShadow="lg" borderRadius="md">
        <VStack align="start" spacing={6}>
          <Text fontSize="2xl" fontWeight="bold">
            Take the Test
          </Text>

          <HStack spacing={4} alignItems="center">
            <Text fontSize="xl" color="teal.500" fontWeight="bold">
              Questions 1-3
            </Text>
            <Button
              leftIcon={<Icon as={FaHeadphones} />}
              colorScheme="teal"
              variant="outline"
            >
              Listen from here
            </Button>
          </HStack>

          <Text>
            Choose the correct letter,{" "}
            <Text as="span" fontWeight="bold">
              A, B, or C.
            </Text>
          </Text>

          <VStack align="start" spacing={6} pt={4}>
            {questionsData.map((data, index) => (
              <div key={data.questionNumber} ref={(el) => (questionRefs.current[index] = el)}>
                <QuestionItem
                  question={data.question}
                  options={data.options}
                  questionNumber={data.questionNumber}
                  onQuestionAnswered={handleQuestionAnswered}
                  selectedValue={answers[data.questionNumber] || ""}
                />
              </div>
            ))}
          </VStack>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default TakeTestGroup;
