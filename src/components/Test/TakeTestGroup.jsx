import React from 'react';
import { VStack, Text, Box, Image } from "@chakra-ui/react";
import SingleChoiceQuestion from '~/components/Test/Question/SingleChoiceQuestion';
import CustomReactQuill from '~/components/CustomReactQuill';
import ReactQuill from 'react-quill';

function TakeTestGroup({ questionGroup, scrollToQuestion, onQuestionAnswered }) {
  const isRequirementEmpty = (text) => {
    return !text || text.trim().replace(/<[^>]+>/g, '').length === 0;
  };

  return (
    <VStack align="start" spacing={6} pt={4}>
      {/* Always display these fields */}
      <Text fontSize="lg" fontWeight="bold">
        {`${questionGroup?.title}`}
      </Text>
      <Text fontSize="md">
        {`Ordinal Number: ${questionGroup?.ordinalNumber}`}
      </Text>
      <Text fontSize="md">
        {`Questions Range: ${questionGroup?.from} - ${questionGroup?.to}`}
      </Text>

      {!isRequirementEmpty(questionGroup?.requirement) && (
        <Box
          w="100%"
          p={4}
          bg="cyan.50"
          borderRadius="md"
          boxShadow="sm"
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
        <SingleChoiceQuestion
          key={question.id}
          question={question.title}
          options={question.options}
          questionNumber={question.ordinalNumber}
          onQuestionAnswered={onQuestionAnswered}
          selectedValue={question.selectedAnswer || ""}
        />
      ))}
    </VStack>
  );
}

export default TakeTestGroup;
