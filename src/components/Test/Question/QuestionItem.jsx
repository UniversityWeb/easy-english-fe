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
import SingleChoiceQuestion from '~/components/Test/Question/SingleChoiceQuestion';
import MultipleChoiceQuestion from '~/components/Test/Question/MultipleChoiceQuestion';
import TrueFalseQuestion from '~/components/Test/Question/TrueFalseQuestion';
import MatchingQuestion from '~/components/Test/Question/MatchingQuestion';
import FillBlankQuestion from '~/components/Test/Question/FillBlankQuestion';

const QuestionItem = ({ question, onQuestionAnswered }) => {
  const renderQuestion = () => {
    const commonProps = {
      onQuestionAnswered,
      question,
    };

    switch (question.type) {
      case QUESTION_TYPES.SINGLE_CHOICE:
        return <SingleChoiceQuestion {...commonProps} />;
      case QUESTION_TYPES.MULTI_CHOICE:
        return <MultipleChoiceQuestion {...commonProps} />;
      case QUESTION_TYPES.TRUE_FALSE:
        return <TrueFalseQuestion {...commonProps} />;
      case QUESTION_TYPES.MATCHING:
        return <MatchingQuestion {...commonProps} />;
      case QUESTION_TYPES.FILL_BLANK:
        return <FillBlankQuestion {...commonProps} />;
      default:
        return <Text>Unknown question type</Text>;
    }
  };  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} w="100%">
      <Text fontWeight="bold">{question.text}</Text>
      {renderQuestion()}
    </Box>
  );
};

export default QuestionItem;
