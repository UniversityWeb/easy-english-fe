import React, { useEffect, useState } from 'react';
import { Box, Container, Text, VStack } from '@chakra-ui/react';
import TakeTestGroup from '~/components/Test/TakeTestGroup';
import { getPart } from '~/utils/testUtils';
import ReactQuill from 'react-quill';

function TakeTestPart({
  testId,
  partId,
  scrollToQuestion,
  onQuestionAnswered,
}) {
  const [part, setPart] = useState();

  useEffect(() => {
    // Fetch part data when testId or partId changes
    const newPart = getPart(testId, partId);
    setPart(newPart);
  }, [testId, partId]);

  // Utility function to check if the reading passage is empty
  const isReadingPassageEmpty = (text) => {
    return !text || text.trim().replace(/<[^>]+>/g, '').length === 0;
  };


  return (
    <Box w="100%" p={6} bg="white" boxShadow="lg" borderRadius="md">
      <VStack align="start" spacing={4}>
        {/* Display part title */}
        <Text fontSize="2xl" fontWeight="bold">
          {part?.title || 'Untitled Part'}
        </Text>

        {/* Conditionally display the reading passage if it has content */}
        {!isReadingPassageEmpty(part?.readingPassage) && (
          <Box
            w="100%"
            p={4}
            bg="cyan.50"
            borderRadius="md"
            boxShadow="sm"
            overflow="hidden"
            sx={{
              '.quill': { height: 'auto' },
              '.ql-editor': { lineHeight: '1.5' },
              '.ql-size-small': { fontSize: '16px' },
              '.ql-size-large': { fontSize: '18px' },
              '.ql-size-huge': { fontSize: '24px' },
              '.ql-editor p': { marginBottom: '15px' },
            }}
          >
            <ReactQuill
              value={part?.readingPassage}
              readOnly={true}
              theme={'bubble'}
              style={{ marginBottom: '0px', lineHeight: '1.5' }}
            />
          </Box>
        )}

        <Container maxW="container.lg" px={4} py={6}>
          {/* Render question groups */}
          {part?.questionGroups?.map((group) => (
            <TakeTestGroup
              key={group.id}
              questionGroup={group}
              scrollToQuestion={scrollToQuestion}
              onQuestionAnswered={onQuestionAnswered}
              testId={testId}
            />
          ))}
        </Container>
      </VStack>
    </Box>
  );
}

export default TakeTestPart;
