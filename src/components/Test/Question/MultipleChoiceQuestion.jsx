import React, { useState } from "react";
import { Text, Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";

const MultipleChoiceQuestion = ({ question, onQuestionAnswered }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (options) => {
    setSelectedOptions(options);
    onQuestionAnswered(question.id, options);
  };

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        {question.ordinalNumber}. {question.title}
      </Text>

      <CheckboxGroup onChange={handleOptionChange} value={selectedOptions}>
        <Stack direction="column" spacing={4}>
          {question.options.map((option, index) => (
            <Checkbox key={index} value={option}>
              {option}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </>
  );
};

export default MultipleChoiceQuestion;
