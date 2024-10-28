import React, { useState } from "react";
import {
  Box,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  Checkbox,
  Button,
  Input,
  IconButton,
  ChakraProvider
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const MultipleChoice = ({ answers: initialAnswers }) => {
  const [answers, setAnswers] = useState(initialAnswers);

  // Add new answer
  const [newAnswer, setNewAnswer] = useState("");

  const addAnswer = () => {
    if (newAnswer.trim()) {
      setAnswers([...answers, newAnswer]);
      setNewAnswer("");
    }
  };

  // Remove answer
  const removeAnswer = (indexToRemove) => {
    setAnswers(answers.filter((_, index) => index !== indexToRemove));
  };

  return (
    <ChakraProvider>
      <Box p={5} bg="gray.50" borderRadius="lg" borderWidth="1px" my={4}>
        {answers.map((answer, index) => (
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
              <Checkbox defaultIsChecked>Correct</Checkbox>
            </Box>
            <IconButton
              icon={<DeleteIcon />}
              aria-label="Delete answer"
              colorScheme="red"
              onClick={() => removeAnswer(index)}
            />
          </Flex>
        ))}
        <Flex mt={4} align="center">
          <Input
            placeholder="Add new answer"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
          />
          <Button ml={2} colorScheme="blue" leftIcon={<AddIcon />} onClick={addAnswer}>
            Add
          </Button>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default MultipleChoice;
