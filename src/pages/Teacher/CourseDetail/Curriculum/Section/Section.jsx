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
    VStack,
} from "@chakra-ui/react";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import Lesson from "../Lesson/Lesson";
import sectionService from "~/services/sectionService";
import lessonService from "~/services/lessonService";
import useCustomToast from "~/hooks/useCustomToast";

const Section = ({ section, fetchSections, openTypeLessonModal, onLessonClick }) => {
    const [lessons, setLessons] = useState([]);
    const [title, setTitle] = useState(section.title);
    const { successToast, errorToast } = useCustomToast();

    const fetchLessons = async () => {
        const lessonRequest = {
            sectionId: section.id,
        };
        try {
            const data = await lessonService.fetchLessons(lessonRequest);
            setLessons(data);
        } catch (error) {
            console.error("Error fetching lessons:", error);
            errorToast(
                error.response?.data?.message || "An error occurred while fetching lessons."
            );
        }
    };

    const handleTitleSubmit = async (newTitle) => {
        try {
            const sectionRequest = { ...section, title: newTitle };
            await sectionService.updateSection(sectionRequest);
            fetchSections();
            successToast("Section updated successfully.");
        } catch (error) {
            console.error("Error updating the section title:", error);
            errorToast(
                error.response?.data?.message || "An error occurred while updating the section title."
            );
        }
    };

    const deleteSection = async () => {
        const sectionRequest = {
            id: section.id,
        };
        try {
            await sectionService.deleteSection(sectionRequest);
            fetchSections();
            successToast("Section deleted successfully.");
        } catch (error) {
            console.error("Error deleting the section:", error);
            errorToast(
                error.response?.data?.message || "An error occurred while deleting the section."
            );
        }
    };

    return (
        <AccordionItem>
            <h2>
                <AccordionButton onClick={fetchLessons}>
                    <Flex flex="1" alignItems="center" justifyContent="space-between">
                        <Editable
                            value={title}
                            fontSize="lg"
                            fontWeight="bold"
                            onSubmit={handleTitleSubmit}
                            onChange={(newTitle) => setTitle(newTitle)}
                        >
                            <EditablePreview />
                            <EditableInput />
                        </Editable>

                        <IconButton
                            icon={<AiOutlineDelete />}
                            aria-label="Delete section"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteSection();
                            }}
                        />
                    </Flex>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
                <VStack align="start" spacing="4">
                    {lessons.map((lesson) => (
                        <Lesson
                            key={lesson.id}
                            lesson={lesson}
                            onClick={() => onLessonClick(lesson.id, section.id)}
                        />
                    ))}
                    <Button
                        onClick={() => openTypeLessonModal(section.id)}
                        leftIcon={<AiOutlinePlusCircle />}
                        colorScheme="blue"
                    >
                        Add a lesson
                    </Button>
                </VStack>
            </AccordionPanel>
        </AccordionItem>
    );
};

export default Section;