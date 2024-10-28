import React, { useState, useEffect } from 'react';
import { Box, Text, Icon, Collapse, VStack, HStack, Spinner } from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp, FaFileAlt, FaPlayCircle, FaPodcast, FaQuestionCircle } from 'react-icons/fa';
import sectionService from '~/services/sectionService'; // Assuming you already have these services
import lessonService from '~/services/lessonService';
import {
    FiFileText,
    FiPlayCircle,
    FiHelpCircle,
} from "react-icons/fi";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
const Curriculum = ({ courseId }) => {
    const [curriculumData, setCurriculumData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSections, setOpenSections] = useState([]);

    useEffect(() => {
        const fetchCurriculumData = async () => {
            setLoading(true);
            try {
                // Fetch all sections for the course
                const sections = await sectionService.fetchSectionsByCourse({ courseId: courseId });
                const sectionsWithLessons = await Promise.all(
                    sections.map(async section => {
                        // Fetch lessons for each section
                        const lessons = await lessonService.fetchLessons({ sectionId: section.id });
                        return {
                            ...section,
                            lessons: lessons.map((lesson) => ({
                                ...lesson,
                                icon: getLessonIcon(lesson.type), // Map the lesson type to an icon
                                color: getLessonColor(lesson.type)
                            })),
                        };
                    })
                );

                setCurriculumData(sectionsWithLessons);
                setOpenSections(sectionsWithLessons.map(() => false)); // Initially close all sections
            } catch (error) {
                console.error('Error fetching curriculum data:', error);
            }
            setLoading(false);
        };

        fetchCurriculumData();
    }, [courseId]);

    const toggleSection = (index) => {
        setOpenSections(prevState =>
            prevState.map((isOpen, i) => (i === index ? !isOpen : isOpen))
        );
    };

    const getLessonIcon = (type) => {
        switch (type) {
            case 'VIDEO':
                return FiPlayCircle;
            case 'AUDIO':
                return HiOutlineSpeakerWave;
            case 'QUIZ':
                return FiHelpCircle;
            default:
                return FiFileText;
        }
    };

    const getLessonColor = (type) => {
        switch (type) {
            case 'VIDEO':
                return "orange.500";
            case 'AUDIO':
                return "purple.500";
            case 'QUIZ':
                return "yellow.500";
            default:
                return "green.500";
        }
    };

    if (loading) {
        return <Spinner size="xl" />;
    }

    return (
        <Box mt={4}>
            {curriculumData.map((section, index) => (
                <Box key={section.id} mb={4}>
                    <HStack justify="space-between" cursor="pointer" onClick={() => toggleSection(index)}>
                        <Text fontWeight="bold" fontSize="xl">{section.title}</Text>
                        <Icon as={openSections[index] ? FaChevronDown : FaChevronUp} />
                    </HStack>
                    <Collapse in={openSections[index]} animateOpacity>
                        <VStack spacing={4} align="stretch" mt={4}>
                            {section.lessons.map((lesson, lessonIndex) => (
                                <HStack key={lesson.id} justify="space-between">
                                    <HStack>
                                        <Icon as={lesson.icon} color={lesson.color} />
                                        <Text>{lesson.title}</Text>
                                    </HStack>
                                    <Text>
                                        {lesson.duration > 0 ? `${lesson.duration} min` :
                                            lesson.title.toLowerCase().includes("quiz") ? "8 questions" :
                                                lesson.title.toLowerCase().includes("zoom") ? "Zoom lesson" :
                                                    "Stream lesson"}
                                    </Text>
                                </HStack>
                            ))}
                        </VStack>
                    </Collapse>
                </Box>
            ))}
        </Box>
    );
};

export default Curriculum;