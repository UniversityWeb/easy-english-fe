import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Switch,
  Grid,
  GridItem,
  Flex,
  Text,
  Select,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import lessonService from '~/services/lessonService';
import useCustomToast from '~/hooks/useCustomToast';
import VideoPicker from '~/components/VideoPicker';

const VideoLesson = ({ sectionId, id, isNew, onLessonSaved }) => {
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState({
    title: '',
    content: '',
    contentUrl: '',
    description: '',
    duration: '',
    isPreview: false,
    startDate: '',
    startTime: '',
  });
  const [video, setVideo] = useState(null);
  const [sourceType, setSourceType] = useState('MP4');

  const { successToast, errorToast } = useCustomToast();

  useEffect(() => {
    let isMounted = true;

    const fetchLesson = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await lessonService.fetchLessonById({ id });
        if (data && isMounted) {
          setLesson({
            title: data.title || '',
            content: data.content || '',
            contentUrl: data.contentUrl || '',
            description: data.description || '',
            duration: data.duration || '',
            isPreview: data.isPreview || false,
            startDate: data.startDate || '',
            startTime: data.startTime || '',
          });
          successToast('Lesson data fetched successfully');
        }
      } catch (error) {
        if (isMounted) {
          console.error(error?.message);
          errorToast('Error fetching lesson data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!isNew && id) {
      // Fetch existing lesson data
      fetchLesson();
    } else {
      // Initialize new lesson state
      setLesson({
        title: '',
        content: '',
        contentUrl: '',
        description: '',
        duration: '',
        isPreview: false,
        startDate: '',
        startTime: '',
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id, isNew]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (lesson.contentUrl && lesson.contentUrl.startsWith('blob:')) {
        URL.revokeObjectURL(lesson.contentUrl);
      }
    };
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    const formData = {
      ...lesson,
      sectionId,
      type: 'VIDEO',
      ...(sourceType === 'MP4' && video ? { file: video } : {}),
    };

    try {
      let savedLesson;
      if (id) {
        savedLesson = await lessonService.updateLesson({ ...formData, id });
        successToast('Lesson updated successfully');
      } else {
        savedLesson = await lessonService.createLesson(formData);
        successToast('Lesson created successfully');
      }
      if (onLessonSaved) {
        onLessonSaved(savedLesson); // Pass the saved lesson to the parent
      }
    } catch (error) {
      errorToast('Error saving the lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={8} pb={0} shadow="md" borderWidth="1px" width="100%">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <FormControl mb={4}>
            <FormLabel>Lesson Title</FormLabel>
            <Input
              value={lesson.title}
              onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
              placeholder="Enter lesson title"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Source Type</FormLabel>
            <Select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
            >
              <option value="MP4">MP4</option>
              <option value="YouTube">YouTube</option>
            </Select>
          </FormControl>

          {sourceType === 'YouTube' ? (
            <FormControl mb={4}>
              <FormLabel>YouTube Video URL</FormLabel>
              <Input
                value={lesson.contentUrl}
                onChange={(e) =>
                  setLesson({ ...lesson, contentUrl: e.target.value })
                }
                placeholder="Enter YouTube video URL"
              />
            </FormControl>
          ) : (
            <VideoPicker
              title={'Upload Video (MP4)'}
              videoPreview={lesson?.contentUrl}
              setVideoPreview={videoPreview => setLesson({ ...lesson, contentUrl: videoPreview })}
              setVideoFile={setVideo}
            />
          )}

          <FormControl mb={4}>
            <FormLabel>Duration (minutes)</FormLabel>
            <Input
              type="number"
              value={lesson.duration}
              onChange={(e) =>
                setLesson({ ...lesson, duration: e.target.value })
              }
              placeholder="Enter lesson duration"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center" mb={4}>
            <Switch
              id="preview-switch"
              isChecked={lesson.isPreview}
              onChange={(e) =>
                setLesson({ ...lesson, isPreview: e.target.checked })
              }
            />
            <FormLabel htmlFor="preview-switch" ml={2}>
              Enable Preview
            </FormLabel>
          </FormControl>

          <Grid templateColumns="repeat(2, 1fr)" gap={6} display="none">
            <GridItem>
              <FormControl>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={lesson.startDate}
                  onChange={(e) =>
                    setLesson({ ...lesson, startDate: e.target.value })
                  }
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="time"
                  value={lesson.startTime}
                  onChange={(e) =>
                    setLesson({ ...lesson, startTime: e.target.value })
                  }
                />
              </FormControl>
            </GridItem>
          </Grid>

          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={lesson.description}
              onChange={(e) =>
                setLesson({ ...lesson, description: e.target.value })
              }
              placeholder="Enter lesson description"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Content</FormLabel>
            <Box
              sx={{
                '.quill': {
                  height: '270px',
                  display: 'flex',
                  flexDirection: 'column',
                },
                '.ql-container': {
                  height: '350px',
                  marginBottom: '20px',
                },
              }}
            >
              <ReactQuill
                value={lesson.content}
                onChange={(content) => setLesson({ ...lesson, content })}
                theme="snow"
                placeholder="Enter lesson content"
                style={{ height: '420px', marginBottom: '20px' }}
              />
            </Box>
          </FormControl>

          <Box position="sticky" bottom={0} bg="white" p={4} zIndex={5}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={loading}
              >
                {id ? 'Update Lesson' : 'Create Lesson'}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default VideoLesson;
