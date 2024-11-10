import React, { useEffect, useState } from 'react';
import { Box, Button, Collapse, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { getParts, getQuestionsInRangeByPartId, getTest } from '~/utils/testUtils';

function PartSection({
  part,
  questionRange = [],
  selectedPartId,
  setSelectedPartId,
  setScrollToQuestion,
  answers,
}) {
  const isActive = selectedPartId?.ordinalNumber === part?.ordinalNumber;

  const answeredCount = questionRange.filter((num) => answers[num]).length;

  return (
    <VStack
      spacing={2}
      p={4}
      h="70px"
      border="2px"
      borderColor="teal.400"
      borderRadius="md"
      alignItems="center"
      cursor="pointer"
      onClick={() => setSelectedPartId(part?.id)}
    >
      {isActive ? (
        <Collapse in={isActive} animateOpacity>
          <HStack spacing={1} wrap="nowrap" whiteSpace="nowrap">
            {questionRange.map((num) => (
              <Button
                key={num}
                size="sm"
                borderRadius="full"
                variant={answers[num] ? 'solid' : 'outline'}
                colorScheme="teal"
                w="26px"
                h="30px"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPartId(part?.id);
                  setScrollToQuestion(num);
                }}
              >
                {num}
              </Button>
            ))}
          </HStack>
        </Collapse>
      ) : (
        <Text fontWeight="bold" color="teal.500">
          Part {part} :{' '}
          <Text as="span" fontWeight="normal" color="black">
            {answeredCount} of {questionRange.length} questions
          </Text>
        </Text>
      )}
    </VStack>
  );
}

function TakeTestFooter({
  testId,
  testParts = [],
  selectedPartId,
  setSelectedPartId,
  setScrollToQuestion,
  isRefresh,
}) {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    // Fetch parts with their question ranges when test parts change
    const newPart = getParts(testId).map((part) => {
      const allQuestions = getQuestionsInRangeByPartId(
        testId,
        part.id,
        0,
        part.questionGroups.reduce((acc, group) => acc + group.questions.length, 0)
      );
      const questionRange = allQuestions.map((q) => q.ordinalNumber);
      return {
        ...part,
        questionRange,
      };
    });
    setParts(newPart);
  }, [testId, isRefresh]);

  const handlePartSelect = (partId) => {
    setSelectedPartId(partId);
  };

  const handleScrollToQuestion = (questionId, ordinalNumber) => {
    // Sets the scroll position based on testQuestionId and ordinalNumber
    const scrollKey = `${questionId}-${ordinalNumber}`;
    setScrollToQuestion(scrollKey);
  };

  return (
    <Box
      w="100%"
      p={4}
      bg="white"
      boxShadow="md"
      borderRadius="md"
      position="sticky"
      bottom="0"
      left="0"
      zIndex="1000"
    >
      <SimpleGrid columns={4} spacing="5px">
        {parts.map((part) => (
          <PartSection
            key={part?.id}
            part={part?.ordinalNumber || 1}
            questionRange={part?.questionRange || []}
            selectedPartId={selectedPartId}
            setSelectedPartId={setSelectedPartId}
            setScrollToQuestion={setScrollToQuestion}
            answers={getTest(testId)?.userAnswers || []}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default TakeTestFooter;
