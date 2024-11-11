import React from 'react';
import { Box, Image, Text, VStack } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import QuestionItem from '~/components/Test/Question/QuestionItem';

function TakeTestGroup({ questionGroup, scrollToQuestion, onQuestionAnswered }) {
  const isRequirementEmpty = (text) => {
    return !text || text.trim().replace(/<[^>]+>/g, '').length === 0;
  };

  return (
    <VStack align="start" spacing={10} pt={4}>
      <Text fontSize="md" fontWeight="bold">
        Question {questionGroup?.from} - {questionGroup?.to}
      </Text>

      {!isRequirementEmpty(questionGroup?.requirement) && (
        <Box
          w="100%"
          overflow="hidden"
          sx={{
            '.ql-editor': { lineHeight: '1.5' },
            '.ql-size-small': { fontSize: '16px' },
            '.ql-size-large': { fontSize: '18px' },
            '.ql-size-huge': { fontSize: '24px' },
            '.ql-editor p': { marginBottom: '15px' },
          }}
        >
          <ReactQuill
            value={questionGroup?.requirement}
            readOnly={true}
            theme={'bubble'}
            style={{ marginBottom: '0px', lineHeight: '1.5' }}
          />
        </Box>
      )}

      {questionGroup?.imagePath && (
        <Box>
          <Text fontSize="md">Image:</Text>
          <Image src={questionGroup.imagePath} alt="Question Image" />
        </Box>
      )}


      {/* Loop over the questions inside the question group */}
      {questionGroup?.questions?.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          onQuestionAnswered={onQuestionAnswered}
          scrollToQuestion={scrollToQuestion}
        />
      ))}
    </VStack>
  );
}

export default TakeTestGroup;
