import React, { useState } from "react";
import { Box, Button, VStack } from "@chakra-ui/react";
import EditableTestPart from "./EditableTestPart";
import { testDemoData } from '~/utils/testDemoData'; // Import the EditableTestPart component

const TestManagement = ({ sectionId, id, isNew, onTestSaved }) => {
  const [testParts, setTestParts] = useState(testDemoData.parts);

  // Function to update a test part
  const updateTestPart = (id, updatedPart) => {
    setTestParts((prevParts) =>
      prevParts.map((part) => (part.id === id ? { ...part, ...updatedPart } : part))
    );
  };

  // Function to remove a test part
  const removeTestPart = (id) => {
    setTestParts((prevParts) => prevParts.filter((part) => part.id !== id));
  };

  // Function to add a new test part
  const addTestPart = () => {
    const newPart = {
      id: Date.now(),
      title: "New Test Part",
      readingPassage: "",
      ordinalNumber: testParts.length + 1,
      testId: 1,
      questionGroups: [],
    };
    setTestParts((prevParts) => [...prevParts, newPart]);
  };

  return (
    <Box p={4}>
      <VStack spacing={4}>
        {testParts.map((part) => (
          <EditableTestPart
            key={part.id}
            part={part}
            onUpdatePart={updateTestPart}
            onRemovePart={removeTestPart}
            onAddQuestionGroup={(groupId) => {
              const newGroup = {
                id: Date.now(),
                ordinalNumber: part.questionGroups.length + 1,
                title: "New Question Group",
                requirement: "",
                audioPath: "",
                imagePath: "",
                contentToDisplay: "",
                originalContent: "",
                questions: [],
                testPartId: part.id,
              };
              updateTestPart(part.id, {
                questionGroups: [...part.questionGroups, newGroup],
              });
            }}
          />
        ))}
        <Button colorScheme="blue" onClick={addTestPart}>
          Add Test Part
        </Button>
      </VStack>
    </Box>
  );
};

export default TestManagement;
