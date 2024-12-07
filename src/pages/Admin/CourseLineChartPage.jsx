import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Avatar,
} from '@chakra-ui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import RoleBasedPageLayout from '~/components/RoleBasedPageLayout';
import { formatVNDMoney } from '~/utils/methods';
import courseStatisticsService from '~/services/courseStatisticsService';

const CourseLineChartPage = () => {
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCourses, setVisibleCourses] = useState({});

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await courseStatisticsService.getRevenueByYear(2024);
        setData(response.data);
        setCourses(response.courses);
        setVisibleCourses(
          response.courses.reduce((acc, course) => {
            acc[course.key] = true;
            return acc;
          }, {}),
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLegendClick = (courseKey) => {
    setVisibleCourses((prev) => ({
      ...prev,
      [courseKey]: !prev[courseKey],
    }));
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
          Earnings Overview (3 Courses)
        </Text>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {courses.map((course, index) => (
                <linearGradient
                  key={course.key}
                  id={`color${index + 1}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={course.color}
                    stopOpacity={0.8}
                  />
                  <stop offset="95%" stopColor={course.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => formatVNDMoney(value)} // Format Y-axis values as VND
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              formatter={(value) => formatVNDMoney(value)} // Format tooltip values as VND
            />
            <Legend
              formatter={(value) => {
                const course = courses.find((c) => c.key === value);
                return (
                  <span
                    onClick={() => handleLegendClick(value)}
                    style={{
                      textDecoration: visibleCourses[value]
                        ? 'none'
                        : 'line-through',
                      cursor: 'pointer',
                      color: course?.color,
                    }}
                  >
                    {course?.label}
                  </span>
                );
              }}
            />
            {courses.map((course, index) => (
              <Area
                key={course.key}
                type="monotone"
                dataKey={course.key}
                stroke={course.color}
                fillOpacity={1}
                fill={`url(#color${index + 1})`}
                style={{
                  strokeWidth: visibleCourses[course.key] ? 2 : 0,
                  opacity: visibleCourses[course.key] ? 1 : 0.2,
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      {/* Table Section */}
      <Box w="full" p={5} shadow="md" borderWidth="1px" rounded="md">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Monthly Course Earnings
        </Text>
        <Box overflowX="auto">
          <Table
            variant="simple"
            colorScheme="whiteAlpha"
            className="resizable-table"
          >
            <Thead bg="gray.100">
              <Tr>
                <Th>Image</Th>
                <Th width="400px">Title</Th>
                <Th width="400px">Total Revenue</Th>
                <Th>Teacher</Th>
              </Tr>
            </Thead>
            <Tbody>
              {courses.map((course) => (
                <Tr
                  key={course.id}
                  _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                >
                  <Td>
                    <Avatar src={course.imagePreview} name={course.title} />
                  </Td>
                  <Td>{course.title}</Td>
                  <Td>{course.totalRevenue}</Td>
                  <Td>{course.ownerUsername}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      <style>{`
        .resizable-table th, .resizable-table td {
          border-right: 1px solid #e2e8f0;

        }

      `}</style>
    </RoleBasedPageLayout>
  );
};

export default CourseLineChartPage;
