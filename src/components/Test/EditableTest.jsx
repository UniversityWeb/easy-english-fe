import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Heading, VStack } from '@chakra-ui/react';
import EditableTestPart from './EditableTestPart';
import TestForm from './TestForm';
import testPartService from '~/services/testPartService';
import useCustomToast from '~/hooks/useCustomToast';
import testService from '~/services/testService';
import { TEST_TYPES } from '~/utils/constants';
import EditableQuestionsOfQuiz from '~/components/Test/EditableQuestionsOfQuiz';
import TestAudioUpload from '~/components/Test/TestAudioUpload';

const EditableTest = ({ sectionId, ordinalNumber, testId, isNew, onTestSaved }) => {
  const [testState, setTestState] = useState({
    title: 'Test Form',
    description: 'Make your description here',
    durationInMilis: 2700000, // Default duration (e.g., 45 minutes in milliseconds)
    passingGrade: 0.0,
    authPath: '',
    type: 'CUSTOM',
    status: 'DISPLAY',
    createdAt: new Date().toISOString(),
    sectionId: sectionId,
  });
  const [testParts, setTestParts] = useState([]);
  const { successToast, errorToast } = useCustomToast();

  useEffect(() => {
    console.log(`EditableTest - useEffect - testId: ${testId}`);

    if (!isNew && testId) {
      fetchTestById();
      fetchTestParts();
    } else {
      setTestState({
        title: '',
        description: '',
        durationInMilis: 2700000,
        passingGrade: 0.0,
        status: "DISPLAY",
        createdAt: new Date().toISOString(),
      }); // Reset form
    }
  }, [testId, isNew]);

  const fetchTestById = async () => {
    if (!testId) return;
    try {
      const data = await testService.getById(testId);
      if (data) {
        setTestState({
          id: data.id || 0,
          title: data.title || '',
          description: data.description || '',
          durationInMilis: data.durationInMilis || 0,
          startDate: data.startDate || new Date().toISOString().slice(0, 16),
          endDate: data.endDate || new Date(new Date().getTime() + 2700000).toISOString().slice(0, 16),
          type: data.type || 'CUSTOM',
          status: data.status || 'DISPLAY',
          createdAt: data.createdAt || new Date().toISOString().slice(0, 16),
          sectionId: data.sectionId || 0,
        });
        successToast('Test data fetched successfully');
      }
    } catch (error) {
      console.error(error?.message);
      errorToast('Error fetching test data');
    }
  }

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

  const removeTestPart = useCallback(async (id) => {
    try {
      await testPartService.remove(id);
      setTestParts((prevParts) => prevParts.filter((part) => part.id !== id));
      successToast('Test part removed successfully!');
    } catch (error) {
      console.error('Error removing test part:', error);
      errorToast('Failed to remove test part.');
    }
  }, []);

  const addTestPart = async () => {
    const newPart = {
      title: 'New Test Part',
      readingPassage: '',
      ordinalNumber: testParts.length + 1 || 1,
      testId: testId,
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
        testState={testState}
        setTestState={setTestState}
        isNew={isNew}
        onTestSaved={onTestSaved}
      />

      {!isNew && testState?.type === TEST_TYPES.CUSTOM && (
        <TestAudioUpload testState={testState} setTestState={setTestState} />
      )}

      {!isNew && (
        <>
          {/* QUIZ test */}
          {testState?.type === TEST_TYPES.QUIZ ? (
            <EditableQuestionsOfQuiz
              test={testState}
            />
          ) : (
            <>
              {/* CUSTOM test */}
              <Heading size="lg" mt={10}>Test parts</Heading>
              <VStack spacing={4} mt={4}>
                {testParts.map((part) => (
                  <EditableTestPart
                    key={part.id}
                    part={part}
                    onRemovePart={removeTestPart}
                  />
                ))}
                <Button colorScheme="blue" onClick={addTestPart} mb={10}>
                  Add Test Part
                </Button>
              </VStack>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default EditableTest;
