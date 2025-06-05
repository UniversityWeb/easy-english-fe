import React, { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FiFileText, FiHelpCircle, FiVideo } from 'react-icons/fi';
import { LuPencil } from 'react-icons/lu';

import { FaCheckCircle, FaLock } from 'react-icons/fa';
import { ImRadioUnchecked } from 'react-icons/im';
import { HiOutlineSpeakerWave } from 'react-icons/hi2';
import { MdRateReview } from 'react-icons/md';
import sectionService from '~/services/sectionService';
import lessonService from '~/services/lessonService';
import testService from '~/services/testService';
import lessonTrackerService from '~/services/lessonTrackerService';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { getUsername } from '~/utils/authUtils';
import { SEC_ITEM_TYPES } from '~/utils/constants';
import TestPreview from '~/components/Test/TestPreview';
import NavbarWithBackBtn from '~/components/Navbars/NavbarWithBackBtn';
import writingService from '~/services/writingService';
import WritingTaskPage from '../Common/WritingTaskPage';

const LessonItem = ({
  icon,
  title,
  duration,
  iconColor,
  onClick,
  typeLesson,
  complete,
  isLocked,
  isTest = false,
  isSelected = false,
  itemRef,
}) => (
  <HStack
    w="100%"
    ref={itemRef}
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
      <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
        {title}
      </Text>
      <HStack spacing={1}>
        <Icon as={icon} boxSize={5} color={iconColor} />
        <Text fontSize="sm" fontWeight="bold">
          {isTest ? 'TEST' : typeLesson}
        </Text>
        {!isTest && (
          <Text fontSize="sm" color="gray.500">
            {duration} min
          </Text>
        )}
      </HStack>
    </VStack>
    {isLocked ? (
      <Icon as={FaLock} boxSize={5} color="gray.500" />
    ) : (
      <Icon
        as={complete ? FaCheckCircle : ImRadioUnchecked}
        boxSize={5}
        color={complete ? 'blue.500' : 'gray.500'}
      />
    )}
  </HStack>
);

const LearnPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { courseId, courseTitle } = useParams();
  const username = getUsername();
  const itemRefs = useRef({});
  const returnURL = localStorage.getItem('previousPageMain');

  useEffect(() => {
    const fetchCurriculumData = async () => {
      setLoading(true);
      try {
        const fetchedSections = await sectionService.fetchSectionsByCourse({
          courseId,
        });

        const sectionsWithContent = await Promise.all(
          fetchedSections.map(async (section) => {
            const writingRequest = {
              sectionId: section.id,
              pageNumber: 0,
              size: 9999,
            };
            const [lessons, tests, writings] = await Promise.all([
              lessonService.fetchLessons({ sectionId: section.id }),
              testService.getTestsBySection(section.id),

              writingService.getWriting(writingRequest),
            ]);

            const formattedLessons = lessons?.map((lesson) => ({
              ...lesson,
              icon: getLessonIcon(lesson.type),
              iconColor: getLessonColor(lesson.type),
              complete: lesson.completed,
              isLesson: true,
              type: lesson.type,
            }));

            const formattedTests = tests?.map((test) => ({
              ...test,
              icon: FiHelpCircle,
              iconColor: 'orange.500',
              complete: test.isDone,
              isTest: true,
              type: 'TEST',
            }));

            const formattedWritings = writings?.map((writing) => ({
              ...writing,
              icon: LuPencil,
              iconColor: 'green.500',
              //complete: writing.isDone,
              //isTest: true,
              type: 'WRITING',
            }));
            //const formattedWritings = [];
            return {
              ...section,
              items: [
                ...formattedLessons,
                ...formattedTests,
                ...formattedWritings,
              ],
            };
          }),
        );

        setSections(sectionsWithContent);

        const selectedType = searchParams.get('type');
        const selectedId = searchParams.get('id');

        // First, try to get the first unlearned lesson
        const firstUnlearnedLesson =
          await lessonTrackerService.getFirstUnlearnedLesson(courseId);

        // Find the selected item
        let foundItem = null;

        // First, check URL params
        if (selectedType && selectedId) {
          foundItem = sectionsWithContent
            .flatMap((section) => section.items)
            .find(
              (item) =>
                (item.isTest ? 'TEST' : item.type) === selectedType &&
                item.id.toString() === selectedId,
            );
        }

        // If no URL params match, try the first unlearned lesson
        if (!foundItem && firstUnlearnedLesson) {
          foundItem = sectionsWithContent
            .flatMap((section) => section.items)
            .find(
              (item) =>
                (item.isTest ? 'TEST' : item.type) ===
                  firstUnlearnedLesson.type &&
                item.id.toString() === firstUnlearnedLesson.id.toString(),
            );
        }

        // If still no item found, default to the first item
        if (!foundItem && sectionsWithContent[0]?.items[0]) {
          foundItem = sectionsWithContent[0].items[0];
        }

        if (foundItem) {
          setSelectedItem(foundItem);
          updateSearchParams(foundItem);
        }
      } catch (error) {
        console.error('Error fetching curriculum data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculumData();
  }, [courseId]);

  useEffect(() => {
    if (selectedItem && itemRefs.current[selectedItem.id]) {
      // Đảm bảo phần tử xuất hiện trước khi scroll
      setTimeout(() => {
        itemRefs.current[selectedItem.id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }, 100); // Delay 100ms để đảm bảo refs đã được cập nhật
    }
  }, [selectedItem]);

  const updateSearchParams = (item) => {
    const type = item.isTest ? 'TEST' : item.type;
    setSearchParams({ type, id: item.id.toString() }, { replace: true });
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

  function extractYouTubeId(url) {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  const renderContent = (courseTitle) => {
    if (!selectedItem) return null;

    const { content, contentUrl, description, type, isTest } = selectedItem;

    if (isTest) {
      return (
        <TestPreview
          courseTitle={courseTitle || 'Default'}
          test={selectedItem}
        />
      );
    }

    return (
      <>
        <Text fontSize="sm" fontWeight="bold" color="gray.500">
          {description}
        </Text>
        {type === SEC_ITEM_TYPES.TEXT && (
          <Box
            color="gray.700"
            mt={4}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        {type === SEC_ITEM_TYPES.VIDEO && (
          <>
            <Box mt={4} w="100%" maxWidth="800px" mx="auto">
              {contentUrl.includes('youtube.com') ||
              contentUrl.includes('youtu.be') ? (
                // Video YouTube
                <iframe
                  width="100%"
                  height="450"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(contentUrl)}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video"
                />
              ) : (
                // Video file từ cloud
                <video
                  controls
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '800px',
                    maxHeight: '450px',
                  }}
                  src={contentUrl}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </Box>

            <Box
              color="gray.700"
              mt={4}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </>
        )}
        {type === SEC_ITEM_TYPES.AUDIO && (
          <>
            <Box
              color="gray.700"
              mt={4}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </>
        )}
        {type === SEC_ITEM_TYPES.WRITING && (
          <>
            <WritingTaskPage infoWriting={selectedItem} />
          </>
        )}
      </>
    );
  };
  const handleItemClick = (id, type) => {
    const foundItem = sections
      .flatMap((section) => section.items)
      .find((item) => item.id === id && item.type === type);

    if (foundItem) {
      setSelectedItem(foundItem);
      updateSearchParams(foundItem);
    }
  };
  const isLastItem = () => {
    if (!selectedItem) return false;

    // Flatten the list of items in sections
    const allItems = sections.flatMap((section) => section.items);

    // Get the last item in the list
    const lastItem = allItems[allItems.length - 1];

    // Check if the selected item is the last one *and* if it is complete
    return (
      selectedItem.id === lastItem.id && lastItem.complete // Ensure the last item is completed
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
      <NavbarWithBackBtn
        returnUrl={returnURL}
        backBtnTitle={'Back to courses'}
      />
      <Flex h="100vh" overflow="hidden">
        <Box
          w="30%"
          bg="gray.100"
          p={5}
          rounded="md"
          display="flex"
          flexDirection="column"
          h="100%"
          overflowY="auto"
        >
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            {courseTitle}
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
                          isLocked={item?.isLocked}
                          isTest={item.isTest}
                          onClick={() => handleItemSelect(item)}
                          isSelected={selectedItem?.id === item.id}
                          itemRef={(el) => (itemRefs.current[item.id] = el)}
                        />
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        </Box>

        <Box flex="1" p={8} pb={0} overflow="auto" h="100%">
          {selectedItem?.isLocked ? (
            <>
              <HStack mb={4} align="center" spacing={2}>
                <Icon as={FaLock} color="red.500" boxSize={5} />{' '}
                {/* Replace `YourLockIconComponent` with the lock icon component you're using */}
                <Text color="gray.600">
                  The current content is locked. Please complete the list below
                  to unlock and proceed.
                </Text>
              </HStack>

              {selectedItem.prevDrips.map((prevDrip) => (
                <HStack
                  key={prevDrip.id}
                  spacing={4}
                  align="center"
                  _hover={{ backgroundColor: 'gray.200', cursor: 'pointer' }} // Hover effect
                  onClick={() => handleItemClick(prevDrip.id, prevDrip.type)} // Click event handler
                >
                  <Icon
                    as={getLessonIcon(prevDrip.type)}
                    color={getLessonColor(prevDrip.type)}
                  />
                  <VStack align="start" spacing={0}>
                    <Text>{prevDrip.title}</Text>
                  </VStack>
                </HStack>
              ))}
            </>
          ) : (
            <>
              <VStack align="start" spacing={4} minHeight="89%">
                {renderContent(courseTitle)}
              </VStack>
              <Box
                position="sticky"
                bottom="0"
                bg="white"
                p={0}
                zIndex={10}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                paddingBottom={3}
                paddingTop={3}
              >
                {isLastItem() ? (
                  <Button
                    colorScheme="teal"
                    alignSelf="flex-end"
                    leftIcon={<MdRateReview />}
                    onClick={() =>
                      navigate(`/course-view-detail/${courseId}?tab=reviews`)
                    }
                  >
                    Review Course
                  </Button>
                ) : (
                  !selectedItem?.isTest && (
                    <Button
                      colorScheme="blue"
                      alignSelf="flex-end"
                      onClick={handleCompleteAndNext}
                    >
                      {selectedItem?.complete ? 'Next' : 'Complete & Next'}
                    </Button>
                  )
                )}
              </Box>
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default LearnPage;
