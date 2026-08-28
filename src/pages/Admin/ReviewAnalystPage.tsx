import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { FiCalendar, FiSettings } from 'react-icons/fi';
import RoleBasedPageLayout from '@/components/organisms/RoleBasedPageLayout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const reviewData = {
  labels: [
    '08/11',
    '08/12',
    '08/13',
    '08/14',
    '08/15',
    '08/16',
    '08/17',
    '08/18',
    '08/19',
    '08/20',
    '08/21',
    '08/22',
    '08/23',
    '08/24',
    '08/25',
    '08/26',
    '08/27',
    '08/28',
    '08/29',
    '08/30',
    '08/31',
  ],
  datasets: [
    {
      label: 'Reviews',
      data: [0, 0, 0, 1, 0, 6, 3, 4, 6, 5, 2, 4, 5, 6, 3, 2, 5, 6, 3, 4, 5],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1.5,
      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      pointBorderColor: '#fff',
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ],
};

const reviewTypeData = {
  labels: [
    '08/11',
    '08/12',
    '08/13',
    '08/14',
    '08/15',
    '08/16',
    '08/17',
    '08/18',
    '08/19',
    '08/20',
    '08/21',
    '08/22',
    '08/23',
    '08/24',
    '08/25',
    '08/26',
    '08/27',
    '08/28',
    '08/29',
    '08/30',
    '08/31',
  ],
  datasets: [
    {
      label: '1 star',
      data: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: 'purple',
      borderWidth: 1.5,
      pointBackgroundColor: 'purple',
      pointBorderColor: '#fff',
      pointRadius: 6,
      pointHoverRadius: 8,
    },
    {
      label: '2 stars',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: 'red',
      borderWidth: 1.5,
      pointBackgroundColor: 'red',
      pointBorderColor: '#fff',
      pointRadius: 6,
      pointHoverRadius: 8,
    },
    {
      label: '3 stars',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      borderColor: 'orange',
      borderWidth: 1.5,
      pointBackgroundColor: 'orange',
      pointBorderColor: '#fff',
      pointRadius: 6,
      pointHoverRadius: 8,
    },
    {
      label: '4 stars',
      data: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 2, 1, 0, 0, 1, 0, 0, 1, 2, 2],
      borderColor: 'green',
      borderWidth: 1.5,
      pointBackgroundColor: 'green',
      pointBorderColor: '#fff',
      pointRadius: 6,
      pointHoverRadius: 8,
    },
    {
      label: '5 stars',
      data: [0, 0, 0, 0, 0, 5, 2, 4, 6, 4, 1, 2, 4, 6, 3, 1, 5, 6, 3, 2, 3],
      borderColor: 'blue',
      borderWidth: 1.5,
      pointBackgroundColor: 'blue',
      pointBorderColor: '#fff',
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ],
};

const chartOptions = {
  scales: {
    x: {
      grid: {
        drawOnChartArea: false,
      },
    },
    y: {
      grid: {
        display: true,
        color: 'rgba(200, 200, 200, 0.5)',
      },
    },
  },
};

const ReviewReport = () => {
  const tableBg = useColorModeValue('white', 'gray.700');

  return (
    <RoleBasedPageLayout>
      <Box p={5}>
        <HStack justify="space-between" mb={5}>
          <Text fontSize="2xl" fontWeight="bold">
            Reviews Report
          </Text>
          <HStack>
            <Button
              leftIcon={<FiCalendar />}
              colorScheme="blue"
              variant="outline"
            >
              Date range
            </Button>
            <Text>Aug 11, 2024 - Aug 31, 2024</Text>
            <IconButton icon={<FiSettings />} aria-label="Settings" />
          </HStack>
        </HStack>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <Box
              p={5}
              bg="gray.50"
              rounded="md"
              shadow="md"
              style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
            >
              <Text fontSize="lg" fontWeight="bold" mb={3}>
                Reviews <span style={{ float: 'right' }}>52</span>
              </Text>
              <Line data={reviewData} options={chartOptions} />
            </Box>
          </GridItem>

          <GridItem>
            <Box
              p={5}
              bg="gray.50"
              rounded="md"
              shadow="md"
              style={{ boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
            >
              <Text fontSize="lg" fontWeight="bold" mb={3}>
                Review types
              </Text>
              <Line data={reviewTypeData} options={chartOptions} />
            </Box>
          </GridItem>

          <GridItem colSpan={1}>
            <Box p={5} bg={tableBg} rounded="md" shadow="md">
              <Text fontSize="lg" fontWeight="bold" mb={3}>
                Top reviewed courses
              </Text>
              <Divider mb={3} />
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>№</Th>
                    <Th>Course name</Th>
                    <Th>Reviews</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>1</Td>
                    <Td>Engine Creating for Xbox One X</Td>
                    <Td>10</Td>
                  </Tr>
                  <Tr>
                    <Td>2</Td>
                    <Td>Graphic Design Essentials</Td>
                    <Td>7</Td>
                  </Tr>
                  <Tr>
                    <Td>3</Td>
                    <Td>Materialism in Design Animation</Td>
                    <Td>7</Td>
                  </Tr>
                  <Tr>
                    <Td>4</Td>
                    <Td>Console Development Basics with Unity</Td>
                    <Td>7</Td>
                  </Tr>
                  <Tr>
                    <Td>5</Td>
                    <Td>Correct and Beautiful Design Interaction</Td>
                    <Td>4</Td>
                  </Tr>
                  <Tr>
                    <Td>6</Td>
                    <Td>Graphic Design Basics Masterclass</Td>
                    <Td>4</Td>
                  </Tr>
                  <Tr>
                    <Td>7</Td>
                    <Td>Adobe Photoshop Mastery</Td>
                    <Td>4</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </GridItem>

          <GridItem colSpan={1}>
            <Box p={5} bg={tableBg} rounded="md" shadow="md">
              <Text fontSize="lg" fontWeight="bold" mb={3}>
                Top reviewers
              </Text>
              <Divider mb={3} />
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>№</Th>
                    <Th>Student name</Th>
                    <Th>Reviews</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>1</Td>
                    <Td>Patricia Dixon</Td>
                    <Td>6</Td>
                  </Tr>
                  <Tr>
                    <Td>2</Td>
                    <Td>Oliver Hamilton</Td>
                    <Td>6</Td>
                  </Tr>
                  <Tr>
                    <Td>3</Td>
                    <Td>Elijah Thompson</Td>
                    <Td>6</Td>
                  </Tr>
                  <Tr>
                    <Td>4</Td>
                    <Td>Thomas Perry</Td>
                    <Td>5</Td>
                  </Tr>
                  <Tr>
                    <Td>5</Td>
                    <Td>Ophelia Ford</Td>
                    <Td>5</Td>
                  </Tr>
                  <Tr>
                    <Td>6</Td>
                    <Td>Eleanor Hayes</Td>
                    <Td>5</Td>
                  </Tr>
                  <Tr>
                    <Td>7</Td>
                    <Td>Julia Watson</Td>
                    <Td>4</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </RoleBasedPageLayout>
  );
};

export default ReviewReport;
