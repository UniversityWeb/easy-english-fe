import React, { useEffect, useRef, useState } from 'react';
import {
  ChakraProvider,
  Box,
  SimpleGrid,
  IconButton,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Image,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import {
  FaPause,
  FaPlay,
  FaListUl,
  FaExpand,
  FaPenFancy,
} from 'react-icons/fa';
import { MdVolumeUp } from 'react-icons/md';
import { CiPaperplane } from 'react-icons/ci';
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from 'react-icons/tb';
import { AiOutlineFileSearch } from 'react-icons/ai';
import TakeTestQuestionReview from '~/components/Test/TakeTestQuestionReview';
import testResultService from '~/services/testResultService';
import { generateSubmitTestRequest, saveTest, getTest } from '~/utils/testUtils';
import useCustomToast from '~/hooks/useCustomToast';

function TakeTestHeader({ audioPath, testId }) {
  const audioRef = useRef(audioPath ? new Audio(audioPath) : null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showRemainingTime, setShowRemainingTime] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { successToast, errorToast } = useCustomToast();
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const cancelRef = useRef();

  // Function to save the current time to localStorage
  const saveCurrentTime = (time) => {
    const key = `audioCurrentTime/${testId}`;
    localStorage.setItem(key, time);
  };

  // Function to get the saved time from localStorage
  const getCurrentTime = () => {
    const key = `audioCurrentTime/${testId}`;
    return parseFloat(localStorage.getItem(key)) || 0;
  };

  // Load saved current time and initialize audio settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.currentTime = getCurrentTime();

      const updateCurrentTime = () => {
        setCurrentTime(audioRef.current.currentTime);
        saveCurrentTime(audioRef.current.currentTime);
      };

      audioRef.current.addEventListener('timeupdate', updateCurrentTime);

      return () => {
        audioRef.current.removeEventListener('timeupdate', updateCurrentTime);
      };
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 5
      );
    }
  };

  const handlePrev = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value / 100);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleTimeDisplay = () => {
    setShowRemainingTime(!showRemainingTime);
  };

  const handleSubmit = async () => {
    try {
      const submitRequest = generateSubmitTestRequest(testId);
      await testResultService.submit(submitRequest);
      successToast('Test submitted successfully');
    } catch (error) {
      errorToast('Error submitting test');
    }
    setIsSubmitConfirmOpen(false);
  };

  return (
    <ChakraProvider>
      <Box w="100%" p={4} bg="white" boxShadow="md">
        <SimpleGrid columns={3} spacing={4} alignItems="center">
          <Image src="https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-2.jpg" alt="Logo" boxSize="50px" />
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            35 minutes remaining
          </Text>
          <Box textAlign="right">
            <IconButton aria-label="Review" icon={<FaPenFancy />} backgroundColor="transparent" />
            <IconButton aria-label="Toggle List" icon={<FaListUl />} backgroundColor="transparent" />
            <IconButton aria-label="Expand" icon={<FaExpand />} backgroundColor="transparent" />
            <Button variant="outline" onClick={onOpen}>Review</Button>
            <Button colorScheme="teal" rightIcon={<CiPaperplane />} onClick={() => setIsSubmitConfirmOpen(true)}>
              Submit
            </Button>
          </Box>
        </SimpleGrid>

        {audioPath && (
          <HStack mt={6} spacing={4} alignItems="center">
            <IconButton aria-label="Rewind" icon={<TbPlayerTrackPrevFilled />} onClick={handlePrev} />
            <IconButton aria-label={isPlaying ? 'Pause' : 'Play'} icon={isPlaying ? <FaPause /> : <FaPlay />} onClick={togglePlayPause} />
            <IconButton aria-label="Forward" icon={<TbPlayerTrackNextFilled />} onClick={handleNext} />
            <Text onClick={toggleTimeDisplay} cursor="pointer">
              {showRemainingTime ? `-${formatTime(audioRef.current.duration - currentTime)}` : formatTime(currentTime)}
            </Text>
            <MdVolumeUp />
            <Slider aria-label="volume-slider" defaultValue={volume * 100} onChange={handleVolumeChange} maxW="100px">
              <SliderTrack bg="gray.200">
                <SliderFilledTrack bg="teal.400" />
              </SliderTrack>
              <SliderThumb boxSize={4} />
            </Slider>
          </HStack>
        )}
      </Box>

      <AlertDialog isOpen={isSubmitConfirmOpen} leastDestructiveRef={cancelRef} onClose={() => setIsSubmitConfirmOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Submission</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to submit the test?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsSubmitConfirmOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleSubmit} ml={3}>
                Submit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ChakraProvider>
  );
}

export default TakeTestHeader;
