import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    Textarea,
    Switch,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import textLessonService from "~/services/textLessonService";
import useCustomToast from "~/hooks/useCustomToast";

const TextLesson = ({ lessonId, sectionId }) => {
    const [lesson, setLesson] = useState({
        title: "",
        content: "",
        description: "",
        duration: "",
        isPreview: false,
        startDate: "",
        startTime: "",
    });
    const [file, setFile] = useState(null); // State for holding the file
    const { successToast, errorToast } = useCustomToast();
    const lessonRequest = {
        id: lessonId,
        sectionId: sectionId,
    };

    useEffect(() => {
        if (lessonId) {
            const fetchLesson = async () => {
                try {
                    const data = await textLessonService.fetchLessonById(lessonRequest);
                    setLesson({
                        ...data,
                        startTime: data.startTime ? data.startTime.slice(0, 5) : "",
                    });
                } catch (error) {
                    errorToast("Error fetching lesson data.");
                }
            };
            fetchLesson();
        }
    }, [lessonId]);

    const handleSubmit = async () => {
        try {
            const formData = new FormData(); // Create a new FormData object
            formData.append("id", lessonId);
            formData.append("title", lesson.title);
            formData.append("content", lesson.content);
            formData.append("description", lesson.description);
            formData.append("duration", lesson.duration);
            formData.append("isPreview", lesson.isPreview);
            formData.append("startDate", lesson.startDate);
            formData.append("startTime", lesson.startTime);
            formData.append("sectionId", sectionId);

            // If a file is selected, append it to the form data
            if (file) {
                formData.append("file", file);
            }

            if (lessonId) {
                await textLessonService.updateLesson(formData);
                successToast("Lesson updated successfully.");
            } else {
                await textLessonService.createLesson(formData);
                successToast("Lesson created successfully.");
            }
        } catch (error) {
            errorToast("Error saving lesson.");
        }
    };

    return (
        <Box p={5} shadow="md" borderWidth="1px" width="100%">
            <FormControl mb={4}>
                <FormLabel>Lesson Title</FormLabel>
                <Input
                    value={lesson.title}
                    onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                    placeholder="Enter lesson title"
                />
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Duration (minutes)</FormLabel>
                <Input
                    type="number"
                    value={lesson.duration}
                    onChange={(e) => setLesson({ ...lesson, duration: e.target.value })}
                    placeholder="Enter lesson duration"
                />
            </FormControl>

            <FormControl display="flex" alignItems="center" mb={4}>
                <Switch
                    id="preview-switch"
                    isChecked={lesson.isPreview}
                    onChange={(e) => setLesson({ ...lesson, isPreview: e.target.checked })}
                />
                <FormLabel htmlFor="preview-switch" ml={2}>
                    Enable Preview
                </FormLabel>
            </FormControl>

            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem>
                    <FormControl>
                        <FormLabel>Start Date</FormLabel>
                        <Input
                            type="date"
                            value={lesson.startDate}
                            onChange={(e) => setLesson({ ...lesson, startDate: e.target.value })}
                        />
                    </FormControl>
                </GridItem>

                <GridItem>
                    <FormControl>
                        <FormLabel>Start Time</FormLabel>
                        <Input
                            type="time"
                            value={lesson.startTime}
                            onChange={(e) => setLesson({ ...lesson, startTime: e.target.value })}
                        />
                    </FormControl>
                </GridItem>
            </Grid>

            <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                    value={lesson.description}
                    onChange={(e) => setLesson({ ...lesson, description: e.target.value })}
                    placeholder="Enter lesson description"
                />
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Content</FormLabel>
                <Textarea
                    value={lesson.content}
                    onChange={(e) => setLesson({ ...lesson, content: e.target.value })}
                    placeholder="Enter lesson content"
                    rows={6}
                />
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Upload File</FormLabel>
                <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])} // Capture the file
                />
            </FormControl>

            <Button colorScheme="blue" onClick={handleSubmit}>
                {lessonId ? "Save Changes" : "Add Lesson"}
            </Button>
        </Box>
    );
};

export default TextLesson;