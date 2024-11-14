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
  HStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Spinner,
} from '@chakra-ui/react';
import {
  FaColumns,
  FaCompress,
  FaExpand,
  FaPause,
  FaPlay,
} from 'react-icons/fa';
import {
  MdFullscreen,
  MdFullscreenExit,
  MdViewHeadline,
  MdVolumeUp,
} from 'react-icons/md';
import { CiPaperplane } from 'react-icons/ci';
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
  TbLayoutColumns,
} from 'react-icons/tb';
import testResultService from '~/services/testResultService';
import {
  generateSubmitTestRequest,
  getTest,
  getCourseId,
  clearSavedTest,
} from '~/utils/testUtils';
import useCustomToast from '~/hooks/useCustomToast';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const CountdownTimer = ({ testId, resetKey, onFinished }) => {
  const navigate = useNavigate();
  const [timeLimit, setTimeLimit] = useState(2100); // Default time in seconds (35 minutes)

  useEffect(() => {
    const savedTest = getTest(testId);
    if (savedTest && savedTest.startedAt && savedTest.durationInMilis) {
      const startedAt = new Date(savedTest.startedAt).getTime();
      const durationInMilis = savedTest.durationInMilis;
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
      if (onFinished) onFinished();
      const courseId = getCourseId(testId);
      clearSavedTest(testId);
      navigate(config.routes.learn(courseId));
      setTimeLimit(60);
      return;
    }

    const timer = setInterval(() => {
      setTimeLimit((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, onFinished]);

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

function TakeTestHeader({
  resetCountDown,
  testId,
  isSplitLayout,
  onToggleLayout,
}) {
  const [audioSource, setAudioSource] = useState('');
  const audioRef = useRef(new Audio(audioSource));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showRemainingTime, setShowRemainingTime] = useState(false);
  const { successToast, errorToast } = useCustomToast();
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const cancelRef = useRef();
  const [resetTimeCountDown, setResetTimeCountDown] = useState(0);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const audioPath = getTest(testId)?.audioPath;
    setAudioSource(audioPath);
  }, [testId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioSource;
      audioRef.current.load();
    }
  }, [audioSource]);

  useEffect(() => {
    setResetTimeCountDown((prev) => prev + 1);
  }, [resetCountDown]);

  const saveCurrentTime = (time) => {
    const key = `audioCurrentTime/${testId}`;
    localStorage.setItem(key, time);
  };

  const getCurrentTime = () => {
    const key = `audioCurrentTime/${testId}`;
    return parseFloat(localStorage.getItem(key)) || 0;
  };

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
    const answers = getTest(testId)?.userAnswers;
    if (!Array.isArray(answers) || answers.length === 0) {
      errorToast("You have not answered any questions");
      return;
    }

    setLoading(true);
    try {
      const submitRequest = generateSubmitTestRequest(testId);
      const testResultResponse = await testResultService.submit(submitRequest);
      successToast('Test submitted successfully');
      const courseId = getCourseId(testId);
      clearSavedTest(testId);
      if (testResultResponse?.id) {
        navigate(config.routes.test_result(testResultResponse?.id), {
          state: { returnUrl: config.routes.learn(courseId) }
        });
      } else {
        handleBackClick();
      }
    } catch (error) {
      errorToast('Error submitting test');
    } finally {
      setLoading(false);
    }
    setIsSubmitConfirmOpen(false);
  };

  const handleBackClick = () => {
    const courseId = getCourseId(testId);
    navigate(config.routes.learn(courseId));
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullScreen(true);
        })
        .catch((err) => {
          console.error('Error attempting to enable full-screen mode:', err);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullScreen(false);
        })
        .catch((err) => {
          console.error('Error attempting to exit full-screen mode:', err);
        });
    }
  };

  return (
    <Box w="100%" p={4} bg="white" boxShadow="md" ref={containerRef}>
      <SimpleGrid columns={3} spacing={4} alignItems="center">
        <IconButton
          aria-label="Back"
          icon={<AiOutlineArrowLeft />}
          onClick={handleBackClick} // Handle the click action
          boxSize="50px"
        />

        <CountdownTimer
          testId={testId}
          resetKey={resetTimeCountDown}
          onFinished={handleSubmit}
        />

        <HStack justifyContent="flex-end" p={4}>
          {/* Fullscreen Button */}
          <IconButton
            aria-label={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            icon={isFullScreen ? <MdFullscreenExit /> : <MdFullscreen />}
            colorScheme="teal"
            variant="outline"
            onClick={toggleFullScreen}
          />

          <IconButton
            aria-label={
              isSplitLayout
                ? 'Switch to Reading Mode'
                : 'Switch to Split Layout'
            }
            icon={isSplitLayout ? <MdViewHeadline /> : <TbLayoutColumns />}
            colorScheme="teal"
            variant="outline"
            onClick={onToggleLayout}
          />
          <Button
            colorScheme="teal"
            rightIcon={<CiPaperplane />}
            onClick={() => setIsSubmitConfirmOpen(true)}
          >
            Submit
          </Button>
        </HStack>
      </SimpleGrid>

      {audioSource && audioSource !== '' && (
        <HStack mt={6} spacing={4} alignItems="center">
          {/* Control buttons */}
          <IconButton
            size={'sm'}
            aria-label="Rewind"
            icon={<TbPlayerTrackPrevFilled />}
            onClick={handlePrev}
          />
          <IconButton
            size={'sm'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            onClick={togglePlayPause}
          />
          <IconButton
            size={'sm'}
            aria-label="Forward"
            icon={<TbPlayerTrackNextFilled />}
            onClick={handleNext}
          />

          {/* Time Display */}
          <Text onClick={toggleTimeDisplay} cursor="pointer">
            {showRemainingTime
              ? `-${formatTime(audioRef.current.duration - currentTime)}`
              : formatTime(currentTime)}
          </Text>

          <Slider
            aria-label="time-slider"
            value={currentTime}
            max={audioRef.current.duration || 0}
            onChange={(value) => {
              audioRef.current.currentTime = value;
              setCurrentTime(value);
            }}
            flex="1"
          >
            <SliderTrack bg="gray.200">
              <SliderFilledTrack bg="teal.400" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>

          {/* Volume Control */}
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
              <Button
                colorScheme="red"
                onClick={handleSubmit}
                ml={3}
                disabled={loading}
                rightIcon={loading ? null : <CiPaperplane />}
              >
                {loading ? <Spinner size="sm" /> : 'Submit'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default TakeTestHeader;
