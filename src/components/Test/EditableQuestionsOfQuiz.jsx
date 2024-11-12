import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import useCustomToast from '~/hooks/useCustomToast';
import EditableQuestionItem from '~/components/Test/EditableQuestion/EditableQuestionItem';
import { AddIcon } from '@chakra-ui/icons';
import testQuestionService from '~/services/testQuestionService';
import { QUESTION_TEMPLATES_TO_ADD } from '~/utils/testDemoData';
import { TEST_TYPES } from '~/utils/constants';

const EditableQuestionsOfQuiz = ({ test }) => {
  const [questions, setQuestions] = useState([]);
  const { successToast, errorToast } = useCustomToast();

  useEffect(() => {
    if (!test?.id || test?.type !== TEST_TYPES.QUIZ) return;

    fetchQuestionsForQuiz();
  }, [test?.id]);

  const fetchQuestionsForQuiz = async () => {
    if (!test) return;

    try {
      const loadedQuestions = await testQuestionService.getAllQuestionsForQuizType(test?.id);
      setQuestions(loadedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  const reloadQuestions = async () => {
    await fetchQuestionsForQuiz();
  };

  const addNewQuestionForQuiz = async () => {
    const newQuestion = {
      ...QUESTION_TEMPLATES_TO_ADD.SINGLE_CHOICE,
      ordinalNumber: questions?.length + 1 || 1,
      testId: test?.id,
    };

    try {
      const addedQuestion = await testQuestionService.createNewQuestionForQuizType(newQuestion);
      setQuestions((prevQuestions) => [...prevQuestions, addedQuestion]);
      successToast('Question added successfully.');
    } catch (error) {
      console.error('Error adding question:', error);
      errorToast('Error adding question.');
    }
  };

  const removeQuestion = useCallback(
    async (id) => {
      try {
        await testQuestionService.remove(id);
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== id),
        );
        successToast('Question removed successfully.');
      } catch (error) {
        console.error('Error removing question:', error);
        errorToast('Error removing question.');
      }
    },
    [questions.length],
  );

  return (
    <Box p={4} paddingBottom={0} shadow="md" borderWidth="1px" width="100%">
      {/* Question List */}
      <Heading size="md" mt={10} mb={5}>Questions</Heading>

      {/* Question Items */}
      {questions.map((question, index) => (
        <EditableQuestionItem
          index={index}
          key={question.id}
          question={question}
          onRemoveQuestion={removeQuestion}
          onReloadQuestions={reloadQuestions}
        />
      ))}

      <Flex justify="end" mb={10}>
        <Button
          colorScheme="green"
          onClick={addNewQuestionForQuiz}
          leftIcon={<AddIcon />}
        >
          Add Question
        </Button>
      </Flex>
    </Box>
  );
};

export default EditableQuestionsOfQuiz;
