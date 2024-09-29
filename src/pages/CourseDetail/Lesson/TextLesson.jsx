import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ChakraProvider,
    Box,
    Flex,
    Button,
    Input,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Switch,
    FormControl,
    FormLabel,
    Textarea,
    InputGroup,
    InputRightElement,
    IconButton,
    Grid,
    GridItem,
    useToast,
} from '@chakra-ui/react';
import { FaCalendarAlt } from 'react-icons/fa';
import { getToken } from '~/utils/authUtils';

const TextLesson = ({ lessonId, sectionId }) => {
    const [lesson, setLesson] = useState({
        title: '',
        content: '',
        description: '',
        duration: '',
        isPreview: false,
        startDate: '',
        startTime: '',
    });

    const toast = useToast();
    const token = getToken();

    // Fetch lesson data if lessonId is provided (for editing)
    useEffect(() => {
        if (lessonId) {
            const fetchLesson = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:8001/lessons/getLessonById?id=${lessonId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.status === 200) {
                        const { title, content, description, duration, isPreview, startDate } = response.data;
                        setLesson({
                            title,
                            content,
                            description,
                            duration,
                            isPreview,
                            startDate,
                            startTime: startDate ? startDate.slice(11, 16) : '',
                        });
                    } else {
                        toast({
                            title: "Failed to load lesson.",
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                } catch (error) {
                    toast({
                        title: "Error fetching lesson.",
                        description: error.message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            };

            fetchLesson();
        } else {
            // Reset form for adding a new lesson
            setLesson({
                title: '',
                content: '',
                description: '',
                duration: '',
                isPreview: false,
                startDate: '',
                startTime: '',
            });
        }
    }, [lessonId, toast, token]);

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const newOrUpdatedLesson = {
                id: lessonId,
                ...lesson,
                sectionId, // Ensure sectionId is included
            };

            const endpoint = lessonId ? `http://localhost:8001/lessons` : 'http://localhost:8001/lessons';
            const method = lessonId ? 'put' : 'post';

            const response = await axios[method](endpoint, newOrUpdatedLesson, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const message = lessonId ? 'Lesson updated successfully.' : 'Lesson added successfully.';
                toast({
                    title: message,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Error saving lesson.",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <ChakraProvider>
            <Box bg="#f4f7fc" minH="100vh" p="8">
                <Box bg="white" p="6" borderRadius="md" boxShadow="md">
                    <Flex mb="4" justify="space-between" align="center">
                        <Tabs variant="soft-rounded" colorScheme="gray">
                            <TabList>
                                <Tab>Text lesson</Tab>
                            </TabList>
                        </Tabs>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            {lessonId ? 'Save Changes' : 'Add Lesson'}
                        </Button>
                    </Flex>

                    <Tabs variant="soft-rounded" colorScheme="gray">
                        <TabPanels>
                            <TabPanel>
                                <FormControl mb="4">
                                    <FormLabel>Lesson title</FormLabel>
                                    <Input
                                        value={lesson.title}
                                        onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                                        placeholder="Enter lesson title"
                                    />
                                </FormControl>

                                <FormControl mb="4">
                                    <FormLabel>Lesson duration (minutes)</FormLabel>
                                    <Input
                                        type="number"
                                        value={lesson.duration}
                                        onChange={(e) => setLesson({ ...lesson, duration: e.target.value })}
                                        placeholder="Enter lesson duration in minutes"
                                    />
                                </FormControl>

                                <FormControl display="flex" alignItems="center" mb="4">
                                    <Switch
                                        id="preview-switch"
                                        isChecked={lesson.isPreview}
                                        onChange={(e) => setLesson({ ...lesson, isPreview: e.target.checked })}
                                        mr="2"
                                    />
                                    <FormLabel htmlFor="preview-switch" mb="0">
                                        Enable preview
                                    </FormLabel>
                                </FormControl>

                                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                                    <GridItem>
                                        <FormControl>
                                            <FormLabel>Start date</FormLabel>
                                            <InputGroup>
                                                <Input
                                                    type="date"
                                                    value={lesson.startDate}
                                                    onChange={(e) => setLesson({ ...lesson, startDate: e.target.value })}
                                                />
                                                <InputRightElement
                                                    children={<IconButton aria-label="calendar" icon={<FaCalendarAlt />} />}
                                                />
                                            </InputGroup>
                                        </FormControl>
                                    </GridItem>

                                    <GridItem>
                                        <FormControl>
                                            <FormLabel>Start time</FormLabel>
                                            <Input
                                                type="time"
                                                value={lesson.startTime}
                                                onChange={(e) => setLesson({ ...lesson, startTime: e.target.value })}
                                            />
                                        </FormControl>
                                    </GridItem>
                                </Grid>

                                <FormControl mb="4">
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        value={lesson.description}
                                        onChange={(e) => setLesson({ ...lesson, description: e.target.value })}
                                        placeholder="Enter a short description of the lesson"
                                        rows={3}
                                    />
                                </FormControl>

                                <FormControl mb="4">
                                    <FormLabel>Content</FormLabel>
                                    <Textarea
                                        value={lesson.content}
                                        onChange={(e) => setLesson({ ...lesson, content: e.target.value })}
                                        placeholder="Detail the lesson content here"
                                        rows={6}
                                    />
                                </FormControl>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Box>
        </ChakraProvider>
    );
};

export default TextLesson;