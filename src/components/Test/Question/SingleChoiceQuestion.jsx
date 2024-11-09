import React from 'react';
import { Box, Text, RadioGroup, Radio, VStack } from '@chakra-ui/react';

const SingleChoiceQuestion = ({
  question,
  options,
  questionNumber,
  onQuestionAnswered,
  selectedValue,
}) => {
  return (
    <Box>
      <Text fontWeight="bold">
        {questionNumber}. {question}
      </Text>
      <RadioGroup
        onChange={(value) => onQuestionAnswered(questionNumber, value)}
        value={selectedValue}
      >
        <VStack align="start">
          {options.map((option, index) => (
            <Radio key={index} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </VStack>
      </RadioGroup>
    </Box>
  );
};

export default SingleChoiceQuestion;
