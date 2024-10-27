import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Textarea,
  Input,
  IconButton,
  Text,
  Heading,
  Collapse,
} from "@chakra-ui/react";
import { RiDeleteBinFill } from "react-icons/ri";
import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";
import { PiPencilSimpleFill } from "react-icons/pi"; // Importing pencil icon

function Faq() {
  const [questions, setQuestions] = useState([
    { question: "What is Lorem Ipsum?", answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.", isOpen: false, isEditing: false, isHovered: false },
    { question: "Why do we use it?", answer: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.", isOpen: false, isEditing: false, isHovered: false },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      setQuestions([...questions, { question: newQuestion, answer: newAnswer, isOpen: false, isEditing: false, isHovered: false }]);
      setNewQuestion("");
      setNewAnswer("");
      setIsAdding(false);
    }
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const toggleQuestion = (index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((item, i) =>
        i === index ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const handleEdit = (index) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((item, i) =>
        i === index ? { ...item, isEditing: true, isOpen: true } : item
      )
    );
  };

  const handleUpdateQuestion = (index, updatedQuestion, updatedAnswer) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((item, i) =>
        i === index
          ? { ...item, question: updatedQuestion, answer: updatedAnswer, isEditing: false }
          : item
      )
    );
  };

  // New function to handle hover
  const toggleHover = (index, isHovered) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((item, i) =>
        i === index ? { ...item, isHovered } : item
      )
    );
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bg="gray.100">
      <Box p={5} w="full" maxW="2xl">
        <Heading as="h2" size="lg" mb={5} textAlign="center">
          Frequently Asked Questions
        </Heading>
        <VStack spacing={5} align="start" w="full">
          {questions.map((item, index) => (
            <Box key={index} borderWidth="1px" borderRadius="md" p={4} w="full" bg="gray.50"
              onMouseEnter={() => toggleHover(index, true)} // Mouse enter
              onMouseLeave={() => toggleHover(index, false)} // Mouse leave
            >
              <HStack justify="space-between" mb={3}>
                <HStack>
                  <Text fontSize="lg" fontWeight="bold">
                    Question {index + 1}
                  </Text>
                  {item.isHovered && ( // Only show edit button if hovered
                    <IconButton
                      icon={<PiPencilSimpleFill />}
                      backgroundColor="transparent"
                      color="gray.500"
                      aria-label="Edit question"
                      onClick={() => handleEdit(index)}
                      size="sm"
                    />
                  )}
                </HStack>
                <HStack>
                  {item.isHovered && ( // Only show delete button if hovered
                    <IconButton
                      icon={<RiDeleteBinFill />}
                      backgroundColor="transparent"
                      color="gray.500"
                      aria-label="Delete question"
                      onClick={() => handleDeleteQuestion(index)}
                      size="sm"
                    />
                  )}
                  <IconButton
                    icon={item.isOpen ? <RxTriangleUp /> : <RxTriangleDown />}
                    aria-label="Toggle question"
                    onClick={() => toggleQuestion(index)}
                    size="sm"
                    color="gray.500"
                  />
                </HStack>
              </HStack>

              <Text fontWeight="bold">{item.question}</Text>

              <Collapse in={item.isOpen} animateOpacity>
                <VStack spacing={3} align="start" mt={3}>
                  <Text fontWeight="bold">Question</Text>
                  <Input
                    value={item.question}
                    isReadOnly={!item.isEditing}
                    onChange={(e) => {
                      const updatedQuestion = e.target.value;
                      setQuestions((prevQuestions) =>
                        prevQuestions.map((q, i) =>
                          i === index ? { ...q, question: updatedQuestion } : q
                        )
                      );
                    }}
                  />
                  <Text fontWeight="bold">Answer</Text>
                  <Textarea
                    value={item.answer}
                    isReadOnly={!item.isEditing}
                    onChange={(e) => {
                      const updatedAnswer = e.target.value;
                      setQuestions((prevQuestions) =>
                        prevQuestions.map((q, i) =>
                          i === index ? { ...q, answer: updatedAnswer } : q
                        )
                      );
                    }}
                  />
                  {item.isEditing && (
                    <Button
                      mt={2}
                      colorScheme="blue"
                      onClick={() => handleUpdateQuestion(index, item.question, item.answer)}
                    >
                      Update Question
                    </Button>
                  )}
                </VStack>
              </Collapse>
            </Box>
          ))}

          {/* Button to toggle the Add new question form */}
          {!isAdding && (
            <Button mt={4} colorScheme="blue" onClick={() => setIsAdding(true)}>
              Add new question
            </Button>
          )}

          {/* New question form */}
          {isAdding && (
            <Box w="full" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
              <VStack spacing={3} align="start" w="full">
                <Text fontWeight="bold">Question</Text>
                <Input
                  placeholder="Enter your question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <Text fontWeight="bold">Answer</Text>
                <Textarea
                  placeholder="Enter the answer"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                />

                {/* Buttons for saving or canceling */}
                <HStack justify="flex-end" w="full" mt={4}>
                  <Button colorScheme="gray" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={handleAddQuestion}>
                    Save Question
                  </Button>
                </HStack>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
}

export default Faq;
