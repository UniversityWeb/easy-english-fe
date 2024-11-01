import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  Button,
  IconButton,
  Image,
  Text,
  RadioGroup,
  Radio, Textarea,
} from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";

const EditableTrueFalse = React.memo(({ question, onUpdateQuestionField }) => {
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    setCorrectAnswer(question?.correctAnswers[0] || "");
  }, [question]);

  // Handle selecting the correct answer
  const handleCorrectAnswerChange = (value) => {
    setCorrectAnswer(value);
    onUpdateQuestionField('correctAnswers', [value]);
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
