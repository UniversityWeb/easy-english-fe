import React, { useState, useEffect } from 'react';
import { Box, Text, RadioGroup, Radio, Button, Input, IconButton } from '@chakra-ui/react';
import { CheckIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

const TrueFalseQuestion = ({ question, onUpdateQuestionField, onDelete }) => {
  const [answer, setAnswer] = useState(question?.answer || '');
  const [questionText, setQuestionText] = useState(question?.text || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setAnswer(question?.answer || '');
    setQuestionText(question?.text || '');
  }, [question]);

  const handleAnswerChange = (value) => {
    setAnswer(value);
    onUpdateQuestionField('answer', value);
  };

  const handleQuestionChange = (value) => {
    setQuestionText(value);
    onUpdateQuestionField('text', value);
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <Box p={5} bg="gray.50" borderRadius="md" borderWidth="1px" my={4}>
      <Text fontSize="lg" fontWeight="bold" mb={3}>True/False Question</Text>

      <Box mb={4}>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          Question Text
        </Text>
        {isEditing ? (
          <Input
            value={questionText}
            onChange={(e) => handleQuestionChange(e.target.value)}
            placeholder="Enter your question"
          />
        ) : (
          <Text>{questionText}</Text>
        )}
      </Box>

      <Box mb={4}>
        <Text fontSize="md" fontWeight="bold" mb={2}>Answer</Text>
        <RadioGroup onChange={handleAnswerChange} value={answer}>
          <Radio value="true">True</Radio>
          <Radio value="false">False</Radio>
        </RadioGroup>
      </Box>

      <Box>
        <Button onClick={toggleEditing} colorScheme="blue" mb={2}>
          {isEditing ? 'Save' : 'Edit'}
        </Button>
        <IconButton
          icon={<DeleteIcon />}
          aria-label="Delete"
          size="sm"
          colorScheme="red"
          onClick={onDelete}
        />
      </Box>
    </Box>
  );
};

export default TrueFalseQuestion;
