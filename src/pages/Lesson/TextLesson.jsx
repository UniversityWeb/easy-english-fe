import React, { useState } from 'react';
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
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const LessonForm = () => {
    const [lessonName, setLessonName] = useState('');
    const [lessonDuration, setLessonDuration] = useState('');
    const [isPreviewEnabled, setPreviewEnabled] = useState(false);
    const [lessonDescription, setLessonDescription] = useState('');
    const [lessonContent, setLessonContent] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const toast = useToast();


    const handleSubmit = async () => {
        const lessonData = {
            title: lessonName,
            type: 'video',
            content: lessonContent,
            description: lessonDescription,
            duration: parseInt(lessonDuration, 10),
            isPreview: isPreviewEnabled,
            startDate: `${startDate}T${startTime}`,
            createdBy: 'admin',
        };

        try {
            const response = await axios.post('http://localhost:8080/lessons', lessonData);

            if (response.status === 200) {
                toast({
                    title: "Lesson added successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error adding lesson.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Error adding lesson.",
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
                    {/* Lesson Name Input & Create Button */}
                    <Flex mb="4" justify="space-between" align="center">
                        <Tabs variant="soft-rounded" colorScheme="gray">
                            <TabList>
                                <Tab>Text lesson</Tab>
                            </TabList>
                        </Tabs>
                        <Input
                            value={lessonName}
                            onChange={(e) => setLessonName(e.target.value)}
                            placeholder="Enter lesson name"
                            width="50%"
                            mx="4"
                        />
                        <Button colorScheme="blue" onClick={handleSubmit}>Create</Button>
                    </Flex>

                    <Tabs variant="soft-rounded" colorScheme="gray">
                        <TabPanels>
                            <TabPanel>
                                {/* Lesson Tab Content */}
                                <Box>
                                    {/* Lesson Duration */}
                                    <FormControl mb="4">
                                        <FormLabel>Lesson duration</FormLabel>
                                        <Input
                                            value={lessonDuration}
                                            onChange={(e) => setLessonDuration(e.target.value)}
                                            placeholder="Enter lesson duration"
                                        />
                                    </FormControl>

                                    {/* Lesson Preview Switch */}
                                    <FormControl display="flex" alignItems="center" mb="4">
                                        <Switch
                                            id="preview-switch"
                                            isChecked={isPreviewEnabled}
                                            onChange={() => setPreviewEnabled(!isPreviewEnabled)}
                                            mr="2"
                                        />
                                        <FormLabel htmlFor="preview-switch" mb="0">
                                            Lesson preview (Everyone can see this lesson)
                                        </FormLabel>
                                    </FormControl>

                                    {/* Lesson Start Date & Time */}
                                    <Grid templateColumns="repeat(2, 1fr)" gap={6} mb="4">
                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>Lesson start date</FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        placeholder="yyyy/mm/dd"
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                    />
                                                    <InputRightElement>
                                                        <IconButton
                                                            aria-label="calendar"
                                                            icon={<FaCalendarAlt />}
                                                            variant="ghost"
                                                        />
                                                    </InputRightElement>
                                                </InputGroup>
                                            </FormControl>
                                        </GridItem>

                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>Lesson start time</FormLabel>
                                                <InputGroup>
                                                    <Input
                                                        placeholder="--:-- --"
                                                        value={startTime}
                                                        onChange={(e) => setStartTime(e.target.value)}
                                                    />
                                                    <InputRightElement>
                                                        <IconButton
                                                            aria-label="clock"
                                                            icon={<FaClock />}
                                                            variant="ghost"
                                                        />
                                                    </InputRightElement>
                                                </InputGroup>
                                            </FormControl>
                                        </GridItem>
                                    </Grid>

                                    {/* Short Description of the Lesson */}
                                    <FormControl mb="4">
                                        <FormLabel>Short description of the lesson</FormLabel>
                                        <Textarea
                                            placeholder="Enter a short description..."
                                            value={lessonDescription}
                                            onChange={(e) => setLessonDescription(e.target.value)}
                                            rows={6}
                                        />
                                    </FormControl>

                                    {/* Lesson Content */}
                                    <FormControl mb="4">
                                        <FormLabel>Lesson content</FormLabel>
                                        <Textarea
                                            placeholder="Enter lesson content..."
                                            value={lessonContent}
                                            onChange={(e) => setLessonContent(e.target.value)}
                                            rows={6}
                                        />
                                    </FormControl>
                                </Box>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Box>
        </ChakraProvider>
    );
};

export default LessonForm;