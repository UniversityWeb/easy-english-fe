import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Button,
  Collapse,
  FormControl,
  FormLabel,
  Input,
  Switch, Heading,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import EditableQuestionItem from "~/components/Test/EditableQuestion/EditableQuestionItem";
import testQuestionService from '~/services/testQuestionService';
import { QUESTION_TYPES } from '~/utils/constants';
import useCustomToast from '~/hooks/useCustomToast';
import ReactQuill from 'react-quill';

const EditableQuestionGroup = ({ group, onUpdateGroup, onRemoveGroup }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [questions, setQuestions] = useState([]);
  const { successToast, errorToast } = useCustomToast();
  const [isAudioEnabled, setIsAudioEnabled] = useState(!!group?.audioPath);
  const [isImageEnabled, setIsImageEnabled] = useState(!!group?.imagePath);
  const [isContentEnabled, setIsContentEnabled] = useState(!!group?.contentToDisplay);

  // State for managing form inputs
  const [inputValues, setInputValues] = useState({
    title: group.title || "",
    requirement: group.requirement || "",
    ordinalNumber: group.ordinalNumber || "",
    from: group.from || "",
    to: group.to || "",
    audioPath: group.audioPath || "",
    imagePath: group.imagePath || "",
    contentToDisplay: group.contentToDisplay || "",
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!group) return;
      try {
        const loadedQuestions = await testQuestionService.getByQuestionGroup(group?.id);
        setQuestions(loadedQuestions);
      } catch (error) {
        errorToast("Error fetching questions.");
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [group]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateGroup = () => {
    onUpdateGroup(group.id, { ...group, ...inputValues });
  };

  const addNewQuestion = async () => {
    const newQuestion = {
      title: "New Question",
      ordinalNumber: questions.length + 1,
      type: QUESTION_TYPES.SINGLE_CHOICE,
      questionGroupId: group?.id,
    };

    try {
      const addedQuestion = await testQuestionService.create(newQuestion);
      setQuestions((prevQuestions) => [...prevQuestions, addedQuestion]);
      successToast("Question added successfully.");
    } catch (error) {
      console.error("Error adding question:", error);
      errorToast("Error adding question.");
    }
  };

  const updateQuestion = async (id, updatedData) => {
    try {
      await testQuestionService.update(id, updatedData);
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === id ? { ...q, ...updatedData } : q))
      );
      successToast("Question updated successfully.");
    } catch (error) {
      console.error("Error updating question:", error);
      errorToast("Error updating question.");
    }
  };

  const removeQuestion = async (id) => {
    try {
      await testQuestionService.remove(id);
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
      successToast("Question removed successfully.");
    } catch (error) {
      console.error("Error removing question:", error);
      errorToast("Error removing question.");
    }
  };

  return (
    <Box p={4} bg="gray.50" mb={4} borderRadius="lg" borderWidth="1px">
      <Flex justify="space-between" mb={4} align="center">
        <Editable defaultValue={inputValues.title} fontWeight="bolder">
          <EditablePreview />
          <EditableInput name="title" onBlur={handleInputChange} />
        </Editable>

        <IconButton
          icon={<DeleteIcon />}
          aria-label="Delete question group"
          colorScheme="red"
          onClick={() => onRemoveGroup(group.id)}
        />
      </Flex>

      <Collapse in={isExpanded} animateOpacity>
        {/* Editable Group Fields */}
        <FormControl mb={2}>
          <FormLabel>Ordinal Number</FormLabel>
          <Input
            name="ordinalNumber"
            value={inputValues.ordinalNumber}
            onChange={handleInputChange}
            type="number"
          />
        </FormControl>

        {/* Additional fields */}
        <FormControl mb={4}>
          <FormLabel>Requirement</FormLabel>
          <Box sx={{ ".quill": { height: "270px" }, ".ql-container": { height: "310px" } }}>
            <ReactQuill
              value={inputValues.requirement}
              onChange={(requirement) => setInputValues((prev) => ({ ...prev, requirement }))}
              theme="snow"
              placeholder="Enter lesson content"
              style={{ height: "380px", marginBottom: "20px" }}
            />
          </Box>
        </FormControl>

        <FormControl mb={4}>
          <Flex justify="space-between" align="center" mb={2}>
            <FormLabel>Audio Path</FormLabel>
            <Switch isChecked={isAudioEnabled} onChange={(e) => setIsAudioEnabled(e.target.checked)} colorScheme="blue" />
          </Flex>
          {isAudioEnabled && (
            <Input name="audioPath" value={inputValues.audioPath} onChange={handleInputChange} />
          )}
        </FormControl>

        <FormControl mb={4}>
          <Flex justify="space-between" align="center" mb={2}>
            <FormLabel>Image Path</FormLabel>
            <Switch isChecked={isImageEnabled} onChange={(e) => setIsImageEnabled(e.target.checked)} colorScheme="blue" />
          </Flex>
          {isImageEnabled && (
            <Input name="imagePath" value={inputValues.imagePath} onChange={handleInputChange} />
          )}
        </FormControl>

        {/* Content to display */}
        <FormControl mb={4}>
          <Flex justify="space-between" align="center" mb={2}>
            <FormLabel>Content to Display</FormLabel>
            <Switch isChecked={isContentEnabled} onChange={(e) => setIsContentEnabled(e.target.checked)} colorScheme="blue" />
          </Flex>
          {isContentEnabled && (
            <Box sx={{ ".quill": { height: "270px" }, ".ql-container": { height: "310px" } }}>
              <ReactQuill
                value={group?.contentToDisplay}
                onChange={(contentToDisplay) => setInputValues((prev) => ({ ...prev, contentToDisplay }))}
                theme="snow"
                placeholder="Enter lesson content"
                style={{ height: "380px", marginBottom: "20px" }}
              />
            </Box>
          )}
        </FormControl>

        <Flex justify="space-between" mb={4}>
          <Button colorScheme="blue" onClick={handleUpdateGroup}>Update Group</Button>
        </Flex>

        <Heading size="md">Questions</Heading>

        {/* Question Items */}
        {questions.map((question) => (
          <EditableQuestionItem
            key={question.id}
            question={question}
            onUpdateQuestion={updateQuestion}
            onRemoveQuestion={removeQuestion}
          />
        ))}

        <Flex justify="space-between" mb={4}>
          <Button colorScheme="green" onClick={addNewQuestion} leftIcon={<AddIcon />}>Add Question</Button>
        </Flex>
      </Collapse>
    </Box>
  );
};

export default EditableQuestionGroup;
