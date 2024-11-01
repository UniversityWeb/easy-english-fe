import React, { useState, useEffect } from "react";
import { Box, Button, FormControl, FormLabel, Heading, Input, Textarea, VStack } from '@chakra-ui/react';
import useCustomToast from '~/hooks/useCustomToast';
import testService from '~/services/testService';

const TestForm = ({ sectionId, ordinalNumber, testId, onTestSaved, isNew }) => {
  const [loading, setLoading] = useState(false);
  const { successToast, errorToast } = useCustomToast();

  const [formData, setFormData] = useState({
    title: 'Test Form',
    description: 'Make your description here',
    durationInMilis: 2700000, // Default duration (e.g., 45 minutes in milliseconds)
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(new Date().getTime() + 2700000).toISOString().slice(0, 16), // Default end time
    status: "DISPLAY",
    createdAt: new Date().toISOString(),
    sectionId: sectionId,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchTestById = async () => {
      if (!testId) return;

      setLoading(true);
      try {
        const data = await testService.getById(testId);
        if (data && isMounted) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            durationInMilis: data.durationInMilis || 0,
            startDate: data.startDate || new Date().toISOString().slice(0, 16),
            endDate: data.endDate || new Date(new Date().getTime() + 2700000).toISOString().slice(0, 16),
            status: data.status || 'DISPLAY',
            createdAt: data.createdAt || new Date().toISOString().slice(0, 16),
            sectionId: data.sectionId || 0,
          });
          successToast('Test data fetched successfully');
        }
      } catch (error) {
        if (isMounted) {
          console.error(error?.message);
          errorToast('Error fetching test data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (!isNew && testId) {
      // Fetch existing test data
      fetchTestById();
    } else {
      setFormData({
        title: '',
        description: '',
        durationInMilis: 2700000,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date(new Date().getTime() + 2700000).toISOString().slice(0, 16),
        status: "DISPLAY",
        createdAt: new Date().toISOString(),
      }); // Reset form
    }

    return () => {
      isMounted = false;
    };
  }, [testId, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const newTest = {
        ...formData,
        id: testId || 0, // Use existing testId for update or set to 0 for creation
        sectionId,
        ordinalNumber,
      };

      let testResponse;
      if (testId) {
        testResponse = await testService.update(testId, newTest); // Call update method if testId exists
        successToast("Test updated successfully!");
      } else {
        testResponse = await testService.create(newTest); // Call create method if no testId
        successToast("Test created successfully!");
      }

      if (testResponse) {
        onTestSaved(testResponse);
      }
    } catch (error) {
      console.error("Error saving test:", error);
      errorToast("Failed to save test.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const minutes = String(totalMinutes % 60).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Convert HH:MM format back to milliseconds
  const convertToMilliseconds = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 60 + minutes) * 60000; // Convert to milliseconds
  };

  return (
    <Box p={4}>
      <Heading mb={10}>{isNew ? 'Add new test' : 'Update test'}</Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Duration (hours / minutes)</FormLabel>
            <Input
              type="time"
              value={formatTime(formData.durationInMilis)}
              onChange={(e) => {
                const newDurationInMilis = convertToMilliseconds(e.target.value);
                setFormData({ ...formData, durationInMilis: newDurationInMilis });
              }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>End Date</FormLabel>
            <Input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </FormControl>
          <Button colorScheme="blue" type="submit" isLoading={loading}>
            {isNew ? 'Create Test' : 'Update Test'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TestForm;
