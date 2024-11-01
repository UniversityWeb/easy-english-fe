import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  CheckboxGroup,
  Checkbox,
  Button,
  Input,
  IconButton,
  Image,
  Text, Textarea,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const EditableMultipleChoice = React.memo(({ question, onUpdateQuestionField }) => {
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    setOptions(question?.options || []);
    setCorrectAnswers(question?.correctAnswers || []);
  }, [question]);

  const addOption = async () => {
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

  const removeOption = async (indexToRemove) => {
    const updatedOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(updatedOptions);

    onUpdateQuestionField('options', updatedOptions);
  };

  const handleOptionEdit = async (index, newValue) => {
    const updatedOptions = options.map((opt, i) => (i === index ? newValue : opt));
    setOptions(updatedOptions);

    onUpdateQuestionField('options', updatedOptions);
  };

  // Handle selecting the correct answers
  const handleCorrectAnswerChange = (value) => {
    const updatedCorrectAnswers = correctAnswers.includes(value)
      ? correctAnswers.filter((answer) => answer !== value)
      : [...correctAnswers, value];

    setCorrectAnswers(updatedCorrectAnswers);
    onUpdateQuestionField('correctAnswers', updatedCorrectAnswers);
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <Box p={5} bg="gray.50" borderRadius="lg" borderWidth="1px" my={4}>
      {/* Image icon and upload functionality */}
      <Flex align="center" mb={4}>
        <IconButton
          icon={<Image />}
          aria-label="Upload question image"
          mr={2}
          onClick={() => document.getElementById("image-upload").click()}
        />
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
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

      {/* Display uploaded image */}
      {image && (
        <Box mb={4}>
          <Image src={image} alt="Uploaded question image" maxW="200px" borderRadius="md" />
        </Box>
      )}

      {/* Options section */}
      <CheckboxGroup value={correctAnswers} onChange={setCorrectAnswers}>
        {options.map((option, index) => (
          <Flex
            key={index}
            justify="space-between"
            align="center"
            bg="white"
            p={4}
            borderRadius="md"
            borderWidth="1px"
            mb={2}
          >
            <Flex align="center" flexGrow={1}>
              <Editable defaultValue={option} onSubmit={(value) => handleOptionEdit(index, value)}>
                <EditablePreview />
                <EditableInput />
              </Editable>
            </Flex>
            <Checkbox value={option} onChange={() => handleCorrectAnswerChange(option)}>
              Correct
            </Checkbox>
            <IconButton
              icon={<DeleteIcon />}
              ms={2}
              size="sm"
              aria-label="Delete option"
              colorScheme="red"
              onClick={() => removeOption(index)}
            />
          </Flex>
        ))}
      </CheckboxGroup>

      {/* Add new option */}
      <Flex mt={4} align="center">
        <Input
          placeholder="Add new option"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
        />
        <Button ml={2} colorScheme="blue" leftIcon={<AddIcon />} onClick={addOption}>
          Add
        </Button>
      </Flex>

      {/* Error message if duplicate option is added */}
      {error && <Text color="red.500" mt={2}>{error}</Text>}
    </Box>
  );
});

export default EditableMultipleChoice;
