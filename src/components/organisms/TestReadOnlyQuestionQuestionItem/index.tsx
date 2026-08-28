import React, { useEffect, useRef } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { QUESTION_TYPES } from '@/utils/constants';
import SingleChoiceQuestion from '@/components/organisms/TestReadOnlyQuestionSingleChoiceQuestion';
import MultipleChoiceQuestion from '@/components/organisms/TestReadOnlyQuestionMultipleChoiceQuestion';
import TrueFalseQuestion from '@/components/organisms/TestReadOnlyQuestionTrueFalseQuestion';
import MatchingQuestion from '@/components/organisms/TestReadOnlyQuestionMatchingQuestion';
import FillBlankQuestion from '@/components/organisms/TestReadOnlyQuestionFillBlankQuestion';

const QuestionItem = ({ question, scrollToQuestion, userAnswers }) => {
  const questionRef = useRef(null);

  useEffect(() => {
    if (scrollToQuestion === question.id && questionRef.current) {
      questionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [scrollToQuestion, question.id]);

  const renderQuestion = () => {
    switch (question.type) {
      case QUESTION_TYPES.SINGLE_CHOICE:
        return <SingleChoiceQuestion question={question} userAnswers={userAnswers} />;
      case QUESTION_TYPES.MULTI_CHOICE:
        return <MultipleChoiceQuestion question={question} userAnswer={userAnswers} />;
      case QUESTION_TYPES.TRUE_FALSE:
        return <TrueFalseQuestion question={question} userAnswers={userAnswers} />;
      case QUESTION_TYPES.MATCHING:
        return <MatchingQuestion question={question} userAnswers={userAnswers} />;
      case QUESTION_TYPES.FILL_BLANK:
        return <FillBlankQuestion question={question} userAnswers={userAnswers} />;
      default:
        return <Text>Unknown question type</Text>;
    }
  };

  return (
    <Box ref={questionRef}>
      {question.type !== QUESTION_TYPES.FILL_BLANK && (
        <Heading as="h4" size="sm" mb={4}>
          Question {question.ordinalNumber}. {question.title}
        </Heading>
      )}

      {renderQuestion()}
    </Box>
  );
};

export default QuestionItem;