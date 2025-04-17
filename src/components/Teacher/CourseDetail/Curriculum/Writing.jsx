import React, { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
} from '@chakra-ui/react';
import useCustomToast from '~/hooks/useCustomToast';
import writingService from '~/services/writingService';

const Writing = ({
  id,
  sectionId,
  ordinalNumber,
  testId,
  isNew,
  onTestSaved,
}) => {
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [writing, setWriting] = useState({
    title: '',
    instructions: '',
    level: 'INTERMEDIATE',
    startDate: '',
    endDate: '',
  });
  const { successToast, errorToast } = useCustomToast();

  const validate = () => {
    const newErrors = {};

    if (!writing.title) {
      newErrors.title = 'Title is required';
    }

    if (!writing.instructions) {
      newErrors.instructions = 'Instructions is required';
    }

    if (!writing.level) {
      newErrors.level = 'Level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      errorToast('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Construct the formData object
    const formData = {
      ...writing,
      sectionId,
    };

    try {
      let savedWriting;
      if (id) {
        savedWriting = await writingService.updateWriting({ ...formData, id });
        successToast('Lesson updated successfully');
      } else {
        savedWriting = await writingService.createWriting(formData);
        successToast('Lesson created successfully');
      }
      //   if (onLessonSaved) {
      //     onLessonSaved(savedWriting); // Pass the saved lesson to the parent
      //   }
    } catch (error) {
      errorToast('Error saving the lesson');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} paddingBottom={0} shadow="md" borderWidth="1px">
      <Tabs variant="enclosed" isFitted>
        <TabList>
          <Tab>Đề</Tab>
          <Tab>Kết quả</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box p={5} pb={0} shadow="md" borderWidth="1px" width="100%">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <FormControl mb={4}>
                    <FormLabel>Writing Title</FormLabel>
                    <Input
                      value={writing.title}
                      onChange={(e) =>
                        setWriting({ ...writing, title: e.target.value })
                      }
                      placeholder="Enter writing title"
                    />
                    {errors.title && (
                      <Text color="red.500">{errors.title}</Text>
                    )}
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Level</FormLabel>
                    <Select
                      value={writing.level}
                      onChange={(e) =>
                        setWriting({ ...writing, level: e.target.value })
                      }
                    >
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="VIP">VIP</option>
                    </Select>
                    {errors.level && (
                      <Text color="red.500">{errors.level}</Text>
                    )}
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Instructions</FormLabel>
                    <Textarea
                      onChange={(e) =>
                        setWriting({ ...writing, instructions: e.target.value })
                      }
                      placeholder="Enter instructions for the writing task"
                    />
                    {errors.instructions && (
                      <Text color="red.500">{errors.instructions}</Text>
                    )}
                  </FormControl>
                  <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={4}>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Start Date</FormLabel>
                        <Input
                          type="datetime-local"
                          onChange={(e) =>
                            setWriting({
                              ...writing,
                              startDate: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem>
                      <FormControl>
                        <FormLabel>End Date</FormLabel>
                        <Input
                          onChange={(e) =>
                            setWriting({ ...writing, endDate: e.target.value })
                          }
                          type="datetime-local"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <Box position="sticky" bottom={0} bg="white" p={4} zIndex={5}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        colorScheme="blue"
                        onClick={handleSubmit}
                        isLoading={loading}
                      >
                        {id ? 'Update Writing' : 'Create Writing'}
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </TabPanel>

          <TabPanel>Tab kết quả</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Writing;
