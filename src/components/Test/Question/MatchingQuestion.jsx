import React, { useState } from 'react';
import { Box, Input, Grid, Text, IconButton, Button, Flex, Center } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon, CheckIcon } from '@chakra-ui/icons';

const MatchingQuestion = ({ question, onUpdateQuestionField }) => {
  const [options, setOptions] = useState(question?.options || []);
  const [answers, setAnswers] = useState(question?.correctAnswers || []);
  const [isEditing, setIsEditing] = useState(Array(options.length).fill(false));
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const addNewPair = () => {
    if (newQuestion.trim() === '' || newAnswer.trim() === '') {
      return;
    }
    const newOptions = [...options, newQuestion];
    const newAnswers = [...answers, newAnswer];
    const newIsEditing = [...isEditing, false];
    setOptions(newOptions);
    setAnswers(newAnswers);
    setIsEditing(newIsEditing);
    onUpdateQuestionField({ options: newOptions, correctAnswers: newAnswers });
    setNewQuestion('');
    setNewAnswer('');
  };

  const removeRow = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    const newAnswers = answers.filter((_, i) => i !== index);
    const newIsEditing = isEditing.filter((_, i) => i !== index);
    setOptions(newOptions);
    setAnswers(newAnswers);
    setIsEditing(newIsEditing);
    onUpdateQuestionField({ options: newOptions, correctAnswers: newAnswers });
  };

  const toggleEdit = (index) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = !newIsEditing[index];
    setIsEditing(newIsEditing);
    if (!newIsEditing[index]) {
      onUpdateQuestionField({ options, correctAnswers: answers });
    }
  };

  const handleDataChange = (index, field, value) => {
    if (field === 'question') {
      const updatedOptions = [...options];
      updatedOptions[index] = value;
      setOptions(updatedOptions);
    } else if (field === 'answer') {
      const updatedAnswers = [...answers];
      updatedAnswers[index] = value;
      setAnswers(updatedAnswers);
    }
  };

  return (
    <Box>
      {options.map((option, index) => (
        <Box key={index} mb={4} bg="gray.50" p={4} borderRadius="md" border="1px solid" borderColor="gray.200">
          <Grid templateColumns="1fr 1fr auto" gap={4}>
            <Box>
              <Text fontWeight="bold" mb={5}>Question</Text>
              <Flex align="center" justify="center" w="100%">
                {isEditing[index] ? (
                  <Input
                    value={options[index]}
                    onChange={(e) => handleDataChange(index, 'question', e.target.value)}
                    placeholder="Enter question"
                    bg="white"
                    border="2px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                    p={2}
                  />
                ) : (
                  <Text>{options[index] || 'No question'}</Text>
                )}
              </Flex>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={5}>Answer</Text>
              <Flex align="center" justify="center" w="100%">
                {isEditing[index] ? (
                  <Input
                    value={answers[index]}
                    onChange={(e) => handleDataChange(index, 'answer', e.target.value)}
                    placeholder="Enter answer"
                    bg="white"
                    border="2px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    _hover={{ borderColor: 'gray.400' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                    p={2}
                  />
                ) : (
                  <Text>{answers[index] || 'No answer'}</Text>
                )}
              </Flex>
            </Box>

            <Box>
              <Flex justify="center">
                <IconButton
                  icon={isEditing[index] ? <CheckIcon /> : <EditIcon />}
                  size="sm"
                  aria-label={isEditing[index] ? 'Save answer' : 'Edit answer'}
                  onClick={() => toggleEdit(index)}
                  ml={2}
                  colorScheme={isEditing[index] ? 'green' : 'blue'}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  aria-label="Delete pair"
                  onClick={() => removeRow(index)}
                  colorScheme="red"
                />
              </Flex>
            </Box>
          </Grid>
        </Box>
      ))}

      <Box mt={4}>
        <Text mb={2}>Add New Question-Answer Pair</Text>
        <Grid templateColumns="1fr 1fr" gap={4}>
          <Input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter new question"
            mb={4}
          />
          <Input
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Enter new answer"
            mb={4}
          />
        </Grid>
        <Button leftIcon={<AddIcon />} onClick={addNewPair} colorScheme="blue">
          Add Pair
        </Button>
      </Box>
    </Box>
  );
};

export default MatchingQuestion;
