import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Switch,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import EditableQuestionGroup from '~/components/Test/EditableQuestionGroup';
import questionGroupService from '~/services/questionGroupService';
import useCustomToast from '~/hooks/useCustomToast';
import testPartService from '~/services/testPartService';
import CustomReactQuill from '~/components/CustomReactQuill';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
        console.error('Error fetching question groups:', error);
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

  const handleRemoveGroup = useCallback(
    async (groupId) => {
      try {
        await questionGroupService.remove(groupId);
        setQuestionGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== groupId),
        );
        successToast('Question group removed successfully!');
      } catch (error) {
        console.error('Error removing question group:', error);
        errorToast('Failed to remove question group.');
      }
    },
    [questionGroups.length],
  );

  const handleAddGroup = async () => {
    const newGroup = {
      title: 'Question 1 - 10',
      ordinalNumber: questionGroups.length + 1 || 1,
      requirement: '',
      testPartId: part?.id,
      imagePath: '',
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

  // Handle drag end event to reorder question groups
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // If there's no destination, return
    if (!destination) return;

    // If the item was dropped in the same position, return
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    )
      return;

    // Reorder the question groups in the local state
    const reorderedGroups = Array.from(questionGroups);
    const [removed] = reorderedGroups.splice(source.index, 1);
    reorderedGroups.splice(destination.index, 0, removed);

    setQuestionGroups(reorderedGroups);

    // Extract group IDs for swapping
    const groupId1 = questionGroups[source.index]?.id;
    const groupId2 = questionGroups[destination.index]?.id;

    // Call the swap API
    try {
      if (groupId1 && groupId2) {
        await questionGroupService.swapTestPart(groupId1, groupId2);
        successToast('Question groups swapped successfully!');
      }
    } catch (error) {
      console.error('Error swapping question groups:', error);
      errorToast('Failed to swap question groups.');
    }
  };

  return (
    <Box
      p={4}
      bg="white"
      mb={4}
      borderRadius="lg"
      borderWidth="1px"
      width="100%"
    >
      <Flex justify="space-between" align="center">
        <Editable
          fontWeight="bolder"
          defaultValue={`Part ${part?.ordinalNumber ?? 'Default'}`}
          onSubmit={(value) =>
            updateTestPart(part.id, { ...part, title: value })
          }
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
          <CustomReactQuill
            value={readingPassage}
            onChange={(readingPassage) => setReadingPassage(readingPassage)}
            placeholder="Enter lesson content"
          />

          <Button
            mt={10}
            colorScheme="blue"
            onClick={(e) =>
              updateTestPart(part.id, { ...part, readingPassage })
            }
          >
            Update Part
          </Button>
        </FormControl>
      )}

      {/* Drag and Drop Context for question groups */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`testPart-${part.id}`} type="group">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {questionGroups.map((group, index) => (
                <Draggable
                  key={group?.id}
                  draggableId={`group-${group.id}`}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      mb={4}
                    >
                      <EditableQuestionGroup
                        index={index}
                        group={group}
                        onRemoveGroup={handleRemoveGroup}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

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
