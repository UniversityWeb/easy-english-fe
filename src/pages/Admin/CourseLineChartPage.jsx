import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Flex, Select, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import { formatVNDMoney } from '~/utils/methods';
import courseStatisticsService from '~/services/courseStatisticsService';
import config from '~/config';
import { useNavigate } from 'react-router-dom';

const CourseBarChartPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10); // Ensure only the top 10 courses are shown
  const [totalPages, setTotalPages] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await courseStatisticsService.getRevenueByMonthAndYear(
          month,
          year,
          page,
          size
        );

        // Sort the data by revenue in descending order and keep only the top 10 courses
        const sortedData = response.content
          .sort((a, b) => b.totalRevenue - a.totalRevenue)
          .slice(0, 10);

        setData(sortedData.map((item) => ({ name: item.title, ...item })));
        setCourses(sortedData);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year, page, size]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleMonthChange = (event) => {
    setMonth(Number(event.target.value));
    setPage(0); // Reset pagination when changing filters
  };

  const handleYearChange = (event) => {
    setYear(Number(event.target.value));
    setPage(0); // Reset pagination when changing filters
  };

  if (loading) {
    return (
      <RoleBasedPageLayout>
        <Box w="full" p={5} textAlign="center">
          <Spinner size="xl" />
        </Box>
      </RoleBasedPageLayout>
    );
  }

  return (
    <RoleBasedPageLayout>
      {/* Chart Section */}
      <Box w="full" p={5} shadow="md" borderWidth="1px" rounded="md" mb={8}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
          Top 10 Courses by Revenue ({courses.length} Courses)
        </Text>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 50, left: 50, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => formatVNDMoney(value)}
              tick={{ fontSize: 12 }} // Adjust font size for better readability
              padding={{ top: 10, bottom: 10 }} // Add padding to avoid label clipping
              width={100} // Increase width for longer labels
            />
            <Tooltip formatter={(value) => formatVNDMoney(value)} />
            <Bar
              dataKey="totalRevenue"
              fill="#8884d8"
              name="Total Revenue"
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Filter Section */}
      <Box w="full" p={4} mb={2} shadow="md" borderWidth="1px" rounded="md">
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold">
            Filter by Month & Year
          </Text>
          <Flex gap={4}>
            <Select
              placeholder="Select Month"
              value={month}
              onChange={handleMonthChange}
              maxWidth="150px"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Select Year"
              value={year}
              onChange={handleYearChange}
              maxWidth="150px"
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Box>

      {/* Table Section */}
      <Box w="full" p={5} shadow="md" borderWidth="1px" rounded="md">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Monthly Course Earnings (Top 10)
        </Text>
        <Box overflowX="auto">
          <Table variant="simple" colorScheme="whiteAlpha">
            <Thead bg="gray.100">
              <Tr>
                <Th>Top</Th>
                <Th>Image</Th>
                <Th>Title</Th>
                <Th>Total Revenue</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses.map((course, index) => (
                <Tr
                  key={course.id}
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  onClick={() =>
                    navigate(config.routes.course_detail(course?.id))
                  }
                >
                  <Td>
                    {index + 1}
                  </Td>
                  <Td>
                    <Avatar src={course.imagePreview} name={course.title} />
                  </Td>
                  <Td>{course.title}</Td>
                  <Td>{formatVNDMoney(course.totalRevenue)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        {/* Pagination Controls */}
        <Box mt={4} textAlign="center">
          <Button
            onClick={() => handlePageChange(page - 1)}
            isDisabled={page === 0}
            mr={2}
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePageChange(page + 1)}
            isDisabled={page + 1 >= totalPages}
          >
            Next
          </Button>
        </Box>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default CourseBarChartPage;