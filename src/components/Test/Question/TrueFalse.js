import React from "react";
import {
  Box,
  Flex,
  RadioGroup,
  Radio,
  ChakraProvider
} from "@chakra-ui/react";

const TrueFalse = () => {
  return (
    <ChakraProvider>
    <Box p={5} bg="gray.50" borderRadius="lg" borderWidth="1px" my={4}>
      <RadioGroup defaultValue="False">
        <Flex
          justify="space-between"
          align="center"
          bg="white"
          p={4}
          borderRadius="md"
          borderWidth="1px"
          mb={2}
        >
          <Radio value="True">True</Radio>
        </Flex>
        <Flex
          justify="space-between"
          align="center"
          bg="white"
          p={4}
          borderRadius="md"
          borderWidth="1px"
        >
          <Radio value="False">False</Radio>
        </Flex>
      </RadioGroup>
    </Box>
    </ChakraProvider>
  );
};

export default TrueFalse;