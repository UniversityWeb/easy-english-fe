import React, { useRef, useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Select,
} from "@chakra-ui/react";
import { FaHeadphones } from 'react-icons/fa';
import SingleChoiceQuestion from '~/components/Test/Question/SingleChoiceQuestion';

function TakeTestPart({ scrollToQuestion, onQuestionAnswered }) {
  const questionsState = [
    {
      question: "The company deals mostly with:",
      options: [
        { value: "A", label: "A. Big cities." },
        { value: "B", label: "B. Nature holidays." },
        { value: "C", label: "C. Nepal." },
      ],
      questionNumber: 11,
    },
    {
      question: "The overseas consultants deal mostly with:",
      options: [
        { value: "A", label: "A. Asia" },
        { value: "B", label: "B. North America" },
        { value: "C", label: "C. Europe" },
      ],
      questionNumber: 12,
    },
    {
      question: "For deserts and gorges, customers should come in the:",
      options: [
        { value: "A", label: "A. Morning." },
        { value: "B", label: "B. Afternoon." },
        { value: "C", label: "C. Night." },
      ],
      questionNumber: 13,
    },
    {
      question: "Trips to regional locations are good because:",
      options: [
        { value: "A", label: "A. The buses are comfortable." },
        { value: "B", label: "B. There is storage for suitcases." },
        { value: "C", label: "C. They can be seen quickly." },
      ],
      questionNumber: 14,
    },
    {
      question: "Trips to regional locations are good because:",
      options: [
        { value: "A", label: "A. The buses are comfortable." },
        { value: "B", label: "B. There is storage for suitcases." },
        { value: "C", label: "C. They can be seen quickly." },
      ],
      questionNumber: 15,
    },
  ];

  const [answers, setAnswers] = useState(() => {
    // Lấy câu trả lời từ localStorage khi trang load
    const savedAnswers = {};
    // Lấy cả câu hỏi từ 11 đến 20
    [...Array(20).keys()].forEach((i) => {
      const questionNumber = i + 1;
      const savedAnswer = localStorage.getItem(`Q${questionNumber}`);
      if (savedAnswer) {
        savedAnswers[questionNumber] = savedAnswer;
      }
    });
    return savedAnswers;
  });

  const questionRefs = useRef([]);
  const questionRefs16To20 = useRef([]);

  // Function để lưu câu trả lời vào localStorage
  const handleQuestionAnswered = (questionNumber, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionNumber]: answer,
    }));

    // Lưu câu trả lời vào localStorage, dạng biến Q11, Q12, v.v.
    localStorage.setItem(`Q${questionNumber}`, answer);

    // Gọi callback bên ngoài nếu cần
    if (onQuestionAnswered) {
      onQuestionAnswered(questionNumber, answer);
    }
  };

  useEffect(() => {
    if (scrollToQuestion) {
      if (scrollToQuestion >= 11 && scrollToQuestion <= 15) {
        const questionIndex = scrollToQuestion - 11;
        if (questionRefs.current[questionIndex]) {
          questionRefs.current[questionIndex].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      } else if (scrollToQuestion >= 16 && scrollToQuestion <= 20) {
        const questionIndex = scrollToQuestion - 16;
        if (questionRefs16To20.current[questionIndex]) {
          questionRefs16To20.current[questionIndex].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  }, [scrollToQuestion]);

  return (
    <ChakraProvider>
      <Box w="100%" p={6} bg="white" boxShadow="lg" borderRadius="md">
        <VStack align="start" spacing={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Part 2
          </Text>

          <HStack spacing={4} alignItems="center">
            <Text fontSize="xl" color="teal.500" fontWeight="bold">
              Questions 11-15
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
              A, B, or C
            </Text>
            .
          </Text>

          <VStack align="start" spacing={6} pt={4}>
            {questionsState.map((data, index) => (
              <div
                key={data.questionNumber}
                ref={(el) => (questionRefs.current[index] = el)}
              >
                <SingleChoiceQuestion
                  question={data.question}
                  options={data.options}
                  questionNumber={data.questionNumber}
                  onQuestionAnswered={handleQuestionAnswered}
                  selectedValue={answers[data.questionNumber] || ""}
                />
              </div>
            ))}
          </VStack>

          {/* Questions 16-20 */}
          <VStack align="start" pt={8} spacing={4}>
            <HStack spacing={4} alignItems="center">
              <Text fontSize="xl" color="teal.500" fontWeight="bold">
                Questions 16-20
              </Text>
              <Button
                leftIcon={<Icon as={FaHeadphones} />}
                colorScheme="teal"
                variant="outline"
              >
                Listen from here
              </Button>
            </HStack>

            <Text>Identify the rooms in the office plan.</Text>
            <Text>
              Write the correct letter,{" "}
              <Text as="span" fontWeight="bold">
                A-G
              </Text>
              , next to the questions.
            </Text>

            <Box
              as="img"
              src="https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-3.jpg"
              alt="Office Plan"
              w="100%"
              maxW="500px"
            />

            <VStack align="start" spacing={4}>
              {[16, 17, 18, 19, 20].map((questionNumber, index) => (
                <HStack
                  key={questionNumber}
                  ref={(el) => (questionRefs16To20.current[index] = el)}
                >
                  <Text>{questionNumber}.</Text>
                  <Select
                    placeholder="Select"
                    value={answers[questionNumber] || ""}
                    w="100px"
                    onChange={(e) => {
                      const value = e.target.value;
                      handleQuestionAnswered(questionNumber, value);
                    }}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                  </Select>
                  <Text>{`Room description ${questionNumber}`}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default TakeTestPart;