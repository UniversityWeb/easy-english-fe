import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Heading,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, MinusIcon } from '@chakra-ui/icons';
import EditableQuestionItem from '~/components/Test/EditableQuestion/EditableQuestionItem';
import testQuestionService from '~/services/testQuestionService';
import useCustomToast from '~/hooks/useCustomToast';
import ReactQuill from 'react-quill';
import questionGroupService from '~/services/questionGroupService';
import { QUESTION_TEMPLATES_TO_ADD } from '~/utils/testDemoData';

const EditableQuestionGroup = React.memo(({ group, onRemoveGroup, onReloadGroups }) => {
  const [groupState, setGroupState] = useState(group);
  const [questions, setQuestions] = useState([]);
  const { successToast, errorToast } = useCustomToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(!!group?.audioPath);
  const [isImageEnabled, setIsImageEnabled] = useState(!!group?.imagePath);
  const [isContentEnabled, setIsContentEnabled] = useState(!!group?.contentToDisplay);

  // Fetch questions from the server
  const fetchQuestions = async () => {
    if (!group) return;

    try {
      const loadedQuestions = await testQuestionService.getByQuestionGroup(group?.id);
      setQuestions(loadedQuestions);
    } catch (error) {
      errorToast('Error fetching questions.');
      console.error('Error fetching questions:', error);
    }
  };

  // Reload questions (to be passed to EditableQuestionItem)
  const reloadQuestions = useCallback(() => {
    fetchQuestions();
  }, [group]);

  useEffect(() => {
    setGroupState({
      title: group?.title || '',
      requirement: group?.requirement || '',
      ordinalNumber: group?.ordinalNumber || '',
      from: group?.from || '',
      to: group?.to || '',
      audioPath: group?.audioPath || '',
      imagePath: group?.imagePath || '',
      contentToDisplay: group?.contentToDisplay || '',
      originalContent: group?.originalContent || '',
      testPartId: group?.testPartId || '',
    });

    fetchQuestions();
  }, [group]);

  const handleUpdateGroup = async (e) => {
    e?.preventDefault();
    setIsUpdating(true);
    try {
      await questionGroupService.update(group?.id, groupState);
      successToast('Question group updated successfully!');
    } catch (error) {
      console.error('Error updating question group:', error);
      errorToast('Failed to update question group.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupState((prev) => ({ ...prev, [name]: value }));
  };

  const addNewQuestion = async () => {
    const newQuestion = {
      ...QUESTION_TEMPLATES_TO_ADD.SINGLE_CHOICE,
      ordinalNumber: questions.length + 1,
      questionGroupId: group?.id,
    };

    try {
      const addedQuestion = await testQuestionService.create(newQuestion);
      setQuestions((prevQuestions) => [...prevQuestions, addedQuestion]);
      successToast('Question added successfully.');
    } catch (error) {
      console.error('Error adding question:', error);
      errorToast('Error adding question.');
    }
  };

  const removeQuestion = useCallback(
    async (id) => {
      try {
        await testQuestionService.remove(id);
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== id),
        );
        successToast('Question removed successfully.');
      } catch (error) {
        console.error('Error removing question:', error);
        errorToast('Error removing question.');
      }
    },
    [questions.length],
  );

  return (
    <Box p={4} bg="gray.50" mb={4} borderRadius="lg" borderWidth="1px">

      <Flex justify="space-between" mb={4} align="center">
        <Editable
          defaultValue={groupState?.title}
          fontWeight="bolder"
          onSubmit={async (value) => {
            await setGroupState((prev) => ({ ...prev, title: value }));
            await handleUpdateGroup();
          }}
        >
          <EditablePreview />
          <EditableInput name="title" />
        </Editable>

        <IconButton
          icon={<DeleteIcon />}
          aria-label="Delete question group"
          colorScheme="red"
          onClick={() => onRemoveGroup(group.id)}
        />
      </Flex>

      <Accordion allowMultiple>
        <AccordionItem>
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton>
                  {isExpanded ? (
                    <>
                      <Box as='span' flex='1' textAlign='left'>
                        Hide
                      </Box>
                      <MinusIcon fontSize='12px' />
                    </>
                  ) : (
                    <>
                      <Box as='span' flex='1' textAlign='left'>
                        Show
                      </Box>
                      <AddIcon fontSize='12px' />
                    </>
                  )}
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Tabs>
                  <TabList>
                    <Tab>Group Info</Tab>
                    <Tab>Questions</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <FormControl mb={2}>
                        <FormLabel>Ordinal Number</FormLabel>
                        <Input
                          name="ordinalNumber"
                          value={groupState?.ordinalNumber}
                          onChange={handleInputChange}
                          type="number"
                        />
                      </FormControl>

                      {/* Additional fields */}
                      <FormControl mb={4}>
                        <FormLabel>Requirement</FormLabel>
                        <Box
                          sx={{
                            '.quill': { height: '270px' },
                            '.ql-container': { height: '310px' },
                          }}
                        >
                          <ReactQuill
                            value={groupState?.requirement}
                            onChange={(requirement) =>
                              setGroupState((prev) => ({ ...prev, requirement }))
                            }
                            theme="snow"
                            placeholder="Enter lesson content"
                            style={{ height: '380px', marginBottom: '20px' }}
                          />
                        </Box>
                      </FormControl>

                      <FormControl mb={4}>
                        <Flex justify="space-between" align="center" mb={2}>
                          <FormLabel>Audio Path</FormLabel>
                          <Switch
                            isChecked={isAudioEnabled}
                            onChange={(e) => setIsAudioEnabled(e.target.checked)}
                            colorScheme="blue"
                          />
                        </Flex>
                        {isAudioEnabled && (
                          <Input
                            name="audioPath"
                            value={groupState.audioPath}
                            onChange={handleInputChange}
                          />
                        )}
                      </FormControl>

                      <FormControl mb={4}>
                        <Flex justify="space-between" align="center" mb={2}>
                          <FormLabel>Image Path</FormLabel>
                          <Switch
                            isChecked={isImageEnabled}
                            onChange={(e) => setIsImageEnabled(e.target.checked)}
                            colorScheme="blue"
                          />
                        </Flex>
                        {isImageEnabled && (
                          <Input
                            name="imagePath"
                            value={groupState.imagePath}
                            onChange={handleInputChange}
                          />
                        )}
                      </FormControl>

                      {/* Content to display */}
                      <FormControl mb={4}>
                        <Flex justify="space-between" align="center" mb={2}>
                          <FormLabel>Content to Display</FormLabel>
                          <Switch
                            isChecked={isContentEnabled}
                            onChange={(e) => setIsContentEnabled(e.target.checked)}
                            colorScheme="blue"
                          />
                        </Flex>
                        {isContentEnabled && (
                          <Box
                            sx={{
                              '.quill': { height: '270px' },
                              '.ql-container': { height: '310px' },
                            }}
                          >
                            <ReactQuill
                              value={group?.contentToDisplay}
                              onChange={(contentToDisplay) =>
                                setGroupState((prev) => ({ ...prev, contentToDisplay }))
                              }
                              theme="snow"
                              placeholder="Enter lesson content"
                              style={{ height: '380px', marginBottom: '20px' }}
                            />
                          </Box>
                        )}
                      </FormControl>

                      <Flex justify="space-between" mb={4}>
                        <Button colorScheme="blue" onClick={handleUpdateGroup} isLoading={isUpdating}>
                          Update Group
                        </Button>
                      </Flex>
                    </TabPanel>

                    <TabPanel>
                      <Heading size="md" mb={5}>Questions</Heading>

                      {/* Question Items */}
                      {questions.map((question) => (
                        <EditableQuestionItem
                          key={question.id}
                          question={question}
                          onRemoveQuestion={removeQuestion}
                          onReloadQuestions={reloadQuestions}
                        />
                      ))}

                      <Flex justify="space-between" mb={4}>
                        <Button
                          colorScheme="green"
                          onClick={addNewQuestion}
                          leftIcon={<AddIcon />}
                        >
                          Add Question
                        </Button>
                      </Flex>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </AccordionPanel>
            </>
          )}

        </AccordionItem>
      </Accordion>
    </Box>
  );
});

export default EditableQuestionGroup;