import React, { useEffect, useState } from 'react';
import {
    ChakraProvider,
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    Switch,
    Textarea,
    Image,
    VStack,
    Text,
    Select as ChakraSelect, // Import Chakra's Select as "ChakraSelect"
} from '@chakra-ui/react';
import Select from 'react-select';  // Import react-select for category
import courseService from '~/services/courseService';
import categoryService from '~/services/categoryService';
import topicService from '~/services/topicService';
import levelService from '~/services/levelService';
import useCustomToast from '~/hooks/useCustomToast';
import { getUsername } from '~/utils/authUtils';

const CourseForm = ({ courseId }) => {
    const username = getUsername();
    const [course, setCourse] = useState({
        title: '',
        categoryIds: [],  // Updated to handle multiple categories
        levelId: '',      // Use levelId instead of level
        topicId: '',      // Use topicId instead of topic
        imageUrl: null,
        description: '',
        duration: '',
        isPublish: false,
        isActive: true,
        createdBy: username,
    });

    const { successToast, errorToast } = useCustomToast();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);
    const [levels, setLevels] = useState([]);

    // Fetch categories and topics on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [fetchedCategories, fetchedTopics] = await Promise.all([
                    categoryService.fetchAllCategory(),
                    topicService.fetchAllTopic(),
                ]);

                setCategories(fetchedCategories || []);
                setTopics(fetchedTopics || []);
            } catch (error) {
                errorToast("Error fetching categories or topics.");
            }
        };

        fetchInitialData();
    }, []);

    // Fetch course data if editing
    useEffect(() => {
        if (courseId) {
            const courseRequest = { id: courseId };
            const fetchCourseData = async () => {
                setLoading(true);
                try {
                    const data = await courseService.fetchMainCourse(courseRequest);

                    setCourse({
                        title: data.title,
                        categoryIds: data.categoryIds, // Handle multiple categories
                        topicId: data.topicId,         // Set topicId
                        levelId: data.levelId,         // Set levelId
                        imageUrl: data.imageUrl,
                        description: data.description,
                        duration: data.duration,
                        isPublish: data.isPublish,
                        createdBy: data.createdBy,
                        isActive: data.isActive,
                    });

                    // Fetch levels based on the topic that was set
                    if (data.topicId) {
                        const levelRequest = { topicId: data.topicId };
                        const fetchedLevels = await levelService.fetchAllLevelByTopic(levelRequest);
                        setLevels(fetchedLevels || []);
                    }

                    successToast("Course data loaded successfully.");
                } catch (error) {
                    errorToast("Error fetching course data.");
                } finally {
                    setLoading(false);
                }
            };
            fetchCourseData();
        }
    }, [courseId]);

    // Fetch levels when a topic is selected
    const handleTopicChange = async (e) => {
        const selectedTopicId = e.target.value;
        setCourse({ ...course, topicId: selectedTopicId, levelId: '' }); // Reset level when topic changes

        try {
            const levelRequest = { topicId: selectedTopicId };
            const fetchedLevels = await levelService.fetchAllLevelByTopic(levelRequest);
            setLevels(fetchedLevels || []);
        } catch (error) {
            errorToast("Error fetching levels for the selected topic.");
        }
    };

    const handleCategoryChange = (selectedOptions) => {
        const selectedCategoryIds = selectedOptions.map(option => option.value);
        setCourse({ ...course, categoryIds: selectedCategoryIds });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCourse({ ...course, imageUrl: URL.createObjectURL(file) });
        }
    };

    const handleCreateOrUpdateCourse = async () => {
        const courseData = {
            ...course,
            duration: parseInt(course.duration),
            isActive: true,
        };

        try {
            if (courseId) {
                await courseService.updateCourse({ id: courseId, ...courseData });
                successToast("Course updated successfully.");
            } else {
                await courseService.createCourse(courseData);
                successToast("Course created successfully.");
            }
        } catch (error) {
            errorToast("Error saving course.");
        }
    };

    return (
        <ChakraProvider>
            <Box p="8" maxW="600px" mx="auto">
                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <>
                        <FormControl mb="4">
                            <FormLabel>Course name</FormLabel>
                            <Input
                                value={course.title}
                                onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                placeholder="Enter course name"
                            />
                        </FormControl>

                        <FormControl display="flex" alignItems="center" mb="4">
                            <Switch
                                id="publish-switch"
                                mr="2"
                                isChecked={course.isPublish}
                                onChange={() => setCourse({ ...course, isPublish: !course.isPublish })}
                            />
                            <FormLabel htmlFor="publish-switch" mb="0">
                                Course publish (Everyone can see this course)
                            </FormLabel>
                        </FormControl>

                        {/* Use react-select for category */}
                        <FormControl mb="4">
                            <FormLabel>Category</FormLabel>
                            <Select
                                isMulti
                                options={categories.map(category => ({
                                    value: category.id,
                                    label: category.name
                                }))}
                                value={categories
                                    .filter(category => course.categoryIds.includes(category.id))
                                    .map(category => ({
                                        value: category.id,
                                        label: category.name
                                    }))}
                                onChange={handleCategoryChange}
                                placeholder="Select categories"
                            />
                        </FormControl>

                        {/* Use Chakra's Select for topic */}
                        <FormControl mb="4">
                            <FormLabel>Topic</FormLabel>
                            <ChakraSelect
                                placeholder="Select topic"
                                value={course.topicId} // This should be the topic ID
                                onChange={handleTopicChange}
                            >
                                {topics.map((topic) => (
                                    <option key={topic.id} value={topic.id}>
                                        {topic.name}
                                    </option>
                                ))}
                            </ChakraSelect>
                        </FormControl>

                        {/* Use Chakra's Select for level */}
                        <FormControl mb="4">
                            <FormLabel>Level</FormLabel>
                            <ChakraSelect
                                placeholder="Select level"
                                value={course.levelId} // This should be the level ID
                                onChange={(e) => setCourse({ ...course, levelId: e.target.value })}
                                isDisabled={!levels.length} // Disable if no levels available
                            >
                                {levels.map((level) => (
                                    <option key={level.id} value={level.id}>
                                        {level.name}
                                    </option>
                                ))}
                            </ChakraSelect>
                        </FormControl>

                        <FormControl mb="4">
                            <FormLabel>Course duration</FormLabel>
                            <Input
                                placeholder="Enter course duration"
                                value={course.duration}
                                onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                            />
                        </FormControl>

                        <FormControl mb="4">
                            <FormLabel>Image</FormLabel>
                            <Box
                                border="2px dashed"
                                borderColor="gray.300"
                                borderRadius="md"
                                p="4"
                                textAlign="center"
                                position="relative"
                                _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                            >
                                {course.imageUrl ? (
                                    <Image src={course.imageUrl} alt="Course" boxSize="150px" mx="auto" />
                                ) : (
                                    <VStack>
                                        <Box boxSize="50px">
                                            <Image
                                                src="https://via.placeholder.com/50"
                                                alt="Placeholder"
                                            />
                                        </Box>
                                        <Text>
                                            Drag and drop an image or upload it from your computer
                                        </Text>
                                    </VStack>
                                )}
                                <Input
                                    type="file"
                                    opacity="0"
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    width="100%"
                                    height="100%"
                                    onChange={handleImageUpload}
                                />
                            </Box>
                        </FormControl>

                        <FormControl mb="4">
                            <FormLabel>Short description of the course</FormLabel>
                            <Textarea
                                placeholder="Enter a short description..."
                                rows={6}
                                value={course.description}
                                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                            />
                        </FormControl>

                        <Button
                            colorScheme="blue"
                            width="100%"
                            onClick={handleCreateOrUpdateCourse}
                        >
                            {courseId ? 'Update Course' : 'Create Course'}
                        </Button>
                    </>
                )}
            </Box>
        </ChakraProvider>
    );
};

export default CourseForm;