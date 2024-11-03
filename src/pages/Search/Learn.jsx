import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
} from '@chakra-ui/react';
import { FiFileText, FiVideo } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';
import { ImRadioUnchecked } from 'react-icons/im';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import sectionService from '~/services/sectionService'; // Ensure these services are correctly imported
import lessonService from '~/services/lessonService';
import { useNavigate, useParams } from 'react-router-dom';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

const LessonItem = ({
  icon,
  title,
  duration,
  iconColor,
  onClick,
  typeLesson,
  complete,
}) => (
  <HStack
    w="100%"
    p={2}
    justifyContent="space-between"
    borderRadius={8}
    bg="gray.50"
    cursor="pointer"
    _hover={{ bg: 'gray.100' }}
    onClick={onClick}
  >
    <VStack align="start" spacing={2} w="100%">
      <Text fontSize="sm" fontWeight="medium">
        {title}
      </Text>
      <HStack spacing={1}>
        <Icon as={icon} boxSize={5} color={iconColor} />
        <Text fontSize="sm" fontWeight="bold">
          {typeLesson}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {duration} min
        </Text>
      </HStack>
    </VStack>
    <Icon
      as={complete ? FaCheckCircle : ImRadioUnchecked}
      boxSize={5}
      color={complete ? 'blue.500' : 'gray.500'}
    />
  </HStack>
);

const Learn = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { courseId } = useParams();
  useEffect(() => {
    const fetchCurriculumData = async () => {
      setLoading(true);
      try {
        const fetchedSections = await sectionService.fetchSectionsByCourse({
          courseId,
        });

        const sectionsWithLessons = await Promise.all(
          fetchedSections.map(async (section) => {
            const lessons = await lessonService.fetchLessons({
              sectionId: section.id,
            });

            return {
              ...section,
              lessons: lessons.map((lesson) => ({
                ...lesson,
                icon: getLessonIcon(lesson.type),
                iconColor: getLessonColor(lesson.type),
                complete: false, // Assuming lessons start incomplete
              })),
            };
          }),
        );

        setSections(sectionsWithLessons);

        // Automatically select the first lesson if available
        if (sectionsWithLessons[0]?.lessons[0]) {
          setSelectedLesson(sectionsWithLessons[0].lessons[0]);
        }
      } catch (error) {
        console.error('Error fetching curriculum data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculumData();
  }, [courseId]);

  const handleCompleteAndNext = () => {
    if (!selectedLesson) return;

    const updatedSections = sections.map((section) => ({
      ...section,
      lessons: section.lessons.map((lesson) =>
        lesson.id === selectedLesson.id
          ? { ...lesson, complete: true }
          : lesson,
      ),
    }));

    setSections(updatedSections);

    // Find the next lesson
    let nextLesson = null;
    let foundNextLesson = false;

    for (const section of updatedSections) {
      for (const lesson of section.lessons) {
        if (foundNextLesson) {
          nextLesson = lesson;
          break;
        }
        if (lesson.id === selectedLesson.id) {
          foundNextLesson = true;
        }
      }
      if (nextLesson) break;
    }

    if (nextLesson) {
      setSelectedLesson(nextLesson);
    } else {
      alert('You have completed all lessons!');
    }
  };

  const renderContent = () => {
    if (!selectedLesson) return null;

    const { content, contentUrl, description, type } = selectedLesson;

    return (
      <>
        <Text fontSize="sm" fontWeight="bold" color="gray.500">
          {description}
        </Text>
        {type === 'TEXT' && (
          <Text fontSize="lg" color="gray.700" mt={4}>
            {content}
          </Text>
        )}
        {type === 'VIDEO' && (
          <>
            <Box mt={4} w="100%">
              <video
                controls
                style={{ width: '100%', height: 'auto' }}
                src={contentUrl}
              >
                Your browser does not support the video tag.
              </video>
            </Box>
            <Text fontSize="lg" color="gray.700" mt={4}>
              {content}
            </Text>
          </>
        )}
        {type === 'AUDIO' && (
          <>
            <Box mt={4} w="100%">
              <audio
                controls
                style={{ width: '100%', height: 'auto' }}
                src={contentUrl}
              >
                Your browser does not support the audio tag.
              </audio>
            </Box>
            <Text fontSize="lg" color="gray.700" mt={4}>
              {content}
            </Text>
          </>
        )}
      </>
    );
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'VIDEO':
        return FiVideo;
      case 'AUDIO':
        return HiOutlineSpeakerWave;
      default:
        return FiFileText;
    }
  };

  const getLessonColor = (type) => {
    switch (type) {
      case 'VIDEO':
        return 'blue.500';
      case 'AUDIO':
        return 'purple.500';
      default:
        return 'green.500';
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <RoleBasedPageLayout>
      <Flex h="100vh">
        <Box w="30%" bg="gray.100" p={4}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Let's paint Van Gogh's Starry Night
          </Text>
          <Accordion allowMultiple>
            {sections.map((section) => (
              <AccordionItem key={section.id}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      {section.title}
                    </Box>
                    <HStack spacing={1}>
                      <Text fontSize="sm" color="gray.500">
                        {section.lessons.length}
                      </Text>
                      <AccordionIcon />
                    </HStack>
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack spacing={2}>
                    {section.lessons.map((lesson) => (
                      <LessonItem
                        key={lesson.id}
                        icon={lesson.icon}
                        iconColor={lesson.iconColor}
                        title={lesson.title}
                        duration={lesson.duration}
                        complete={lesson.complete}
                        onClick={() => setSelectedLesson(lesson)}
                      />
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
        <Box flex="1" p={8}>
          <VStack align="start" spacing={4}>
            {renderContent()}
          </VStack>

          <Button
            colorScheme="blue"
            mt={8}
            alignSelf="flex-end"
            onClick={handleCompleteAndNext}
          >
            Complete & Next
          </Button>
        </Box>
      </Flex>
    </RoleBasedPageLayout>
  );
};

export default Learn;
