import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Text, IconButton, Slider, SliderTrack, SliderFilledTrack, SliderThumb, HStack, VStack } from '@chakra-ui/react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { MdVolumeUp } from 'react-icons/md';
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from 'react-icons/tb';

const TestAudioUpload = () => {
  const [audioSource, setAudioSource] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio(audioSource));

  useEffect(() => {
    if (audioSource) {
      audioRef.current.src = audioSource;
      audioRef.current.load();
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
      };
    }
  }, [audioSource]);

  useEffect(() => {
    if (audioRef.current) {
      const updateTime = () => {
        setCurrentTime(audioRef.current.currentTime);
      };

      audioRef.current.addEventListener('timeupdate', updateTime);

      return () => {
        audioRef.current.removeEventListener('timeupdate', updateTime);
      };
    }
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setAudioSource(url);
    } else {
      alert('Please upload a valid audio file.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'audio/*', // Accept any audio format
  });

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
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
    }
  };

  const handlePrev = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  const handleVolumeChange = (value) => {
    const vol = value / 100;
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <VStack spacing={4}>
      {/* Drag and Drop Area */}
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? 'blue.400' : 'gray.300'}
        p={4}
        textAlign="center"
        borderRadius="md"
        bg={isDragActive ? 'blue.50' : 'gray.50'}
        transition="background-color 0.2s"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text color="blue.500">Drop the audio file here...</Text>
        ) : (
          <Text>Drag & drop an audio file here, or click to select one</Text>
        )}
      </Box>

      {/* Audio Player Controls (only visible if audio is uploaded) */}
      {audioSource && (
        <Box mt={4} p={3} borderWidth="1px" borderRadius="md" borderColor="gray.200" bg="gray.50" width="100%">
          {/* Audio Controls */}
          <HStack mt={2} spacing={4} alignItems="center" justify="center">
            <IconButton
              size="sm"
              aria-label="Rewind"
              icon={<TbPlayerTrackPrevFilled />}
              onClick={handlePrev}
            />
            <IconButton
              size="sm"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              icon={isPlaying ? <FaPause /> : <FaPlay />}
              onClick={togglePlayPause}
            />
            <IconButton
              size="sm"
              aria-label="Forward"
              icon={<TbPlayerTrackNextFilled />}
              onClick={handleNext}
            />
          </HStack>

          {/* Time Slider and Display */}
          <HStack mt={4} alignItems="center" justify="space-between">
            <Text>{formatTime(currentTime)}</Text>
            <Slider
              aria-label="time-slider"
              value={currentTime}
              max={duration || 0}
              onChange={(value) => {
                audioRef.current.currentTime = value;
                setCurrentTime(value);
              }}
              flex="1"
              mx={4}
            >
              <SliderTrack bg="gray.200">
                <SliderFilledTrack bg="blue.400" />
              </SliderTrack>
              <SliderThumb boxSize={4} />
            </Slider>
            <Text>{formatTime(duration)}</Text>
          </HStack>

          {/* Volume Control */}
          <HStack mt={2} alignItems="center" justify="center">
            <MdVolumeUp />
            <Slider
              aria-label="volume-slider"
              value={volume * 100}
              onChange={handleVolumeChange}
              maxW="100px"
            >
              <SliderTrack bg="gray.200">
                <SliderFilledTrack bg="blue.400" />
              </SliderTrack>
              <SliderThumb boxSize={4} />
            </Slider>
          </HStack>
        </Box>
      )}
    </VStack>
  );
};

export default TestAudioUpload;