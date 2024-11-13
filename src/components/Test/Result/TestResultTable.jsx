import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Button, Table, Thead, Tbody, Tr, Th, Td, Input, VStack, HStack, Text, Skeleton, Icon, Flex, InputGroup, InputLeftElement
} from '@chakra-ui/react';
import { FaSearch, FaFilter, FaBan, FaRedo } from 'react-icons/fa';
import websocketService from '~/services/websocketService';
import { websocketConstants } from '~/utils/websocketConstants';
import testResultService from '~/services/testResultService';
import useCustomToast from '~/hooks/useCustomToast';
import { TEST_RESULT_STATUSES } from '~/utils/constants';

const TestResultTable = ({ testId }) => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [searchFilters, setSearchFilters] = useState({
    username: '',
    finishedAt: '',
  });
  const [currentPage, setCurrentPage] = useState(0); // Page index starts from 0
  const [totalPages, setTotalPages] = useState(1);   // Total number of pages
  const [pageSize] = useState(10);                   // Fixed page size
  const { successToast, errorToast } = useCustomToast();

  // Fetch test results by testId with pagination
  const fetchTestResults = async (page = 0) => {
    setLoading(true); // Trigger loading
    try {
      const data = await testResultService.getTestHistory(testId, page, pageSize);
      setTestResults(data.content || []);
      setTotalPages(data.totalPages || 1); // Update total pages from the response
      setLoading(false); // Stop loading
    } catch (error) {
      console.error('Error fetching test results:', error);
      setLoading(false); // Stop loading even if there's an error
    }
  };

  // Effect to fetch test results on component mount and when page changes
  useEffect(() => {
    fetchTestResults(currentPage);
  }, [testId, currentPage]);

  // WebSocket effect to listen for new test result notifications
  useEffect(() => {
    websocketService.connect(() => {
      websocketService.subscribe(websocketConstants.testResultNotificationTopic(testId), (notification) => {
        const newResult = JSON.parse(notification.body);
        setTestResults((prevResults) => [newResult, ...prevResults]); // Add new result to the top of the table
        successToast('New test result added!');
      });
    });

    // Cleanup WebSocket on unmount
    return () => {
      websocketService.unsubscribe(websocketConstants.testResultNotificationTopic(testId));
      websocketService.disconnect();
    };
  }, []);

  // Handle deleting a test result
  const deleteTestResult = useCallback(async (id) => {
    try {
      await testResultService.remove(id);
      setTestResults((prevResults) => prevResults.filter((result) => result.id !== id));
      successToast('Test result deleted successfully!');
    } catch (error) {
      console.error('Error deleting test result:', error);
      errorToast('Failed to delete test result.');
    }
  }, []);

  // Handle filtering the results based on username and finishedAt
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Apply filters to test results
  const filteredResults = testResults.filter((result) => {
    const matchesUsername = result.username.toLowerCase().includes(searchFilters.username.toLowerCase());
    const matchesFinishedAt = searchFilters.finishedAt
      ? result.finishedAt.startsWith(searchFilters.finishedAt)
      : true;
    return matchesUsername && matchesFinishedAt;
  });

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  // Reload the table data
  const handleReload = () => {
    fetchTestResults(currentPage);  // Fetch the data again for the current page
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TEST_RESULT_STATUSES.DONE:
        return 'green.200'; // Green color for DONE status
      case TEST_RESULT_STATUSES.IN_PROGRESS:
        return 'yellow.200'; // Yellow color for IN_PROGRESS status
      case TEST_RESULT_STATUSES.FAILED:
        return 'red.200'; // Red color for FAILED status
      default:
        return 'gray.100'; // Default color
    }
  };

  return (
    <Box p={4} shadow="md" borderWidth="1px" borderRadius="md">
      {/* Filter Bar */}
      <VStack spacing={4} mb={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Filter by username"
            name="username"
            value={searchFilters.username}
            onChange={handleFilterChange}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FaFilter} color="gray.300" />
          </InputLeftElement>
          <Input
            type="date"
            placeholder="Filter by finishedAt (YYYY-MM-DD)"
            name="finishedAt"
            value={searchFilters.finishedAt}
            onChange={handleFilterChange}
          />
        </InputGroup>
      </VStack>

      {/* Reload Button */}
      <HStack justifyContent="flex-end" mb={4}>
        <Button leftIcon={<FaRedo />} colorScheme="blue" onClick={handleReload} isLoading={loading}>
          Reload
        </Button>
      </HStack>

      {/* Table Container with Fixed Height, Scrollable */}
      <Box borderWidth="1px" borderRadius="md" overflow="auto" maxHeight="400px">
        {loading ? (
          <Skeleton height="400px" />
        ) : testResults.length === 0 ? (
          // Show Empty State if there are no results
          <Flex direction="column" alignItems="center" justifyContent="center" height="400px">
            <Icon as={FaBan} boxSize="50px" color="gray.400" />
            <Text mt={4} fontSize="lg" color="gray.500">
              No test results found.
            </Text>
          </Flex>
        ) : (
          <Table variant="simple" size="sm" minWidth="800px" overflowX="auto">
            <Thead>
              <Tr>
                <Th>Username</Th>
                <Th>Correct Percent</Th>
                <Th>Status</Th>
                <Th>Started At</Th>
                <Th>Finished At</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredResults.map((result) => (
                <Tr key={result.id}>
                  <Td>{result.username}</Td>
                  <Td>{new Intl.NumberFormat('en-US', {
                      style: 'percent',
                      maximumFractionDigits: 2,
                    }).format(result.correctPercent / 100)}
                  </Td>
                  <Td>
                    <Box
                      bg={getStatusColor(result.status)} // Apply background color based on status
                      borderRadius="md"
                      p={2}
                      textAlign="center"
                    >
                      {result.status}
                    </Box>
                  </Td>
                  <Td>{new Date(result.startedAt).toLocaleString()}</Td>
                  <Td>{new Date(result.finishedAt).toLocaleString()}</Td>
                  <Td>
                    <Button colorScheme="red" size="sm" onClick={() => deleteTestResult(result.id)}>
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Pagination Controls - Centered and placed at the bottom */}
      <HStack justifyContent="center" mt={4}>
        <Button onClick={handlePreviousPage} isDisabled={currentPage === 0}>
          Previous
        </Button>
        <Text>Page {currentPage + 1} of {totalPages}</Text>
        <Button onClick={handleNextPage} isDisabled={currentPage === totalPages - 1 || totalPages === 0}>
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default TestResultTable;