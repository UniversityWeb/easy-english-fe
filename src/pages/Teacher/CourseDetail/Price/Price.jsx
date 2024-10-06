import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Switch,
  Grid,
  GridItem,
  Text
} from "@chakra-ui/react";
import priceService from '~/services/priceService';
import useCustomToast from '~/hooks/useCustomToast';

const Price = ({ courseId }) => {
  const [form, setForm] = useState({
    id: "", 
    isActive: false,
    price: "",
    salePrice: "",
    startDate: "",
    endDate: "",
  });

  const { successToast, errorToast } = useCustomToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      const fetchPrice = async () => {
        setLoading(true);
        const priceRequest = {
          courseId,
        };
        try {
          const priceData = await priceService.fetchPriceByCourse(priceRequest);
          if (priceData) {
            setForm({
              ...priceData,
            });
            successToast("Price data loaded successfully.");
          }
        } catch (error) {
          errorToast("Error fetching price data.");
        } finally {
          setLoading(false);
        }
      };

      fetchPrice();
    }
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSwitchChange = (e) => {
    setForm({ ...form, isActive: e.target.checked });
  };

  const handleUpdatePrice = async () => {
    const priceRequest = {
      id: form.id, 
      isActive: form.isActive,
      price: parseFloat(form.price),
      salePrice: parseFloat(form.salePrice),
      startDate: form.startDate,
      endDate: form.endDate,
    };

    try {
      await priceService.updatePrice(priceRequest);
      successToast("Price updated successfully.");
    } catch (error) {
      errorToast("Error updating price.");
    }
  };

  return (
    <ChakraProvider>
      <Box p="8" maxW="600px" mx="auto">
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <FormControl display="flex" alignItems="center" mb={4}>
              <Switch
                id="active-switch"
                isChecked={form.isActive}
                onChange={handleSwitchChange}
              />
              <FormLabel htmlFor="active-switch" ml={2}>
                Active
              </FormLabel>
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                placeholder="Enter price"
              />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Sale Price</FormLabel>
              <Input
                type="number"
                name="salePrice"
                value={form.salePrice}
                onChange={handleInputChange}
                placeholder="Enter sale price"
              />
            </FormControl>

            <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>Sale Start Date</FormLabel>
                  <Input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Sale End Date</FormLabel>
                  <Input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Button colorScheme="blue" mt={4} onClick={handleUpdatePrice}>
              Update Price
            </Button>
          </>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default Price;
