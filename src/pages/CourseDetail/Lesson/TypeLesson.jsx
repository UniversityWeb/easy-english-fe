// TypeLesson.jsx
import React from "react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Box, Text, Icon, Button } from "@chakra-ui/react";
import { FaFileAlt, FaVideo, FaBroadcastTower, FaVideoSlash, FaQuestionCircle, FaClipboard } from "react-icons/fa";

const TypeLesson = ({ isOpen, onClose, onSelect }) => {
    const lessonTypes = [
        { icon: FaFileAlt, label: "Text lesson" },
        { icon: FaVideo, label: "Video lesson" },
        { icon: FaBroadcastTower, label: "Stream lesson" },
        { icon: FaVideoSlash, label: "Zoom lesson" },
    ];

    const examTypes = [
        { icon: FaQuestionCircle, label: "Quiz" },
        { icon: FaClipboard, label: "Assignment" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Select lesson type</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text mb={4}>Select material type to continue</Text>

                    <Text fontSize="lg" fontWeight="bold" mb={2}>Learning Content</Text>
                    <SimpleGrid columns={[2, 2]} spacing={4}>
                        {lessonTypes.map((type, index) => (
                            <Box
                                key={index}
                                textAlign="center"
                                p={4}
                                borderWidth={1}
                                borderRadius="md"
                                borderColor="blue.500"
                                cursor="pointer"
                                _hover={{ bg: "blue.50" }}
                                onClick={() => onSelect(type.label)} // Pass the label to the parent component
                            >
                                <Icon as={type.icon} boxSize={8} color="blue.500" />
                                <Text mt={2} fontWeight="medium">{type.label}</Text>
                            </Box>
                        ))}
                    </SimpleGrid>

                    <Text fontSize="lg" fontWeight="bold" mt={6} mb={2}>Exam Students</Text>
                    <SimpleGrid columns={[2, 2]} spacing={4}>
                        {examTypes.map((type, index) => (
                            <Box
                                key={index}
                                textAlign="center"
                                p={4}
                                borderWidth={1}
                                borderRadius="md"
                                borderColor="blue.500"
                                cursor="pointer"
                                _hover={{ bg: "blue.50" }}
                                onClick={() => onSelect(type.label)} // Pass the label to the parent component
                            >
                                <Icon as={type.icon} boxSize={8} color="blue.500" />
                                <Text mt={2} fontWeight="medium">{type.label}</Text>
                            </Box>
                        ))}
                    </SimpleGrid>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TypeLesson;