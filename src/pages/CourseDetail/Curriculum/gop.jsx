import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ChakraProvider,
    Box,
    Button,
    Flex,
    Heading,
    Spacer,
    Tabs,
    TabList,
    Tab,
    VStack,
    Input,
    Accordion,
    Text
} from '@chakra-ui/react';
import { MdArrowBack, MdAdd } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import Section from '../Section/Section';
import { getToken } from '~/utils/authUtils';

const Curriculum = () => {
    const { courseId } = useParams(); // Get courseId from the URL
    const [sections, setSections] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [isAddingSection, setIsAddingSection] = useState(false);
    const token = getToken();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get(`http://localhost:8001/sections/getAllSectionByCourse?courseId=${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSections(response.data);
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        };

        fetchSections();
    }, [courseId, token]);

    const handleAddNewSection = async () => {
        if (newSectionName.trim() === '') return;

        const newSection = {
            title: newSectionName,
            lessons: [],
            createdBy: 'your_username',
        };

        try {
            const response = await axios.post('http://localhost:8080/sections', newSection, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setSections([...sections, { title: newSectionName, id: response.data.id }]);
                setNewSectionName('');
                setIsAddingSection(false);
                alert('Section added successfully');
            }
        } catch (error) {
            console.error('Error adding section:', error);
            alert('Failed to add section');
        }
    };

    return (
        <ChakraProvider>
            <Box bg="#f4f7fc" minH="100vh">
                <Flex bg="gray.800" color="white" px="8" py="4" alignItems="center">
                    <Button leftIcon={<MdArrowBack />} variant="ghost" colorScheme="whiteAlpha" onClick={() => navigate('/courses')}>
                        Back to courses
                    </Button>
                    <Heading as="h2" size="md" ml="4">
                        Course Curriculum
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
                    <Button colorScheme="blue" variant="solid" mr="4">Published</Button>
                    <Button colorScheme="gray" variant="outline">View</Button>
                </Flex>

                <Flex p="8">
                    <Box flex="1" mr="8">
                        <Heading size="lg" mb="4">Curriculum</Heading>

                        <Accordion allowMultiple allowToggle defaultIndex={[0]}>
                            {sections.map((section) => (
                                <Section key={section.id} section={section} />
                            ))}
                        </Accordion>

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

export default Curriculum;