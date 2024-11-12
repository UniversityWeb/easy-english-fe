import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Button,
  IconButton,
} from '@chakra-ui/react';
import { FiFileText, FiVideo, FiHelpCircle } from 'react-icons/fi';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import {
  RxTriangleDown,
  RxTriangleUp,
  RxDragHandleDots2,
} from 'react-icons/rx';
import { RiDeleteBinFill } from 'react-icons/ri';
import { MdSubdirectoryArrowRight } from 'react-icons/md';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SEC_ITEM_TYPES } from '~/utils/constants';
import sectionService from '~/services/sectionService';
import lessonService from '~/services/lessonService';
import testService from '~/services/testService';
import dripService from '~/services/dripService'; // Import the dripService

// Function to get the appropriate icon based on the lesson type
const getLessonIcon = (type) => {
  switch (type) {
    case SEC_ITEM_TYPES.TEXT:
      return { icon: FiFileText, color: 'green.500' };
    case SEC_ITEM_TYPES.VIDEO:
      return { icon: FiVideo, color: 'blue.500' };
    case SEC_ITEM_TYPES.AUDIO:
      return { icon: HiOutlineSpeakerWave, color: 'purple.500' };
    case SEC_ITEM_TYPES.TEST:
      return { icon: FiHelpCircle, color: 'orange.500' };
    default:
      return { icon: FiFileText, color: 'gray.500' };
  }
};

