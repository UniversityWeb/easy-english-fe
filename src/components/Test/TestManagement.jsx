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
  Collapse, Heading,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import SingleChoice from "~/components/Test/Question/SingleChoice";
import MultipleChoice from "~/components/Test/Question/MultipleChoice";
import TrueFalse from "~/components/Test/Question/TrueFalse";
import Mapping from "~/components/Test/Question/Mapping";

function TestManagement({ id, sectionId, isNew, onLessonSaved }) {
  const [testParts, setTestParts] = useState([
    {
      id: 1,
      title: "Part 1",
      questionGroups: [
        {
          id: 1,
          title: "Group 1",
          questions: [
            { id: 1, type: "single", text: "What does CPU stand for?" },
          ],
        },
      ],
      isExpanded: true,
    },
  ]);

  const addPart = () => {
    const newSection = {
      id: testParts.length + 1,
      title: `testPart ${testParts.length + 1}`,
      questionGroups: [],
      isExpanded: true,
    };
    setTestParts([...testParts, newSection]);
  };

  const removePart = (testPartId) => {
    setTestParts(testParts.filter((testPart) => testPart.id !== testPartId));
  };

  const togglePartExpand = (testPartId) => {
    setTestParts(
      testParts.map((testPart) =>
        testPart.id === testPartId
          ? { ...testPart, isExpanded: !testPart.isExpanded }
          : testPart
      )
    );
  };

  const addQuestionGroup = (testPartId) => {
    const newGroup = {
      id: Date.now(),
      title: `Group ${Date.now()}`,
      questions: [],
    };
    setTestParts(
      testParts.map((testPart) =>
        testPart.id === testPartId
          ? { ...testPart, questionGroups: [...testPart.questionGroups, newGroup] }
          : testPart
      )
    );
  };

  const removeQuestionGroup = (testPartId, groupId) => {
    setTestParts(
      testParts.map((testPart) =>
        testPart.id === testPartId
          ? {
            ...testPart,
            questionGroups: testPart.questionGroups.filter(
              (group) => group.id !== groupId
            ),
          }
          : testPart
      )
    );
  };

  const addQuestion = (testPartId, groupId) => {
    const newQuestion = {
      id: Date.now(),
      type: "single",
      text: "New question",
    };
    setTestParts(
      testParts.map((testPart) =>
        testPart.id === testPartId
          ? {
            ...testPart,
            questionGroups: testPart.questionGroups.map((group) =>
              group.id === groupId
                ? { ...group, questions: [...group.questions, newQuestion] }
                : group
            ),
          }
          : testPart
      )
    );
  };

  const removeQuestion = (testPartId, groupId, questionId) => {
    setTestParts(
      testParts.map((testPart) =>
        testPart.id === testPartId
          ? {
            ...testPart,
            questionGroups: testPart.questionGroups.map((group) =>
              group.id === groupId
                ? {
                  ...group,
                  questions: group.questions.filter(
                    (question) => question.id !== questionId
                  ),
                }
                : group
            ),
          }
          : testPart
      )
    );
  };

  // New function to update the question type
  const updateQuestionType = (testPartId, groupId, questionId, newType) => {
    setTestParts(
      testParts.map((testPart) =>
        testPart.id === testPartId
          ? {
            ...testPart,
            questionGroups: testPart.questionGroups.map((group) =>
              group.id === groupId
                ? {
                  ...group,
                  questions: group.questions.map((question) =>
                    question.id === questionId
                      ? { ...question, type: newType }
                      : question
                  ),
                }
                : group
            ),
          }
          : testPart
      )
    );
  };

  const renderQuestionComponent = (question) => {
    switch (question.type) {
      case "single":
        return (
          <SingleChoice
            key={question.id}
            answers={[
              "Computer Processing Unit",
              "Central Peripheral Unit",
              "Central Processing Unit",
              "Computer Processing User",
            ]}
          />
        );
      case "multiple":
        return (
          <MultipleChoice
            key={question.id}
            answers={[
              "Computer Processing Unit",
              "Central Peripheral Unit",
              "Central Processing Unit",
              "Computer Processing User",
            ]}
          />
        );
      case "true-false":
        return <TrueFalse key={question.id} />;
      case "matching":
        return (
          <Mapping
            key={question.id}
            data={[
              { question: "Bill", answer: "Gates" },
              { question: "Steve", answer: "Jobs" },
              { question: "Elon", answer: "Musk" },
              { question: "Mark", answer: "Zuckerberg" },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box p={8} bg="gray.100" minH="100vh">
      <Heading mb={20}>{isNew ? ('Add new test') : ('Update test')}</Heading>

      {testParts.map((part) => (
        <Box key={part.id} p={4} bg="white" mb={4} borderRadius="lg" borderWidth="1px">
          <Flex justify="space-between" align="center">
            <Editable defaultValue={part.title}>
              <EditablePreview />
              <EditableInput />
            </Editable>

            <Flex align="center">
              <IconButton
                icon={part.isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                aria-label={part.isExpanded ? "Collapse part" : "Expand part"}
                onClick={() => togglePartExpand(part.id)}
                mr={2}
              />

              <IconButton
                icon={<DeleteIcon />}
                aria-label="Delete part"
                colorScheme="red"
                onClick={() => removePart(part.id)}
              />
            </Flex>
          </Flex>

          <Collapse in={part.isExpanded} animateOpacity>

            {part.questionGroups.map((group) => (
              <Box key={group.id} p={4} bg="gray.50" mb={4} borderRadius="lg" borderWidth="1px">
                <Flex justify="space-between" mb={4} align="center">
                  <Editable defaultValue={group.title}>
                    <EditablePreview />
                    <EditableInput />
                  </Editable>

                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete question group"
                    colorScheme="red"
                    onClick={() => removeQuestionGroup(part.id, group.id)}
                  />
                </Flex>

                {group.questions.map((question) => (
                  <Box key={question.id} p={4} bg="gray.100" mb={4} borderRadius="lg" borderWidth="1px">
                    <Flex justify="space-between" mb={4} align="center">
                      <Editable defaultValue={question.text}>
                        <EditablePreview />
                        <EditableInput />
                      </Editable>

                      <Flex align="center">
                        <Select
                          w="200px"
                          mr={2}
                          value={question.type}
                          onChange={(e) =>
                            updateQuestionType(part.id, group.id, question.id, e.target.value)
                          }
                        >
                          <option value="single">Single choice</option>
                          <option value="multiple">Multiple choice</option>
                          <option value="true-false">True-False</option>
                          <option value="matching">Matching</option>
                        </Select>

                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete question"
                          colorScheme="red"
                          onClick={() => removeQuestion(part.id, group.id, question.id)}
                        />
                      </Flex>
                    </Flex>

                    {renderQuestionComponent(question)}
                  </Box>
                ))}

                <Flex justify="flex-end" mb={4}>
                  <Button
                    colorScheme="green"
                    onClick={() => addQuestion(part.id, group.id)}
                    leftIcon={<AddIcon />}
                  >
                    Add Question
                  </Button>
                </Flex>
              </Box>
            ))}

            <Flex justify="flex-end" mb={4}>
              <Button
                colorScheme="green"
                onClick={() => addQuestionGroup(part.id)}
                leftIcon={<AddIcon />}
              >
                Add Question Group
              </Button>
            </Flex>
          </Collapse>
        </Box>
      ))}

      <Flex justify="space-between" mb={4} align="center">
        <Button colorScheme="blue" onClick={addPart} leftIcon={<AddIcon />}>
          Add New Part
        </Button>
      </Flex>
    </Box>
  );
}

export default TestManagement;
