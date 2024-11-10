import React, { useState } from "react";
import { Box, Input, Heading, Text, VStack, HStack } from "@chakra-ui/react";

const FillBlankQuestion = ({ question, onQuestionAnswered }) => {
  const [answers, setAnswers] = useState([]);

  // Handle input change for each blank
  const handleInputChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    onQuestionAnswered(question.id, newAnswers);
  };

  return (
    <Box mb={6} p={4} borderWidth="1px" borderRadius="lg">
      <Heading as="h4" size="sm" mb={4}>
        {question.ordinalNumber + 1}. {question.title}
      </Heading>

      <VStack align="start" spacing={4}>
        <HStack>
          {/* Part 1: "She is good ___ math." */}
          <Text>She is good</Text>
          <Input
            placeholder="___"
            value={answers[0] || ""}
            onChange={(e) => handleInputChange(0, e.target.value)}
            width="100px"
          />
          <Text>math.</Text>
        </HStack>

        <HStack>
          {/* Part 2: "___ hi xin chao nhe." */}
          <Input
            placeholder="___"
            value={answers[1] || ""}
            onChange={(e) => handleInputChange(1, e.target.value)}
            width="100px"
          />
          <Text>hi xin chao nhe.</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default FillBlankQuestion;