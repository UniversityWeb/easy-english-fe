import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  RadioGroup,
  Radio, Textarea,
} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";

const EditableTrueFalse = React.memo(({ question, onUpdateQuestionField }) => {
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    setCorrectAnswer(question?.correctAnswers[0] || "");
  }, [question]);

  // Handle selecting the correct answer
  const handleCorrectAnswerChange = (value) => {
    setCorrectAnswer(value);
    onUpdateQuestionField('correctAnswers', [value]);
  };

  return (
    <Box p={5} bg="gray.50" borderRadius="lg" borderWidth="1px" my={4}>
      <Flex align="center" mb={4}>
        <Editable
          width="100%"
          defaultValue={question.title}
          onSubmit={(value) => onUpdateQuestionField('title', value)}
        >
          <EditablePreview />
          <Textarea
            as={EditableInput}
            placeholder="Enter question title"
            resize="vertical" // Allows vertical resizing
            size="sm" // Adjust size as needed
          />
        </Editable>
      </Flex>

      {/* True/False options */}
      <RadioGroup value={correctAnswer} onChange={handleCorrectAnswerChange}>
        <Flex align="center" mb={2}>
          <Radio value="True">True</Radio>
          <Radio value="False" ml={4}>False</Radio>
        </Flex>
      </RadioGroup>
    </Box>
  );
});

export default EditableTrueFalse;
