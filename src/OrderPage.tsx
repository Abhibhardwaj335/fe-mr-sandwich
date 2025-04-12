import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField
} from '@mui/material';
import CenteredFormLayout from "./components/CenteredFormLayout";

const OrderPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState<string>('');
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  const tableId = new URLSearchParams(window.location.search).get('tableId') || '';

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
        const response = await axios.get(
          `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/menu`
        );
        setMenuItems(response.data.menuItems);
      } catch (err) {
        console.error('Error fetching menu, using mock items:', err);
        setMenuItems(mockMenuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleItemSelect = (item: any) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (!paymentDetails || selectedItems.length === 0) {
      alert("Please add items and provide payment details.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/orders`,
        {
          tableId,
          items: selectedItems,
          paymentDetails
        }
      );

      setOrderPlaced(true);
      console.log('Order placed:', response.data);
      setSelectedItems([]);
      setPaymentDetails('');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredFormLayout title="Place an Order">
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          {menuItems.map((item) => (
            <Box key={item.id} display="flex" justifyContent="space-between" mb={2}>
              <Typography>{item.name} - RS/- {item.price}</Typography>
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

      {selectedItems.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Items in Your Order:</Typography>
          {selectedItems.map((item, index) => (
            <Typography key={index}>
              {item.name} - ${item.price}
            </Typography>
          ))}
          <Typography variant="subtitle1" mt={2}>
            <strong>Total:</strong> ${calculateTotal()}
          </Typography>
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

      {orderPlaced && (
        <Typography variant="h6" mt={4} color="success.main">
          ✅ Order placed successfully!
        </Typography>
      )}
    </CenteredFormLayout>
  );
};

export default OrderPage;
