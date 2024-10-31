import React, { useCallback, useEffect, useState } from 'react';
import { QUESTION_TYPES } from '~/utils/constants';
import EditableSingleChoice from '~/components/Test/EditableQuestion/EditableSingleChoice';
import EditableMultipleChoice from '~/components/Test/EditableQuestion/EditableMultipleChoice';
import EditableMapping from '~/components/Test/EditableQuestion/EditableMapping';
import EditableTrueFalse from '~/components/Test/EditableQuestion/EditableTrueFalse';
import { Box, Flex, Select, IconButton, EditablePreview, EditableInput, Editable } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import testQuestionService from '~/services/testQuestionService';
import useCustomToast from '~/hooks/useCustomToast';

const EditableQuestionItem = React.memo(({ question, onRemoveQuestion }) => {
  const [questionState, setQuestionState] = useState(question);
  const { successToast, errorToast } = useCustomToast();

  useEffect(() => {
    if (question) {
      setQuestionState({
        id: question?.id,
        type: question?.type || "SINGLE_CHOICE", // Default type if not provided
        ordinalNumber: question?.ordinalNumber || 0,
        title: question?.title || "",
        description: question?.description || "",
        audioPath: question?.audioPath || "",
        imagePath: question?.imagePath || "",
        options: question?.options || [],
        correctAnswers: question?.correctAnswers || [],
        questionGroupId: question?.questionGroupId || 0,
      });
    }
  }, [question]);

  useEffect(() => {
    if (!questionState) return;

    updateQuestion(question?.id, questionState);
  }, [questionState]);

  const updateQuestion = async (id, updatedData) => {
    try {
      await testQuestionService.update(id, updatedData);
      successToast("Question updated successfully.");
    } catch (error) {
      console.error("Error updating question:", error);
      errorToast("Error updating question.");
    }
  };

  const updateQuestionField = useCallback(async (field, value) => {
    setQuestionState((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    await updateQuestion(question.id, { ...question, [field]: value });
  }, [question.id]);

  // Function to render the question based on its type
  const renderQuestion = () => {
    const commonProps = {
      key: question?.id,
      question: questionState,
      onUpdateQuestionField: updateQuestionField,
    };

    switch (questionState?.type) {
      case QUESTION_TYPES.SINGLE_CHOICE:
        return <EditableSingleChoice {...commonProps} />;
      case QUESTION_TYPES.MULTI_CHOICE:
        return <EditableMultipleChoice {...commonProps} />;
      case QUESTION_TYPES.TRUE_FALSE:
        return <EditableTrueFalse {...commonProps} />;
      case QUESTION_TYPES.MATCHING:
        return <EditableMapping {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Box p={4} bg="gray.100" mb={4} borderRadius="lg" borderWidth="1px">
      <Flex justify="space-between" mb={4} align="center">
        <Editable
          defaultValue={question?.title || 'Default'}
          onSubmit={(value) => updateQuestion(question?.id, { ...question, title: value })}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
        <Flex align="center">
          <Select
            w="200px"
            mr={2}
            value={questionState?.type}
            onChange={async (e) => {
              const newType = e.target.value;

              // Reset options or data based on new type if necessary
              // This could involve resetting options or specific question-related state
              switch (newType) {
                case QUESTION_TYPES.SINGLE_CHOICE:
                  await updateQuestion(question.id, { ...question, type: newType, options: [], correctAnswers: [] });
                  break;
                case QUESTION_TYPES.MULTI_CHOICE:
                  await updateQuestion(question.id, { ...question, type: newType, options: [], correctAnswers: [] });
                  break;
                default:
                  break;
              }
            }}
          >
            {Object.values(QUESTION_TYPES).map((type) => (
              <option key={type} value={type}>
                {type.replace('_', ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
              </option>
            ))}
          </Select>
          <IconButton
            icon={<DeleteIcon />}
            aria-label="Delete question"
            colorScheme="red"
            onClick={() => onRemoveQuestion(question?.id)}
          />
        </Flex>
      </Flex>
      {renderQuestion()}
    </Box>
  );
});

export default EditableQuestionItem;
