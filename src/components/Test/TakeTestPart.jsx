import React, { useEffect, useState } from 'react';
import { Box, VStack, Text } from "@chakra-ui/react";
import TakeTestGroup from '~/components/Test/TakeTestGroup';
import { getPart, getParts, getQuestionsInRangeByPartId } from '~/utils/testUtils';

function TakeTestPart({ testId, partId, scrollToQuestion, onQuestionAnswered }) {
  const [part, setPart] = useState();

  useEffect(() => {
    // Fetch parts with their question ranges when test parts change
    const newPart = getPart(testId, partId);
    debugger
    setPart(newPart);
  }, [testId, partId]);

  return (
    <Box w="100%" p={6} bg="white" boxShadow="lg" borderRadius="md">
      <VStack align="start" spacing={4}>
        {/* Display part title */}
        <Text fontSize="2xl" fontWeight="bold">
          {part?.title || 'Untitled Part'}
        </Text>

        {/* Always display ordinalNumber, from, to, and requirement */}
        <Text fontSize="md">
          {`Ordinal Number: ${part?.ordinalNumber}`}
        </Text>
        <Text fontSize="md">
          {`Reading Passage: ${part?.readingPassage}`}
        </Text>

        {/* Render question groups */}
        {part?.questionGroups?.map((group) => (
          <TakeTestGroup
            key={group.id}
            questionGroup={group}
            scrollToQuestion={scrollToQuestion}
            onQuestionAnswered={onQuestionAnswered}
          />
        ))}
      </VStack>
    </Box>
  );
}

export default TakeTestPart;
