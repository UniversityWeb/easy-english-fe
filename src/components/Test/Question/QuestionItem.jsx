import React from 'react';
import {
  Box,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  VStack,
  Text,
  Image,
  Input,
} from '@chakra-ui/react';
import { QUESTION_TYPES } from '~/utils/constants';

class TestQuestion {
  constructor(id, text, options, type, items = [], images = [], sentence = "") {
    this.id = id;
    this.text = text;
    this.options = options;
    this.type = type;
    this.items = items;
    this.images = images;
    this.sentence = sentence;
  }
}

// Helper functions for each question type
const renderSingleChoice = (question, selectedAnswer, onAnswerChange) => (
  <RadioGroup
    value={selectedAnswer || ''}
    onChange={(value) => onAnswerChange(question.id, value)}
  >
    <VStack align="start">
      {question.options.map((option, index) => (
        <Radio key={index} value={option}>
          {option}
        </Radio>
      ))}
    </VStack>
  </RadioGroup>
);

const renderMultiChoice = (question, selectedAnswer, onAnswerChange) => (
  <CheckboxGroup
    value={selectedAnswer || []}
    onChange={(value) => onAnswerChange(question.id, value)}
  >
    <VStack align="start">
      {question.options.map((option, index) => (
        <Checkbox key={index} value={option}>
          {option}
        </Checkbox>
      ))}
    </VStack>
  </CheckboxGroup>
);

const renderTrueFalse = (question, selectedAnswer, onAnswerChange) => (
  <RadioGroup
    value={selectedAnswer || ''}
    onChange={(value) => onAnswerChange(question.id, value)}
  >
    <VStack align="start">
      <Radio value="True">True</Radio>
      <Radio value="False">False</Radio>
    </VStack>
  </RadioGroup>
);

const renderItemMatch = (question, selectedAnswer, onAnswerChange) => (
  <VStack align="start">
    {question.items.map((item, index) => (
      <Box key={index}>
        <Text>{item}</Text>
        <Input
          placeholder="Enter corresponding match"
          value={selectedAnswer ? selectedAnswer[index] : ''}
          onChange={(e) => {
            const newAnswer = [...(selectedAnswer || [])];
            newAnswer[index] = e.target.value;
            onAnswerChange(question.id, newAnswer);
          }}
        />
      </Box>
    ))}
  </VStack>
);

const renderImageMatch = (question, selectedAnswer, onAnswerChange) => (
  <VStack align="start">
    {question.images.map((image, index) => (
      <Box key={index}>
        <Image src={image.src} alt={`Option ${index}`} />
        <RadioGroup
          value={selectedAnswer}
          onChange={(value) => onAnswerChange(question.id, value)}
        >
          {image.options.map((option, idx) => (
            <Radio key={idx} value={option}>
              {option}
            </Radio>
          ))}
        </RadioGroup>
      </Box>
    ))}
  </VStack>
);

const renderKeywords = (question, selectedAnswer, onAnswerChange) => (
  <VStack align="start">
    <Input
      placeholder="Enter keywords"
      value={selectedAnswer || ''}
      onChange={(e) => onAnswerChange(question.id, e.target.value)}
    />
  </VStack>
);

const renderFillTheGap = (question, selectedAnswer, onAnswerChange) => (
  <VStack align="start">
    {question.sentence.split('__').map((part, index) => (
      <span key={index}>
        {part}
        {index < question.sentence.split('__').length - 1 && (
          <Input
            placeholder="Fill the gap"
            value={selectedAnswer ? selectedAnswer[index] : ''}
            onChange={(e) => {
              const newAnswer = [...(selectedAnswer || [])];
              newAnswer[index] = e.target.value;
              onAnswerChange(question.id, newAnswer);
            }}
          />
        )}
      </span>
    ))}
  </VStack>
);

// Main component
const QuestionItem = ({ question, onAnswerChange, selectedAnswer }) => {
  const renderQuestion = () => {
    switch (question.type) {
      case QUESTION_TYPES.SINGLE_CHOICE:
        return renderSingleChoice(question, selectedAnswer, onAnswerChange);
      case QUESTION_TYPES.MULTI_CHOICE:
        return renderMultiChoice(question, selectedAnswer, onAnswerChange);
      case QUESTION_TYPES.TRUE_FALSE:
        return renderTrueFalse(question, selectedAnswer, onAnswerChange);
      case QUESTION_TYPES.MATCHING:
        return renderItemMatch(question, selectedAnswer, onAnswerChange);
      case QUESTION_TYPES.IMAGE_MATCH:
        return renderImageMatch(question, selectedAnswer, onAnswerChange);
      case QUESTION_TYPES.KEYWORDS:
        return renderKeywords(question, selectedAnswer, onAnswerChange);
      case QUESTION_TYPES.FILL_BLANK:
        return renderFillTheGap(question, selectedAnswer, onAnswerChange);
      default:
        return <Text>Unknown question type</Text>;
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} w="100%">
      <Text fontWeight="bold">{question.text}</Text>
      {renderQuestion()}
    </Box>
  );
};

export default QuestionItem;