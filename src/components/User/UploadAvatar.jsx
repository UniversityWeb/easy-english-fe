import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Box, Text, Spinner } from '@chakra-ui/react';
import userService from '~/services/userService'; // Adjust the import according to your service
import useCustomToast from '~/hooks/useCustomToast';

const UploadAvatar = ({ registerRequest, setRegisterRequest }) => {
  const [loading, setLoading] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const { successToast, errorToast } = useCustomToast();

  const handleConfirmUpload = useCallback(async () => {
    if (newFile) {
      setLoading(true); // Start loading animation
      try {
        // Upload the avatar file and get the new file path or URL
        const uploadedPath = await userService.uploadAvatar(newFile); // Ensure this method exists in your userService

        // Update registerRequest with the new avatar path
        setRegisterRequest(prevState => ({
          ...prevState,
          avatar: uploadedPath, // Adjust if needed
        }));

        setNewFile(null); // Clear the new file
        successToast('Avatar uploaded successfully.');
      } catch (error) {
        console.error('Failed to upload avatar:', error.message);
        errorToast('An error occurred while uploading the avatar.');
      } finally {
        setLoading(false); // Stop loading animation
      }
    }
  }, [newFile, setRegisterRequest]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) { // Check for image MIME type
      setNewFile(file);
      handleConfirmUpload(); // Directly upload the new avatar
    } else {
      alert('Please upload a valid image file.');
    }
  }, [handleConfirmUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*', // Accept image files only
  });

  return (
    <Box p={8} shadow="md" borderWidth="1px" width="100%" minH="200px" borderRadius="md">
      {/* Avatar upload area */}
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? 'blue.500' : 'gray.300'}
        p={4}
        mt={4}
        textAlign="center"
        borderRadius="md"
        bg={isDragActive ? 'blue.50' : 'white'}
        boxShadow="md"
        transition="background-color 0.2s"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text color="blue.500">Drop your avatar image here...</Text>
        ) : (
          <Text color="gray.600">Drag 'n' drop an image file here, or click to select one</Text>
        )}
      </Box>

      {loading && (
        <Box mt={4} textAlign="center">
          <Spinner size="lg" color="blue.500" />
          <Text mt={2}>Uploading...</Text>
        </Box>
      )}
    </Box>
  );
};

export default UploadAvatar;
