import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Collapse, HStack, Text, useDisclosure, VStack } from '@chakra-ui/react';
import { getParts, getQuestionsInRangeByPartId, getTest } from '~/utils/testUtils';

// Helper function to get the question range for a part
const getQuestionRange = (testId, part) => {
  const allQuestions = getQuestionsInRangeByPartId(
    testId,
    part.id,
    0,
    part.questionGroups.reduce((acc, group) => acc + group.questions.length, 0)
  );
  return allQuestions.map((q) => {
    return {
      id: q?.id,
      ordinalNumber: q?.ordinalNumber
    };
  });
};

// PartSection Component
const PartSection = React.memo(({
                                  part,
                                  questionRange = [],
                                  onPartClick,
                                  onScrollToQuestion,
                                  answers,
                                  selectedPartId,
                                }) => {
  const { isOpen, onToggle } = useDisclosure({ isOpen: selectedPartId === part?.id });
  const isActive = selectedPartId === part?.id;
  const answeredCount = questionRange.filter((num) => answers[num]).length;

  const handlePartClick = (e) => {
    e.preventDefault();
    onPartClick(part?.id);
  };

  return (
    <VStack
      spacing={2}
      p={2}
      h="auto"
      border="2px"
      borderColor={isActive ? 'teal.400' : 'transparent'}
      borderRadius="md"
      alignItems="flex-start"
      cursor="pointer"
      onClick={handlePartClick}
      minW="200px"
      transition="border-color 0.2s ease-in-out, transform 0.2s ease-in-out"
      _hover={{ borderColor: 'teal.300', transform: 'scale(1.05)' }}
    >
      {/* Collapsed View */}
      {!isActive ? (
        <Text fontWeight="bold" color="black">
          Part {part.ordinalNumber}:{' '}
          <Text as="span" fontWeight="normal">
            {answeredCount} of {questionRange.length} questions
          </Text>
        </Text>
      ) : (
        <Collapse in={isActive} animateOpacity>
          <HStack spacing={1} wrap="nowrap" whiteSpace="nowrap" overflowX="auto" maxW="100%" p={1}>
            {questionRange.map((question) => (
              <Button
                key={question?.id}
                size="sm"
                borderRadius="full"
                variant={answers[question?.id] ? 'solid' : 'outline'}
                colorScheme="teal"
                w="30px"
                h="30px"
                onClick={(e) => {
                  e.stopPropagation();
                  onScrollToQuestion(question?.id);
                  onPartClick(part?.id);
                }}
                _active={{ transform: 'scale(0.95)', transition: 'transform 0.1s ease-in-out' }}
              >
                {question?.ordinalNumber}
              </Button>
            ))}
          </HStack>
        </Collapse>
      )}
    </VStack>
  );
});

// TakeTestFooter Component
function TakeTestFooter({
                          testId,
                          selectedPartId,
                          onPartClick,
                          onScrollToQuestion,
                          isRefresh,
                        }) {
  const [parts, setParts] = useState([]);
  const userAnswers = useMemo(() => getTest(testId)?.userAnswers || [], [testId]);

  useEffect(() => {
    const fetchParts = () => {
      return getParts(testId).map((part) => ({
        ...part,
        questionRange: getQuestionRange(testId, part),
      }));
    };
    setParts(fetchParts());
  }, [testId, isRefresh]);

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
      overflowX="auto"
    >
      <HStack spacing={4} overflowX="auto" p={2}>
        {parts.map((part) => (
          <PartSection
            key={part?.id}
            part={part}
            questionRange={part?.questionRange || []}
            selectedPartId={selectedPartId}
            onPartClick={onPartClick}
            onScrollToQuestion={onScrollToQuestion}
            answers={userAnswers}
          />
        ))}
      </HStack>
    </Box>
  );
}

export default TakeTestFooter;
