import React from 'react';
import { QUESTION_TYPES } from '~/utils/constants';
import EditableSingleChoice from '~/components/Test/EditableQuestion/EditableSingleChoice';
import EditableMultipleChoice from '~/components/Test/EditableQuestion/EditableMultipleChoice';
import EditableMapping from '~/components/Test/EditableQuestion/EditableMapping';
import EditableTrueFalse from '~/components/Test/EditableQuestion/EditableTrueFalse';
import { Box, Flex, Select, IconButton, EditablePreview, EditableInput, Editable } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const EditableQuestionItem = ({ question, onUpdateQuestion, onRemoveQuestion }) => {

  // Function to render the question based on its type
  const renderQuestion = () => {
    const commonProps = {
      key: question.id,
      question: question,
      onUpdate: onUpdateQuestion,
    };

    switch (question.type) {
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
          onSubmit={(value) => onUpdateQuestion(question?.id, { title: value })}
        >
          <EditablePreview />
          <EditableInput />
        </Editable>
        <Flex align="center">
          <Select
            w="200px"
            mr={2}
            value={question?.type}
            onChange={(e) => {
              const newType = e.target.value;
              onUpdateQuestion(question?.id, { type: newType });

              // Reset options or data based on new type if necessary
              // This could involve resetting options or specific question-related state
              switch (newType) {
                case QUESTION_TYPES.SINGLE_CHOICE:
                  onUpdateQuestion(question.id, { options: [], correctAnswers: [] }); // Reset specific fields
                  break;
                case QUESTION_TYPES.MULTI_CHOICE:
                  onUpdateQuestion(question.id, { options: [], correctAnswers: [] }); // Reset specific fields
                  break;
                // Add cases for other question types as necessary
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
};

export default EditableQuestionItem;
