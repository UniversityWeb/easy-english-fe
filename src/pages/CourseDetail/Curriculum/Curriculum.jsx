import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Accordion,
    Box,
    Button,
    ChakraProvider,
    Flex,
    Heading,
    Input,
    Tabs,
    Tab,
    TabList,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { MdArrowBack, MdAdd } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Section from "../Section/Section"; // Import Section component
import TypeLesson from "../Lesson/TypeLesson"; // Import TypeLesson component
import TextLesson from "../Lesson/TextLesson"; // Import TextLesson
import { getToken } from "~/utils/authUtils";

const Curriculum = () => {
    const { courseId } = useParams();
    const [sections, setSections] = useState([]);
    const [newSectionName, setNewSectionName] = useState("");
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
    const [selectedLessonType, setSelectedLessonType] = useState(null); // New state for selected lesson type
    const [selectedLesson, setSelectedLesson] = useState(null); // Track the selected lesson
    const [isAddingLesson, setIsAddingLesson] = useState(false); // Track if adding a lesson
    const [selectedSectionId, setSelectedSectionId] = useState(null); // Track the sectionId for new lessons
    const token = getToken();
    const navigate = useNavigate();
    const toast = useToast();

    // Fetch sections from the API
    const fetchSections = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8001/sections/getAllSectionByCourse?courseId=${courseId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSections(response.data);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
    };

    useEffect(() => {
        fetchSections();
    }, [courseId, token]);

    // Add a new section
    const handleAddNewSection = async () => {
        if (newSectionName.trim() === "") return;

        const newSection = {
            courseId: courseId,
            title: newSectionName,
            lessons: [],
            createdBy: "your_username",
        };

        try {
            const response = await axios.post(
                "http://localhost:8001/sections",
                newSection,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                fetchSections();
                setNewSectionName("");
                setIsAddingSection(false);
                toast({
                    title: "Section added successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Error adding section:", error);
            toast({
                title: "Failed to add section",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Function to handle lesson type selection
    const handleLessonTypeSelect = (type) => {
        setSelectedLessonType(type);
        setIsAddingLesson(true); // Set isAddingLesson to true when a lesson type is selected
        setIsModalOpen(false); // Close the modal after selection
        setSelectedLesson(null); // Clear the selected lesson
    };

    // When a lesson is clicked, set the selected lesson
    const handleLessonClick = (lessonId) => {
        setSelectedLesson(lessonId);
        setIsAddingLesson(false); // Reset adding mode
    };

    // Handle "Add Lesson" click
    const handleAddLessonClick = (sectionId) => {
        setIsAddingLesson(true); // Enable adding lesson mode
        setSelectedLesson(null); // Clear the selected lesson
        setSelectedLessonType(null); // Reset the selected lesson type
        setSelectedSectionId(sectionId); // Set sectionId for a new lesson
        setIsModalOpen(true); // Open the modal to select lesson type
    };

    return (
        <ChakraProvider>
            <Box bg="#f4f7fc" minH="100vh">
                <Flex bg="gray.800" color="white" px="8" py="4" alignItems="center">
                    <Button
                        leftIcon={<MdArrowBack />}
                        variant="ghost"
                        colorScheme="whiteAlpha"
                        onClick={() => navigate("/")}
                    >
                        Back to courses
                    </Button>
                    <Heading as="h2" size="md" ml="4">
                        Course Curriculum
                    </Heading>
                    <Tabs variant="unstyled" ml="auto">
                        <TabList>
                            <Tab _selected={{ color: "blue.300", borderBottom: "2px solid" }}>
                                Curriculum
                            </Tab>
                            <Tab>Drip</Tab>
                            <Tab>Settings</Tab>
                            <Tab>Pricing</Tab>
                            <Tab>FAQ</Tab>
                            <Tab>Notice</Tab>
                        </TabList>
                    </Tabs>
                    <Button colorScheme="blue" variant="solid" mr="4">
                        Published
                    </Button>
                    <Button colorScheme="gray" variant="outline">
                        View
                    </Button>
                </Flex>

                <Flex p="8">
                    <Box flex="1" mr="8">
                        <Heading size="lg" mb="4">
                            Curriculum
                        </Heading>

                        <Accordion allowMultiple allowToggle>
                            {sections.map((section) => (
                                <Section
                                    key={section.id}
                                    section={section}
                                    fetchSections={fetchSections}
                                    openTypeLessonModal={(sectionId) => handleAddLessonClick(sectionId)} // Pass sectionId
                                    onLessonClick={handleLessonClick} // Pass the lesson click handler
                                />
                            ))}
                        </Accordion>

                        {isAddingSection ? (
                            <VStack mt="8" spacing="4" align="start">
                                <Input
                                    placeholder="Enter section name"
                                    value={newSectionName}
                                    onChange={(e) => setNewSectionName(e.target.value)}
                                />
                                <Button colorScheme="blue" onClick={handleAddNewSection}>
                                    Add
                                </Button>
                            </VStack>
                        ) : (
                            <Button
                                leftIcon={<MdAdd />}
                                colorScheme="blue"
                                variant="outline"
                                mt="8"
                                width="100%"
                                onClick={() => setIsAddingSection(true)} // Open section input
                            >
                                New section
                            </Button>
                        )}
                    </Box>

                    <Box flex="2" display="flex" justifyContent="center" alignItems="center">
                        {selectedLesson && !isAddingLesson ? (
                            <TextLesson lessonId={selectedLesson} sectionId={selectedSectionId} />
                        ) : isAddingLesson && selectedLessonType === "Text lesson" ? (
                            <TextLesson sectionId={selectedSectionId} /> // Pass sectionId for adding
                        ) : isAddingLesson ? (
                            <VStack>
                                <Heading size="md">Create a new lesson here!</Heading>
                                <Text textAlign="center" color="gray.500" maxW="md">
                                    Get started by adding details to your new lesson.
                                </Text>
                            </VStack>
                        ) : (
                            <VStack>
                                <Heading size="md">Let's build your course!</Heading>
                                <Text textAlign="center" color="gray.500" maxW="md">
                                    Get started by creating the lessons from scratch in the column on
                                    the left or import your educational content.
                                </Text>
                            </VStack>
                        )}
                    </Box>
                </Flex>

                {/* Add the TypeLesson modal */}
                <TypeLesson
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handleLessonTypeSelect}
                />
            </Box>
        </ChakraProvider>
    );
};

export default Curriculum;