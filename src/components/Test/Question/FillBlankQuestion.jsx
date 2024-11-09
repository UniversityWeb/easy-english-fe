import React, { useState, useEffect } from 'react';
import { Box, Text, Input, Button, IconButton, Flex } from '@chakra-ui/react';
import { CheckIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';

const FillBlankQuestion = ({ question, onUpdateQuestionField, onDelete }) => {
  const [questionText, setQuestionText] = useState(question?.text || '');
  const [blanks, setBlanks] = useState(question?.blanks || []);
  const [newBlank, setNewBlank] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setQuestionText(question?.text || '');
    setBlanks(question?.blanks || []);
  }, [question]);

  const handleBlankChange = (index, value) => {
    const updatedBlanks = blanks.map((blank, i) => (i === index ? value : blank));
    setBlanks(updatedBlanks);
    onUpdateQuestionField('blanks', updatedBlanks);
  };

  const addBlank = () => {
    if (newBlank.trim()) {
      setBlanks([...blanks, newBlank.trim()]);
      setNewBlank('');
      onUpdateQuestionField('blanks', [...blanks, newBlank.trim()]);
    }
  };

  const removeBlank = (index) => {
    const updatedBlanks = blanks.filter((_, i) => i !== index);
    setBlanks(updatedBlanks);
    onUpdateQuestionField('blanks', updatedBlanks);
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <Box p={5} bg="gray.50" borderRadius="md" borderWidth="1px" my={4}>
      <Text fontSize="lg" fontWeight="bold" mb={3}>Fill in the Blank Question</Text>

      <Box mb={4}>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          Question Text
        </Text>
        {isEditing ? (
          <Input
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question with blanks"
          />
        ) : (
          <Text>{questionText}</Text>
        )}
      </Box>

      <Box mb={4}>
        <Text fontSize="md" fontWeight="bold" mb={2}>Blanks</Text>
        {blanks.map((blank, index) => (
          <Flex key={index} mb={2} align="center">
            <Text>_________</Text>
            <Input
              value={blank}
              onChange={(e) => handleBlankChange(index, e.target.value)}
              placeholder={`Fill in blank ${index + 1}`}
              width="200px"
              ml={2}
            />
            <IconButton
              icon={<DeleteIcon />}
              aria-label="Delete Blank"
              size="sm"
              colorScheme="red"
              ml={2}
              onClick={() => removeBlank(index)}
            />
          </Flex>
        ))}
      </Box>

      <Box>
        <Input
          value={newBlank}
          onChange={(e) => setNewBlank(e.target.value)}
          placeholder="Enter new blank text"
          mb={2}
        />
        <Button leftIcon={<AddIcon />} onClick={addBlank} colorScheme="blue" mb={2}>
          Add Blank
        </Button>
        <Button onClick={toggleEditing} colorScheme="blue" mb={2}>
          {isEditing ? 'Save' : 'Edit'}
        </Button>
        <IconButton
          icon={<DeleteIcon />}
          aria-label="Delete Question"
          size="sm"
          colorScheme="red"
          onClick={onDelete}
        />
      </Box>
    </Box>
  );
};

export default FillBlankQuestion;
