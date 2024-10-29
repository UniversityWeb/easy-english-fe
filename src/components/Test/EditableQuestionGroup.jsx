import React, { useState } from "react";
import {
  Box,
  Flex,
  Select,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Button,
  Collapse,
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons';
import EditableQuestionItem from "~/components/Test/EditableQuestion/EditableQuestionItem";

const EditableQuestionGroup = ({ group, onRemoveGroup, onAddQuestion, onRemoveQuestion, onUpdateQuestionType }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Box p={4} bg="gray.50" mb={4} borderRadius="lg" borderWidth="1px">
      <Flex justify="space-between" mb={4} align="center">
        <Editable defaultValue={group.title}>
          <EditablePreview />
          <EditableInput />
        </Editable>

        <IconButton
          icon={<DeleteIcon />}
          aria-label="Delete question group"
          colorScheme="red"
          onClick={() => onRemoveGroup(group.id)}
        />
      </Flex>

      <Flex justify="flex-end" mb={4}>
        <IconButton
          aria-label="Toggle Questions"
          onClick={() => setIsExpanded((prev) => !prev)}
          icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        />
      </Flex>

      <Collapse in={isExpanded} animateOpacity>
        {group.questions.map((question) => (
          <Box key={question.id} p={4} bg="gray.100" mb={4} borderRadius="lg" borderWidth="1px">
            <Flex justify="space-between" mb={4} align="center">
              <Editable defaultValue={question.title}>
                <EditablePreview />
                <EditableInput />
              </Editable>

              <Flex align="center">
                <Select
                  w="200px"
                  mr={2}
                  value={question.type}
                  onChange={(e) => onUpdateQuestionType(group.id, question.id, e.target.value)}
                >
                  <option value="SINGLE_CHOICE">Single Choice</option>
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="TRUE_FALSE">True/False</option>
                  <option value="MATCHING">Matching</option>
                </Select>

                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete question"
                  colorScheme="red"
                  onClick={() => onRemoveQuestion(group.id, question.id)}
                />
              </Flex>
            </Flex>

            <EditableQuestionItem question={question} />
          </Box>
        ))}

        <Flex justify="flex-end" mb={4}>
          <Button
            colorScheme="green"
            onClick={() => onAddQuestion(group.id)}
            leftIcon={<AddIcon />}
          >
            Add Question
          </Button>
        </Flex>
      </Collapse>
    </Box>
  );
};

export default EditableQuestionGroup;
