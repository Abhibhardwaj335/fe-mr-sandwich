import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import CenteredFormLayout from "../components/CenteredFormLayout";
import { ShoppingCart, XCircle, PlusCircle, MinusCircle, Info } from "lucide-react";  // Updated icons

const OrderPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>(''); // To hold payment method
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [manualTableId, setManualTableId] = useState<string>("");

  const urlTableId = new URLSearchParams(window.location.search).get('tableId') || '';
  const effectiveTableId = urlTableId || manualTableId;

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
    setSelectedItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev;
      }
      return [...prev, { ...item, count: 1 }];
    });
  };

  const handleItemRemove = (itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleItemIncrease = (itemId: number) => {
    setSelectedItems(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          return { ...item, count: item.count + 1 };
        }
        return item;
      });
    });
  };

  const handleItemDecrease = (itemId: number) => {
    setSelectedItems(prev => {
      return prev.map(item => {
        if (item.id === itemId && item.count > 1) {
          return { ...item, count: item.count - 1 };
        }
        return item;
      });
    });
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.count), 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (!effectiveTableId) {
      alert("Please enter a Table ID.");
      return;
    }

    if (!paymentMethod || selectedItems.length === 0) {
      alert("Please add items and select a payment method.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/orders`,
        {
          tableId: effectiveTableId,
          items: selectedItems,
          paymentDetails: paymentMethod
        }
      );

      setOrderPlaced(true);
      console.log('Order placed:', response.data);
      setSelectedItems([]);
      setPaymentMethod('');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredFormLayout title="Place an Order" icon={<ShoppingCart />}>
      {effectiveTableId ? (
        <Typography variant="h6" mt={2}>
          You're ordering for <strong>Table {effectiveTableId}</strong>
        </Typography>
      ) : (
        <TextField
          label="Enter Table ID"
          fullWidth
          value={manualTableId}
          onChange={(e) => setManualTableId(e.target.value)}
          sx={{ mb: 2 }}
        />
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>Menu</Typography>
          {menuItems.map((item) => {
            const itemInOrder = selectedItems.find(group => group.id === item.id);
            const itemCount = itemInOrder ? itemInOrder.count : 0;

            return (
              <Box key={item.id} display="flex" justifyContent="space-between" mb={2}>
                <Typography>{item.name} - RS/- {item.price}</Typography>
                <Box display="flex" alignItems="center">
                  {itemCount > 0 ? (
                    <>
                      <IconButton onClick={() => handleItemDecrease(item.id)} disabled={itemCount <= 0}>
                        <MinusCircle />
                      </IconButton>
                      <Typography>{itemCount}</Typography>
                      <IconButton onClick={() => handleItemIncrease(item.id)}>
                        <PlusCircle />
                      </IconButton>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleItemSelect(item)}
                    >
                      Add
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {selectedItems.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Items in Your Order:</Typography>
          <Accordion>
            <AccordionSummary expandIcon={<Info />} aria-controls="order-details-content" id="order-details-header">
              <Typography variant="subtitle1">{selectedItems.length} item(s) selected</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {selectedItems.map((item, index) => (
                <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography>{item.count}x {item.name} = RS/- {(item.count * item.price).toFixed(2)}</Typography>
                  <IconButton onClick={() => handleItemRemove(item.id)} color="secondary">
                    <XCircle />
                  </IconButton>
                </Box>
              ))}
              <Typography variant="subtitle1" mt={2}>
                <strong>Total:</strong> RS/- {calculateTotal()}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      <Box mt={4}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            label="Payment Method"
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handlePlaceOrder}
          disabled={loading}
          fullWidth
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
