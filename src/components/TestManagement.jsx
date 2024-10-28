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
import { AddIcon, DeleteIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import SingleChoice from "~/components/Test/Question/SingleChoice";
import MultipleChoice from "~/components/Test/Question/MultipleChoice";
import TrueFalse from "~/components/Test/Question/TrueFalse";
import Mapping from "~/components/Test/Question/Mapping";

function TestManagement() {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Section 1",
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

  const addSection = () => {
    const newSection = {
      id: sections.length + 1,
      title: `Section ${sections.length + 1}`,
      questionGroups: [],
      isExpanded: true,
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const toggleSectionExpand = (sectionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const addQuestionGroup = (sectionId) => {
    const newGroup = {
      id: Date.now(),
      title: `Group ${Date.now()}`,
      questions: [],
    };
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, questionGroups: [...section.questionGroups, newGroup] }
          : section
      )
    );
  };

  const removeQuestionGroup = (sectionId, groupId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questionGroups: section.questionGroups.filter(
              (group) => group.id !== groupId
            ),
          }
          : section
      )
    );
  };

  const addQuestion = (sectionId, groupId) => {
    const newQuestion = {
      id: Date.now(),
      type: "single",
      text: "New question",
    };
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questionGroups: section.questionGroups.map((group) =>
              group.id === groupId
                ? { ...group, questions: [...group.questions, newQuestion] }
                : group
            ),
          }
          : section
      )
    );
  };

  const removeQuestion = (sectionId, groupId, questionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questionGroups: section.questionGroups.map((group) =>
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
          : section
      )
    );
  };

  // New function to update the question type
  const updateQuestionType = (sectionId, groupId, questionId, newType) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
            ...section,
            questionGroups: section.questionGroups.map((group) =>
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
          : section
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
      <Flex justify="space-between" mb={4} align="center">
        <Button colorScheme="blue" onClick={addSection} leftIcon={<AddIcon />}>
          Add Section
        </Button>
      </Flex>

      {sections.map((section) => (
        <Box key={section.id} p={4} bg="white" mb={4} borderRadius="lg" borderWidth="1px">
          <Flex justify="space-between" align="center">
            <Editable defaultValue={section.title}>
              <EditablePreview />
              <EditableInput />
            </Editable>

            <Flex align="center">
              <IconButton
                icon={section.isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                aria-label={section.isExpanded ? "Collapse section" : "Expand section"}
                onClick={() => toggleSectionExpand(section.id)}
                mr={2}
              />

              <IconButton
                icon={<DeleteIcon />}
                aria-label="Delete section"
                colorScheme="red"
                onClick={() => removeSection(section.id)}
              />
            </Flex>
          </Flex>

          <Collapse in={section.isExpanded} animateOpacity>
            <Flex justify="flex-end" mb={4}>
              <Button
                colorScheme="green"
                onClick={() => addQuestionGroup(section.id)}
                leftIcon={<AddIcon />}
              >
                Add Question Group
              </Button>
            </Flex>

            {section.questionGroups.map((group) => (
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
                    onClick={() => removeQuestionGroup(section.id, group.id)}
                  />
                </Flex>

                <Flex justify="flex-end" mb={4}>
                  <Button
                    colorScheme="green"
                    onClick={() => addQuestion(section.id, group.id)}
                    leftIcon={<AddIcon />}
                  >
                    Add Question
                  </Button>
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
                            updateQuestionType(section.id, group.id, question.id, e.target.value)
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
                          onClick={() => removeQuestion(section.id, group.id, question.id)}
                        />
                      </Flex>
                    </Flex>

                    {renderQuestionComponent(question)}
                  </Box>
                ))}
              </Box>
            ))}
          </Collapse>
        </Box>
      ))}
    </Box>
  );
}

export default TestManagement;
