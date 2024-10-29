import React from "react";
import {
  Box,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import EditableQuestionGroup from '~/components/Test/EditableQuestionGroup';

const EditableTestPart = ({ part, onUpdatePart, onRemovePart, onAddQuestionGroup }) => {
  return (
    <Box p={4} bg="white" mb={4} borderRadius="lg" borderWidth="1px" width="100%">
      <Flex justify="space-between" align="center">
        <Editable defaultValue={part.title} onSubmit={(value) => onUpdatePart(part.id, { title: value })}>
          <EditablePreview />
          <EditableInput />
        </Editable>

        <IconButton
          icon={<DeleteIcon />}
          aria-label="Delete part"
          colorScheme="red"
          onClick={() => onRemovePart(part.id)}
        />
      </Flex>

      <Textarea
        placeholder="Reading Passage"
        value={part.readingPassage}
        onChange={(e) => onUpdatePart(part.id, { readingPassage: e.target.value })}
        mb={4}
      />

      {part.questionGroups.map((group) => (
        <EditableQuestionGroup
          key={group.id}
          group={group}
          onUpdateGroup={(groupId, updatedGroup) => onUpdatePart(part.id, {
            questionGroups: part.questionGroups.map(g => (g.id === groupId ? { ...g, ...updatedGroup } : g)),
          })}
          onRemoveGroup={(groupId) => onUpdatePart(part.id, {
            questionGroups: part.questionGroups.filter(g => g.id !== groupId),
          })}
          onAddQuestion={(groupId) => {
            const newQuestion = {
              id: Date.now(),
              type: "SINGLE_CHOICE",
              title: "New Question",
              description: "",
              options: [""],
              correctAnswers: [""],
              questionGroupId: groupId,
            };
            onUpdatePart(part.id, {
              questionGroups: part.questionGroups.map(g => (g.id === groupId ? { ...g, questions: [...g.questions, newQuestion] } : g)),
            });
          }}
          onRemoveQuestion={(groupId, questionId) => {
            onUpdatePart(part.id, {
              questionGroups: part.questionGroups.map(g => (
                g.id === groupId
                  ? { ...g, questions: g.questions.filter(q => q.id !== questionId) }
                  : g
              )),
            });
          }}
        />
      ))}

      <Flex justify="flex-end" mb={4}>
        <Button colorScheme="green" onClick={() => onUpdatePart(part.id, { questionGroups: [...part.questionGroups, { id: Date.now(), title: "New Group", questions: [] }] })} leftIcon={<AddIcon />}>
          Add Question Group
        </Button>
      </Flex>
    </Box>
  );
};

export default EditableTestPart;