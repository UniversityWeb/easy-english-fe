import React from 'react';
import { VStack, Text, Box, Image } from "@chakra-ui/react";
import SingleChoiceQuestion from '~/components/Test/Question/SingleChoiceQuestion';

function TakeTestGroup({ questionGroup, scrollToQuestion, onQuestionAnswered }) {
  return (
    <VStack align="start" spacing={6} pt={4}>
      {/* Always display these fields */}
      <Text fontSize="lg" fontWeight="bold">
        {`Group Title: ${questionGroup?.title}`}
      </Text>
      <Text fontSize="md">
        {`Ordinal Number: ${questionGroup?.ordinalNumber}`}
      </Text>
      <Text fontSize="md">
        {`Questions Range: ${questionGroup?.from} - ${questionGroup?.to}`}
      </Text>
      <Text fontSize="md">
        {`Requirement: ${questionGroup?.requirement}`}
      </Text>

      {/* Conditionally display optional fields */}
      {questionGroup?.audioPath && (
        <Box>
          <Text fontSize="md">Audio:</Text>
          <audio controls>
            <source src={questionGroup.audioPath} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </Box>
      )}

      {questionGroup?.imagePath && (
        <Box>
          <Text fontSize="md">Image:</Text>
          <Image src={questionGroup.imagePath} alt="Question Image" />
        </Box>
      )}

      {questionGroup?.contentToDisplay && (
        <Box>
          <Text fontSize="md">Content:</Text>
          <Text>{questionGroup.contentToDisplay}</Text>
        </Box>
      )}

      {questionGroup?.originalContent && (
        <Box>
          <Text fontSize="md">Original Content:</Text>
          <Text>{questionGroup.originalContent}</Text>
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
