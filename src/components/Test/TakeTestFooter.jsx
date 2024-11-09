import React from 'react';
import { Box, SimpleGrid, VStack, Text, Button, Collapse, HStack } from "@chakra-ui/react";

function PartSection({ partNumber, questionRange, activePart, setActivePart, setScrollToQuestion, answers }) {
  const isActive = activePart === `part${partNumber}`;

  // Calculate progress based on actual answers
  const answeredCount = questionRange.filter(num => answers[num]).length;

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
      onClick={() => setActivePart(`part${partNumber}`)}
    >
      {isActive ? (
        <Collapse in={isActive} animateOpacity>
          <HStack spacing={1} wrap="nowrap" whiteSpace="nowrap">
            {questionRange.map((num) => (
              <Button
                key={num}
                size="sm"
                borderRadius="full"
                variant={answers[num] ? "solid" : "outline"}
                colorScheme="teal"
                w="26px"
                h="30px"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePart(`part${partNumber}`);
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
          Part {partNumber} : <Text as="span" fontWeight="normal" color="black">
          {answeredCount} of {questionRange.length} questions
        </Text>
        </Text>
      )}
    </VStack>
  );
}


function TakeTestFooter({ activePart, setActivePart, setScrollToQuestion, answers }) {
  const parts = [
    { partNumber: 1, questionRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { partNumber: 2, questionRange: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
    { partNumber: 3, questionRange: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
    { partNumber: 4, questionRange: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
  ];

  return (
    <Box w="100%" p={4} bg="white" boxShadow="md" borderRadius="md" position="sticky" bottom="0" left="0" zIndex="1000">
      <SimpleGrid columns={4} spacing="5px">
        {parts.map((part) => (
          <PartSection
            key={part.partNumber}
            partNumber={part.partNumber}
            questionRange={part.questionRange}
            activePart={activePart}
            setActivePart={setActivePart}
            setScrollToQuestion={setScrollToQuestion}
            answers={answers}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default TakeTestFooter;