import React, { useState } from 'react';
import axios from 'axios';  // Import Axios
import {
    ChakraProvider,
    Box,
    Button,
    Flex,
    Heading,
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    IconButton,
    VStack,
    HStack,
    Input,
    Spacer,
    Tabs,
    TabList,
    Tab,
    Icon,
} from '@chakra-ui/react';
import { MdArrowBack, MdAdd, MdSearch } from 'react-icons/md';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FaFileAlt, FaPodcast, FaVideo, FaChalkboardTeacher, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
const CurriculumPage = () => {
    const [sections, setSections] = useState([
        {
            name: 'Section 1: Lectures',
            lessons: [
                { icon: FaFileAlt, color: 'green.500', title: 'Part 1 - Your First Ride' },
                { icon: FaPodcast, color: 'purple.500', title: 'Part 2 - A Closer Introduction' },
                { icon: FaVideo, color: 'orange.500', title: 'Part 3 - Structure Your Training' },
                { icon: FaChalkboardTeacher, color: 'blue.500', title: 'Part 4 - Finding New Training Methods' },
                { icon: FaFileAlt, color: 'blue.500', title: 'Part 5 - Zoom Conference' },
                { icon: FaQuestionCircle, color: 'yellow.500', title: 'Final quiz' },
            ],
        },
        {
            name: 'Section 2: Necessary',
            lessons: [
                { icon: FaFileAlt, color: 'green.500', title: 'Part 1 - Your First Ride' },
                { icon: FaPodcast, color: 'purple.500', title: 'Part 2 - A Closer Introduction' },
                { icon: FaVideo, color: 'orange.500', title: 'Part 3 - Structure Your Training' },
                { icon: FaChalkboardTeacher, color: 'blue.500', title: 'Part 4 - Finding New Training Methods' },
                { icon: FaFileAlt, color: 'blue.500', title: 'Part 5 - Zoom Conference' },
                { icon: FaQuestionCircle, color: 'yellow.500', title: 'Final quiz' },
            ],
        },
    ]);

    const [newSectionName, setNewSectionName] = useState('');
    const [isAddingSection, setIsAddingSection] = useState(false);
    const navigate = useNavigate();
    // Function to handle adding a new section, including Axios POST request
    const handleAddNewSection = async () => {
        if (newSectionName.trim() === '') return;

        const newSection = {
            title: newSectionName,
            lessons: [],
            createdBy: 'your_username',  // Add your username or other data here
        };

        try {
            // POST request to the backend to save the new section
            const response = await axios.post('http://localhost:8080/sections', newSection);

            if (response.status === 200) {
                // Update UI after successful POST request
                setSections([...sections, { name: newSectionName, lessons: [] }]);
                setNewSectionName('');
                setIsAddingSection(false);
                alert('Section added successfully');
            }
        } catch (error) {
            console.error('Error adding section:', error);
            alert('Failed to add section');
        }
    };
    const handleAddNewLesson = () => {
        navigate('/lesson'); // Navigate to the lesson page
    };
    return (
        <ChakraProvider>
            {/* Main container */}
            <Box bg="#f4f7fc" minH="100vh">
                {/* Navigation Bar */}
                <Flex bg="gray.800" color="white" px="8" py="4" alignItems="center">
                    <Button leftIcon={<MdArrowBack />} variant="ghost" colorScheme="whiteAlpha">
                        Back to courses
                    </Button>
                    <Heading as="h2" size="md" ml="4">
                        The Right Set for Landscape Photography
                    </Heading>
                    <Spacer />
                    <Tabs variant="unstyled">
                        <TabList>
                            <Tab _selected={{ color: 'blue.300', borderBottom: '2px solid' }}>Curriculum</Tab>
                            <Tab>Drip</Tab>
                            <Tab>Settings</Tab>
                            <Tab>Pricing</Tab>
                            <Tab>FAQ</Tab>
                            <Tab>Notice</Tab>
                        </TabList>
                    </Tabs>
                    <Spacer />
                    <Button colorScheme="blue" variant="solid" mr="4">
                        Published
                    </Button>
                    <Button colorScheme="gray" variant="outline">
                        View
                    </Button>
                </Flex>

                {/* Main Content */}
                <Flex p="8">
                    {/* Left Sidebar - Curriculum */}
                    <Box flex="1" mr="8">
                        <Heading size="lg" mb="4">
                            Curriculum
                        </Heading>

                        <Accordion allowToggle defaultIndex={[0]}>
                            {sections.map((section, index) => (
                                <AccordionItem key={index}>
                                    <h2>
                                        <AccordionButton>
                                            <Box flex="1" textAlign="left" fontWeight="bold">
                                                {section.name}
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        <VStack align="start" spacing="4">
                                            {section.lessons.map((lesson, lessonIndex) => (
                                                <HStack key={lessonIndex}>
                                                    <Icon as={lesson.icon} color={lesson.color} />
                                                    <Text>{lesson.title}</Text>
                                                </HStack>
                                            ))}

                                            {/* Add Lesson and Search Materials Buttons */}
                                            <Flex width="100%" mt="4">
                                                <Button onClick={handleAddNewLesson} leftIcon={<AiOutlinePlusCircle />} colorScheme="blue" flex="1">
                                                    Add a lesson
                                                </Button>
                                                <Button leftIcon={<MdSearch />} variant="outline" ml="4" flex="1">
                                                    Search materials
                                                </Button>
                                            </Flex>
                                        </VStack>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        {/* Add New Section */}
                        {isAddingSection ? (
                            <VStack mt="8" spacing="4" align="start">
                                <Input
                                    placeholder="Enter section name"
                                    value={newSectionName}
                                    onChange={(e) => setNewSectionName(e.target.value)}
                                />
                                <Button colorScheme="blue" onClick={handleAddNewSection}>
                                    Add
                                </Button>
                            </VStack>
                        ) : (
                            <Button
                                leftIcon={<MdAdd />}
                                colorScheme="blue"
                                variant="outline"
                                mt="8"
                                width="100%"
                                onClick={() => setIsAddingSection(true)}
                            >
                                New section
                            </Button>
                        )}
                    </Box>

                    {/* Right Section - Build your course */}
                    <Box flex="2" display="flex" justifyContent="center" alignItems="center">
                        <VStack>
                            <Heading size="md">Let's build your course!</Heading>
                            <Text textAlign="center" color="gray.500" maxW="md">
                                Get started by creating the lessons from scratch in the column on the left or import
                                your educational content.
                            </Text>
                        </VStack>
                    </Box>
                </Flex>
            </Box>
        </ChakraProvider>
    );
};

export default CurriculumPage;