import React from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';
import QuestionItem from '~/components/Test/Question/QuestionItem';

class TestPart {
  constructor(id, title, questions) {
    this.id = id;
    this.title = title;
    this.questions = questions;
  }
}

const TestPartComponent = ({ section, onAnswerChange, answers }) => {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold">
        {section.title}
      </Text>

      <VStack spacing={6} w="100%">
        {section.questions.map((question) => (
          <Box
            key={question.id}
            w="100%"
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            mb={4}
          >
            <QuestionItem
              question={question}
              selectedAnswer={answers[question.id]}
              onAnswerChange={onAnswerChange}
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TestPartComponent;