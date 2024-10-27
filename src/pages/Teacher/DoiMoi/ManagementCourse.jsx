import { ChakraProvider, Box, VStack, HStack, Button } from "@chakra-ui/react";
import { useState } from "react";
import Curriculum from "~/pages/Teacher/DoiMoi/Curriculum";
import Drip from "~/pages/Teacher/DoiMoi/Curriculum";
import Settings from "~/pages/Teacher/DoiMoi/Setting";
import Pricing from "~/pages/Teacher/DoiMoi/Curriculum";
import FAQ from "~/pages/Teacher/DoiMoi/Faq";
import Notice from "~/pages/Teacher/DoiMoi/Notice";

function ManagementCourse() {
  const [activeComponent, setActiveComponent] = useState("Curriculum");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Curriculum":
        return <Curriculum />;
      case "Drip":
        return <Drip />;
      case "Settings":
        return <Settings />;
      case "Pricing":
        return <Pricing />;
      case "FAQ":
        return <FAQ />;
      case "Notice":
        return <Notice />;
      default:
        return <Curriculum />;
    }
  };

  return (
    <ChakraProvider>
      <VStack h="100vh" bg="gray.50" p={5}>
        {/* Menu Buttons */}
        <HStack spacing={5} mb={5}>
          <Button onClick={() => setActiveComponent("Curriculum")}>
            Curriculum
          </Button>
          <Button onClick={() => setActiveComponent("Drip")}>Drip</Button>
          <Button onClick={() => setActiveComponent("Settings")}>Settings</Button>
          <Button onClick={() => setActiveComponent("Pricing")}>Pricing</Button>
          <Button onClick={() => setActiveComponent("FAQ")}>FAQ</Button>
          <Button onClick={() => setActiveComponent("Notice")}>Notice</Button>
        </HStack>

        {/* Render the selected component */}
        <Box w="full" h="full" bg="white" p={5} rounded="md">
          {renderComponent()}
        </Box>
      </VStack>
    </ChakraProvider>
  );
}

export default ManagementCourse;