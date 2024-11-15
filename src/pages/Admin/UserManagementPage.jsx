import React, { useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Select,
  Button,
  IconButton,
  useToast,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { RiDeleteBinFill } from 'react-icons/ri';
import { PiPencilSimpleFill } from 'react-icons/pi';
import ProfileEdit from '~/components/Admin/UserManagement/UserDetail';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';

// Enum options
const GENDER_OPTIONS = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
};

const ROLE_OPTIONS = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
};

const STATUS_OPTIONS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DELETED: 'Deleted',
};

// Sample user data
const initialUsers = [
  {
    username: 'john_doe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123456789',
    bio: 'Software Engineer',
    gender: 'MALE',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatarPath: 'https://via.placeholder.com/150',
  },
  {
    username: 'jane_doe',
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phoneNumber: '987654321',
    bio: 'Math Teacher',
    gender: 'FEMALE',
    role: 'TEACHER',
    status: 'INACTIVE',
    avatarPath: 'https://via.placeholder.com/150',
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Holds the user being edited
  const toast = useToast();

  // Handle opening the modal for editing or adding new user
  const handleEdit = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Handle saving the updated or new user data
  const handleSave = (updatedUser) => {
    setUsers((prevUsers) => {
      if (selectedUser) {
        // Editing existing user
        return prevUsers.map((user) =>
          user.username === updatedUser.username ? updatedUser : user,
        );
      } else {
        // Adding new user
        return [...prevUsers, updatedUser];
      }
    });
    setIsModalOpen(false);
    toast({
      title: selectedUser ? 'User updated.' : 'New user added.',
      description: `User ${updatedUser.username} has been ${
        selectedUser ? 'updated' : 'added'
      } successfully.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Handle deleting a user
  const handleDelete = (username) => {
    setUsers(users.filter((user) => user.username !== username));
    toast({
      title: 'User deleted.',
      description: `User ${username} has been deleted successfully.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={5}>
          <Heading>User Management</Heading>
          <Button colorScheme="teal" onClick={() => handleEdit()}>
            Add User
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead bg="gray.100">
              <Tr>
                <Th>Avatar</Th>
                <Th>Username</Th>
                <Th>Full Name</Th>
                <Th>Email</Th>
                <Th>Phone Number</Th>
                <Th>Gender</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Bio</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.username}>
                  <Td>
                    <Avatar src={user.avatarPath} name={user.fullName} />
                  </Td>
                  <Td>{user.username}</Td>
                  <Td>{user.fullName}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.phoneNumber}</Td>
                  <Td>
                    <Select value={user.gender} isReadOnly>
                      {Object.keys(GENDER_OPTIONS).map((key) => (
                        <option key={key} value={key}>
                          {GENDER_OPTIONS[key]}
                        </option>
                      ))}
                    </Select>
                  </Td>
                  <Td>
                    <Select value={user.role} isReadOnly>
                      {Object.keys(ROLE_OPTIONS).map((key) => (
                        <option key={key} value={key}>
                          {ROLE_OPTIONS[key]}
                        </option>
                      ))}
                    </Select>
                  </Td>
                  <Td>
                    <Select value={user.status} isReadOnly>
                      {Object.keys(STATUS_OPTIONS).map((key) => (
                        <option key={key} value={key}>
                          {STATUS_OPTIONS[key]}
                        </option>
                      ))}
                    </Select>
                  </Td>
                  <Td>{user.bio}</Td>
                  <Td>
                    <IconButton
                      icon={<PiPencilSimpleFill />}
                      onClick={() => handleEdit(user)}
                      color="gray.500"
                      mr={2}
                    />
                    <IconButton
                      icon={<RiDeleteBinFill />}
                      onClick={() => handleDelete(user.username)}
                      color="gray.500"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Modal for editing or adding user profile */}
        <Modal isOpen={isModalOpen} onClose={closeModal} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent
            style={{ zoom: 0.85 }}
            width="auto"
            height="auto"
            minW="900px"
            maxH="800px"
          >
            <ModalCloseButton />
            <ProfileEdit
              user={selectedUser || {}}
              onSave={(newData) =>
                handleSave({
                  ...newData,
                  username: selectedUser
                    ? newData.username
                    : `new_user_${users.length + 1}`,
                })
              }
            />
          </ModalContent>
        </Modal>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default UserManagement;
