import React, { useEffect, useState } from 'react';
import { ChakraProvider, Box, Text, Flex, Button, Icon, Avatar, Stack, HStack, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { FaClock, FaBook, FaVideo, FaClipboardCheck, FaLevelUpAlt, FaHeart, FaShareAlt, FaStar } from 'react-icons/fa';
import FAQ1 from './FAQ1';
import Reviews from './Reviews';
import Curriculum from './Curriculum';
import Announcement from './Announcement';
import Description from './Description';
import CourseRandom from './CourseRandom';
import RelateCourse from './RelateCourse';
import { useNavigate, useParams } from 'react-router-dom';
import reviewService from '~/services/reviewService'; // Đường dẫn đến service lấy đánh giá
import courseService from '~/services/courseService'; // Đường dẫn đến service lấy khóa học

function CourseDetails() {
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState(null);
    const { courseId } = useParams();

    useEffect(() => {
        const loadCourseData = async () => {
            const response = await courseService.fetchMainCourse({ id: courseId });
            if (response) setCourseData(response);
        };
        loadCourseData();
    }, [courseId]); // Thêm courseId vào dependency array để load lại dữ liệu khi courseId thay đổi

    if (!courseData) return <Text>Loading...</Text>;

    if (!courseData) return <Text>Loading...</Text>;

    return (
        <ChakraProvider>
            <Box maxW="1200px" mx="auto" py={10} px={5}>
                <Flex justify="space-between" direction={['column', 'column', 'row']}>
                    <Box flex="2">
                        {/* Category */}
                        <Text color="gray.500" fontSize="sm">
                            {courseData.topic.name}
                        </Text>

                        {/* Title */}
                        <Text fontSize="3xl" fontWeight="bold" mt={2}>
                            {courseData.title}
                        </Text>

                        {/* Description */}
                        <Text fontSize="md" mt={4} color="gray.600">
                            {courseData.descriptionPreview}
                        </Text>

                        {/* Show less/Show more */}
                        <Text color="blue.500" mt={2} cursor="pointer">Show less</Text>

                        {/* Instructor Info */}
                        <Flex align="center" mt={5}>
                            <Avatar name={courseData.ownerUsername || "Instructor Name"} src="https://bit.ly/ryan-florence" size="lg" />
                            <Box ml={4}>
                                <Text fontWeight="bold">Instructor</Text>
                                <Text color="blue.500">{courseData.ownerUsername || "Instructor Name"}</Text>
                            </Box>
                            <Box ml={10}>
                                <Text fontWeight="bold">{courseData.countStudent}</Text>
                                <Text>Students enrolled</Text>
                            </Box>
                            <Box ml={10}>
                                <Flex align="center">
                                    {/* Hiển thị số sao */}
                                    {[...Array(Math.round(courseData.rating))].map((_, i) => (
                                        <Icon key={i} as={FaStar} color="orange.400" />
                                    ))}
                                    {/* Hiển thị ngôi sao trống nếu cần */}
                                    {[...Array(5 - Math.round(courseData.rating))].map((_, i) => (
                                        <Icon key={i + 5} as={FaStar} color="gray.300" />
                                    ))}
                                    {/* Hiển thị số lượng đánh giá */}
                                    <Text ml={2}>{courseData.ratingCount} review{courseData.ratingCount !== 1 ? 's' : ''}</Text>
                                </Flex>
                            </Box>
                        </Flex>

                        {/* Tabs Section */}
                        <Box mt={10}>
                            <Tabs variant="unstyled">
                                <TabList>
                                    <Tab _selected={{ color: 'blue.500', borderBottom: '2px solid', borderColor: 'blue.500' }}>
                                        Description
                                    </Tab>
                                    <Tab _selected={{ color: 'blue.500', borderBottom: '2px solid', borderColor: 'blue.500' }}>
                                        Curriculum
                                    </Tab>
                                    <Tab _selected={{ color: 'blue.500', borderBottom: '2px solid', borderColor: 'blue.500' }}>
                                        FAQ
                                    </Tab>
                                    <Tab _selected={{ color: 'blue.500', borderBottom: '2px solid', borderColor: 'blue.500' }}>
                                        Announcement
                                    </Tab>
                                    <Tab _selected={{ color: 'blue.500', borderBottom: '2px solid', borderColor: 'blue.500' }}>
                                        Reviews
                                    </Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <Description courseId={courseId} />
                                    </TabPanel>
                                    <TabPanel>
                                        <Curriculum courseId={courseId} />
                                    </TabPanel>
                                    <TabPanel>
                                        <FAQ1 courseId={courseId} />
                                    </TabPanel>
                                    <TabPanel>
                                        <Announcement courseId={courseId} />
                                    </TabPanel>
                                    <TabPanel>
                                        <Reviews courseId={courseId} />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>
                        <Box mt={10}><RelateCourse /></Box>
                    </Box>

                    {/* Right Section */}
                    <Box flex="1" mt={[8, 8, 0]} pl={[0, 0, 10]}>
                        {/* Wishlist and Share */}
                        <Flex justify="space-between" mb={4}>
                            <Button leftIcon={<FaHeart />} variant="ghost" colorScheme="gray">Add to wishlist</Button>
                            <Button leftIcon={<FaShareAlt />} variant="ghost" colorScheme="gray">Share</Button>
                        </Flex>

                        {/* Start Course Button */}
                        <Button
                            colorScheme="blue"
                            size="lg"
                            w="100%"
                            onClick={() => navigate('/course-detail')} // Chuyển hướng về App
                        >
                            START COURSE
                        </Button>

                        {/* Course Details */}
                        <Box mt={6}>
                            <Text fontWeight="bold" fontSize="lg" mb={4}>Course details</Text>
                            <Stack spacing={3}>
                                <HStack>
                                    <Icon as={FaClock} color="gray.500" />
                                    <Text>Duration</Text>
                                    <Text ml="auto" fontWeight="bold">{courseData.duration} hours</Text>
                                </HStack>
                                <HStack>
                                    <Icon as={FaBook} color="gray.500" />
                                    <Text>Lectures</Text>
                                    <Text ml="auto" fontWeight="bold">{courseData.countSection}</Text>
                                </HStack>

                                <HStack>
                                    <Icon as={FaLevelUpAlt} color="gray.500" />
                                    <Text>Level</Text>
                                    <Text ml="auto" fontWeight="bold">{courseData.level.name}</Text>
                                </HStack>
                            </Stack>
                        </Box>
                        <Box mt={6}>
                            <Text fontWeight="bold" fontSize="lg" mb={4}>Related Courses</Text>
                            <CourseRandom />
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </ChakraProvider>
    );
}

export default CourseDetails;
