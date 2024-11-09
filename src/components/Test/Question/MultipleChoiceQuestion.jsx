import React, { useEffect, useState } from 'react';
import { Box, Flex, CheckboxGroup, Checkbox, Button, Input, IconButton, Text, Textarea } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const MultipleChoiceQuestion = ({ question, onUpdateQuestionField }) => {
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    setOptions(question?.options || []);
    setCorrectAnswers(question?.correctAnswers || []);
  }, [question]);

  const addOption = () => {
    const trimmedNewOption = newOption?.trim();
    if (options.includes(trimmedNewOption)) {
      setError("This option already exists.");
      return;
    }

    if (trimmedNewOption) {
      const updatedOptions = [...options, trimmedNewOption];
      setOptions(updatedOptions);
      setNewOption("");
      onUpdateQuestionField('options', updatedOptions);
      setError("");
    }
  };

  const removeOption = (indexToRemove) => {
    const updatedOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(updatedOptions);
    onUpdateQuestionField('options', updatedOptions);
  };

  const handleOptionChange = (index, newValue) => {
    const updatedOptions = options.map((opt, i) => (i === index ? newValue : opt));
    setOptions(updatedOptions);
    onUpdateQuestionField('options', updatedOptions);
  };

  const handleCorrectAnswerChange = (value) => {
    const updatedCorrectAnswers = correctAnswers.includes(value)
      ? correctAnswers.filter((answer) => answer !== value)
      : [...correctAnswers, value];
    setCorrectAnswers(updatedCorrectAnswers);
    onUpdateQuestionField('correctAnswers', updatedCorrectAnswers);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <Box p={5} bg="gray.50" borderRadius="lg" borderWidth="1px" my={4}>
      <Flex direction="column" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Multiple Choice Question
        </Text>
        {image && <Image src={image} alt="Question Image" />}
        <Button onClick={handleImageUpload} colorScheme="blue" mb={3}>
          Upload Image
        </Button>
      </Flex>

      <Box mb={4}>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          Question Text
        </Text>
        <Textarea
          value={question?.text || ''}
          onChange={(e) => onUpdateQuestionField('text', e.target.value)}
          placeholder="Enter your question"
        />
      </Box>

      <Box mb={4}>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          Options
        </Text>
        <CheckboxGroup value={correctAnswers} onChange={handleCorrectAnswerChange}>
          {options.map((option, index) => (
            <Flex key={index} mb={2} align="center">
              <Checkbox value={option}>{option}</Checkbox>
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Delete option"
                size="sm"
                ml={2}
                onClick={() => removeOption(index)}
                colorScheme="red"
              />
            </Flex>
          ))}
        </CheckboxGroup>
      </Box>

      <Flex direction="column" align="center" mb={4}>
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Enter new option"
          mb={2}
        />
        {error && <Text color="red.500">{error}</Text>}
        <Button leftIcon={<AddIcon />} onClick={addOption} colorScheme="blue">
          Add Option
        </Button>
      </Flex>
    </Box>
  );
};

export default MultipleChoiceQuestion;
