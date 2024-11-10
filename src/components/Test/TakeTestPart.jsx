import React, { useEffect, useState } from 'react';
import { Box, VStack, Text } from "@chakra-ui/react";
import TakeTestGroup from '~/components/Test/TakeTestGroup';
import { getPart, getParts } from '~/utils/testUtils';

function TakeTestPart({ testId, partId, scrollToQuestion, onQuestionAnswered }) {
  const [part, setPart] = useState();

  useEffect(() => {
    let part = getPart(testId, partId);
    part = { ...part, questionGroups: part.questionGroups || [] };
    setPart(part || {});
  }, [partId]);

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
