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
import { MdSubdirectoryArrowRight } from 'react-icons/md'; // Import the new icon
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
    default:
      return { icon: FiFileText, color: 'gray.500' };
  }
};

const Drip = () => {
  // Sample data
  const [sections, setSections] = useState([
    {
      id: 'section-1',
      title: 'Section 1',
      lessons: [
        { id: 'lesson-1', title: 'Lesson 1', type: 'TEXT' },
        { id: 'lesson-2', title: 'Lesson 2', type: 'VIDEO' },
      ],
    },
    {
      id: 'section-2',
      title: 'Section 2',
      lessons: [
        { id: 'lesson-3', title: 'Lesson 3', type: 'AUDIO' },
        { id: 'lesson-4', title: 'Lesson 4', type: 'QUIZ' },
      ],
    },
  ]);

  const [dripContents, setDripContents] = useState([
    { id: 'drip-1', lessons: [] },
    { id: 'drip-2', lessons: [] },
  ]);

  const addDripContent = () => {
    setDripContents((prev) => [
      ...prev,
      { id: `drip-${prev.length + 1}`, lessons: [] },
    ]);
  };

  // Handle the drag-and-drop functionality
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If no destination, exit early
    if (!destination) return;

    // If the source and destination are the same, and it's in a drip content, reorder the lessons
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

    // Handle dragging from sections to drip content
    if (source.droppableId.startsWith('section-')) {
      const sourceSection = sections.find(
        (section) => section.id === source.droppableId,
      );
      const draggedLesson = sourceSection?.lessons[source.index];

      if (draggedLesson) {
        setDripContents((prevDripContents) =>
          prevDripContents.map((dripContent) => {
            if (dripContent.id === destination.droppableId) {
              // Check if the lesson is already in the drip content to avoid duplicates
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
      // Handle dragging between drip contents
      let draggedLesson = null;

      setDripContents((prevDripContents) =>
        prevDripContents.map((dripContent) => {
          if (dripContent.id === source.droppableId) {
            // Remove the lesson from the source drip content
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

  // Handle deleting a lesson from a drip content
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

  // Handle deleting an entire drip content
  const deleteDripContent = (dripId) => {
    setDripContents((prevDripContents) =>
      prevDripContents.filter((content) => content.id !== dripId),
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <HStack spacing={5} align="start" h="full">
        {/* Left Section (Lessons) */}
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
                                  draggableId={lesson.id} // Use lesson.id for section lessons
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

        {/* Right Section (Drip Contents) */}
        <Box w="70%" textAlign="center" maxHeight="80vh" overflow="auto">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Drip Contents
          </Text>

          {dripContents.map((dripContent, index) => (
            <Box key={dripContent.id} mb={4} width="750px">
              {/* Drip title and delete button */}
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
                              // Create unique draggableId for lessons in drip content
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
                                          as={MdSubdirectoryArrowRight} // Add icon for non-first lessons
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
        </Box>
      </HStack>
    </DragDropContext>
  );
};

export default Drip;
