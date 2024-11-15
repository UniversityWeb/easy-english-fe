import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  Grid,
  GridItem,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

// Constants for options
const GENDER_OPTIONS = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

const ROLE_OPTIONS = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
};

const STATUS_OPTIONS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  DELETED: "Deleted",
};

function ProfileEdit({ user, onSave }) {
  const toast = useToast();

  // State to store temporary data for editing
  const [tempData, setTempData] = useState(user);

  useEffect(() => {
    setTempData(user); // Reset tempData if the user prop changes
  }, [user]);

  // Handle input changes for tempData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData((prev) => ({
          ...prev,
          avatarPath: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle avatar click
  const handleAvatarClick = () => {
    document.getElementById("avatarUpload").click();
  };

  // Handle form submission and call onSave with updated data
  const handleSubmit = () => {
    onSave(tempData);
    toast({
      title: "Profile Updated",
      description: "User profile has been successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={10}>
      <Flex bg="transparent" overflow="hidden" maxW="900px" mx="auto">
        {/* Avatar and User Info */}
        <Box
          flex="1"
          bg="transparent"
          p={6}
          textAlign="center"
          position="relative"
        >
          <Box position="relative" w="150px" h="150px" mx="auto">
            <Avatar
              size="full"
              name={tempData.fullName}
              src={tempData.avatarPath || "https://via.placeholder.com/150"}
              cursor="pointer"
              onClick={handleAvatarClick}
            />
            <IconButton
              icon={<AddIcon />}
              position="absolute"
              bottom="0"
              right="0"
              borderRadius="full"
              colorScheme="purple"
              onClick={handleAvatarClick}
              aria-label="Upload Avatar"
            />
          </Box>
          <Input
            id="avatarUpload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            display="none"
          />
          <Heading size="md" mt={4}>
            {tempData.fullName}
          </Heading>
          <Text color="gray.500">{tempData.email}</Text>
          <Text color="gray.500" mb={4}>
            {tempData.phoneNumber}
          </Text>
        </Box>

        {/* Profile Edit Form */}
        <Box flex="2" p={8}>
          <Heading size="md" mb={6}>
            Edit Profile
          </Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  value={tempData.username}
                  onChange={handleChange}
                  isReadOnly // Set to read-only if username should not be editable
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="fullName"
                  value={tempData.fullName}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Input
                  name="bio"
                  value={tempData.bio}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phoneNumber"
                  value={tempData.phoneNumber}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={tempData.email}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  value={tempData.gender}
                  onChange={handleChange}
                >
                  {Object.keys(GENDER_OPTIONS).map((key) => (
                    <option key={key} value={key}>
                      {GENDER_OPTIONS[key]}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  name="role"
                  value={tempData.role}
                  onChange={handleChange}
                >
                  {Object.keys(ROLE_OPTIONS).map((key) => (
                    <option key={key} value={key}>
                      {ROLE_OPTIONS[key]}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={tempData.status}
                  onChange={handleChange}
                >
                  {Object.keys(STATUS_OPTIONS).map((key) => (
                    <option key={key} value={key}>
                      {STATUS_OPTIONS[key]}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
          </Grid>
          <Button
            mt={6}
            colorScheme="purple"
            size="lg"
            width="100%"
            onClick={handleSubmit}
          >
            Save Profile
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}

export default ProfileEdit;
