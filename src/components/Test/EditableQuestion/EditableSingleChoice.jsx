import React, { useState } from "react";
import {
  Box,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  RadioGroup,
  Radio,
  Button,
  Input,
  IconButton,
  Image,
  ChakraProvider
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const EditableSingleChoice = ({ question, onUpdate }) => {
  const [options, setOptions] = useState(question?.options);
  const [correctAnswers, setCorrectAnswers] = useState(question?.correctAnswers);

  const addAnswer = () => {
    if (options.trim()) {
      setOptions([...options, options]);
      setOptions("");
    }
  };

  // Remove answer
  const removeAnswer = (indexToRemove) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  // Image upload state
  const [image, setImage] = useState(null);

  // Handle image selection
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
        <Editable defaultValue="Type your question here">
          <EditablePreview />
          <EditableInput />
        </Editable>
      </Flex>

      {/* Display uploaded image */}
      {image && (
        <Box mb={4}>
          <Image src={image} alt="Uploaded question image" maxW="200px" borderRadius="md" />
        </Box>
      )}

      {/* Answer options */}
      <RadioGroup>
        {options.map((answer, index) => (
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
              <Editable defaultValue={answer}>
                <EditablePreview />
                <EditableInput />
              </Editable>
            </Flex>
            <Box flexShrink={0} mr={2}>
              <Radio value={answer}>Correct</Radio>
            </Box>
            <IconButton
              icon={<DeleteIcon />}
              aria-label="Delete answer"
              colorScheme="red"
              onClick={() => removeAnswer(index)}
            />
          </Flex>
        ))}
      </RadioGroup>

      {/* Add new answer */}
      <Flex mt={4} align="center">
        <Input
          placeholder="Add new answer"
          value={options}
          onChange={(e) => setOptions(e.target.value)}
        />
        <Button ml={2} colorScheme="blue" leftIcon={<AddIcon />} onClick={addAnswer}>
          Add
        </Button>
      </Flex>
    </Box>
  );
};

export default EditableSingleChoice;