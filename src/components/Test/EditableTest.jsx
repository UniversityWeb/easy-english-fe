import React, { useEffect, useState } from 'react';
import { Box, Button, VStack } from '@chakra-ui/react';
import EditableTestPart from './EditableTestPart';
import TestForm from './TestForm';
import testPartService from '~/services/testPartService';
import useCustomToast from '~/hooks/useCustomToast';

const EditableTest = ({ sectionId, ordinalNumber, testId, isNew, onTestSaved }) => {
  const [testParts, setTestParts] = useState([]);
  const { successToast, errorToast } = useCustomToast();

  useEffect(() => {
    console.log(`EditableTest - useEffect - testId: ${testId}`);
    const fetchTestParts = async () => {
      if (!testId) return;

      try {
        const parts = await testPartService.getTestPartsByTestId(testId);
        setTestParts(parts);
      } catch (error) {
        console.error('Error fetching test parts:', error);
        errorToast('Failed to fetch test parts.');
      }
    };

    fetchTestParts();
  }, [testId, isNew]);

  const updateTestPart = async (id, updatedPart) => {
    try {
      await testPartService.update(id, updatedPart);
      setTestParts((prevParts) =>
        prevParts.map((part) =>
          part.id === id ? { ...part, ...updatedPart } : part,
        ),
      );
      successToast('Test part updated successfully!');
    } catch (error) {
      console.error('Error updating test part:', error);
      errorToast('Failed to update test part.');
    }
  };

  const removeTestPart = async (id) => {
    try {
      await testPartService.remove(id);
      setTestParts((prevParts) => prevParts.filter((part) => part.id !== id));
      successToast('Test part removed successfully!');
    } catch (error) {
      console.error('Error removing test part:', error);
      errorToast('Failed to remove test part.');
    }
  };

  const addTestPart = async () => {
    const newPart = {
      title: 'New Test Part',
      readingPassage: '',
      ordinalNumber: testParts.length + 1,
      testId: testId,
      questionGroups: [],
    };

    try {
      const createdPart = await testPartService.create(newPart);
      setTestParts((prevParts) => [...prevParts, createdPart]);
      successToast('Test part added successfully!');
    } catch (error) {
      console.error('Error adding test part:', error);
      errorToast('Failed to add test part.');
    }
  };

  return (
    <Box p={4} paddingBottom={0} shadow="md" borderWidth="1px" width="100%">
      <TestForm
        sectionId={sectionId}
        ordinalNumber={ordinalNumber}
        testId={testId}
        isNew={isNew}
        onTestSaved={onTestSaved}
      />
      <VStack spacing={4} mt={4}>
        {testParts.map((part) => (
          <EditableTestPart
            key={part.id}
            part={part}
            onUpdatePart={updateTestPart}
            onRemovePart={removeTestPart}
            onAddQuestionGroup={(groupId) => {
              const newGroup = {
                id: Date.now(),
                ordinalNumber: part.questionGroups.length + 1,
                title: 'New Question Group',
                requirement: '',
                audioPath: '',
                imagePath: '',
                contentToDisplay: '',
                originalContent: '',
                questions: [],
                testPartId: part.id,
              };
              updateTestPart(part.id, {
                questionGroups: [...part.questionGroups, newGroup],
              });
            }}
          />
        ))}
        <Button colorScheme="blue" onClick={addTestPart}>
          Add Test Part
        </Button>
      </VStack>
    </Box>
  );
};

export default EditableTest;
