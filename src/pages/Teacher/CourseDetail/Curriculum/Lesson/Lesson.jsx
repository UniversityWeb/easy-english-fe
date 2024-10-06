import React from "react";
import { HStack, Icon, Text, IconButton } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import lessonService from "~/services/lessonService"; 
import useCustomToast from "~/hooks/useCustomToast"; 

const Lesson = ({ lesson, onClick, fetchLessons }) => {
  const { successToast, errorToast } = useCustomToast(); 

  const deleteLesson = async () => {
    const lessonRequest = { 
      id: lesson.id 
    };
    try {
      await lessonService.deleteLesson(lessonRequest); 
      successToast("Lesson deleted successfully.");

    } catch (error) {
      console.error("Error deleting lesson:", error);
      errorToast(
        error.response?.data?.message || "An error occurred while deleting the lesson."
      ); 
    }
  };

  return (
    <HStack justifyContent="space-between" width="100%" cursor="pointer">
      <HStack onClick={onClick}>
        <Icon as={lesson.icon} color={lesson.color} />
        <Text>{lesson.title}</Text>
      </HStack>

      <IconButton
        aria-label="Delete lesson"
        icon={<AiOutlineDelete />}
        colorScheme="red"
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation(); 
          deleteLesson(); 
        }}
      />
    </HStack>
  );
};

export default Lesson;