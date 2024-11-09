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
  Select,
  Spacer,
  Image,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import {
  FaPause,
  FaPlay,
  FaListUl,
  FaExpand,
  FaPenFancy
} from 'react-icons/fa';
import { MdVolumeUp } from 'react-icons/md';
import { CiPaperplane } from 'react-icons/ci';
import { AiOutlineFileSearch } from 'react-icons/ai';
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled
} from 'react-icons/tb';
import TakeTestQuestionReview from '~/components/Test/TakeTestQuestionReview';

function TakeTestHeader() {
  const audioRef = useRef(new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showRemainingTime, setShowRemainingTime] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure(); // Quản lý trạng thái modal Review

  useEffect(() => {
    audioRef.current.volume = volume;

    const updateCurrentTime = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    audioRef.current.addEventListener('timeupdate', updateCurrentTime);

    return () => {
      audioRef.current.removeEventListener('timeupdate', updateCurrentTime);
    };
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
    audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
  };

  const handlePrev = () => {
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
  };

  const handleVolumeChange = (value) => {
    setVolume(value / 100);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleTimeDisplay = () => {
    setShowRemainingTime(!showRemainingTime);
  };


  return (
    <ChakraProvider>
      <Box w="100%" p={4} bg="white" boxShadow="md">
        {/* Top Section */}
        <SimpleGrid columns={3} spacing={4} alignItems="center">
          {/* Left: Logo */}
          <Image src="https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-2.jpg" alt="Logo" boxSize="50px" />
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            35 minutes remaining
          </Text>

          {/* Right: Action Buttons */}
          <Box textAlign="right">
            <IconButton aria-label="Review" icon={<FaPenFancy />} backgroundColor="transparent" />
            <IconButton aria-label="Toggle List" icon={<FaListUl />} backgroundColor="transparent" />
            <IconButton aria-label="Expand" icon={<FaExpand />} backgroundColor="transparent" />
            <Button variant="outline" leftIcon={<AiOutlineFileSearch />} backgroundColor="transparent" border="none" onClick={onOpen}>Review</Button>
            <Button colorScheme="teal" rightIcon={<CiPaperplane style={{ fontSize: '24px' }} />} >Submit</Button>
          </Box>
        </SimpleGrid>

        {/* Bottom Section */}
        <HStack mt={6} spacing={4} alignItems="center">
          {/* Control buttons */}
          <IconButton aria-label="Rewind" icon={<TbPlayerTrackPrevFilled />} onClick={handlePrev} />
          <IconButton aria-label={isPlaying ? "Pause" : "Play"} icon={isPlaying ? <FaPause /> : <FaPlay />} onClick={togglePlayPause} />
          <IconButton aria-label="Forward" icon={<TbPlayerTrackNextFilled />} onClick={handleNext} />

          {/* Time Display */}
          <Text onClick={toggleTimeDisplay} cursor="pointer">
            {showRemainingTime
              ? `-${formatTime(audioRef.current.duration - currentTime)}`
              : formatTime(currentTime)}
          </Text>

          <Slider aria-label="time-slider" value={currentTime} max={audioRef.current.duration || 0} onChange={(value) => {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
          }} flex="1">
            <SliderTrack bg="gray.200">
              <SliderFilledTrack bg="teal.400" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>

          {/* Volume Control */}
          <MdVolumeUp />
          <Slider aria-label="volume-slider" defaultValue={volume * 100} onChange={handleVolumeChange} maxW="100px">
            <SliderTrack bg="gray.200">
              <SliderFilledTrack bg="teal.400" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </HStack>
      </Box>

      {/* Modal hiển thị nội dung Review */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <TakeTestQuestionReview />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}

export default TakeTestHeader;