import React, { useEffect, useState } from 'react';
import { Box, Text, Image } from '@chakra-ui/react';
import courseService from '~/services/courseService';

const Description = ({ courseId }) => {
    const [course, setCourse] = useState(null);

    const fetchCourseDetails = async () => {
        const response = await courseService.fetchMainCourse({ id: courseId }); // Sử dụng courseId từ props
        if (response) {
            setCourse(response);
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    if (!course) {
        return <Text>Loading...</Text>;
    }

    return (
        <Box mt={4}>
            {/* Course Image and Description Section */}
            <Box position="relative" mb={6}>
                <Image
                    src={course.imagePreview} // Sử dụng imagePreview từ API
                    alt="Course banner"
                    borderRadius="md"
                    w="100%"
                    h="auto"
                />
            </Box>

            {/* Course Description with dangerouslySetInnerHTML */}
            <Box
                w="100%"
                maxW="800px"
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="md"
                dangerouslySetInnerHTML={{ __html: course.description }} // Hiển thị nội dung đã lưu
            />
        </Box>
    );
};

export default Description;
