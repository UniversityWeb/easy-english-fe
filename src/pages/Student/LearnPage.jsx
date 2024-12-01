import React, { useState, useEffect } from 'react';
import {
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
import { FiFileText, FiVideo, FiHelpCircle } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';
import { ImRadioUnchecked } from 'react-icons/im';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import { MdArrowBack } from 'react-icons/md';
import sectionService from '~/services/sectionService';
import lessonService from '~/services/lessonService';
import testService from '~/services/testService';
import lessonTrackerService from '~/services/lessonTrackerService';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getUsername } from '~/utils/authUtils';
import { SEC_ITEM_TYPES } from '~/utils/constants';
import TestPreview from '~/components/Test/TestPreview';

const LessonItem = ({
  icon,
  title,
  duration,
  iconColor,
  onClick,
  typeLesson,
  complete,
  isTest = false,
  isSelected = false,
}) => (
  <HStack
    w="100%"
    p={2}
    justifyContent="space-between"
    borderRadius={8}
    bg={isSelected ? 'blue.100' : 'gray.50'}
    cursor="pointer"
    _hover={{ bg: isSelected ? 'blue.200' : 'gray.100' }}
    border={isSelected ? '2px solid blue.500' : 'none'}
    onClick={onClick}
  >
    <VStack align="start" spacing={2} w="100%">
      <Text fontSize="sm" fontWeight="medium">
        {title}
      </Text>
      <HStack spacing={1}>
        <Icon as={icon} boxSize={5} color={iconColor} />
        <Text fontSize="sm" fontWeight="bold">
          {isTest ? 'Test' : typeLesson}
        </Text>
        {!isTest && (
          <Text fontSize="sm" color="gray.500">
            {duration} min
          </Text>
        )}
      </HStack>
    </VStack>
    <Icon
      as={complete ? FaCheckCircle : ImRadioUnchecked}
      boxSize={5}
      color={complete ? 'blue.500' : 'gray.500'}
    />
  </HStack>
);

const LearnPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { courseId } = useParams();
  const username = getUsername();
  const navigate = useNavigate();

  const Navbar = () => {
    const handleBackClick = () => {
      navigate(`/course-view-detail/${courseId}`);
    };

    return (
      <Flex
        bg="gray.800"
        color="white"
        px="8"
        py="4"
        alignItems="center"
        w="full"
      >
        <Button
          leftIcon={<MdArrowBack />}
          variant="ghost"
          colorScheme="whiteAlpha"
          onClick={handleBackClick}
        >
          Back to courses
        </Button>
      </Flex>
    );
  };

  useEffect(() => {
    const fetchCurriculumData = async () => {
      setLoading(true);
      try {
        const fetchedSections = await sectionService.fetchSectionsByCourse({
          courseId,
        });

        const sectionsWithContent = await Promise.all(
          fetchedSections.map(async (section) => {
            const [lessons, tests] = await Promise.all([
              lessonService.fetchLessons({ sectionId: section.id }),
              testService.getTestsBySection(section.id),
            ]);

            const formattedLessons = lessons.map((lesson) => ({
              ...lesson,
              icon: getLessonIcon(lesson.type),
              iconColor: getLessonColor(lesson.type),
              complete: lesson.completed,
              isLesson: true,
              type: lesson.type,
            }));

            const formattedTests = tests.map((test) => ({
              ...test,
              icon: FiHelpCircle,
              iconColor: 'orange.500',
              complete: test.completed,
              isTest: true,
              type: 'test',
            }));

            return {
              ...section,
              items: [...formattedLessons, ...formattedTests],
            };
          }),
        );

        setSections(sectionsWithContent);

        // Check if there's a selected item in the URL
        const selectedType = searchParams.get('type');
        const selectedId = searchParams.get('id');

        // Find the selected item based on URL params
        if (selectedType && selectedId) {
          const foundItem = sectionsWithContent
            .flatMap((section) => section.items)
            .find(
              (item) =>
                (item.isTest ? 'test' : item.type) === selectedType &&
                item.id.toString() === selectedId,
            );

          if (foundItem) {
            setSelectedItem(foundItem);
            return;
          }
        }

        // If no URL params or item not found, set first item
        if (sectionsWithContent[0]?.items[0]) {
          const firstItem = sectionsWithContent[0].items[0];
          setSelectedItem(firstItem);
          updateSearchParams(firstItem);
        }
      } catch (error) {
        console.error('Error fetching curriculum data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculumData();
  }, [courseId, searchParams]);

  const updateSearchParams = (item) => {
    const type = item.isTest ? 'test' : item.type;
    setSearchParams({ type, id: item.id.toString() });
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    updateSearchParams(item);
  };

  const handleCompleteAndNext = async () => {
    if (!selectedItem) return;

    if (!selectedItem.complete) {
      try {
        if (selectedItem.isLesson) {
          await lessonTrackerService.createCompleteLesson({
            lessonId: selectedItem.id,
            username: username,
            isCompleted: true,
            completedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error completing the item:', error);
        return;
      }
    }

    const updatedSections = sections.map((section) => ({
      ...section,
      items: section.items.map((item) =>
        item.id === selectedItem.id ? { ...item, complete: true } : item,
      ),
    }));

    setSections(updatedSections);

    // Find next item
    let nextItem = null;
    let foundNextItem = false;

    for (const section of updatedSections) {
      for (const item of section.items) {
        if (foundNextItem) {
          nextItem = item;
          break;
        }
        if (item.id === selectedItem.id) {
          foundNextItem = true;
        }
      }
      if (nextItem) break;
    }

    if (nextItem) {
      setSelectedItem(nextItem);
      updateSearchParams(nextItem);
    } else {
      alert('You have completed all items!');
    }
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
        return 'orange.500';
      default:
        return 'green.500';
    }
  };

  const renderContent = () => {
    if (!selectedItem) return null;

    const { content, contentUrl, description, type, isTest } = selectedItem;

    if (isTest) {
      return <TestPreview test={selectedItem} />;
    }

    return (
      <>
        <Text fontSize="sm" fontWeight="bold" color="gray.500">
          {description}
        </Text>
        {type === SEC_ITEM_TYPES.TEXT && (
          <Text fontSize="lg" color="gray.700" mt={4}>
            {content}
          </Text>
        )}
        {type === SEC_ITEM_TYPES.VIDEO && (
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
        {type === SEC_ITEM_TYPES.AUDIO && (
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

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" h="100vh">
      <Navbar />
      <Flex h="full">
        <Box
          w="30%"
          bg="gray.100"
          p={5}
          rounded="md"
          display="flex"
          flexDirection="column"
          h="100%"
        >
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Let's paint Van Gogh's Starry Night
          </Text>
          <Box flex="1" overflowY="auto" pr={2}>
            <Accordion
              allowMultiple
              defaultIndex={sections.map((_, index) => index)}
            >
              {sections.map((section) => (
                <AccordionItem key={section.id}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="bold">
                        {section.title}
                      </Box>
                      <HStack spacing={1}>
                        <Text fontSize="sm" color="gray.500">
                          {section.items.length}
                        </Text>
                        <AccordionIcon />
                      </HStack>
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <VStack spacing={2}>
                      {section.items.map((item) => (
                        <LessonItem
                          key={item.id}
                          icon={item.icon}
                          iconColor={item.iconColor}
                          title={item.title}
                          duration={item.duration}
                          complete={item.complete}
                          isTest={item.isTest}
                          onClick={() => handleItemSelect(item)}
                          isSelected={selectedItem?.id === item.id}
                        />
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </Box>

        <Box flex="1" p={8}>
          <VStack align="start" spacing={4}>
            {renderContent()}
          </VStack>

          {!selectedItem?.isTest && (
            <Button
              colorScheme="blue"
              mt={8}
              alignSelf="flex-end"
              onClick={handleCompleteAndNext}
            >
              {selectedItem?.complete ? 'Next' : 'Complete & Next'}
            </Button>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default LearnPage;
