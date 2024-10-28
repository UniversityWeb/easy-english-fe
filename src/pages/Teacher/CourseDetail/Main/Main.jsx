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
    Select as ChakraSelect,
} from '@chakra-ui/react';
import Select from 'react-select';  // For category selection
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
        categoryIds: [],
        levelId: '',
        topicId: '',
        description: '',
        duration: '',
        isPublish: false,
        isActive: true,
        createdBy: username,
    });

    const [video, setVideo] = useState(null); // For video upload
    const [image, setImage] = useState(null); // For image upload

    const { successToast, errorToast } = useCustomToast();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [topics, setTopics] = useState([]);
    const [levels, setLevels] = useState([]);

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

    useEffect(() => {
        if (courseId) {
            const courseRequest = { id: courseId };
            const fetchCourseData = async () => {
                setLoading(true);
                try {
                    const data = await courseService.fetchMainCourse(courseRequest);

                    setCourse({
                        title: data.title,
                        categoryIds: data.categoryIds,
                        topicId: data.topicId,
                        levelId: data.levelId,
                        description: data.description,
                        duration: data.duration,
                        isPublish: data.isPublish,
                        createdBy: data.createdBy,
                        isActive: data.isActive,
                    });

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

    const handleTopicChange = async (e) => {
        const selectedTopicId = e.target.value;
        setCourse({ ...course, topicId: selectedTopicId, levelId: '' });

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

    const handleVideoChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setVideo(selectedFile); // Save the video file
        }
    };

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setImage(selectedFile); // Save the image file
        }
    };

    const handleCreateOrUpdateCourse = async () => {
        const formData = new FormData();
        formData.append('title', course.title);
        formData.append('description', course.description);
        formData.append('duration', course.duration);
        formData.append('isPublish', course.isPublish);
        formData.append('isActive', course.isActive);
        formData.append('createdBy', course.createdBy);
        formData.append('categoryIds', course.categoryIds.join(','));
        formData.append('topicId', course.topicId);
        formData.append('levelId', course.levelId);

        // Append video and image files if available
        if (video) {
            formData.append('video', video); // Send the video file
        }
        if (image) {
            formData.append('image', image); // Send the image file
        }

        try {
            if (courseId) {
                formData.append('id', courseId);
                await courseService.updateCourse(formData);
                successToast("Course updated successfully.");
            } else {
                await courseService.createCourse(formData);
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

                        <FormControl mb="4">
                            <FormLabel>Course publish</FormLabel>
                            <Switch
                                isChecked={course.isPublish}
                                onChange={() => setCourse({ ...course, isPublish: !course.isPublish })}
                            />
                        </FormControl>

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

                        <FormControl mb="4">
                            <FormLabel>Topic</FormLabel>
                            <ChakraSelect
                                placeholder="Select topic"
                                value={course.topicId}
                                onChange={handleTopicChange}
                            >
                                {topics.map((topic) => (
                                    <option key={topic.id} value={topic.id}>
                                        {topic.name}
                                    </option>
                                ))}
                            </ChakraSelect>
                        </FormControl>

                        <FormControl mb="4">
                            <FormLabel>Level</FormLabel>
                            <ChakraSelect
                                placeholder="Select level"
                                value={course.levelId}
                                onChange={(e) => setCourse({ ...course, levelId: e.target.value })}
                                isDisabled={!levels.length}
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
                            <FormLabel>Video</FormLabel>
                            <Input
                                type="file"
                                onChange={handleVideoChange} // Capture the video file
                            />
                        </FormControl>

                        <FormControl mb="4">
                            <FormLabel>Image</FormLabel>
                            <Input
                                type="file"
                                onChange={handleImageChange} // Capture the image file
                            />
                        </FormControl>

                        <FormControl mb="4">
                            <FormLabel>Description</FormLabel>
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