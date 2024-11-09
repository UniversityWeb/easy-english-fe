import React, { useState } from "react";
import { Box, VStack, Text, Input, useToast } from "@chakra-ui/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Notice = () => {
  const [content, setContent] = useState(""); 
  const toast = useToast();

  return (
    <VStack spacing={4} w="100%" maxW="800px" mx="auto" mt={6}>
      <Box w="100%">
        <Text fontSize="sm" fontWeight="bold" mb={1} color="gray.700">
          Notice
        </Text>

        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          placeholder="Enter your login message here..."
          style={{ height: "200px", marginBottom: "20px" }}
        />

      </Box>
    </VStack>
  );
};

export default Notice;