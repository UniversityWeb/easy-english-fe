import React, { useState } from "react";
import {
  Box,
  Flex,
  Editable,
  EditableInput,
  EditablePreview,
  Button,
  Text,
  IconButton,
  ChakraProvider,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const Mapping = () => {
  // State để lưu danh sách các câu hỏi và câu trả lời
  const [data, setData] = useState([
    { id: 1, question: "Bill", answer: "Gates" },
    { id: 2, question: "Steve", answer: "Jobs" },
  ]);

  // Hàm thêm mới một dòng câu hỏi và câu trả lời
  const addNewPair = () => {
    const newPair = {
      id: data.length + 1,
      question: "New Question",
      answer: "New Answer",
    };
    setData([...data, newPair]);
  };

  // Hàm xóa một dòng câu hỏi và câu trả lời
  const removePair = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <ChakraProvider>
      <Box p={5} bg="gray.50" borderRadius="lg" borderWidth="1px" my={4}>
        {data.map((item, index) => (
          <Flex
            key={item.id}
            justify="space-between"
            align="center"
            bg="white"
            p={4}
            borderRadius="md"
            borderWidth="1px"
            mb={2}
          >
            <Flex flex={1} align="center" mr={4}>
              <Text mr={2}>Question</Text>
              <Editable defaultValue={item.question}>
                <EditablePreview />
                <EditableInput />
              </Editable>
            </Flex>

            {/* Đường kẻ dọc */}
            <Box borderLeftWidth="1px" borderColor="gray.200" height="40px" mr={4} />

            <Flex flex={1} align="center">
              <Text mr={2}>Answer</Text>
              <Editable defaultValue={item.answer}>
                <EditablePreview />
                <EditableInput />
              </Editable>
            </Flex>

            {/* Nút xóa */}
            <IconButton
              aria-label="Delete pair"
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={() => removePair(item.id)}
            />
          </Flex>
        ))}

        {/* Nút thêm mới */}
        <Flex mt={4} align="center">
          <Button colorScheme="blue" leftIcon={<AddIcon />} onClick={addNewPair}>
            Add new answer
          </Button>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default Mapping;