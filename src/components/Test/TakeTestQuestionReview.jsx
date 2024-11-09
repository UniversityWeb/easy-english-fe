import React, { useEffect, useState } from "react";
import { Box, Text, Table, Tbody, Tr, Td } from "@chakra-ui/react";

const TakeTestQuestionReview = () => {
  // Tạo state để lưu trữ câu trả lời
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // Lấy câu trả lời từ localStorage cho các biến từ Q1 đến Q40
    const storedAnswers = Array.from({ length: 40 }, (_, i) => {
      const answer = localStorage.getItem(`Q${i + 1}`);
      return answer ? answer : "-"; // Nếu không có giá trị, đặt là "-"
    });
    setAnswers(storedAnswers);
  }, []);

  // Chia các câu trả lời thành các hàng, mỗi hàng 4 câu
  const rows = [];
  for (let i = 0; i < answers.length; i += 4) {
    rows.push(answers.slice(i, i + 4));
  }

  return (
    <Box maxWidth="600px" margin="0 auto" p={4}>
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
        Review your answers
      </Text>
      <Text fontSize="sm" color="gray.500" textAlign="center" mb={4}>
        * This window is to review your answers only, you cannot change the answers here
      </Text>
      <Table variant="simple" size="lg" border="1px solid" borderColor="gray.300" borderRadius="md">
        <Tbody>
          {rows.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {row.map((answer, colIndex) => (
                <Td
                  key={colIndex}
                  textAlign="center"
                  border="1px solid"
                  borderColor="gray.300"
                  fontWeight="bold"
                  color={answer !== "-" ? "blue.600" : "gray.600"}
                  width="25%"
                  p={4}
                >
                  Q{rowIndex * 4 + colIndex + 1}: {answer}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TakeTestQuestionReview;
