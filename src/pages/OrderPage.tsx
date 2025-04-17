import React, { useState, useEffect } from "react";
import { menuCategories } from "../components/data/menuItems";
import MenuView from "../components/MenuView";
import ReviewCart from "../components/ReviewCart";
import CenteredFormLayout from "../components/CenteredFormLayout";
import { ShoppingCart, MinusCircle, PlusCircle } from "lucide-react";
import { Box, Button, IconButton, TextField, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import axios from "axios";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  subcategory: string;
  count: number;
}

// ...imports stay the same

const OrderPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(menuCategories[0].name);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [view, setView] = useState<"menu" | "cart">("menu");
  const [manualTableId, setManualTableId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");

  const urlTableId = new URLSearchParams(window.location.search).get("tableId") || "";
  const effectiveTableId = urlTableId || manualTableId;

  const activeCategory = menuCategories.find((cat) => cat.name === selectedCategory);

  const handleAddItem = (item: CartItem) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev;
      return [...prev, { ...item, count: 1 }];
    });
  };

  const handleIncrease = (id: number) =>
    setSelectedItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, count: i.count + 1 } : i))
    );

  const handleDecrease = (id: number) =>
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.id === id && i.count > 1 ? { ...i, count: i.count - 1 } : i
      )
    );

  const handleRemove = (id: number) =>
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));

  const handleSubmitOrder = async () => {
    if (!effectiveTableId) {
      alert("Please enter a Table ID.");
      return;
    }

    if (!paymentMethod || selectedItems.length === 0) {
      alert("Please add items and select a payment method.");
      return;
    }

    setLoading(true);
    const orderPayload = {
      tableId: effectiveTableId,
      items: selectedItems.map(({ id, name, count, price }) => ({
        id, name, count, price,
      })),
      paymentDetails: paymentMethod,
      total: selectedItems.reduce((sum, i) => sum + i.price * i.count, 0),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/orders`,
        orderPayload
      );

      setOrderId(response.data.orderId);
      setOrderPlaced(true);
      alert("Order placed successfully!");
      setSelectedItems([]);
      setView("menu");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToExistingOrder = async () => {
    if (!orderId) {
      alert("No existing order to add items to.");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Please add items.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setLoading(true);

    const orderPayload = {
      items: selectedItems,
      paymentDetails: paymentMethod,
      total: selectedItems.reduce((sum, i) => sum + i.price * i.count, 0),
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/orders?id=${orderId}`,
        orderPayload
      );

      setOrderPlaced(true);
      alert("Items added to the existing order!");
      setSelectedItems([]);
      setView("menu");
    } catch (err) {
      console.error("Error adding items to existing order:", err);
      alert("Failed to add items to existing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredFormLayout title="Place an Order" icon={<ShoppingCart />}>
      {!effectiveTableId ? (
        <TextField
          label="Enter Table ID"
          fullWidth
          value={manualTableId}
          onChange={(e) => setManualTableId(e.target.value)}
          sx={{ mb: 2 }}
        />
      ) : (
        <Typography variant="h6" mt={2}>
          You're ordering for <strong>Table {effectiveTableId}</strong>
        </Typography>
      )}

      {view === "menu" && activeCategory && (
        <>
          <Box display="flex" gap={2} mt={2} mb={2} overflow="auto">
            {menuCategories.map((cat) => (
              <Button
                key={cat.name}
                variant={cat.name === selectedCategory ? "contained" : "outlined"}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </Button>
            ))}
          </Box>

          <Box>
            {activeCategory.items.map((item) => {
              const selected = selectedItems.find((i) => i.id === item.id);
              const count = selected ? selected.count : 0;

              return (
                <Box
                  key={item.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                  p={2}
                  border="1px solid #ddd"
                  borderRadius={2}
                >
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 60, height: 60, marginRight: 16, borderRadius: 8 }}
                    />
                    <Box>
                      <Typography>{item.name}</Typography>
                      <Typography variant="caption">Rs/- {item.price}</Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center">
                    {count > 0 ? (
                      <>
                        <IconButton onClick={() => handleDecrease(item.id)}>
                          <MinusCircle />
                        </IconButton>
                        <Typography>{count}</Typography>
                        <IconButton onClick={() => handleIncrease(item.id)}>
                          <PlusCircle />
                        </IconButton>
                      </>
                    ) : (
                      <Button variant="contained" onClick={() => handleAddItem(item)}>
                        Add
                      </Button>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => setView("cart")}
            sx={{ mt: 4 }}
          >
            Review Cart
          </Button>
        </>
      )}

      {view === "cart" && (
        <ReviewCart
          selectedItems={selectedItems}
          onRemove={handleRemove}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onSubmit={orderPlaced ? handleAddToExistingOrder : handleSubmitOrder}
          onBack={() => setView("menu")}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          loading={loading}
          orderPlaced={orderPlaced}
        />
      )}
    </CenteredFormLayout>
  );
};

export default OrderPage;
