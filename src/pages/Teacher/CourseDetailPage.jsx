import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  Tabs,
} from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Curriculum from '~/components/Teacher/CourseDetail/Curriculum';
import Drip from '~/components/Teacher/CourseDetail/Drip';
import Settings from '~/components/Teacher/CourseDetail/Setting';
import Pricing from '~/components/Teacher/CourseDetail/Pricing';
import FAQ from '~/components/Teacher/CourseDetail/Faq';
import Notice from '~/components/Teacher/CourseDetail/Notice';
import config from '~/config';
import courseService from '~/services/courseService';

function CourseDetailPage() {
  const { courseId } = useParams(); // Extract courseId from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Curriculum'; // Get active tab from query params
  const [courseTitle, setCourseTitle] = useState('');
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(config.routes.course_management_for_teacher);
  };

  const renderComponent = () => {
    switch (activeTab) {
      case 'Curriculum':
        return <Curriculum courseId={courseId} />;
      case 'Drip':
        return <Drip courseId={courseId} />;
      case 'Settings':
        return <Settings courseId={courseId} />;
      case 'Pricing':
        return <Pricing courseId={courseId} />;
      case 'FAQ':
        return <FAQ courseId={courseId} />;
      case 'Notice':
        return <Notice courseId={courseId} />;
      default:
        return <Curriculum courseId={courseId} />;
    }
  };

  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const courseRequest = { id: courseId };
          const data = await courseService.fetchMainCourse(courseRequest);
          if (data) {
            setCourseTitle(data.title || 'Course Detail'); // Set course title from API
          }
        } catch (error) {
          console.error('Error fetching course data.', error);
        }
      };

      fetchCourseData();
    }
  }, [courseId]);

  const handleTabChange = (index) => {
    const tabNames = [
      'Curriculum',
      'Drip',
      'Settings',
      'Pricing',
      'FAQ',
      'Notice',
    ];
    setSearchParams({ tab: tabNames[index] });
  };

  const getTabIndex = () => {
    const tabMapping = {
      Curriculum: 0,
      Drip: 1,
      Settings: 2,
      Pricing: 3,
      FAQ: 4,
      Notice: 5,
    };
    return tabMapping[activeTab] || 0;
  };

  return (
    <VStack h="100vh" bg="gray.50">
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
        <Heading as="h2" size="md" ml="4">
          {courseTitle}
        </Heading>

        <Tabs
          variant="unstyled"
          ml="auto"
          index={getTabIndex()}
          onChange={handleTabChange}
        >
          <TabList>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              Curriculum
            </Tab>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              Drip
            </Tab>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              Settings
            </Tab>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              Pricing
            </Tab>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              FAQ
            </Tab>
            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>
              Notice
            </Tab>
          </TabList>
        </Tabs>

        <Button colorScheme="blue" variant="solid" mr="4">
          Published
        </Button>
        <Button
          colorScheme="blue"
          variant="solid"
          onClick={() => navigate(`/course/view/${courseId}`)}
        >
          View
        </Button>
      </Flex>

      <Box
        w="full"
        h="full"
        bg="white"
        rounded="md"
        minHeight="500px"
        overflowY="auto"
      >
        {renderComponent()}
      </Box>
    </VStack>
  );
}

export default CourseDetailPage;
