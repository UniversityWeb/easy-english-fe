import React from "react";
import { HStack, Icon, Text, IconButton, useToast } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { getToken } from "~/utils/authUtils"; // Assuming you have a util to get token

const Lesson = ({ lesson, onClick, fetchLessons }) => {
    const token = getToken(); // Get the token for authorization
    const toast = useToast(); // Chakra UI toast for notifications

    // Function to handle lesson deletion
    const deleteLesson = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8001/lessons`, // API endpoint to delete the lesson
                {
                    params: { id: lesson.id }, // Passing the lesson ID as a query parameter
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the authorization token
                    },
                }
            );

            if (response.status === 200) {
                toast({
                    title: "Lesson deleted successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                //fetchLessons(); // Refresh the lesson list after deletion
            }
        } catch (error) {
            console.error("Error deleting lesson:", error);
            toast({
                title: "Failed to delete lesson.",
                description: error.response?.data?.message || "An error occurred.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <HStack justifyContent="space-between" width="100%" cursor="pointer">
            {/* Clickable lesson content */}
            <HStack onClick={onClick}>
                <Icon as={lesson.icon} color={lesson.color} />
                <Text>{lesson.title}</Text>
            </HStack>

            {/* Delete button */}
            <IconButton
                aria-label="Delete lesson"
                icon={<AiOutlineDelete />}
                colorScheme="red"
                size="sm"
                variant="ghost"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering onClick for lesson selection
                    deleteLesson(); // Call deleteLesson when delete button is clicked
                }}
            />
        </HStack>
    );
};

export default Lesson;