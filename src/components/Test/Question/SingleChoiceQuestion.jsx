import React, { useState } from "react";
import { Text, Radio, RadioGroup, Stack } from "@chakra-ui/react";

const SingleChoiceQuestion = ({ question, onQuestionAnswered }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    onQuestionAnswered(question.id, [option]);
  };

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        {question.ordinalNumber}. {question.title}
      </Text>

      <RadioGroup onChange={handleOptionChange} value={selectedOption}>
        <Stack direction="column" spacing={4}>
          {question.options.map((option, index) => (
            <Radio key={index} value={option}>
              {option}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </>
  );
};

export default SingleChoiceQuestion;
