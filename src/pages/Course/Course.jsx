import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const CourseForm = () => {
    const [courseName, setCourseName] = useState('');
    const [category, setCategory] = useState('');
    const [level, setLevel] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [isPublish, setIsPublish] = useState(false);
    const navigate = useNavigate();
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleCreateCourse = async () => {
        // Dữ liệu sẽ được gửi lên server
        const courseData = {
            title: courseName,
            category,
            level,
            imageUrl: image,
            duration: parseInt(duration),
            description,
            isPublish,
            createdBy: 'John Doe', // Giả sử người tạo là John Doe
            sections: [] // Mặc định là danh sách rỗng
        };

        try {
            // Gửi yêu cầu POST lên API
            const response = await axios.post('http://localhost:8080/courses', courseData);

            // Xử lý khi thêm khóa học thành công
            console.log('Course added successfully:', response.data);
            navigate('/section');
        } catch (error) {
            // Xử lý khi có lỗi xảy ra
            console.error('Error adding course:', error);
        }
    };

    return (
        <ChakraProvider>
            <Box p="8" maxW="600px" mx="auto">

                {/* Course Name */}
                <FormControl mb="4">
                    <FormLabel>Course name</FormLabel>
                    <Input
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="Enter course name"
                    />
                </FormControl>

                {/* Course Publish Switch */}
                <FormControl display="flex" alignItems="center" mb="4">
                    <Switch
                        id="publish-switch"
                        mr="2"
                        isChecked={isPublish}
                        onChange={() => setIsPublish(!isPublish)}
                    />
                    <FormLabel htmlFor="publish-switch" mb="0">
                        Course publish (Everyone can see this course)
                    </FormLabel>
                </FormControl>

                {/* Category */}
                <Flex mb="4">
                    <FormControl flex="1">
                        <FormLabel>Category</FormLabel>
                        <Select
                            placeholder="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
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

                {/* Level */}
                <FormControl mb="4">
                    <FormLabel>Level</FormLabel>
                    <Select
                        placeholder="Select level"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
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
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                </FormControl>

                {/* Image Upload */}
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
                        {image ? (
                            <Image src={image} alt="Course" boxSize="150px" mx="auto" />
                        ) : (
                            <VStack>
                                <Box boxSize="50px">
                                    <Image
                                        src="https://via.placeholder.com/50"
                                        alt="Placeholder"
                                    />
                                </Box>
                                <Text>Drag and drop an image or upload it from your computer</Text>
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormControl>

                {/* Create Button */}
                <Button colorScheme="blue" width="100%" onClick={handleCreateCourse}>
                    Create
                </Button>
            </Box>
        </ChakraProvider>
    );
};

export default CourseForm;
