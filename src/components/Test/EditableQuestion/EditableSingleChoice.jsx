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
  Text
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const EditableSingleChoice = ({ question, onUpdate }) => {
  const [options, setOptions] = useState(question?.options || []);
  const [newOption, setNewOption] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

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

      // Update the question with the new options array
      await onUpdate(question?.id, { options: updatedOptions });
      setError("");
    }
  };

  const removeOption = async (indexToRemove) => {
    const updatedOptions = options.filter((_, index) => index !== indexToRemove);
    setOptions(updatedOptions);

    // Update question with the new options array
    await onUpdate(question?.id, { options: updatedOptions });
  };

  const handleOptionEdit = async (index, newValue) => {
    const updatedOptions = options.map((opt, i) => (i === index ? newValue : opt));
    setOptions(updatedOptions);

    // Update question with the new options array
    await onUpdate(question?.id, { options: updatedOptions });
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
        <Editable defaultValue={question.title}>
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
              <Editable defaultValue={answer} onSubmit={(value) => handleOptionEdit(index, value)}>
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
              onClick={() => removeOption(index)}
            />
          </Flex>
        ))}
      </RadioGroup>

      {/* Add new answer */}
      <Flex mt={4} align="center">
        <Input
          placeholder="Add new answer"
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
};

export default EditableSingleChoice;
