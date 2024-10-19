import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Stack,
  useToast,
  Spinner,
  Flex,
  Badge,
  Container,
  Tabs,
  TabList,
  Tab, Skeleton,
} from '@chakra-ui/react';
import orderService from '~/services/orderService';
import useCustomToast from '~/hooks/useCustomToast';
import Footer from '~/components/Footer';
import NavbarForStudent from '~/components/Navbars/NavbarForStudent';
import { getUsername } from '~/utils/authUtils';
import { delayLoading, formatDate } from '~/utils/methods';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { getOrdersTabStatusByIndex, ORDERS_TAB_STATUSES, SAVED_ORDERS_TAB_INDEX_KEY } from '~/utils/constants';

const Orders = () => {
  const username = getUsername();
  const { successToast, errorToast } = useCustomToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const savedIndex = localStorage.getItem(SAVED_ORDERS_TAB_INDEX_KEY) || 0;
  const [selectedIndex, setSelectedIndex] = useState(parseInt(savedIndex));
  const toast = useToast();

  useEffect(() => {
    fetchOrdersByStatus(page, selectedIndex);
  }, [page, selectedIndex]);

  const fetchOrdersByStatus = async (pageNumber, selectedIndex) => {
    setLoading(true);

    const startTime = Date.now();

    try {
      const status = getOrdersTabStatusByIndex(selectedIndex);
      const response = await fetchOrders(status, pageNumber);
      const orders = response?.content;
      setOrders(orders || []);
      setTotalPages(response?.totalPages || 0);
    } catch (error) {
      console.log(error?.message);
      errorToast('Error fetching orders');
    } finally {
      await delayLoading(startTime);
      setLoading(false);
    }
  };

  const fetchOrders = async (status, pageNumber) => {
    if (status === 'All') {
      return orderService.getOrdersByUsername(username, pageNumber);
    }
    return orderService.getOrdersByStatus(username, status, pageNumber);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage((prevPage) => prevPage - 1);
  };

  return (
    <Box>
      <NavbarForStudent />

      <Container maxW="80%">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={10}>
          Your Orders
        </Text>

        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="lg" />
          </Flex>
        ) : (
          <Tabs
            index={selectedIndex}
            onChange={(index) => {
              localStorage.setItem(SAVED_ORDERS_TAB_INDEX_KEY, index);
              setSelectedIndex(index);
              setPage(0);
            }}
          >
            <TabList>
              <Tab>All</Tab>
              <Tab>Pending payment</Tab>
              <Tab>Paid</Tab>
              <Tab>Failed</Tab>
              <Tab>Refund</Tab>
              <Tab>Expired</Tab>
            </TabList>

            <OrderList orders={orders} loading={loading} />
          </Tabs>
        )}

        <Flex justify="center" align="center" mt={6} mb={50} gap={10}>
          <Button
            onClick={handlePreviousPage}
            disabled={page === 0}
            colorScheme={page === 0 ? "gray" : "blue"}
            size="md"
            variant="outline"
            leftIcon={page > 0 ? <FaArrowLeft /> : null}
            _hover={{
              bg: page > 0 ? "blue.500" : "",
              color: page > 0 ? "white" : "",
            }}
          >
            Prev
          </Button>

          <Text fontSize="sm" color="gray.600">
            Page {page + 1} of {totalPages}
          </Text>

          <Button
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            colorScheme={page === totalPages - 1 ? "gray" : "blue"}
            size="md"
            variant="outline"
            rightIcon={page < totalPages - 1 ? <FaArrowRight /> : null}
            _hover={{
              bg: page < totalPages - 1 ? "blue.500" : "",
              color: page < totalPages - 1 ? "white" : "",
            }}
          >
            Next
          </Button>
        </Flex>
      </Container>

      <Footer />
    </Box>
  );
};

const OrderList = ({ orders, loading }) => {
  return (
    <Stack spacing={4} mt={6} px={6}>
      {loading ? (
        [...Array(3)].map((_, index) => (
          <Skeleton key={index} height="100px" borderRadius="md" />
        ))
      ) : orders.length === 0 ? (
        <Text fontSize="xl" color="gray.500" textAlign="center">
          No orders available.
        </Text>
      ) : (
        orders.map((order) => (
          <Box
            key={order.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            shadow="md"
            backgroundColor="white"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box flex="1">
              <Text>Order ID: {order.id}</Text>
              <Text fontSize="sm" color="gray.500">
                Total Amount: {order.totalAmount} {order.currency}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Created At: {formatDate(order.createdAt)}
              </Text>
              <Badge colorScheme={order.status === 'PAID' ? 'green' : 'red'}>
                {order.status}
              </Badge>
            </Box>
          </Box>
        ))
      )}
    </Stack>
  );
};

export default Orders;
