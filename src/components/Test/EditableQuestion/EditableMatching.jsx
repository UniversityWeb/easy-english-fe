import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  Button,
  IconButton,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const EditableMatching = React.memo(({ question, onUpdateQuestionField }) => {
  const [pairs, setPairs] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setPairs(question?.pairs || []);
  }, [question]);

  const handleAddPair = () => {
    const trimmedNewQuestion = newQuestion.trim();
    const trimmedNewAnswer = newAnswer.trim();

    if (!trimmedNewQuestion || !trimmedNewAnswer) {
      setError('Both question and answer fields are required.');
      return;
    }

    const newPair = { question: trimmedNewQuestion, answer: trimmedNewAnswer };
    const updatedPairs = [...pairs, newPair];

    setPairs(updatedPairs);
    setNewQuestion('');
    setNewAnswer('');
    setError('');

    onUpdateQuestionField('pairs', updatedPairs);
  };

  const handleRemovePair = (indexToRemove) => {
    const updatedPairs = pairs.filter((_, index) => index !== indexToRemove);
    setPairs(updatedPairs);

    onUpdateQuestionField('pairs', updatedPairs);
  };

  const handleEditPair = (index, field, newValue) => {
    const updatedPairs = pairs.map((pair, i) =>
      i === index ? { ...pair, [field]: newValue } : pair
    );
    setPairs(updatedPairs);
    onUpdateQuestionField('pairs', updatedPairs);
  };

  return (
    <Box p={5} bg="gray.50" borderRadius="lg" borderWidth="1px" my={4}>
      {pairs.map((pair, index) => (
        <Flex key={index} justify="space-between" align="center" mb={4}>
          <Box width="45%">
            <Editable
              defaultValue={pair.question}
              onSubmit={(value) => handleEditPair(index, 'question', value)}
            >
              <EditablePreview />
              <EditableInput placeholder="Enter your question" />
            </Editable>
            {!pair.question && (
              <Text color="red.500" fontSize="sm">
                This field is required
              </Text>
            )}
          </Box>

          <Text fontSize="2xl" textAlign="center">
            ⇔
          </Text>

          <Box width="45%">
            <Editable
              defaultValue={pair.answer}
              onSubmit={(value) => handleEditPair(index, 'answer', value)}
            >
              <EditablePreview />
              <EditableInput placeholder="Enter your answer" />
            </Editable>
            {!pair.answer && (
              <Text color="red.500" fontSize="sm">
                This field is required
              </Text>
            )}
          </Box>

          <IconButton
            icon={<DeleteIcon />}
            aria-label="Delete pair"
            colorScheme="red"
            ml={2}
            onClick={() => handleRemovePair(index)}
          />
        </Flex>
      ))}

      <Flex mt={4} align="center">
        <Input
          placeholder="Add new question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          width="45%"
          mr={2}
        />
        <Input
          placeholder="Add new answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          width="45%"
          ml={2}
        />
        <Button
          ml={4}
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={handleAddPair}
        >
          Add Pair
        </Button>
      </Flex>

      {/* Error message if form validation fails */}
      {error && (
        <Text color="red.500" mt={2}>
          {error}
        </Text>
      )}
    </Box>
  );
});

export default EditableMatching;