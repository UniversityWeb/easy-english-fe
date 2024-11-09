import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Icon,
  Collapse,
  VStack,
  HStack,
  Spinner,
} from '@chakra-ui/react';
import { RxTriangleDown, RxTriangleUp } from 'react-icons/rx';
import sectionService from '~/services/sectionService';
import lessonService from '~/services/lessonService';
import { FiFileText, FiVideo, FiHelpCircle } from 'react-icons/fi';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import { SEC_ITEM_TYPES } from '~/utils/constants';

const Curriculum = ({ courseId }) => {
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState([]);
  const [openLessons, setOpenLessons] = useState({});

  useEffect(() => {
    const fetchCurriculumData = async () => {
      setLoading(true);
      try {
        const sections = await sectionService.fetchSectionsByCourse({
          courseId: courseId,
        });
        const sectionsWithLessons = await Promise.all(
          sections.map(async (section) => {
            const lessons = await lessonService.fetchLessons({
              sectionId: section.id,
            });
            return {
              ...section,
              lessons: lessons.map((lesson) => ({
                ...lesson,
                icon: getLessonIcon(lesson.type),
                color: getLessonColor(lesson.type),
              })),
            };
          })
        );

        setCurriculumData(sectionsWithLessons);
        setOpenSections(sectionsWithLessons.map(() => false));
      } catch (error) {
        console.error('Error fetching curriculum data:', error);
      }
      setLoading(false);
    };

    fetchCurriculumData();
  }, [courseId]);

  const toggleSection = (index) => {
    setOpenSections((prevState) =>
      prevState.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  const toggleLessonDescription = (lessonId) => {
    setOpenLessons((prevOpenLessons) => ({
      ...prevOpenLessons,
      [lessonId]: !prevOpenLessons[lessonId],
    }));
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case SEC_ITEM_TYPES.VIDEO:
        return FiVideo;
      case SEC_ITEM_TYPES.AUDIO:
        return HiOutlineSpeakerWave;
      case SEC_ITEM_TYPES.TEST:
        return FiHelpCircle;
      default:
        return FiFileText;
    }
  };

  const getLessonColor = (type) => {
    switch (type) {
      case SEC_ITEM_TYPES.VIDEO:
        return 'blue.500';
      case SEC_ITEM_TYPES.AUDIO:
        return 'purple.500';
      case SEC_ITEM_TYPES.TEST:
        return 'yellow.500';
      default:
        return 'green.500';
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <Box mt={4}>
      {curriculumData.map((section, index) => (
        <Box key={section.id} mb={4}>
          <HStack
            p={1}
            justify="space-between"
            cursor="pointer"
            onClick={() => toggleSection(index)}
            _hover={{ bg: 'gray.100' }}
          >
          <Text fontWeight="medium" fontSize="lg">
        {section.title}
          </Text>
            <Icon as={openSections[index] ? RxTriangleUp : RxTriangleDown} />
          </HStack>
          <Collapse in={openSections[index]} animateOpacity>
            <VStack spacing={4} align="stretch" mt={4}>
              {section.lessons.map((lesson) => (
                <Box  key={lesson.id}>
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={lesson.icon} color={lesson.color} />
                      <Text>{lesson.title}</Text>
                    </HStack>
                    <HStack>
                      <Text>
                        {lesson.duration > 0
                          ? `${lesson.duration} min`
                          : lesson.title.toLowerCase().includes('quiz')
                            ? '8 questions'
                            : lesson.title.toLowerCase().includes('zoom')
                              ? 'Zoom lesson'
                              : 'Stream lesson'}
                      </Text>
                      {lesson.description && (
                        <Icon
                          as={
                            openLessons[lesson.id]
                              ? RxTriangleUp
                              : RxTriangleDown
                          }
                          _hover={{ bg: 'gray.200', borderRadius: '50%' }}
                          _active={{ bg: 'gray.300', borderRadius: '50%' }}
                          cursor="pointer"
                          onClick={() => toggleLessonDescription(lesson.id)}
                        />
                      )}
                    </HStack>
                  </HStack>
                  {lesson.description && (
                    <Collapse in={openLessons[lesson.id]} animateOpacity>
                      <Box pl={6} mt={2} maxWidth="90%"> 
                        <Text wordBreak="break-word" noOfLines={3}>
                          {lesson.description}
                        </Text>
                      </Box>
                    </Collapse>
                  )}
                </Box>
              ))}
            </VStack>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default Curriculum;