const Drip = ({ courseId }) => {
  const [sections, setSections] = useState([]);
  const [dripContents, setDripContents] = useState([
    { id: 'drip-1', lessons: [] },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const sectionRequest = { courseId };
        const fetchedSections =
          await sectionService.fetchSectionsByCourse(sectionRequest);

        if (fetchedSections) {
          const sectionsWithLessons = await Promise.all(
            fetchedSections.map(async (section) => {
              const sectionId = section?.id;
              const lessonRequest = { sectionId };
              const [lessons, tests] = await Promise.all([
                lessonService.fetchLessons(lessonRequest),
                testService.getTestsBySection(sectionId),
              ]);
              return {
                ...section,
                lessons: [
                  ...(lessons || []),
                  ...(tests || []).map((test) => ({
                    ...test,
                    type: SEC_ITEM_TYPES.TEST,
                  })),
                ],
              };
            }),
          );
          setSections(sectionsWithLessons);
        }
      } catch (error) {
        console.log('Error fetching sections');
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [courseId]);

  const addDripContent = () => {
    setDripContents((prev) => [
      ...prev,
      { id: `drip-${prev.length + 1}`, lessons: [] },
    ]);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Handle reordering within the same drip content
    if (source.droppableId === destination.droppableId) {
      setDripContents((prevDripContents) =>
        prevDripContents.map((dripContent) => {
          if (dripContent.id === source.droppableId) {
            const reorderedLessons = Array.from(dripContent.lessons);
            const [movedLesson] = reorderedLessons.splice(source.index, 1);
            reorderedLessons.splice(destination.index, 0, movedLesson);
            return {
              ...dripContent,
              lessons: reorderedLessons,
            };
          }
          return dripContent;
        }),
      );
    }

    // Handle dragging lessons from sections into drip content
    if (source.droppableId.startsWith('section-')) {
      const sourceSection = sections.find(
        (section) => `section-${section.id}` === source.droppableId,
      );
      const draggedLesson = sourceSection?.lessons[source.index];

      if (draggedLesson) {
        setDripContents((prevDripContents) =>
          prevDripContents.map((dripContent) => {
            if (dripContent.id === destination.droppableId) {
              if (
                !dripContent.lessons.find(
                  (lesson) => lesson.id === draggedLesson.id,
                )
              ) {
                const updatedLessons = Array.from(dripContent.lessons);
                updatedLessons.splice(destination.index, 0, draggedLesson);
                return {
                  ...dripContent,
                  lessons: updatedLessons,
                };
              }
            }
            return dripContent;
          }),
        );
      }
    } else {
      // Handle dragging lessons between drip contents
      let draggedLesson = null;
      setDripContents((prevDripContents) =>
        prevDripContents.map((dripContent) => {
          if (dripContent.id === source.droppableId) {
            const updatedLessons = Array.from(dripContent.lessons);
            [draggedLesson] = updatedLessons.splice(source.index, 1);
            return {
              ...dripContent,
              lessons: updatedLessons,
            };
          }
          return dripContent;
        }),
      );

      if (draggedLesson) {
        setDripContents((prevDripContents) =>
          prevDripContents.map((dripContent) => {
            if (dripContent.id === destination.droppableId) {
              const updatedLessons = Array.from(dripContent.lessons);
              updatedLessons.splice(destination.index, 0, draggedLesson);
              return {
                ...dripContent,
                lessons: updatedLessons,
              };
            }
            return dripContent;
          }),
        );
      }
    }
  };

  const deleteLessonFromDrip = (dripId, lessonId) => {
    setDripContents((prevDripContents) =>
      prevDripContents.map((dripContent) => {
        if (dripContent.id === dripId) {
          const updatedLessons = dripContent.lessons.filter(
            (lesson) => lesson.id !== lessonId,
          );
          return {
            ...dripContent,
            lessons: updatedLessons,
          };
        }
        return dripContent;
      }),
    );
  };

  const deleteDripContent = (dripId) => {
    setDripContents((prevDripContents) =>
      prevDripContents.filter((content) => content.id !== dripId),
    );
  };

  const handleSaveDrips = async () => {
    const dripsUpdateRequest = dripContents.map((dripContent) => {
      const prevLesson = dripContent.lessons[0]; // First lesson is considered the previous one
      const nextDrips = dripContent.lessons
        .filter((lesson, index) => index !== 0) // Exclude the first lesson from 'nextDrips'
        .map((lesson) => ({
          nextId: lesson.id,
          nextType: lesson.type,
          requiredCompletion: true,
        }));

      return {
        prevId: prevLesson?.id || null,
        prevType: prevLesson?.type || null,
        nextDrips,
      };
    });

    try {
      const response = await dripService.updateDrips(
        courseId,
        dripsUpdateRequest,
      );
      if (response) {
        console.log('Drip contents updated successfully.');
      } else {
        console.error('Failed to update drip contents.');
      }
    } catch (error) {
      console.error('Error updating drip contents: ', error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <HStack spacing={5} align="start" h="full">
        {/* Sections list */}
        <Box w="30%" bg="gray.100" p={5} rounded="md">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Drip
          </Text>
          {loading ? (
            <Text>Loading sections...</Text>
          ) : (
            <Accordion allowMultiple>
              {sections.map((section) => (
                <AccordionItem key={section.id}>
                  {({ isExpanded }) => (
                    <>
                      <h2>
                        <AccordionButton _hover={{ bg: 'gray.200' }}>
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
                            {section.title}
                          </Box>
                          {isExpanded ? <RxTriangleUp /> : <RxTriangleDown />}
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <Droppable
                          droppableId={`section-${section.id}`}
                          isDropDisabled={true}
                        >
                          {(provided) => (
                            <List
                              spacing={3}
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {section.lessons.map((lesson, index) => {
                                const { icon, color } = getLessonIcon(
                                  lesson?.type,
                                );
                                return (
                                  <Draggable
                                    draggableId={`section-${section.id}-${lesson.id}`}
                                    index={index}
                                    key={lesson.id}
                                  >
                                    {(provided) => (
                                      <ListItem
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <HStack bg="transparent">
                                          <Icon
                                            as={RxDragHandleDots2}
                                            color="gray.500"
                                            marginRight="10px"
                                          />
                                          <ListIcon as={icon} color={color} />
                                          <Text>{lesson.title}</Text>
                                        </HStack>
                                      </ListItem>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </List>
                          )}
                        </Droppable>
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Box>

        {/* Drip contents */}
        <Box w="70%" textAlign="center" maxHeight="80vh" overflow="auto">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Drip Contents
          </Text>

          {dripContents.map((dripContent, index) => (
            <Box key={dripContent.id} mb={4} width="750px">
              <HStack mb={2} spacing={2} align="center">
                <Text fontWeight="bold">Drip Content {index + 1}</Text>
                <IconButton
                  size="sm"
                  aria-label="Delete Drip"
                  icon={<RiDeleteBinFill />}
                  color="gray.500"
                  onClick={() => deleteDripContent(dripContent.id)}
                />
              </HStack>

              <Droppable droppableId={dripContent.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    bg="gray.50"
                    border="1px dashed gray"
                    p={4}
                    rounded="md"
                    {...provided.droppableProps}
                  >
                    {dripContent.lessons.length === 0 ? (
                      <Text color="gray.500">Drag lessons here</Text>
                    ) : (
                      <List spacing={3}>
                        {dripContent.lessons.map((lesson, lessonIndex) => {
                          const { icon, color } = getLessonIcon(lesson?.type);
                          return (
                            <Draggable
                              draggableId={`drip-${dripContent.id}-${lesson.id}`}
                              index={lessonIndex}
                              key={lesson.id}
                            >
                              {(provided) => (
                                <ListItem
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <HStack
                                    p={2}
                                    mb={2}
                                    bg="white"
                                    rounded="md"
                                    align="center"
                                    justify="space-between"
                                  >
                                    <HStack spacing={2} align="center">
                                      {lessonIndex !== 0 && (
                                        <Icon
                                          as={MdSubdirectoryArrowRight}
                                          color="gray.500"
                                        />
                                      )}
                                      <ListIcon as={icon} color={color} />
                                      <Text>{lesson.title}</Text>
                                    </HStack>
                                    <IconButton
                                      size="sm"
                                      aria-label="Delete lesson"
                                      icon={<RiDeleteBinFill />}
                                      color="gray.500"
                                      onClick={() =>
                                        deleteLessonFromDrip(
                                          dripContent.id,
                                          lesson.id,
                                        )
                                      }
                                    />
                                  </HStack>
                                </ListItem>
                              )}
                            </Draggable>
                          );
                        })}
                      </List>
                    )}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}

          <Button mt={4} colorScheme="blue" onClick={addDripContent}>
            Add Drip Content
          </Button>
          <Button mt={4} colorScheme="green" onClick={handleSaveDrips}>
            Save Drip Contents
          </Button>
        </Box>
      </HStack>
    </DragDropContext>
  );
};

export default Drip;
