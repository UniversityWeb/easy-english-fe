import React, { useEffect, useRef, useState } from 'react';
import {
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
  useDisclosure,
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
} from 'react-icons/fa';
import { MdVolumeUp } from 'react-icons/md';
import { CiPaperplane } from 'react-icons/ci';
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from 'react-icons/tb';
import testResultService from '~/services/testResultService';
import {
  generateSubmitTestRequest,
  saveTest,
  getTest, getCourseId, clearSavedTest,
} from '~/utils/testUtils';
import useCustomToast from '~/hooks/useCustomToast';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

const CountdownTimer = ({ testId, resetKey, onFinished }) => {
  const navigate = useNavigate();
  const [timeLimit, setTimeLimit] = useState(2100); // Default time in seconds (35 minutes)

  useEffect(() => {
    // Load `startedAt` and `durationInMilis` from localStorage when testId changes
    const savedTest = getTest(testId);

    if (savedTest && savedTest.startedAt && savedTest.durationInMilis) {
      const startedAt = new Date(savedTest.startedAt).getTime();
      const durationInMilis = savedTest.durationInMilis;

      // Calculate the remaining time in seconds
      const currentTime = Date.now();
      const endTime = startedAt + durationInMilis;
      const remainingTime = Math.max(
        Math.floor((endTime - currentTime) / 1000),
        0,
      );

      setTimeLimit(remainingTime);
    }
  }, [testId, resetKey]);

  useEffect(() => {
    if (timeLimit <= 0) {
      if (onFinished) onFinished(); // Trigger onFinished callback when time runs out
      const courseId = getCourseId(testId);
      clearSavedTest(testId);
      navigate(config.routes.learn(courseId));
      setTimeLimit(60);
      return;
    }

    // Set up the countdown timer that updates every second
    const timer = setInterval(() => {
      setTimeLimit((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, [timeLimit, onFinished]);

  // Format the time as hh:mm:ss
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const formattedHours =
      hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <Text fontSize="lg" fontWeight="bold" textAlign="center">
      {formatTime(timeLimit)} remaining
    </Text>
  );
};

function TakeTestHeader({ audioPath, resetCountDown, testId }) {
  const audioRef = useRef(audioPath ? new Audio(audioPath) : null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showRemainingTime, setShowRemainingTime] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { successToast, errorToast } = useCustomToast();
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const cancelRef = useRef();
  const [resetTimeCountDown, setResetTimeCountDown] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setResetTimeCountDown((prev) => prev + 1);
  }, [resetCountDown]);

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
        audioRef.current.currentTime + 5,
      );
    }
  };

  const handlePrev = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        audioRef.current.currentTime - 5,
      );
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

  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Box w="100%" p={4} bg="white" boxShadow="md" ref={containerRef}>
      <SimpleGrid columns={3} spacing={4} alignItems="center">
        <Image
          src="https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-2.jpg"
          alt="Logo"
          boxSize="50px"
        />
        <CountdownTimer
          testId={testId}
          resetKey={resetTimeCountDown}
          onFinished={handleSubmit}
        />
        <Box textAlign="right">
          <Button variant="outline" onClick={onOpen} me={5}>
            Review
          </Button>
          <Button
            colorScheme="teal"
            rightIcon={<CiPaperplane />}
            onClick={() => setIsSubmitConfirmOpen(true)}
          >
            Submit
          </Button>
        </Box>
      </SimpleGrid>

      {audioPath && (
        <HStack mt={6} spacing={4} alignItems="center">
          <IconButton
            aria-label="Rewind"
            icon={<TbPlayerTrackPrevFilled />}
            onClick={handlePrev}
          />
          <IconButton
            aria-label={isPlaying ? 'Pause' : 'Play'}
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            onClick={togglePlayPause}
          />
          <IconButton
            aria-label="Forward"
            icon={<TbPlayerTrackNextFilled />}
            onClick={handleNext}
          />
          <Text onClick={toggleTimeDisplay} cursor="pointer">
            {showRemainingTime
              ? `-${formatTime(audioRef.current.duration - currentTime)}`
              : formatTime(currentTime)}
          </Text>
          <MdVolumeUp />
          <Slider
            aria-label="volume-slider"
            defaultValue={volume * 100}
            onChange={handleVolumeChange}
            maxW="100px"
          >
            <SliderTrack bg="gray.200">
              <SliderFilledTrack bg="teal.400" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </HStack>
      )}

      <Text>
        test
      </Text>

      <AlertDialog
        isOpen={isSubmitConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsSubmitConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Submission</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to submit the test?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsSubmitConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleSubmit} ml={3}>
                Submit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default TakeTestHeader;
