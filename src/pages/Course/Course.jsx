import React, { useState, useEffect } from 'react';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, SimpleGrid, Button, Heading, Flex, Text } from '@chakra-ui/react';
import CourseCard from './CourseCard';
import { getToken } from '~/utils/authUtils';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = getToken();
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8001/courses/getAllCourse', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [token]);

    return (
        <Box p={5} mx="100px">
            <Flex justify="space-between" align="center" mb={5}>
                <Heading as="h1" size="lg">Courses</Heading>
                <Button onClick={() => navigate('/maincourse')} colorScheme="blue" borderRadius="full" px={6}>+ Add New Course</Button>
            </Flex>

            <Tabs variant="enclosed">
                <TabList>
                    <Tab>All</Tab>
                    <Tab>Published</Tab>
                    <Tab>In Draft</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        {loading ? <Text>Loading...</Text> : (
                            <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={10}>
                                {courses.map((course) => (
                                    <CourseCard key={course.id} course={course} onMakeFeatured={() => navigate(`/curriculum/${course.id}`)} />
                                ))}
                            </SimpleGrid>
                        )}
                    </TabPanel>
                    <TabPanel>
                        {loading ? <Text>Loading...</Text> : (
                            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={5}>
                                {courses.filter((course) => course.price !== 0).map((course) => (
                                    <CourseCard key={course.id} course={course} onMakeFeatured={() => navigate(`/curriculum/${course.id}`)} />
                                ))}
                            </SimpleGrid>
                        )}
                    </TabPanel>
                    <TabPanel>
                        <Text>No courses in draft.</Text>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default Courses;