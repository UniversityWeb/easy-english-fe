import React, { useEffect, useState } from "react";
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
import questionGroupService from '~/services/questionGroupService';

const EditableTestPart = ({ part, onUpdatePart, onRemovePart }) => {
  const [questionGroups, setQuestionGroups] = useState([]);

  useEffect(() => {
    const fetchQuestionGroups = async () => {
      try {
        const groups = await questionGroupService.getByTestPart(part.id);
        setQuestionGroups(groups); // Store fetched question groups
      } catch (error) {
        console.error("Error fetching question groups:", error);
      }
    };

    fetchQuestionGroups();
  }, [part.id]);

  return (
    <Box p={4} bg="white" mb={4} borderRadius="lg" borderWidth="1px" width="100%">
      <Flex justify="space-between" align="center">
        <Editable
          defaultValue={part.title}
          onSubmit={(value) => onUpdatePart(part.id, { title: value })}
        >
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

      {questionGroups.map((group) => (
        <EditableQuestionGroup
          key={group.id}
          group={group}
          onUpdateGroup={(groupId, updatedGroup) => onUpdatePart(part.id, {
            questionGroups: questionGroups.map(g => (g.id === groupId ? { ...g, ...updatedGroup } : g)),
          })}
          onRemoveGroup={(groupId) => onUpdatePart(part.id, {
            questionGroups: questionGroups.filter(g => g.id !== groupId),
          })}
          // You can implement add/remove question handlers here if needed
        />
      ))}

      <Flex justify="flex-end" mb={4}>
        <Button
          colorScheme="green"
          onClick={() => {
            const newGroup = { id: Date.now(), title: "New Group", questions: [] };
            setQuestionGroups((prev) => [...prev, newGroup]); // Add new group locally
            onUpdatePart(part.id, { questionGroups: [...questionGroups, newGroup] }); // Update parent state
          }}
          leftIcon={<AddIcon />}
        >
          Add Question Group
        </Button>
      </Flex>
    </Box>
  );
};

export default EditableTestPart;
