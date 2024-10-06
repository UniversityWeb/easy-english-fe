import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import CourseHeader from "./Header/Header";
import CourseForm from "./Main/Main";
import Curriculum from "~/pages/Teacher/CourseDetail/Curriculum/Curriculum";
import { useParams, useNavigate } from "react-router-dom";
import Price from "./Price/Price";

const CourseDetail = () => {
  const [activeTab, setActiveTab] = useState("Curriculum");
  const { courseId } = useParams();
  const navigate = useNavigate(); 

  const handleBackClick = () => {
    navigate('/course-management-for-teacher'); 
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Curriculum":
        return <Curriculum courseId={courseId} />;
      case "Main":
        return <CourseForm courseId={courseId} />;
      case "Settings":
        return <Text>FAQ Content goes here.</Text>;
      case "Pricing":
        return <Price courseId={courseId} />;
      case "FAQ":
        return <Text>FAQ Content goes here.</Text>;
      case "Notice":
        return <Text>Notice Content goes here.</Text>;
      default:
        return <Text>Curriculum Content goes here.</Text>;
    }
  };

  return (
    <Box>
      <CourseHeader
        courseTitle="How to Design Components Right"
        onBackClick={handleBackClick}
        isPublished={true}
        setActiveTab={setActiveTab}
      />
      <Box p={8}>{renderTabContent()}</Box>
    </Box>
  );
};

export default CourseDetail;
