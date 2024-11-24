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
  Spinner,
  useToast,
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
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import sectionService from '~/services/sectionService';
import lessonService from '~/services/lessonService';
import dripService from '~/services/dripService';
import testService from '~/services/testService';

const getLessonIcon = (type) => {
  switch (type) {
    case 'TEXT':
      return { icon: FiFileText, color: 'green.500' };
    case 'VIDEO':
      return { icon: FiVideo, color: 'blue.500' };
    case 'AUDIO':
      return { icon: HiOutlineSpeakerWave, color: 'purple.500' };
    case 'QUIZ':
      return { icon: FiHelpCircle, color: 'orange.500' };
    case 'CUSTOM':
      return { icon: FiHelpCircle, color: 'orange.500' };
    default:
      return { icon: FiFileText, color: 'gray.500' };
  }
};

const Drip = ({ courseId }) => {
  const [sections, setSections] = useState([]);
  const [dripContents, setDripContents] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for save operation
  const toast = useToast(); // For showing success/error messages

  const convertToDripContents = (drips) => {
    return drips.map((drip) => ({
      id: `drip-${drip.id}`,
      lessons: [
        {
          id:
            (['TEXT', 'VIDEO', 'AUDIO'].includes(drip.prevDetailType)
              ? 'lesson-'
              : 'lesson-test-') + drip.prevId,
          title: drip.prevTitle,
          type: drip.prevDetailType || 'TEXT',
        },
        ...drip.nextDrips.map((next) => ({
          id:
            (['TEXT', 'VIDEO', 'AUDIO'].includes(next.nextDetailType)
              ? 'lesson-'
              : 'lesson-test-') + next.nextId,
          title: next.nextTitle,
          type: next.nextDetailType || 'TEXT',
        })),
      ],
    }));
  };

  const prepareDripsUpdateRequest = (dripContents) => {
    return dripContents.map((drip) => {
      const prevId = parseInt(
        drip.lessons[0].id.replace(/lesson-(test-)?/, ''),
      );
      const prevType = drip.lessons[0].id.startsWith('lesson-test-')
        ? 'TEST'
        : 'LESSON';

      return {
        prevId,
        prevType,
        requiredCompletion: true,
        nextDrips: drip.lessons.slice(1).map((lesson) => {
          const nextId = parseInt(lesson.id.replace(/lesson-(test-)?/, ''));
          const nextType = lesson.id.startsWith('lesson-test-')
            ? 'TEST'
            : 'LESSON';

          return {
            nextId,
            nextType,
            requiredCompletion: true,
          };
        }),
      };
    });
  };

  const fetchData = async () => {
    const sectionRequest = { courseId };
    const fetchedSections =
      await sectionService.fetchSectionsByCourse(sectionRequest);
    if (fetchedSections) {
      const sectionsWithFormattedLessons = await Promise.all(
        fetchedSections.map(async (section) => {
          const sectionId = section?.id;
          const lessons = await lessonService.fetchLessons({ sectionId });
          const formattedLessons = lessons.map((lesson) => ({
            id: 'lesson-' + lesson.id.toString(),
            title: lesson.title,
            type: lesson.type,
          }));

          const tests = await testService.getTestsBySection(sectionId);
          const formattedTests = tests.map((test) => ({
            id: 'lesson-test-' + test.id.toString(),
            title: test.title,
            type: test.type,
          }));
          const allLessonsAndTests = [...formattedLessons, ...formattedTests];

          return {
            id: 'section-' + section.id.toString(),
            title: section.title,
            lessons: allLessonsAndTests,
          };
        }),
      );
      setSections(sectionsWithFormattedLessons);
    }

    const fetchedDrips = await dripService.getAllDripsByCourseId(courseId);
    if (fetchedDrips) {
      const convertedDrips = convertToDripContents(fetchedDrips);
      setDripContents(convertedDrips);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const onSaveDrips = async () => {
    setLoading(true); // Start loading
    const dripsUpdateRequest = prepareDripsUpdateRequest(dripContents);

    try {
      const result = await dripService.updateDrips(
        courseId,
        dripsUpdateRequest,
      );
      if (result) {
        toast({
          title: 'Drips updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchData(); // Re-fetch data after saving
      } else {
        throw new Error('Failed to update drips');
      }
    } catch (error) {
      toast({
        title: 'Error updating drips.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // End loading
    }
  };

  const addDripContent = () => {
    setDripContents((prev) => [
      ...prev,
      { id: `drip-${prev.length + 1}`, lessons: [] },
    ]);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

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
      return;
    }

    if (source.droppableId.startsWith('section-')) {
      const sourceSection = sections.find(
        (section) => section.id === source.droppableId,
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <HStack spacing={5} align="start" h="full">
        <Box w="30%" bg="gray.100" p={5} rounded="md">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Drip
          </Text>

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
                      <Droppable droppableId={section.id} isDropDisabled={true}>
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
                                  draggableId={lesson.id}
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
        </Box>

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
          <Button
            ml={4}
            mt={4}
            colorScheme="blue"
            onClick={onSaveDrips}
            isLoading={loading} // Show spinner while saving
          >
            Save
          </Button>
        </Box>
      </HStack>
    </DragDropContext>
  );
};

export default Drip;
