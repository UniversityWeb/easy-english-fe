import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Button,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';

const MotionImage = motion(Image);

const ImagePreview = ({ isOpen, onClose, imageUrl }) => {
  const [scale, setScale] = useState(1);
  const wheelHandlerRef = useRef(null);
  const controls = useAnimation();

  const handleZoomIn = () => {
    setScale((s) => {
      const next = Math.min(s + 0.25, 4);
      controls.start({ scale: next });
      return next;
    });
  };

  const handleZoomOut = () => {
    setScale((s) => {
      const next = Math.max(s - 0.25, 0.5);
      controls.start({ scale: next });
      return next;
    });
  };

  const handleReset = () => {
    setScale(1);
    controls.start({ scale: 1, x: 0, y: 0 });
  };

  const handleClose = () => {
    setScale(1);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      controls.set({ scale: 1, x: 0, y: 0 });
    }
  }, [isOpen, controls]);

  // Use a callback ref to handle event listener attachment for elements inside portals/modals
  const containerRef = useCallback((node) => {
    if (wheelHandlerRef.current) {
      wheelHandlerRef.current();
      wheelHandlerRef.current = null;
    }

    if (node !== null) {
      const handleWheel = (e) => {
        e.preventDefault();
        setScale((s) => {
          const next = e.deltaY < 0 ? Math.min(s + 0.15, 4) : Math.max(s - 0.15, 0.5);
          controls.start({ scale: next });
          return next;
        });
      };

      node.addEventListener('wheel', handleWheel, { passive: false });
      wheelHandlerRef.current = () => {
        node.removeEventListener('wheel', handleWheel);
      };
    }
  }, [controls]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="full" isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="0"
        boxShadow="none"
        height="100%"
        width="100%"
        backgroundColor="transparent"
      >
        <ModalCloseButton
          position="absolute"
          top={4}
          right={4}
          zIndex="10"
          color="white"
          size="lg"
          onClick={handleClose}
        />
        <ModalBody
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
          backgroundColor="rgba(0, 0, 0, 0.85)"
          position="relative"
          p={4}
        >
          <Box
            ref={containerRef}
            position="relative"
            overflow="hidden"
            flex="1"
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            cursor={scale > 1 ? "grab" : "default"}
          >
            <MotionImage
              src={imageUrl}
              alt="Image Preview"
              objectFit="contain"
              drag
              dragConstraints={{ left: -600, right: 600, top: -600, bottom: 600 }}
              dragElastic={0.1}
              animate={controls}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ maxHeight: '90%', maxWidth: '90%' }}
            />
          </Box>

          <HStack spacing="5px" mt="5px" pb={2} zIndex="10">
            <IconButton
              icon={<MinusIcon />}
              onClick={handleZoomOut}
              aria-label="Zoom Out"
              colorScheme="gray"
              variant="solid"
              size="md"
              borderRadius="full"
              isDisabled={scale <= 0.5}
            />
            <Button
              onClick={handleReset}
              colorScheme="gray"
              variant="solid"
              size="md"
              borderRadius="full"
              leftIcon={<RepeatIcon />}
            >
              Reset
            </Button>
            <IconButton
              icon={<AddIcon />}
              onClick={handleZoomIn}
              aria-label="Zoom In"
              colorScheme="gray"
              variant="solid"
              size="md"
              borderRadius="full"
              isDisabled={scale >= 4}
            />
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImagePreview;
