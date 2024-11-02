import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Heading,
  Input,
  Tabs,
  Tab,
  TabList,
  Text,
  VStack,
  Accordion,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import {
  FaFileAlt,
  FaVideo,
  FaBroadcastTower,
  FaVideoSlash,
} from 'react-icons/fa';
import Section from '~/pages/Teacher/CourseDetail/Curriculum/Section/Section';
import TextLesson from './Lesson/TextLesson';
import sectionService from '~/services/sectionService';
import useCustomToast from '~/hooks/useCustomToast';

const Curriculum = ({ courseId }) => {
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLessonType, setSelectedLessonType] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const { successToast, errorToast } = useCustomToast();

  const fetchSections = async () => {
    const sectionRequest = {
      courseId,
    };
    try {
      const data = await sectionService.fetchSectionsByCourse(sectionRequest);
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      errorToast('Failed to fetch sections');
    }
  };

  useEffect(() => {
    fetchSections();
  }, [courseId]);

  const handleAddNewSection = async () => {
    if (newSectionName.trim() === '') return;

    const sectionRequest = {
      courseId,
      title: newSectionName,
      status: 'DISPLAY',
      lessons: [],
    };

    try {
      await sectionService.createSection(sectionRequest);
      await fetchSections();
      setNewSectionName('');
      setIsAddingSection(false);
      successToast('Section added successfully!');
    } catch (error) {
      console.error('Error adding section:', error);
      errorToast('Failed to add section');
    }
  };

  const handleLessonTypeSelect = (type) => {
    setSelectedLessonType(type);
    setIsAddingLesson(true);
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  const handleLessonClick = (lessonId, sectionId) => {
    setSelectedLesson(lessonId);
    setSelectedSectionId(sectionId);
    setIsAddingLesson(false);
  };

  const handleAddLessonClick = (sectionId) => {
    setIsAddingLesson(true);
    setSelectedLesson(null);
    setSelectedLessonType(null);
    setSelectedSectionId(sectionId);
    setIsModalOpen(true);
  };

  const renderLessonTypeModal = () => {
    const lessonTypes = [
      { icon: FaFileAlt, label: 'Text lesson' },
      { icon: FaVideo, label: 'Video lesson' },
      { icon: FaBroadcastTower, label: 'Stream lesson' },
      { icon: FaVideoSlash, label: 'Zoom lesson' },
    ];

    return (
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select lesson type</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Select material type to continue</Text>
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
                  _hover={{ bg: 'blue.50' }}
                  onClick={() => handleLessonTypeSelect(type.label)}
                >
                  <Icon as={type.icon} boxSize={8} color="blue.500" />
                  <Text mt={2} fontWeight="medium">
                    {type.label}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <ChakraProvider>
      <Box bg="#f4f7fc" minH="100vh">
        <Flex p="8">
          <Box flex="2" mr="8">
            <Heading size="lg" mb="4">
              Curriculum
            </Heading>

            <Accordion allowMultiple allowToggle>
              {sections.map((section) => (
                <Section
                  key={section.id}
                  section={section}
                  fetchSections={fetchSections}
                  openTypeLessonModal={(sectionId) =>
                    handleAddLessonClick(sectionId)
                  }
                  onLessonClick={handleLessonClick}
                />
              ))}
            </Accordion>

            {isAddingSection ? (
              <VStack mt="8" spacing="4" align="start">
                <Input
                  placeholder="Enter section name"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                />
                <Button colorScheme="blue" onClick={handleAddNewSection}>
                  Add
                </Button>
              </VStack>
            ) : (
              <Button
                leftIcon={<MdAdd />}
                colorScheme="blue"
                variant="outline"
                mt="8"
                width="100%"
                onClick={() => setIsAddingSection(true)}
              >
                New section
              </Button>
            )}
          </Box>

          <Box
            flex="5"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {selectedLesson && !isAddingLesson ? (
              <TextLesson
                lessonId={selectedLesson}
                sectionId={selectedSectionId}
              />
            ) : isAddingLesson && selectedLessonType === 'Text lesson' ? (
              <TextLesson sectionId={selectedSectionId} />
            ) : isAddingLesson ? (
              <VStack>
                <Heading size="md">Create a new lesson here!</Heading>
                <Text textAlign="center" color="gray.500" maxW="md">
                  Get started by adding details to your new lesson.
                </Text>
              </VStack>
            ) : (
              <VStack>
                <Heading size="md">Let's build your course!</Heading>
                <Text textAlign="center" color="gray.500" maxW="md">
                  Get started by creating the lessons from scratch in the column
                  on the left or import your educational content.
                </Text>
              </VStack>
            )}
          </Box>
        </Flex>
        {renderLessonTypeModal()}
      </Box>
    </ChakraProvider>
  );
};

export default Curriculum;
