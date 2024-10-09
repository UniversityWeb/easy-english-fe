import React, { useEffect, useState } from 'react';
import {
    ChakraProvider,
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    Flex,
    Select,
    Textarea,
    IconButton,
    Text,
    VStack,
    Image,
    Switch,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import courseService from '~/services/courseService'; 
import useCustomToast from '~/hooks/useCustomToast';
import { getUsername } from '~/utils/authUtils';
const CourseForm = ({ courseId }) => {
    const username = getUsername();
    const [course, setCourse] = useState({
        title: '',
        category: '',
        level: '',
        imageUrl: null,
        description: '',
        duration: '',
        isPublish: false,
        isActive: true,
        createdBy: username,
    });
    const { successToast, errorToast } = useCustomToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (courseId) {
            const courseRequest = {
                id: courseId
            };
            const fetchCourseData = async () => {
                setLoading(true);
                try {
                    const data = await courseService.fetchMainCourse(courseRequest);
                    setCourse({
                        ...data,
                    });
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

                        <Flex mb="4">
                            <FormControl flex="1">
                                <FormLabel>Category</FormLabel>
                                <Select
                                    placeholder="Category"
                                    value={course.category}
                                    onChange={(e) => setCourse({ ...course, category: e.target.value })}
                                >
                                    <option value="Programming">Programming</option>
                                    <option value="Business">Business</option>
                                </Select>
                            </FormControl>
                            <IconButton
                                aria-label="Add category"
                                icon={<FaPlus />}
                                colorScheme="blue"
                                ml="4"
                                alignSelf="flex-end"
                            />
                        </Flex>

                        <FormControl mb="4">
                            <FormLabel>Level</FormLabel>
                            <Select
                                placeholder="Select level"
                                value={course.level}
                                onChange={(e) => setCourse({ ...course, level: e.target.value })}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </Select>
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
