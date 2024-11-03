import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import testService from '~/services/testService';
import { Button, Box, Text, Spinner } from '@chakra-ui/react';
import useCustomToast from '~/hooks/useCustomToast';

const TestAudioUpload = ({ testState, setTestState }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newFile, setNewFile] = useState(null);
  const {successToast} = useCustomToast();

  const handleConfirmUpload = useCallback(async () => {
    if (newFile) {
      setLoading(true); // Start loading animation
      try {
        // Upload the audio file and get the new file path or URL
        const uploadedPath = await testService.uploadAudio(testState?.id, newFile);

        // Update testState with the new audio path
        setTestState(prevState => ({
          ...prevState,
          audioPath: uploadedPath
        }));

        setShowDialog(false); // Close the dialog
        setNewFile(null); // Clear the new file
        successToast('Audio file uploaded successfully.');
      } catch (error) {
        console.error('Failed to upload audio file:', error.message);
        alert('An error occurred while uploading the audio file.');
      } finally {
        setLoading(false); // Stop loading animation
      }
    }
  }, [newFile, testState?.id]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'audio/mpeg') { // Check for MP3 MIME type
      if (testState.audioPath) {
        setShowDialog(true); // Show confirmation dialog if there’s already an audio file
        setNewFile(file);
      } else {
        // Directly upload if no existing audio
        setNewFile(file);
        handleConfirmUpload();
      }
    } else {
      alert('Please upload a valid MP3 audio file.');
    }
  }, [testState.audioPath, handleConfirmUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'audio/mpeg' // Only accept MP3 files
  });

  return (
    <Box p={8} paddingBottom={0} shadow="md" borderWidth="1px" width="100%" minH="300px">
      {/* Audio file upload area */}
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
          <Text color="blue.500">Drop the audio file here...</Text>
        ) : (
          <Text color="gray.600">
            Drag 'n' drop an audio file here, or click to select one
          </Text>
        )}
      </Box>

      {/* Display the currently uploaded audio file */}
      {testState.audioPath && (
        <Box mt={2} p={3} borderWidth="1px" borderRadius="md" borderColor="blue.200" bg="blue.50" w="100%">
          <Text fontWeight="bold">Selected file:</Text>
          <Text>{testState.audioPath}</Text>
          <audio controls style={{ width: '100%', marginTop: '10px' }}>
            <source src={testState.audioPath} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </Box>
      )}

      {showDialog && (
        <Box mt={4} p={4} border="1px solid" borderColor="gray.300" borderRadius="md" bg="gray.50">
          <Text fontWeight="bold">Are you sure you want to replace the existing audio file?</Text>
          <Button colorScheme="red" onClick={handleConfirmUpload} mt={2} mr={2} isDisabled={loading}>
            Yes
          </Button>
          <Button onClick={() => setShowDialog(false)} mt={2} isDisabled={loading}>
            No
          </Button>
        </Box>
      )}

      {loading && (
        <Box mt={4} mb={10} textAlign="center">
          <Spinner size="lg" color="blue.500" />
          <Text mt={2}>Uploading...</Text>
        </Box>
      )}
    </Box>
  );
};

export default TestAudioUpload;
