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
import 'react-quill/dist/quill.snow.css';
import lessonService from '~/services/lessonService';
import useCustomToast from '~/hooks/useCustomToast';
import CustomReactQuill from '~/components/CustomReactQuill';
import AudioPicker from '~/components/AudioPicker';

const AudioLesson = ({ id, sectionId, isNew, onLessonSaved }) => {
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
  const [audio, setAudio] = useState(null);
  const [sourceType, setSourceType] = useState('MP3');

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
  }, [lesson.contentUrl]);

  const handleAudioChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setAudio(selectedFile);
      // Create a preview URL for the audio
      const previewUrl = URL.createObjectURL(selectedFile);
      setLesson({ ...lesson, contentUrl: previewUrl });
    }
  };

  const handleRemoveAudio = () => {
    if (lesson.contentUrl && lesson.contentUrl.startsWith('blob:')) {
      URL.revokeObjectURL(lesson.contentUrl);
    }
    setLesson({ ...lesson, contentUrl: '' });
    setAudio(null);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Construct the formData object
    const formData = {
      ...lesson,
      sectionId,
      type: 'AUDIO',
      ...(sourceType === 'MP3' && audio ? { file: audio } : {}),
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={5} pb={0} shadow="md" borderWidth="1px" width="100%">
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
              <option value="MP3">MP3</option>
              <option value="YouTube">URL</option>
            </Select>
          </FormControl>

          {sourceType === 'YouTube' ? (
            <FormControl mb={4}>
              <FormLabel>Audio URL</FormLabel>
              <Input
                value={lesson.contentUrl}
                onChange={(e) =>
                  setLesson({ ...lesson, contentUrl: e.target.value })
                }
                placeholder="Enter audio URL"
              />
            </FormControl>
          ) : (
            <AudioPicker
              title={'Upload Audio (MP3)'}
              audioPreview={lesson?.contentUrl}
              setAudioPreview={audioPreview => setLesson({ ...lesson, contentUrl: audioPreview })}
              setAudioFile={setAudio}
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

          <FormControl mb={10}>
            <FormLabel>Content</FormLabel>
            <CustomReactQuill
              value={lesson.content}
              onChange={(content) => setLesson({ ...lesson, content })}
              height={'320px'}
            />
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

export default AudioLesson;
