import React, { useState } from "react";
import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    IconButton,
    useEditableControls,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { AiOutlinePlusCircle, AiOutlineEdit, AiOutlineDelete, AiOutlineDrag } from "react-icons/ai";
import { MdSearch } from "react-icons/md";
import Lesson from "../Lesson/Lesson"; // Import Lesson component
import axios from "axios";
import { getToken } from "~/utils/authUtils";

const Section = ({ section, fetchSections, openTypeLessonModal, onLessonClick }) => {
    const [lessons, setLessons] = useState([]);
    const [title, setTitle] = useState(section.title);
    const token = getToken();
    const toast = useToast();

    const fetchLessons = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8001/lessons/getAllLessonBySection?sectionId=${section.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setLessons(response.data);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    };

    const handleTitleSubmit = async (newTitle) => {
        const sectionRequest = {
            id: section.id,
            courseId: section.courseId,
            title: newTitle,
        };
        try {
            const response = await axios.put(
                `http://localhost:8001/sections`,
                sectionRequest,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTitle(newTitle);
            fetchSections(); // Fetch lại sections sau khi sửa
            toast({
                title: "Section updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error updating section:", error);
            toast({
                title: "Failed to update section",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const deleteSection = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8001/sections?id=${section.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchSections(); // Fetch lại sections sau khi xóa
            toast({
                title: "Section deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error deleting section:", error);
            toast({
                title: "Failed to delete section",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const EditableControls = () => {
        const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

        const handleEditButtonClick = (event) => {
            event.stopPropagation();
            if (!isEditing) {
                getEditButtonProps().onClick();
            }
        };

        return !isEditing ? (
            <IconButton
                size="sm"
                variant="ghost"
                icon={<AiOutlineEdit />}
                onClick={handleEditButtonClick}
                aria-label="Edit section title"
            />
        ) : null;
    };

    return (
        <AccordionItem>
            <h2>
                <AccordionButton onClick={fetchLessons}>
                    <Flex flex="1" alignItems="center" justifyContent="space-between">
                        <Flex alignItems="center">
                            <IconButton
                                icon={<AiOutlineDrag />}
                                aria-label="Drag section"
                                variant="ghost"
                                size="sm"
                                cursor="move"
                            />

                            {/* Editable Title */}
                            <Editable
                                value={title}
                                fontSize="lg"
                                fontWeight="bold"
                                isPreviewFocusable={false}
                                submitOnBlur={true}
                                onSubmit={handleTitleSubmit}
                                onChange={(newTitle) => setTitle(newTitle)}
                            >
                                <EditablePreview />
                                <EditableInput
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                        if (e.key === " ") {
                                            e.preventDefault();
                                            const caretPosition = e.target.selectionStart;
                                            const newValue =
                                                title.slice(0, caretPosition) +
                                                "\u00A0" +
                                                title.slice(caretPosition); // Thêm &nbsp;
                                            setTitle(newValue);
                                            setTimeout(() => {
                                                e.target.setSelectionRange(caretPosition + 1, caretPosition + 1);
                                            }, 0);
                                        }
                                    }}
                                />
                                <EditableControls />
                            </Editable>
                        </Flex>

                        <IconButton
                            icon={<AiOutlineDelete />}
                            aria-label="Delete section"
                            variant="ghost"
                            size="sm"
                            onClick={deleteSection}
                        />
                    </Flex>
                    <AccordionIcon />
                </AccordionButton>
            </h2>

            <AccordionPanel pb={4}>
                <VStack align="start" spacing="4">
                    {lessons.map((lesson) => (
                        <Lesson key={lesson.id} lesson={lesson} onClick={() => onLessonClick(lesson.id)} />
                    ))}
                    <Flex width="100%" mt="4">
                        <Button
                            onClick={() => openTypeLessonModal(section.id)} // Pass section.id to openTypeLessonModal
                            leftIcon={<AiOutlinePlusCircle />}
                            colorScheme="blue"
                            flex="1"
                        >
                            Add a lesson
                        </Button>
                        <Button leftIcon={<MdSearch />} variant="outline" ml="4" flex="1">
                            Search materials
                        </Button>
                    </Flex>
                </VStack>
            </AccordionPanel>
        </AccordionItem>
    );
};

export default Section;