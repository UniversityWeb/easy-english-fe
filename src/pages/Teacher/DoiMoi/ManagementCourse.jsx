import React, { useState } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import Curriculum from '~/pages/Teacher/DoiMoi/Curriculum';
import Drip from '~/pages/Teacher/DoiMoi/Curriculum';
import Settings from '~/pages/Teacher/DoiMoi/Setting';
import Pricing from '~/pages/Teacher/DoiMoi/Pricing';
import FAQ from '~/pages/Teacher/DoiMoi/Faq';
import Notice from '~/pages/Teacher/DoiMoi/Notice';
import config from '~/config';

function ManagementCourse() {
  const { courseId } = useParams(); // Extract courseId from URL
  const [activeComponent, setActiveComponent] = useState('Curriculum');
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(config.routes.course_management_for_teacher);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Curriculum':
        return <Curriculum courseId={courseId} />;
      case 'Drip':
        return <Drip />;
      case 'Settings':
        return <Settings courseId={courseId} />;
      case 'Pricing':
        return <Pricing courseId={courseId} />;
      case 'FAQ':
        return <FAQ courseId={courseId} />;
      case 'Notice':
        return <Notice />;
      default:
        return <Curriculum courseId={courseId} />;
    }
  };

  return (
    <VStack h="100vh" bg="gray.50">
      {/* Header section */}
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
          How to Design Components Right
        </Heading>

        {/* Tabs */}
        <Tabs
          variant="unstyled"
          ml="auto"
          onChange={(index) => {
            const tabNames = [
              'Curriculum',
              'Drip',
              'Settings',
              'Pricing',
              'FAQ',
              'Notice',
            ];
            setActiveComponent(tabNames[index]);
          }}
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

      {/* Main content */}
      <Box w="full" h="full" bg="white" p={8} rounded="md" mt={5}>
        {renderComponent()}
      </Box>
    </VStack>
  );
}

export default ManagementCourse;
