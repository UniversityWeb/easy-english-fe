import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, Spinner, Badge, Container } from '@chakra-ui/react';
import orderService from '../../services/orderService';
import { formatDate } from '~/utils/methods';
import StudentPageLayout from '~/components/StudentPageLayout';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        setError('Error fetching order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={20}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <StudentPageLayout>
      <Container maxW="80%" mb="50px">
        <Text fontSize="2xl" fontWeight="bold">
          Order Details
        </Text>

        <OrderSummary order={order} />
        <OrderItems items={order.items} />
      </Container>
    </StudentPageLayout>
  );
};

const OrderSummary = ({ order }) => (
  <Box mt={4} borderWidth="1px" borderRadius="lg" shadow="md" p={6}>
    <Text>Order ID: {order.id}</Text>
    <Text>Total Amount: {order.totalAmount} {order.currency}</Text>
    <Text>Created At: {formatDate(order.createdAt)}</Text>
    <Text>Updated At: {formatDate(order.updatedAt)}</Text>
    <Badge colorScheme={order.status === 'PAID' ? 'green' : 'red'}>
      {order.status}
    </Badge>
  </Box>
);

const OrderItems = ({ items }) => {
  if (items.length === 0) {
    return <Text color="gray.500">No items in this order.</Text>;
  }

  return (
    <Box mt={4} borderWidth="1px" borderRadius="lg" shadow="md" p={6}>
      <Text fontSize="xl" fontWeight="bold">Order Items</Text>
      {items.map(item => (
        <Box key={item.id} borderBottomWidth="1px" py={2}>
          <Text>Course: {item.course.name}</Text>
          <Text>Price: {item.price} {item.course.currency}</Text>
          {item.discountPercent && (
            <Text color="orange.500">
              Discount: {item.discountPercent}%
            </Text>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default OrderDetail;
