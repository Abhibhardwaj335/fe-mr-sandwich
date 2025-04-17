import React, { useState } from "react";
import { menuCategories } from "../components/data/menuItems";
import MenuView from "../components/MenuView";
import ReviewCart from "../components/ReviewCart";
import CenteredFormLayout from "../components/CenteredFormLayout";
import { ShoppingCart, MinusCircle, PlusCircle } from "lucide-react";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";

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

  const handleSubmitOrder = () => {
    const orderPayload = {
      tableId: effectiveTableId,
      items: selectedItems.map(({ id, name, count, price }) => ({
        id, name, count, price,
      })),
      total: selectedItems.reduce((sum, i) => sum + i.price * i.count, 0),
      timestamp: new Date().toISOString(),
    };

    // 👇 You can replace this with an actual API call
    console.log("Submitting order:", orderPayload);

    alert("Order submitted! Thank you.");
    setSelectedItems([]); // Clear cart
    setView("menu"); // Go back to menu
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
                      <Button
                        variant="contained"
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

          {selectedItems.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 4 }}
              onClick={() => setView("cart")}
            >
              Review Cart ({selectedItems.reduce((sum, i) => sum + i.count, 0)} item
              {selectedItems.length > 1 ? "s" : ""})
            </Button>
          )}
        </>
      )}

      {view === "cart" && (
        <ReviewCart
          selectedItems={selectedItems}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onBack={() => setView("menu")}
          tableId={effectiveTableId}
          onSubmit={handleSubmitOrder}
        />
      )}
    </CenteredFormLayout>
  );
};

export default OrderPage;
