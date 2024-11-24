import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  IconButton,
  Flex,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaFileAudio, FaTrash, FaUpload, FaRedo } from 'react-icons/fa';
import { MdFileUpload } from 'react-icons/md';
import useCustomToast from '~/hooks/useCustomToast';
import testService from '~/services/testService';

const TestAudioUpload = ({ testState, setTestState }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(testState?.audioPath || null); // Initialize with testState.audioPath if available
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const { successToast, errorToast } = useCustomToast();

  // Update audio URL either from uploaded file or testState.audioPath
  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
    } else if (testState?.audioPath) {
      setAudioUrl(testState.audioPath); // Use audioPath from testState on initial load
    }
  }, [audioFile, testState?.audioPath]);

  // Play/pause the audio
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle the audio file upload
  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const audioPath = await testService.uploadAudio(testState.id, file);
      setAudioFile(file);
      setTestState({ ...testState, audioPath }); // Update testState with the new audioPath
      successToast('Audio uploaded successfully!');
    } catch (error) {
      console.error('Error uploading audio:', error);
      errorToast('Failed to upload audio');
    }
  };

  // Handle the audio file deletion
  const handleDeleteAudio = async () => {
    try {
      await testService.deleteAudio(testState.id);
      setAudioFile(null); // Clear the file state
      setAudioUrl(null); // Clear the audio URL
      setTestState({ ...testState, audioPath: null }); // Update testState to reflect deletion
      successToast('Audio deleted successfully!');
    } catch (error) {
      console.error('Error deleting audio:', error);
      errorToast('Failed to delete audio');
    }
  };

  // Update the current time of the audio when it is playing
  const updateCurrentTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle time slider changes
  const handleSliderChange = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  // Handle volume slider changes
  const handleVolumeChange = (value) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  return (
    <Box
      mt={4}
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
    >
      <Text fontSize="lg" mb={4}>
        Upload & Play Audio
      </Text>

      {/* File Select or Drop Section */}
      <Box
        border="2px dashed"
        borderColor="gray.300"
        borderRadius="md"
        p={6}
        mb={4}
        textAlign="center"
        _hover={{ borderColor: 'blue.300' }}
      >
        {audioFile && audioUrl ? (
          <VStack spacing={3}>
            <FaFileAudio size={48} color="blue.500" />
            <Text fontSize="md" fontWeight="600">
              {audioFile ? audioFile.name : 'Audio loaded'}
            </Text>
            {audioFile && (
              <Text fontSize="sm" color="gray.500">
                {`${(audioFile.size / 1024 / 1024).toFixed(2)} MB • ${audioFile.type}`}
              </Text>
            )}
            <HStack>
              <Button
                size="sm"
                fontSize="sm"
                colorScheme="blue"
                as="label"
                htmlFor="audio-upload"
                leftIcon={audioUrl ? <FaRedo /> : <FaUpload />}
              >
                {audioUrl ? 'Change Audio' : 'Upload New Audio'}
              </Button>
              <Button
                size="sm"
                fontSize="sm"
                colorScheme="red"
                onClick={handleDeleteAudio}
                leftIcon={<FaTrash />}
              >
                Delete Audio
              </Button>
            </HStack>
            <Input
              type="file"
              accept="audio/mpeg, audio/wav"
              id="audio-upload"
              display="none"
              onChange={handleAudioUpload}
            />
          </VStack>
        ) : (
          <VStack spacing={4}>
            <MdFileUpload size={64} color="gray.500" />
            <Text fontSize="sm" color="gray.600">
              Drag & drop an audio file here, or click to select a file
            </Text>
            <Button fontSize="sm" size="sm" colorScheme="blue" as="label" htmlFor="audio-upload">
              Select File
            </Button>
            <Input
              type="file"
              accept="audio/mpeg, audio/wav"
              id="audio-upload"
              display="none"
              onChange={handleAudioUpload}
            />
          </VStack>
        )}
      </Box>

      {/* Audio Player Section */}
      {audioUrl && audioFile && (
        <Box bg="gray.50" p={4} borderRadius="md" boxShadow="md">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={updateCurrentTime}
            onLoadedMetadata={() => setAudioDuration(audioRef.current.duration)}
            onEnded={() => setIsPlaying(false)}
            controls
            hidden
          />

          {/* Audio Player Controls */}
          <Flex direction={{ base: 'column', md: 'row' }} align="center" mt={4}>
            <IconButton
              onClick={handlePlayPause}
              icon={isPlaying ? <FaPause /> : <FaPlay />}
              colorScheme="blue"
              aria-label="Play/Pause"
              mr={{ base: 0, md: 2 }}
              mb={{ base: 2, md: 0 }}
            />

            {/* Time and Duration Display */}
            <HStack spacing={2} flex="1" align="center" justify="space-between">
              <Text fontSize="sm">{formatTime(currentTime)}</Text>
              <Slider
                aria-label="time-slider"
                value={currentTime}
                min={0}
                max={audioDuration}
                onChange={handleSliderChange}
                flex="1"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Text fontSize="sm">{formatTime(audioDuration)}</Text>
            </HStack>

            {/* Volume Control */}
            <Text fontSize="sm" ml={{ base: 0, md: 4 }}>
              Volume
            </Text>
            <Slider
              aria-label="volume-slider"
              value={volume}
              min={0}
              max={1}
              step={0.01}
              onChange={handleVolumeChange}
              width="100px"
              ml={{ base: 0, md: 4 }}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

// Helper function to format time in hh:mm:ss
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export default TestAudioUpload;
