import React, { useState } from "react";
import { Box, VStack, Text, Button, useToast, Stack } from '@chakra-ui/react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import courseService from '~/services/courseService';
import useCustomToast from '~/hooks/useCustomToast';

const Notice = ({ courseId }) => {
  const [content, setContent] = useState(""); // State to store the notice content
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state
  const {successToast, errorToast} = useCustomToast();
  const toast = useToast();

  // Function to handle the submission of the notice
  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Notice is empty.",
        description: "Please enter some content before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true); // Set loading state to true
    try {
      await courseService.updateCourseNotice(courseId, content); // Call the API method
      successToast("Notice Updated successfully");
      setContent(""); // Clear the editor after successful submission
    } catch (error) {
      console.error("Error updating notice:", error);
      errorToast(error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <VStack spacing={4} w="100%" maxW="800px" mx="auto" mt={6}>
      <Box w="100%">
        <Stack spacing={2}>
          <Text fontSize="sm" fontWeight="bold" color="gray.600">
            Notice
          </Text>

          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            placeholder="Enter your notice here..."
            style={{
              height: "200px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          />
        </Stack>

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Submitting"
        >
          Submit Notice
        </Button>
      </Box>
    </VStack>
  );
};

export default Notice;