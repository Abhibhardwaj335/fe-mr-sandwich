import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, CircularProgress, TextField } from '@mui/material';
import CenteredFormLayout from "./components/CenteredFormLayout";

const OrderPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<string>('');
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  const tableId = new URLSearchParams(window.location.search).get('tableId') || '';

  // Mock data for testing
  const mockMenuItems = [
    { id: 1, name: "Cheese Sandwich", price: 5.99 },
    { id: 2, name: "Veggie Wrap", price: 6.49 },
    { id: 3, name: "Chicken Sandwich", price: 7.99 },
    { id: 4, name: "Fries", price: 2.49 },
    { id: 5, name: "Cold Drink", price: 1.99 }
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        // Uncomment below to call real API
        // const response = await axios.get(
        //   `${import.meta.env.VITE_API_URL}/menu`
        // );

        // Mock API response for testing
        const response = { data: { menuItems: mockMenuItems } };

        setMenuItems(response.data.menuItems);
      } catch (err) {
        console.error('Error fetching menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleItemSelect = (item: any) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const handlePlaceOrder = async () => {
    if (!paymentDetails || selectedItems.length === 0) {
      alert("Please add items and provide payment details.");
      return;
    }

    setLoading(true);

    try {
      const customerId = "customerId123"; // Replace with actual customer ID

      // Uncomment below to call real API for placing order
      // const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
      //   customerId,
      //   tableId,
      //   items: selectedItems,
      //   paymentDetails
      // });

      // Mock API response for placing order
      const response = {
        data: { message: 'Order placed successfully', orderId: 'order#12345' }
      };

      setOrderPlaced(true);
      console.log(response.data);
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredFormLayout title="Place an Order">
      <Typography variant="h4">Order Page</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          {menuItems.map((item) => (
            <Box key={item.id} display="flex" justifyContent="space-between" mb={2}>
              <Typography>{item.name} - ${item.price}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleItemSelect(item)}
              >
                Add to Order
              </Button>
            </Box>
          ))}
        </Box>
      )}

      <Box mt={4}>
        <TextField
          label="Payment Details"
          fullWidth
          value={paymentDetails}
          onChange={(e) => setPaymentDetails(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Place Order'}
        </Button>
      </Box>

      {orderPlaced && <Typography variant="h6" mt={4}>Order placed successfully!</Typography>}
    </CenteredFormLayout>
  );
};

export default OrderPage;
