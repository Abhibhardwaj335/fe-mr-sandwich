import React, { useState, useEffect } from "react";
import { menuCategories } from "../components/data/menuItems";
import MenuView from "../components/MenuView";
import ReviewCart from "../components/ReviewCart";
import CenteredFormLayout from "../components/CenteredFormLayout";
import { ShoppingCart, MinusCircle, PlusCircle, Menu } from "lucide-react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Chip,
  Badge
} from "@mui/material";
import axios from "axios";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  subcategory: string;
  count: number;
}

const OrderPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(menuCategories[0].name);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [view, setView] = useState<"menu" | "cart">("menu");
  const [manualTableId, setManualTableId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const urlTableId = new URLSearchParams(window.location.search).get("tableId") || "";
  const effectiveTableId = urlTableId || manualTableId;

  const activeCategory = menuCategories.find((cat) => cat.name === selectedCategory);

  const totalItemsInCart = selectedItems.reduce((sum, item) => sum + item.count, 0);

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

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

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

  // Filter categories that have items
  const categoriesWithItems = menuCategories.filter(cat => cat.items.length > 0);

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
        <Typography variant="h6" mt={2} mb={2}>
          You're ordering for <strong>Table {effectiveTableId}</strong>
        </Typography>
      )}

      {view === "menu" && activeCategory && (
        <>
          {/* Mobile View: Category Button and Cart Button */}
          {isMobile && (
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Button
                variant="outlined"
                startIcon={<Menu />}
                onClick={() => setDrawerOpen(true)}
              >
                {selectedCategory}
              </Button>

              <Badge badgeContent={totalItemsInCart} color="primary">
                <Button
                  variant="contained"
                  onClick={() => setView("cart")}
                  startIcon={<ShoppingCart />}
                >
                  Cart
                </Button>
              </Badge>
            </Box>
          )}

          {/* Desktop View: Scrollable Category Buttons */}
          {!isMobile && (
            <Box
              display="flex"
              gap={1}
              mt={2}
              mb={2}
              sx={{
                overflowX: "auto",
                pb: 1,
                "&::-webkit-scrollbar": {
                  height: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "10px",
                }
              }}
            >
              {categoriesWithItems.map((cat) => (
                <Button
                  key={cat.name}
                  variant={cat.name === selectedCategory ? "contained" : "outlined"}
                  onClick={() => setSelectedCategory(cat.name)}
                  sx={{
                    flexShrink: 0,
                    whiteSpace: "nowrap"
                  }}
                >
                  {cat.name}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile: Category Drawer */}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box sx={{ width: 250 }} role="presentation">
              <List>
                <ListItem>
                  <ListItemText primary="Categories" primaryTypographyProps={{ variant: 'h6' }} />
                </ListItem>
                {categoriesWithItems.map((cat) => (
                  <ListItem
                    key={cat.name}
                    button
                    onClick={() => handleSelectCategory(cat.name)}
                    selected={cat.name === selectedCategory}
                  >
                    <ListItemText primary={cat.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>

          {/* Menu Items Display */}
          <Box>
            <Typography variant="h6" gutterBottom>
              {selectedCategory}
            </Typography>

            {/* Group by subcategory */}
            {Array.from(new Set(activeCategory.items.map(item => item.subcategory))).map(subcategory => (
              <Box key={subcategory} mb={3}>
                <Typography variant="subtitle1" color="text.secondary" mb={1}>
                  {subcategory}
                </Typography>

                {activeCategory.items
                  .filter(item => item.subcategory === subcategory)
                  .map((item) => {
                    const selected = selectedItems.find((i) => i.id === item.id);
                    const count = selected ? selected.count : 0;

                    return (
                      <Box
                        key={item.id}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1.5}
                        p={2}
                        border="1px solid #ddd"
                        borderRadius={2}
                      >
                        <Box display="flex" alignItems="center">
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 60,
                              height: 60,
                              marginRight: 16,
                              borderRadius: 8,
                              objectFit: "cover"
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                            }}
                          />
                          <Box>
                            <Typography>{item.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              ₹{item.price}
                            </Typography>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center">
                          {count > 0 ? (
                            <Box display="flex" alignItems="center" border="1px solid #ddd" borderRadius={4} px={1}>
                              <IconButton size="small" onClick={() => handleDecrease(item.id)}>
                                <MinusCircle size={18} />
                              </IconButton>
                              <Typography sx={{ mx: 1 }}>{count}</Typography>
                              <IconButton size="small" onClick={() => handleIncrease(item.id)}>
                                <PlusCircle size={18} />
                              </IconButton>
                            </Box>
                          ) : (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleAddItem(item)}
                            >
                              Add
                            </Button>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
              </Box>
            ))}
          </Box>

          {/* Desktop View: Cart Button */}
          {!isMobile && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => setView("cart")}
              sx={{ mt: 4 }}
              startIcon={<ShoppingCart />}
              disabled={selectedItems.length === 0}
            >
              Review Cart ({totalItemsInCart} item{totalItemsInCart !== 1 ? 's' : ''})
            </Button>
          )}

          {/* Mobile View: Sticky Cart Button */}
          {isMobile && selectedItems.length > 0 && (
            <Box
              position="fixed"
              bottom={0}
              left={0}
              right={0}
              p={2}
              bgcolor="background.paper"
              boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
              zIndex={1000}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={() => setView("cart")}
                startIcon={<ShoppingCart />}
              >
                Review Cart ({totalItemsInCart} item{totalItemsInCart !== 1 ? 's' : ''}) -
                ₹{selectedItems.reduce((sum, i) => sum + i.price * i.count, 0)}
              </Button>
            </Box>
          )}
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