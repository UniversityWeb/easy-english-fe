import {
  Box,
  Button,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  List,
  ListItem,
  ListIcon,
  HStack,
  Text,
  Icon,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  useDisclosure,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { FiFileText, FiVideo, FiMic, FiHelpCircle } from 'react-icons/fi';
import {
  RxTriangleDown,
  RxTriangleUp,
  RxDragHandleDots2,
} from 'react-icons/rx';
import { RiDeleteBinFill } from 'react-icons/ri';
import { PiPencilSimpleFill } from 'react-icons/pi';
import { useState, useEffect } from 'react';
import TextLesson from '~/pages/Teacher/DoiMoi/TextLesson';
import VideoLesson from '~/pages/Teacher/DoiMoi/VideoLesson';
import AudioLesson from '~/pages/Teacher/DoiMoi/AudioLesson';
import sectionService from '~/services/sectionService';
import lessonService from '~/services/lessonService';
import useCustomToast from '~/hooks/useCustomToast';
import EditableTest from '~/components/Test/EditableTest';

const getLessonIcon = (type) => {
  switch (type) {
    case 'TEXT':
      return { icon: FiFileText, color: 'green.500' };
    case 'VIDEO':
      return { icon: FiVideo, color: 'blue.500' };
    case 'AUDIO':
      return { icon: FiMic, color: 'purple.500' };
    case 'QUIZ':
      return { icon: FiHelpCircle, color: 'orange.500' };
    default:
      return { icon: FiFileText, color: 'gray.500' };
  }
};

const Curriculum = ({ courseId }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [showIcons, setShowIcons] = useState(null);
  const [isAddingNewSection, setIsAddingNewSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [selectedLessonType, setSelectedLessonType] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [hoveredLessonId, setHoveredLessonId] = useState(null);
  const { successToast, errorToast } = useCustomToast();

  // Fetch sections and lessons from the API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionRequest = { courseId };
        const fetchedSections =
          await sectionService.fetchSectionsByCourse(sectionRequest);
        if (fetchedSections) {
          const sectionsWithLessons = await Promise.all(
            fetchedSections.map(async (section) => {
              const lessonRequest = { sectionId: section.id };
              const lessons = await lessonService.fetchLessons(lessonRequest);
              return { ...section, lessons: lessons || [] };
            }),
          );
          setSections(sectionsWithLessons);
        } else {
          errorToast('Failed to fetch sections');
        }
      } catch (error) {
        errorToast('Error fetching sections');
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, [courseId, toast]);

  const handleLessonSaved = (savedLesson) => {
    console.log('save : ', savedLesson);
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === savedLesson.sectionId) {
          const updatedLessons = section.lessons.some(
            (lesson) => lesson.id === savedLesson.id,
          )
            ? section.lessons.map((lesson) =>
                lesson.id === savedLesson.id ? savedLesson : lesson,
              )
            : [...section.lessons, savedLesson];

          return { ...section, lessons: updatedLessons };
        }
        return section;
      }),
    );
  };
  const handleLessonTypeClick = (lessonType) => {
    setSelectedLessonType(lessonType);
    console.log('selectedSectionId : ', selectedSectionId);
    setSelectedLessonId(null);
    console.log('selectedSectionId : ', selectedSectionId);
    onClose();
  };

  const handleDeleteSection = async (id) => {
    try {
      // Call the delete API
      await sectionService.deleteSection({ id });
      setSections(sections.filter((section) => section.id !== id));
      successToast('Section deleted');
    } catch (error) {
      errorToast('Error deleting section');
    }
  };
  const handleUpdateSection = async (sectionId, newTitle) => {
    try {
      const updatedSection = {
        id: sectionId,
        title: newTitle,
        courseId, // Ensure you send the courseId as well
      };

      // Call the update API
      const result = await sectionService.updateSection(updatedSection);

      if (result) {
        // Update the local state with the new title
        setSections((prevSections) =>
          prevSections.map((section) =>
            section.id === sectionId
              ? { ...section, title: newTitle }
              : section,
          ),
        );
        successToast('Section updated');
      } else {
        errorToast('Failed to update section');
      }
    } catch (error) {
      errorToast('Error updating section');
    }
  };

  const handleAddNewSection = async () => {
    if (newSectionTitle.trim() !== '') {
      try {
        const newSection = {
          title: newSectionTitle,
          courseId, // Make sure courseId is passed
        };
        const createdSection = await sectionService.createSection(newSection);

        // Add the new section to the state
        setSections([...sections, { ...createdSection, lessons: [] }]);
        setNewSectionTitle('');
        setIsAddingNewSection(false);
        successToast('Section added');
      } catch (error) {
        errorToast('Error adding section');
      }
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedLessonType(lesson?.type);
    setSelectedLessonId(lesson.id);
    setSelectedSectionId(lesson.sectionId);
  };

  const renderLessonComponent = () => {
    const isNewLesson = !selectedLessonId && selectedSectionId;

    switch (selectedLessonType) {
      case 'TEXT':
        return (
          <TextLesson
            id={selectedLessonId}
            sectionId={selectedSectionId}
            isNew={isNewLesson}
            onLessonSaved={handleLessonSaved}
          />
        );
      case 'VIDEO':
        return (
          <VideoLesson
            id={selectedLessonId}
            sectionId={selectedSectionId}
            isNew={isNewLesson}
            onLessonSaved={handleLessonSaved}
          />
        );
      case 'AUDIO':
        return (
          <AudioLesson
            id={selectedLessonId}
            sectionId={selectedSectionId}
            isNew={isNewLesson}
            onLessonSaved={handleLessonSaved}
          />
        );
      case 'QUIZ':
        return (
          <EditableTest
            id={selectedLessonId}
            sectionId={selectedSectionId}
            isNew={isNewLesson}
            onLessonSaved={handleLessonSaved}
          />
        );
      default:
        return <Text fontSize="xl">Please select a lesson type.</Text>;
    }
  };

  if (loading) {
    return (
      <HStack justify="center" align="center" h="full">
        <Spinner size="xl" />
      </HStack>
    );
  }

  const handleDeleteLesson = async (lessonId) => {
    try {
      const lessonRequest = { id: lessonId };
      await lessonService.deleteLesson(lessonRequest);
      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
        })),
      );
      successToast('Lesson deleted');
    } catch (error) {
      errorToast('Error deleting lesson');
    }
  };

  return (
    <HStack spacing={5} align="start" h="full">
      <Box w="30%" bg="gray.100" p={5} rounded="md">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Curriculum
        </Text>

        <Accordion allowMultiple>
          {sections.map((section) => (
            <AccordionItem key={section.id}>
              {({ isExpanded }) => (
                <>
                  <h2>
                    <AccordionButton
                      _hover={{ bg: 'gray.200' }}
                      onMouseEnter={() => setShowIcons(section.id)}
                      onMouseLeave={() => setShowIcons(null)}
                    >
                      <Icon
                        as={RxDragHandleDots2}
                        color="gray.500"
                        marginRight="10px"
                      />

                      <Box
                        flex="1"
                        textAlign="left"
                        fontWeight="bold"
                        display="flex"
                        alignItems="center"
                      >
                        {editingSectionId === section.id ? (
                          <Input
                            value={section.title}
                            onClick={(e) => e.stopPropagation()} // Prevent accordion toggle
                            onChange={(e) =>
                              setSections((prevState) =>
                                prevState.map((s) =>
                                  s.id === section.id
                                    ? { ...s, title: e.target.value }
                                    : s,
                                ),
                              )
                            }
                            onBlur={() => {
                              handleUpdateSection(section.id, section.title);
                              setEditingSectionId(null);
                            }}
                            onKeyDown={(e) => {
                              e.stopPropagation(); // Prevent accordion toggle on keydown
                              if (e.key === 'Enter') {
                                handleUpdateSection(section.id, section.title);
                                setEditingSectionId(null);
                              }
                            }}
                            autoFocus
                            size="sm"
                            width="auto"
                          />
                        ) : (
                          section.title
                        )}

                        {showIcons === section.id && (
                          <Icon
                            as={PiPencilSimpleFill}
                            color="gray.500"
                            marginLeft="10px"
                            onClick={() => setEditingSectionId(section.id)}
                            cursor="pointer"
                          />
                        )}
                      </Box>

                      {showIcons === section.id && (
                        <Box marginRight="10px">
                          <Icon
                            as={RiDeleteBinFill}
                            color="gray.500"
                            cursor="pointer"
                            onClick={() => handleDeleteSection(section.id)}
                          />
                        </Box>
                      )}

                      {isExpanded ? <RxTriangleUp /> : <RxTriangleDown />}
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <List spacing={3}>
                      {section.lessons.map((lesson) => {
                        const { icon, color } = getLessonIcon(lesson?.type);
                        return (
                          <ListItem
                            onClick={() =>
                              handleLessonClick({
                                ...lesson,
                                sectionId: section.id,
                              })
                            }
                            key={lesson.id}
                            cursor="pointer"
                            onMouseEnter={() => setHoveredLessonId(lesson.id)}
                            onMouseLeave={() => setHoveredLessonId(null)}
                          >
                            <HStack justify="space-between">
                              <HStack>
                                <ListIcon
                                  as={RxDragHandleDots2}
                                  color="gray.500"
                                />
                                <ListIcon as={icon} color={color} />
                                <Text>{lesson.title}</Text>
                              </HStack>
                              {hoveredLessonId === lesson.id && (
                                <Icon
                                  as={RiDeleteBinFill}
                                  color="gray.500"
                                  cursor="pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteLesson(lesson.id);
                                  }}
                                />
                              )}
                            </HStack>
                          </ListItem>
                        );
                      })}
                    </List>

                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      mt={4}
                      onClick={() => {
                        onOpen();
                        setSelectedSectionId(section.id);
                      }}
                    >
                      Add a lesson
                    </Button>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          ))}
        </Accordion>

        {isAddingNewSection ? (
          <VStack mt={4} spacing={3}>
            <Input
              placeholder="Enter new section title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddNewSection();
                }
              }}
              autoFocus
            />
            <HStack>
              <Button colorScheme="blue" onClick={handleAddNewSection}>
                Add Section
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingNewSection(false);
                  setNewSectionTitle('');
                }}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        ) : (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            mt={4}
            onClick={() => setIsAddingNewSection(true)}
          >
            New Section
          </Button>
        )}
      </Box>

      <Box w="70%" textAlign="center" maxHeight="80vh" overflow="auto">
        {selectedLessonType ? (
          renderLessonComponent()
        ) : (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              Let's build your course!
            </Text>
            <Text fontSize="md" color="gray.500">
              Get started by creating the lessons from scratch in the column on
              the left or import your Educational content.
            </Text>
          </Box>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="700px" height="500px" p={5}>
          <ModalHeader fontSize="lg" fontWeight="bold">
            Select lesson type
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <Text fontWeight="bold" mb={2}>
                Learning Content
              </Text>
              <SimpleGrid columns={4} spacing={4}>
                <Button
                  variant="outline"
                  onClick={() => handleLessonTypeClick('TEXT')}
                  size="lg"
                  minW="130px"
                  minH="130px"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiFileText} w={8} h={8} color="blue.500" />
                  <Text mt={2} fontSize="sm">
                    Text lesson
                  </Text>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleLessonTypeClick('VIDEO')}
                  size="lg"
                  minW="130px"
                  minH="130px"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiVideo} w={8} h={8} color="blue.500" />
                  <Text mt={2} fontSize="sm">
                    Video lesson
                  </Text>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleLessonTypeClick('AUDIO')}
                  size="lg"
                  minW="130px"
                  minH="130px"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiMic} w={8} h={8} color="blue.500" />
                  <Text mt={2} fontSize="sm">
                    Audio lesson
                  </Text>
                </Button>
              </SimpleGrid>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Exam Students
              </Text>
              <SimpleGrid columns={4} spacing={4}>
                <Button
                  variant="outline"
                  onClick={() => handleLessonTypeClick('QUIZ')}
                  size="lg"
                  minW="130px"
                  minH="130px"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiHelpCircle} w={8} h={8} color="blue.500" />
                  <Text mt={2} fontSize="sm">
                    Quiz
                  </Text>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleLessonTypeClick('Assignment')}
                  size="lg"
                  minW="130px"
                  minH="130px"
                  borderRadius="md"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiFileText} w={8} h={8} color="blue.500" />
                  <Text mt={2} fontSize="sm">
                    Assignment
                  </Text>
                </Button>
              </SimpleGrid>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
};

export default Curriculum;