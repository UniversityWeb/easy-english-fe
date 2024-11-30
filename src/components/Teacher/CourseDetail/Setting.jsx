import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Switch,
  Textarea,
  Text,
  Select as ChakraSelect,
  Image,
  Flex,
  Heading,
} from '@chakra-ui/react';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import courseService from '~/services/courseService';
import categoryService from '~/services/categoryService';
import topicService from '~/services/topicService';
import levelService from '~/services/levelService';
import { getUsername } from '~/utils/authUtils';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import useCustomToast from '~/hooks/useCustomToast';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

const Setting = React.memo(({ courseId }) => {
  const navigate = useNavigate();
  const username = getUsername();
  const [course, setCourse] = useState({
    title: '',
    categoryIds: [],
    levelId: '',
    topicId: '',
    description: '',
    descriptionPreview: '',
    duration: '',
    isPublish: true,
    createdBy: 'admin',
    imagePreview: '',
    videoPreview: '',
  });

  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [levels, setLevels] = useState([]);
  const [imageFile, setImageFile] = useState(null); // Store the actual image file
  const [videoFile, setVideoFile] = useState(null); // Store the actual video file
  const { successToast, errorToast } = useCustomToast();

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
        console.error('Error fetching categories or topics.', error);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch course data if courseId is provided
  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const courseRequest = { id: courseId };
          const data = await courseService.fetchMainCourse(courseRequest);

          setCourse({
            title: data.title,
            categoryIds: data.categories.map((category) => category.id),
            topicId: data.topic.id,
            levelId: data.level.id,
            description: data.description,
            descriptionPreview: data.descriptionPreview,
            duration: data.duration,
            isPublish: data.isPublish,
            createdBy: data.createdBy,
            imagePreview: data.imagePreview,
            videoPreview: data.videoPreview,
          });

          if (data.topic.id) {
            const levels = await levelService.fetchAllLevelByTopic({
              topicId: data.topic.id,
            });
            setLevels(levels || []);
          }
        } catch (error) {
          console.error('Error fetching course data.', error);
        }
      };

      fetchCourseData();
    }
  }, [courseId]);

  // Handle topic change and fetch levels
  const handleTopicChange = async (e) => {
    const selectedTopicId = e.target.value;
    setCourse({ ...course, topicId: selectedTopicId, levelId: '' });

    try {
      const fetchedLevels = await levelService.fetchAllLevelByTopic({
        topicId: selectedTopicId,
      });
      setLevels(fetchedLevels || []);
    } catch (error) {
      console.error('Error fetching levels for the selected topic.', error);
    }
  };

  // Handle category selection changes
  const handleCategoryChange = (selectedOptions) => {
    const selectedCategoryIds = selectedOptions.map((option) => option.value);
    setCourse({ ...course, categoryIds: selectedCategoryIds });
  };

  const handleDescriptionChange = (content) => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      description: content,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setCourse((prevCourse) => ({
        ...prevCourse,
        imagePreview: imagePreview,
      }));
      setImageFile(file); // Store the actual image file
    }
  };

  const handleRemoveImage = () => {
    setCourse((prevCourse) => ({
      ...prevCourse,
      imagePreview: '',
    }));
    setImageFile(null); // Reset the image file
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoPreview = URL.createObjectURL(file);
      setCourse((prevCourse) => ({
        ...prevCourse,
        videoPreview: videoPreview,
      }));
      setVideoFile(file); // Store the actual video file
    }
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('ownerUsername', username);
    formData.append('title', course.title);
    formData.append('description', course.description);
    formData.append('descriptionPreview', course.descriptionPreview);
    formData.append('duration', course.duration);
    formData.append('isPublish', course.isPublish);
    formData.append('imagePreview', course.imagePreview);
    formData.append('videoPreview', course.videoPreview);
    course.categoryIds.forEach((id) => {
      formData.append('categoryIds', id); // Thêm từng categoryId vào FormData
    });
    formData.append('topicId', course.topicId);
    formData.append('levelId', course.levelId);
    formData.append('createdBy', course.createdBy);

    if (videoFile) {
      formData.append('video', videoFile);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (courseId) {
        formData.append('id', courseId);
        await courseService.updateCourse(formData);
        successToast('Course updated successfully.');
        console.log('Course updated successfully.');
      } else {
        const newCourse = await courseService.createCourse(formData);
        const newCourseId = newCourse.id;
        console.log('newCourseId', newCourseId);
        successToast('Course created successfully.');
        console.log('Course created successfully.');

        navigate(config.routes.course_detail(newCourseId));
      }
    } catch (error) {
      errorToast('Error saving course.');
      console.error('Error saving course.', error);
    }
  };

  return (
    <Box pb={10} maxW="600px" mx="auto">
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
          onChange={() =>
            setCourse({ ...course, isPublish: !course.isPublish })
          }
        />
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Category</FormLabel>
        <Select
          isMulti
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          value={categories
            .filter((category) => course.categoryIds.includes(category.id))
            .map((category) => ({
              value: category.id,
              label: category.name,
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
                '.overlay': { opacity: 1 },
                '.remove-btn': { opacity: 1 },
              }}
            >
              <video
                src={course.videoPreview}
                controls
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box
                className="overlay"
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                backgroundColor="rgba(0, 0, 0, 0.5)"
                opacity="0"
                transition="opacity 0.3s ease"
              />
              <Flex
                className="remove-btn"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                opacity="0"
                transition="opacity 0.3s ease"
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
              height="100%"
              onClick={() => document.getElementById('videoUpload').click()}
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Text>Drag and drop a video or upload it from your computer</Text>
              <Button mt="2" colorScheme="blue">
                Upload a video
              </Button>
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
                '.overlay': { opacity: 1 },
                '.remove-btn': { opacity: 1 },
              }}
            >
              <Image
                src={course.imagePreview}
                alt="Course Image"
                width="100%"
                height="100%"
                objectFit="cover"
              />
              <Box
                className="overlay"
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                backgroundColor="rgba(0, 0, 0, 0.5)"
                opacity="0"
                transition="opacity 0.3s ease"
              />
              <Flex
                className="remove-btn"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                opacity="0"
                transition="opacity 0.3s ease"
                justifyContent="center"
                alignItems="center"
              >
                <Button onClick={handleRemoveImage} colorScheme="blue">
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
              height="100%"
              onClick={() => document.getElementById('imageUpload').click()}
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Text>
                Drag and drop an image or upload it from your computer
              </Text>
              <Button mt="2" colorScheme="blue">
                Upload an image
              </Button>
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
          onChange={(e) =>
            setCourse({ ...course, descriptionPreview: e.target.value })
          }
        />
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Description</FormLabel>
        <Box
          sx={{
            '.quill': {
              height: '270px',
              display: 'flex',
              flexDirection: 'column',
            },
            '.ql-container': {
              height: '220px',
              marginBottom: '20px',
            },
          }}
        >
          <ReactQuill
            value={course.description}
            onChange={handleDescriptionChange}
            theme="snow"
            placeholder="Enter your description here..."
          />
        </Box>
      </FormControl>

      <Button colorScheme="blue" width="100%" onClick={handleSubmit}>
        {courseId ? 'Update Course' : 'Create Course'}
      </Button>
    </Box>
  );
});

export default Setting;
