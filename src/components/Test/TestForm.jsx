import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack } from '@chakra-ui/react';
import testPartService from '~/services/testPartService';
import useCustomToast from '~/hooks/useCustomToast';

const TestForm = ({ sectionId, ordinalNumber, testId, onTestCreated }) => {
  const { successToast, errorToast } = useCustomToast();

  const [formData, setFormData] = useState({
    title: 'Test Form',
    description: 'Make your description here',
    durationInMilis: 2700000, // Default duration (e.g., 45 minutes in milliseconds)
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(new Date().getTime() + 2700000).toISOString().slice(0, 16), // Default end time
    status: "DISPLAY",
    createdAt: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTest = {
        ...formData,
        id: testId || 0,
        sectionId,
        ordinalNumber,
      };

      await testPartService.create(newTest);
      successToast("Test created successfully!");
      onTestCreated(); // Refresh the list after creating a new test
      setFormData({
        title: '',
        description: '',
        durationInMilis: 2700000,
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date(new Date().getTime() + 2700000).toISOString().slice(0, 16),
        status: "DISPLAY",
        createdAt: new Date().toISOString(),
      }); // Reset form
    } catch (error) {
      console.error("Error creating test:", error);
      errorToast("Failed to create test.");
    }
  };

  return (
    <Box p={4} bg="gray.100" borderRadius="md">
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
            <FormLabel>Duration (in milliseconds)</FormLabel>
            <Input
              type="number"
              name="durationInMilis"
              value={formData.durationInMilis}
              onChange={handleChange}
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
          <Button colorScheme="blue" type="submit">
            Create Test
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TestForm;
