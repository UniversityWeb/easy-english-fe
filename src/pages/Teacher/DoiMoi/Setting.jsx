import React, { useState } from 'react';
import {
    ChakraProvider,
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    Switch,
    Textarea,
    VStack,
    Text,
    Select as ChakraSelect,
    Image,
    IconButton,
    Flex
} from '@chakra-ui/react';
import Select from 'react-select';
import { AiOutlineCloudUpload, AiOutlineDelete } from 'react-icons/ai'; // Icons for upload and delete
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const Setting = ({ courseId }) => {
    const [course, setCourse] = useState({
        title: 'English Basics',
        categoryIds: ['1', '2'],
        levelId: '3',
        topicId: '1',
        description: '',  // Quill's content
        descriptionPreview: 'Learn the basics of English language',
        duration: '3 hours',
        isPublish: true,
        isActive: true,
        createdBy: 'admin',
        imagePreview: 'https://res.cloudinary.com/dnhvlncfw/image/upload/v1728881932/cld-sample-3.jpg',  // Initially, no image preview
        videoPreview: '',  // Initially, no video preview
    });

    const [categories] = useState([
        { id: '1', name: 'Language' },
        { id: '2', name: 'Grammar' },
    ]);
    const [topics] = useState([
        { id: '1', name: 'IELTS' },
        { id: '2', name: 'TOEIC' },
    ]);
    const [levels, setLevels] = useState([
        { id: '3', name: 'Beginner' },
        { id: '4', name: 'Intermediate' },
    ]);

    // Handle topic selection and update levels accordingly
    const handleTopicChange = (e) => {
        const selectedTopicId = e.target.value;
        setCourse({ ...course, topicId: selectedTopicId, levelId: '' });

        if (selectedTopicId === '1') {
            setLevels([{ id: '3', name: 'Beginner' }, { id: '4', name: 'Intermediate' }]);
        } else {
            setLevels([{ id: '5', name: 'Advanced' }]);
        }
    };

    // Handle category selection changes
    const handleCategoryChange = (selectedOptions) => {
        const selectedCategoryIds = selectedOptions.map(option => option.value);
        setCourse({ ...course, categoryIds: selectedCategoryIds });
    };

    // Handle ReactQuill description change with a proper state update
    const handleDescriptionChange = (content) => {
        setCourse(prevCourse => ({
            ...prevCourse,
            description: content
        }));
    };

    // Handle image file upload and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCourse(prevCourse => ({
                ...prevCourse,
                imagePreview: imageUrl
            }));
        }
    };

    // Handle image removal
    const handleRemoveImage = () => {
        setCourse(prevCourse => ({
            ...prevCourse,
            imagePreview: ''
        }));
    };

    // Handle video file upload and preview
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const videoUrl = URL.createObjectURL(file);
            setCourse(prevCourse => ({
                ...prevCourse,
                videoPreview: videoUrl
            }));
        }
    };

    return (
        <ChakraProvider>
            <Box p="8" maxW="600px" mx="auto">
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
                    <Box position="relative" width="100%" height="250px" mx="auto">
                        {course.videoPreview ? (
                            <Box
                                position="relative"
                                width="100%"
                                height="100%"
                                cursor="pointer"
                                overflow="hidden"
                                _hover={{
                                    '.overlay': { opacity: 1 }, // Show overlay on hover
                                    '.remove-btn': { opacity: 1 }, // Show button on hover
                                }}
                            >
                                {/* Video */}
                                <video
                                    src={course.videoPreview}
                                    controls
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />

                                {/* Dark overlay when hovering */}
                                <Box
                                    className="overlay"
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    width="100%"
                                    height="100%"
                                    backgroundColor="rgba(0, 0, 0, 0.5)" // Dark overlay effect
                                    opacity="0"
                                    transition="opacity 0.3s ease" // Smooth transition
                                />

                                {/* Remove button */}
                                <Flex
                                    className="remove-btn"
                                    position="absolute"
                                    top="50%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    opacity="0"
                                    transition="opacity 0.3s ease" // Smooth transition
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Button
                                        onClick={() => setCourse({ ...course, videoPreview: '' })}
                                        colorScheme="blue"
                                    >
                                        Remove
                                    </Button>
                                </Flex>
                            </Box>
                        ) : (
                            <Flex
                                border="2px dashed gray"
                                p="4"
                                textAlign="center"
                                cursor="pointer"
                                height="100%" // To maintain height
                                onClick={() => document.getElementById('videoUpload').click()}
                                justifyContent="center" // Center horizontally
                                alignItems="center" // Center vertically
                                flexDirection="column" // Stack elements vertically
                            >
                                <Text>Drag and drop a video or upload it from your computer</Text>
                                <Button mt="2" colorScheme="blue">Upload a video</Button>
                                <Input
                                    id="videoUpload"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    display="none"
                                />
                            </Flex>
                        )}
                    </Box>
                </FormControl>

                <FormControl mb="4">
                    <FormLabel>Image</FormLabel>
                    <Box position="relative" width="100%" height="250px" mx="auto">
                        {course.imagePreview ? (
                            <Box
                                position="relative"
                                width="100%"
                                height="100%"
                                cursor="pointer"
                                overflow="hidden"
                                _hover={{
                                    '.overlay': { opacity: 1 }, // Show overlay on hover
                                    '.remove-btn': { opacity: 1 }, // Show button on hover
                                }}
                            >
                                {/* Image */}
                                <Image
                                    src={course.imagePreview}
                                    alt="Course Image"
                                    width="100%"
                                    height="100%"
                                    objectFit="cover"
                                />

                                {/* Dark overlay when hovering */}
                                <Box
                                    className="overlay"
                                    position="absolute"
                                    top="0"
                                    left="0"
                                    width="100%"
                                    height="100%"
                                    backgroundColor="rgba(0, 0, 0, 0.5)" // Dark overlay effect
                                    opacity="0"
                                    transition="opacity 0.3s ease" // Smooth transition
                                />

                                {/* Remove button */}
                                <Flex
                                    className="remove-btn"
                                    position="absolute"
                                    top="50%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    opacity="0"
                                    transition="opacity 0.3s ease" // Smooth transition
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Button
                                        onClick={handleRemoveImage}
                                        colorScheme="blue"
                                    >
                                        Remove
                                    </Button>
                                </Flex>
                            </Box>
                        ) : (
                            <Flex
                                border="2px dashed gray"
                                p="4"
                                textAlign="center"
                                cursor="pointer"
                                height="100%" // To maintain height
                                onClick={() => document.getElementById('imageUpload').click()}
                                justifyContent="center" // Center horizontally
                                alignItems="center" // Center vertically
                                flexDirection="column" // Stack elements vertically
                            >
                                <Text>Drag and drop an image or upload it from your computer</Text>
                                <Button mt="2" colorScheme="blue">Upload an image</Button>
                                <Input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    display="none"
                                />
                            </Flex>
                        )}
                    </Box>
                </FormControl>

                <FormControl mb="4">
                    <FormLabel>Description preview</FormLabel>
                    <Textarea
                        placeholder="Enter a short description preview..."
                        rows={6}
                        value={course.descriptionPreview}
                        onChange={(e) => setCourse({ ...course, descriptionPreview: e.target.value })}
                    />
                </FormControl>

                <FormControl mb="4">
                    <FormLabel>Description</FormLabel>
                    <Box sx={{
                        '.quill': {
                            height: "270px",  // Increase height
                            display: 'flex',
                            flexDirection: 'column'
                        },
                        '.ql-container': {
                            height: "220px",  // Editor height
                            marginBottom: "20px" // Add bottom margin
                        }
                    }}>
                        <ReactQuill
                            value={course.description}
                            onChange={handleDescriptionChange}
                            theme="snow"
                            placeholder="Enter your description here..."
                        />
                    </Box>
                </FormControl>

                <Button colorScheme="blue" width="100%" >
                    {courseId ? 'Update Course' : 'Create Course'}
                </Button>
            </Box>
        </ChakraProvider>
    );
};

export default Setting;