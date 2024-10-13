import React from "react";
import { Button, Flex, Heading, Tabs, Tab, TabList } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CourseHeader = ({ courseTitle, onBackClick, isPublished, setActiveTab }) => {
    const navigate = useNavigate();

    return (
        <Flex bg="gray.800" color="white" px="8" py="4" alignItems="center">
            <Button
                leftIcon={<MdArrowBack />}
                variant="ghost"
                colorScheme="whiteAlpha"
                onClick={onBackClick}
            >
                Back to courses
            </Button>
            <Heading as="h2" size="md" ml="4">
                {courseTitle || "Course Curriculum"}
            </Heading>
            <Tabs
                variant="unstyled"
                ml="auto"
                onChange={(index) => {
                    const tabNames = ["Curriculum", "Main", "Settings", "Pricing", "FAQ", "Notice"];
                    setActiveTab(tabNames[index]);
                }}
            >
                <TabList>
                    <Tab _selected={{ color: "blue.300", borderBottom: "2px solid" }}>
                        Curriculum
                    </Tab>
                    <Tab _selected={{ color: "blue.300", borderBottom: "2px solid" }}>Main</Tab>
                    <Tab _selected={{ color: "blue.300", borderBottom: "2px solid" }}>Settings</Tab>
                    <Tab _selected={{ color: "blue.300", borderBottom: "2px solid" }}>Pricing</Tab>
                    <Tab _selected={{ color: "blue.300", borderBottom: "2px solid" }}>FAQ</Tab>
                    <Tab _selected={{ color: "blue.300", borderBottom: "2px solid" }}>Notice</Tab>
                </TabList>
            </Tabs>
            <Button colorScheme={isPublished ? "blue" : "gray"} variant="solid" mr="4">
                {isPublished ? "Published" : "Draft"}
            </Button>
            <Button colorScheme="gray" variant="outline" onClick={() => navigate("/course/view")}>
                View
            </Button>
        </Flex>
    );
};

export default CourseHeader;