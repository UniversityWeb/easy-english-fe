import React, { useEffect, useState } from 'react';
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
import testQuestionService from '~/services/testQuestionService';
import { QUESTION_TYPES } from '~/utils/constants';
import useCustomToast from '~/hooks/useCustomToast';

const EditableQuestionGroup = ({ group, onRemoveGroup }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [questions, setQuestions] = useState([]);
  const { successToast, errorToast } = useCustomToast();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const loadedQuestions = await testQuestionService.getByQuestionGroup(group.id);
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        errorToast("Error fetching questions.");
      }
    };

    if (group?.id) {
      fetchQuestions();
    }
  }, [group]);

  const addNewQuestion = async () => {
    const newQuestion = {
      title: "New Question",
      type: "SINGLE_CHOICE",
      questionGroupId: group.id
    };

    try {
      const addedQuestion = await testQuestionService.create(newQuestion);
      setQuestions((prevQuestions) => [...prevQuestions, addedQuestion]);
      successToast("Question added successfully.");
    } catch (error) {
      console.error("Error adding question:", error);
      errorToast("Error adding question.");
    }
  };

  const onUpdateQuestion = async (id, updatedData) => {
    try {
      await testQuestionService.update(id, updatedData);
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === id ? { ...q, ...updatedData } : q))
      );
      successToast("Question updated successfully.");
    } catch (error) {
      console.error("Error updating question:", error);
      errorToast("Error updating question.");
    }
  };

  const removeQuestion = async (id) => {
    try {
      await testQuestionService.remove(id);
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
      errorToast("Question removed successfully.");
    } catch (error) {
      console.error("Error removing question:", error);
      errorToast("Error removing question.");
    }
  };

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
        {questions.map((question) => (
          <Box key={question.id} p={4} bg="gray.100" mb={4} borderRadius="lg" borderWidth="1px">
            <Flex justify="space-between" mb={4} align="center">
              <Editable
                defaultValue={question.title}
                onSubmit={(value) => onUpdateQuestion(question.id, { title: value })}
              >
                <EditablePreview />
                <EditableInput />
              </Editable>

              <Flex align="center">
                <Select
                  w="200px"
                  mr={2}
                  value={question.type}
                  onChange={(e) =>
                    onUpdateQuestion(question.id, { type: e.target.value })
                  }
                >
                  <option value={QUESTION_TYPES.SINGLE_CHOICE}>Single Choice</option>
                  <option value={QUESTION_TYPES.MULTI_CHOICE}>Multiple Choice</option>
                  <option value={QUESTION_TYPES.TRUE_FALSE}>True/False</option>
                  <option value={QUESTION_TYPES.MATCHING}>Matching</option>
                </Select>

                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete question"
                  colorScheme="red"
                  onClick={() => removeQuestion(question.id)}
                />
              </Flex>
            </Flex>

            <EditableQuestionItem
              question={question}
              onUpdateQuestion={onUpdateQuestion}
            />
          </Box>
        ))}

        <Flex justify="flex-end" mb={4}>
          <Button
            colorScheme="green"
            onClick={addNewQuestion}
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
