import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Button,
  FormLabel, FormControl, Switch,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import EditableQuestionGroup from '~/components/Test/EditableQuestionGroup';
import questionGroupService from '~/services/questionGroupService';
import ReactQuill from 'react-quill';
import useCustomToast from '~/hooks/useCustomToast';
import testPartService from '~/services/testPartService';

const EditableTestPart = React.memo(({ part, onRemovePart }) => {
  const [questionGroups, setQuestionGroups] = useState([]);
  const [showReadingPassage, setShowReadingPassage] = useState(false);
  const [readingPassage, setReadingPassage] = useState('');
  const { successToast, errorToast } = useCustomToast();

  useEffect(() => {
    const fetchQuestionGroups = async () => {
      if (!part) return;

      setReadingPassage(part?.readingPassage);
      setShowReadingPassage(part?.readingPassage || false);
      try {
        const groups = await questionGroupService.getByTestPart(part.id);
        setQuestionGroups(groups);
      } catch (error) {
        console.error("Error fetching question groups:", error);
      }
    };

    fetchQuestionGroups();
  }, [part]);

  const updateTestPart = async (id, updatedPart) => {
    if (!id || !updatedPart) return;

    try {
      await testPartService.update(id, updatedPart);
      successToast('Test part updated successfully!');
    } catch (error) {
      console.error('Error updating test part:', error);
      errorToast('Failed to update test part.');
    }
  };

  const handleRemoveGroup = useCallback(async (groupId) => {
    try {
      await questionGroupService.remove(groupId);
      setQuestionGroups((prevGroups) => prevGroups.filter(group => group.id !== groupId));
      successToast('Question group removed successfully!');
    } catch (error) {
      console.error('Error removing question group:', error);
      errorToast('Failed to remove question group.');
    }
  }, [questionGroups.length]);

  const handleAddGroup = async () => {
    const newGroup = {
      title: 'Question 1 - 10',
      ordinalNumber: questionGroups.length + 1,
      from: 1,
      to: 10,
      requirement: 'Do me',
      testPartId: part?.id,
      audioPath: '',
      imagePath: '',
      contentToDisplay: '',
      originalContent: '',
    };

    try {
      const createdGroup = await questionGroupService.create(newGroup);
      setQuestionGroups((prevGroups) => [...prevGroups, createdGroup]);
      successToast('Question group added successfully!');
    } catch (error) {
      console.error('Error adding question group:', error);
      errorToast('Failed to add question group.');
    }
  };

  return (
    <Box p={4} bg="white" mb={4} borderRadius="lg" borderWidth="1px" width="100%">
      <Flex justify="space-between" align="center">
        <Editable
          fontWeight="bolder"
          defaultValue={part?.title || "Default"}
          onSubmit={(value) => updateTestPart(part.id, { ...part, title: value })}
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

      {/* Switch to toggle visibility */}
      <FormControl display="flex" alignItems="center" mb={4}>
        <FormLabel htmlFor="toggleReadingPassage" mb="0">
          Show Reading Passage
        </FormLabel>
        <Switch
          id="toggleReadingPassage"
          isChecked={showReadingPassage}
          onChange={() => setShowReadingPassage(!showReadingPassage)}
        />
      </FormControl>

      {showReadingPassage && (
        <FormControl mb={10}>
          <FormLabel>Reading Passage</FormLabel>
          <Box
            sx={{
              ".quill": {
                height: "270px",
                display: "flex",
                flexDirection: "column",
              },
              ".ql-container": {
                height: "310px",
                marginBottom: "20px",
              },
            }}
          >
            <ReactQuill
              value={readingPassage}
              onChange={(readingPassage) => setReadingPassage(readingPassage)}
              theme="snow"
              placeholder="Enter lesson content"
              style={{ height: "380px", marginBottom: "20px" }}
            />
          </Box>

          <Button
            colorScheme="blue"
            onClick={(e) => updateTestPart(part.id, { ...part, readingPassage })}
          >
            Update Part
          </Button>
        </FormControl>
      )}

      {questionGroups.map((group) => (
        <EditableQuestionGroup
          key={group?.id}
          group={group}
          onRemoveGroup={handleRemoveGroup}
        />
      ))}

      <Flex justify="flex-end" mb={4}>
        <Button
          colorScheme="green"
          onClick={handleAddGroup}
          leftIcon={<AddIcon />}
        >
          Add Question Group
        </Button>
      </Flex>
    </Box>
  );
});

export default EditableTestPart;
