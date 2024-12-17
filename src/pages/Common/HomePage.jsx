import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Avatar,
  Icon,
} from '@chakra-ui/react';
import {
  FaUser,
  FaEye,
  FaStar,
  FaQuoteRight,
  FaClock,
  FaGlobe,
  FaBook,
} from 'react-icons/fa';
import CourseCard from '~/components/Student/Search/CourseCard';
import courseStatisticsService from '~/services/courseStatisticsService';
import { useNavigate } from 'react-router-dom';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseStatisticsService.getTopCourse();
        setCourses(response.content || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <RoleBasedPageLayout>
      <Box>
        {/* Hero Section */}
        <Flex
          bgImage="url('https://masterstudy.stylemixthemes.com/lms-plugin/wp-content/uploads/sites/26/2022/05/Mask-Group-29-1-1.jpg')"
          bgSize="cover"
          bgPosition="center"
          color="white"
          p={10}
          alignItems="center"
          justifyContent="space-between"
          height="80vh"
          borderBottomLeftRadius="80px"
        >
          <Box maxW="700px" pl={40}>
            <Heading fontSize="5xl" mb={4}>
              Start Investing in Your Future Today
            </Heading>
            <Text fontSize="xl" mb={6}>
              Explore over 1300 English courses, from beginner to advanced levels, taught by top experts and prestigious universities.
              Enhance your communication skills to excel in your career, studies abroad, and daily life.
            </Text>
          </Box>
        </Flex>

        {/* Popular Courses Section */}
        <Box p={10} bg="gray.50">
          <Heading fontSize="3xl" mb={6} textAlign="center">
            Popular Courses
          </Heading>
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPreview={() => navigate(`/course-view-detail/${course.id}`)}
                onHover={setHoveredCourseId}
                isHovered={hoveredCourseId === course.id}
              />
            ))}
          </SimpleGrid>
        </Box>

        {/* Call to Action Section */}
        <Flex
          p={0} // Xóa padding thừa
          bg="gray.100"
          alignItems="center"
          justifyContent="space-between"
          borderRadius="0" // Bo góc nhẹ
          height="100vh" // Đảm bảo chiều cao cân đối
        >
          {/* Phần ảnh */}
          <Box flex="1">
            <Image
              src="https://masterstudy.stylemixthemes.com/lms-plugin/wp-content/uploads/sites/26/2022/05/Image_27-1-1.jpeg"
              alt="CTA"
              boxSize="full"
              objectFit="cover"
              height="100vh"
            />
          </Box>

          {/* Phần nội dung */}
          <Box
            flex="1"
            p={10} // Thêm padding trong phần text
            bg="white"
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Heading fontSize="3xl" mb={4} marginLeft="100px">
              Pick a Course That Makes Your Life
            </Heading>
            <Text
              marginLeft="100px"
              fontSize="lg"
              mb={6}
              color="gray.600"
              maxWidth="500px"
            >
              Looking for your next favorite course? Find our freshest content
              here. Discover new horizons. Gain knowledge that makes a
              mind-blowing change in your life. Ready? Let’s get started!
            </Text>
            <Button
              marginLeft="100px"
              colorScheme="blue"
              size="lg"
              width="fit-content"
              onClick={() => navigate('/search')}
            >
              VIEW ALL COURSES
            </Button>
          </Box>
        </Flex>
        {/*<Box bg="gray.50" py={20} px={4} textAlign="center" marginTop={5}>*/}
        {/*  <VStack spacing={4} maxW="800px" mx="auto">*/}
        {/*    <Icon as={FaQuoteRight} color="blue.500" boxSize={12} mb={2} />*/}
        {/*    <Heading fontSize="3xl" fontWeight="bold" color="gray.800">*/}
        {/*      What Students Say*/}
        {/*    </Heading>*/}
        {/*    <HStack spacing={1} justifyContent="center">*/}
        {/*      {[...Array(5)].map((_, index) => (*/}
        {/*        <Icon key={index} as={FaStar} color="yellow.400" boxSize={6} />*/}
        {/*      ))}*/}
        {/*    </HStack>*/}
        {/*    <Text*/}
        {/*      fontSize="lg"*/}
        {/*      color="gray.600"*/}
        {/*      lineHeight="tall"*/}
        {/*      maxWidth="700px"*/}
        {/*    >*/}
        {/*      "Learning with EasyEnglish has truly transformed my language skills! The courses are engaging,*/}
        {/*      and the instructors are incredibly knowledgeable. Since joining,*/}
        {/*      I've gained so much confidence in speaking and understanding English.*/}
        {/*      I’ve already recommended EasyEnglish to my friends and colleagues,*/}
        {/*      and the feedback has been overwhelmingly positive.*/}
        {/*      This is truly the best place to learn English*/}
        {/*      and improve your communication for both professional and personal growth."*/}
        {/*    </Text>*/}
        {/*    <HStack spacing={6} mt={6}>*/}
        {/*      <Avatar*/}
        {/*        src="https://randomuser.me/api/portraits/men/1.jpg"*/}
        {/*        name="Student 1"*/}
        {/*      />*/}
        {/*      <Avatar*/}
        {/*        src="https://randomuser.me/api/portraits/men/2.jpg"*/}
        {/*        name="Student 2"*/}
        {/*      />*/}
        {/*      <Avatar*/}
        {/*        src="https://randomuser.me/api/portraits/women/1.jpg"*/}
        {/*        name="Student 3"*/}
        {/*      />*/}
        {/*    </HStack>*/}
        {/*  </VStack>*/}
        {/*</Box>*/}
        {/* Why Choose Us Section */}
        <Box p={10} bg="white">
          <Flex
            justify="space-between"
            align="center"
            direction={['column', 'row']}
          >
            {/* Phần nội dung văn bản */}
            <Box flex="1" marginLeft="100px">
              <Heading fontSize="3xl" mb={4} color="gray.800">
                Why Choose Us
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="500px" mb={6}>
                MasterStudy is committed to helping students achieve their goals
                by providing an innovative environment and making a difference.
              </Text>

              <VStack align="start" spacing={6}>
                {/* Feature 1 */}
                <HStack spacing={4}>
                  <Box
                    bg="blue.500"
                    boxSize="50px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaGlobe} boxSize={6} color="white" />
                  </Box>
                  <Box>
                    <Heading fontSize="lg" color="gray.800">
                      Learn from the Best
                    </Heading>
                    <Text fontSize="sm" color="gray.600" maxW="500px">
                      Certificate courses are instructed by experienced and
                      qualified instructors with Ph.D. and Masters' degrees.
                    </Text>
                  </Box>
                </HStack>

                {/* Feature 2 */}
                <HStack spacing={4}>
                  <Box
                    bg="blue.500"
                    boxSize="50px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaBook} boxSize={6} color="white" />
                  </Box>
                  <Box>
                    <Heading fontSize="lg" color="gray.800">
                      Set Your Own Learning Pace
                    </Heading>
                    <Text fontSize="sm" color="gray.600" maxW="500px">
                      If you're a busy parent or professional, find an online
                      program that works around your schedule.
                    </Text>
                  </Box>
                </HStack>

                {/* Feature 3 */}
                <HStack spacing={4}>
                  <Box
                    bg="blue.500"
                    boxSize="50px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaClock} boxSize={6} color="white" />
                  </Box>
                  <Box>
                    <Heading fontSize="lg" color="gray.800">
                      Graduate in Less Than a Year
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      Get your degree quickly and start writing your success
                      story now.
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>

            {/* Phần hình ảnh */}
            <Box flex="1" display="flex" justifyContent="center" mt={[8, 0]}>
              <Image
                src="https://masterstudy.stylemixthemes.com/lms-plugin/wp-content/uploads/sites/26/2022/05/Image_29-1-1.png"
                alt="Why Choose Us"
                borderRadius="md"
                boxShadow="lg"
                objectFit="cover" // Đảm bảo ảnh không bị méo khi thay đổi kích thước
                height="100vh" // Đặt chiều cao của ảnh bằng với chiều cao màn hình
              />
            </Box>
          </Flex>
        </Box>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default Home;
