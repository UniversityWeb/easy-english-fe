import React, { useState, useEffect, useRef } from 'react';
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
  Input,
  useToast,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react';
import { RiDeleteBinFill } from 'react-icons/ri';
import { PiPencilSimpleFill } from 'react-icons/pi';
import ProfileEdit from '~/components/Admin/UserManagement/UserDetail';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import userService from '~/services/userService'; // Import the service
import { size } from 'lodash';

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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    username: '',
    role: '',
    gender: '',
    status: '',
    page: 1,
    size: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = useToast();
  const resizableColumns = useRef([]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const filterReq = []; // You can build this from the `filters` state if needed
      const response = await userService.getUsersWithoutAdmin(filters);
      setUsers(response.data); // Assuming `response.data` contains the users list
      setFilteredUsers(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

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
    setFilteredUsers((prevFilteredUsers) => {
      if (selectedUser) {
        return prevFilteredUsers.map((user) =>
          user.username === updatedUser.username ? updatedUser : user,
        );
      } else {
        return [...prevFilteredUsers, updatedUser];
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
    const updatedUsers = users.filter((user) => user.username !== username);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    toast({
      title: 'User deleted.',
      description: `User ${username} has been deleted successfully.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Apply filters and fetch users when the search button is clicked
  const handleSearch = async () => {
    try {
      const filterReq = { ...filters }; // Use the filters state to build the request
      const response = await userService.getUsersWithoutAdmin(filterReq);
      setFilteredUsers(response.data);
    } catch (error) {
      toast({
        title: 'Error applying filters',
        description: error.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Ref to track resizing columns
  useEffect(() => {
    let currentIndex = null;
    let nextIndex = null;
    let startX = null;
    let startWidth = null;
    let nextWidth = null;

    function initResize(e, index) {
      currentIndex = index;
      nextIndex = index + 1;
      startX = e.clientX;
      startWidth = resizableColumns.current[currentIndex].offsetWidth;
      nextWidth = resizableColumns.current[nextIndex]?.offsetWidth || 0;

      window.addEventListener('mousemove', resizeColumn);
      window.addEventListener('mouseup', stopResize);
    }

    function resizeColumn(e) {
      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;
      const newNextWidth = nextWidth - deltaX;

      if (newWidth > 50 && newNextWidth > 50) {
        resizableColumns.current[currentIndex].style.width = `${newWidth}px`;
        resizableColumns.current[nextIndex].style.width = `${newNextWidth}px`;
      }
    }

    function stopResize() {
      window.removeEventListener('mousemove', resizeColumn);
      window.removeEventListener('mouseup', stopResize);
    }

    resizableColumns.current.forEach((th, index) => {
      if (index < resizableColumns.current.length - 1) {
        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        th.appendChild(resizer);
        resizer.addEventListener('mousedown', (e) => initResize(e, index));
      }
    });
  }, []);

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={5}>
          <Heading>User Management</Heading>
          <Button colorScheme="teal" onClick={() => handleEdit()}>
            Add User
          </Button>
        </Flex>

        {/* Filter Section */}
        <Flex mb={4} gap={4}>
          <Box>
            <Input
              placeholder="Search by username"
              name="username"
              value={filters.username}
              onChange={handleFilterChange}
            />
          </Box>
          <Box>
            <Select
              placeholder="Filter by role"
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
            >
              {Object.keys(ROLE_OPTIONS).map((key) => (
                <option key={key} value={key}>
                  {ROLE_OPTIONS[key]}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Select
              placeholder="Filter by gender"
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
            >
              {Object.keys(GENDER_OPTIONS).map((key) => (
                <option key={key} value={key}>
                  {GENDER_OPTIONS[key]}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Select
              placeholder="Filter by status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              {Object.keys(STATUS_OPTIONS).map((key) => (
                <option key={key} value={key}>
                  {STATUS_OPTIONS[key]}
                </option>
              ))}
            </Select>
          </Box>
          <Button colorScheme="blue" onClick={handleSearch}>
            Search
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table
            variant="simple"
            colorScheme="whiteAlpha"
            className="resizable-table"
          >
            <Thead bg="gray.100">
              <Tr>
                <Th ref={(el) => (resizableColumns.current[0] = el)}>Avatar</Th>
                <Th ref={(el) => (resizableColumns.current[1] = el)}>
                  Username
                </Th>
                <Th ref={(el) => (resizableColumns.current[2] = el)}>
                  Full Name
                </Th>
                <Th ref={(el) => (resizableColumns.current[3] = el)}>Email</Th>
                <Th ref={(el) => (resizableColumns.current[4] = el)}>
                  Phone Number
                </Th>
                <Th ref={(el) => (resizableColumns.current[5] = el)}>Gender</Th>
                <Th ref={(el) => (resizableColumns.current[6] = el)}>Role</Th>
                <Th ref={(el) => (resizableColumns.current[7] = el)}>Status</Th>
                <Th ref={(el) => (resizableColumns.current[8] = el)}>Bio</Th>
                <Th ref={(el) => (resizableColumns.current[9] = el)}>
                  Created At
                </Th>
                <Th ref={(el) => (resizableColumns.current[10] = el)}>
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user) => (
                <Tr key={user.username}>
                  <Td>
                    <Avatar src={user.avatarPath} name={user.fullName} />
                  </Td>
                  <Td>{user.username}</Td>
                  <Td>{user.fullName}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.phoneNumber}</Td>
                  <Td>{GENDER_OPTIONS[user.gender]}</Td>
                  <Td>{ROLE_OPTIONS[user.role]}</Td>
                  <Td>{STATUS_OPTIONS[user.status]}</Td>
                  <Td>{user.bio}</Td>
                  <Td>{user.createdAt}</Td>
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
          <ModalContent
            style={{ zoom: 0.85 }}
            width="auto"
            height="auto"
            minW="900px"
            maxH="800px"
          >
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

      {/* Styles for resizable columns */}
      <style>{`
        .resizable-table th, .resizable-table td {
          border-right: 1px solid #e2e8f0;
          padding: 8px;
          white-space: nowrap;
          position: relative;
        }
        .resizable-table th:last-child, .resizable-table td:last-child {
          border-right: none;
        }
        .resizer {
          position: absolute;
          top: 0;
          right: 0;
          width: 5px;
          height: 100%;
          cursor: col-resize;
          background-color: transparent;
        }
      `}</style>
    </RoleBasedPageLayout>
  );
};

export default UserManagement;
