import React, { useState } from "react";
import { menuCategories } from "../components/data/menuItems";
import ReviewCart from "../components/ReviewCart";
import CenteredFormLayout from "../components/CenteredFormLayout";
import { ShoppingCart } from "lucide-react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import CategorySelector from "../components/order/CategorySelector";
import SubcategorySection from "../components/order/SubcategorySection";
import TableIdInput from "../components/order/TableIdInput";
import CartButton from "../components/order/CartButton";

interface MenuItem {
  name: string;
  price: number;
  image: string;
  subcategory: string;
}

interface CartItem extends MenuItem {
  count: number;
}

const countryCodes = [
  { code: "+91"},
  { code: "+1"},
  { code: "+44"},
  { code: "+61"},
  { code: "+81"},
  { code: "+49"},
];

const OrderPage: React.FC = () => {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [localPhone, setLocalPhone] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(menuCategories[0].name);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [view, setView] = useState<"menu" | "cart">("menu");
  const [manualTableId, setManualTableId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [customerInfoSet, setCustomerInfoSet] = useState<boolean>(false);

  const urlTableId = new URLSearchParams(window.location.search).get("tableId") || "";
  const effectiveTableId = urlTableId || manualTableId;

  const activeCategory = menuCategories.find((cat) => cat.name === selectedCategory);

  // Customer information
  const customerName = name;
  const customerPhone = `${countryCode}${localPhone}`;

  // Function to save customer info
  const handleSaveCustomerInfo = () => {
    if (name && localPhone) {
      setCustomerInfoSet(true);
    } else {
      alert("Please enter your name and phone number.");
    }
  };

  // Group items by subcategory
  const groupedItems = activeCategory?.items.reduce((groups, item) => {
    if (!groups[item.subcategory]) {
      groups[item.subcategory] = [];
    }
    groups[item.subcategory].push(item);
    return groups;
  }, {} as Record<string, typeof activeCategory.items>) || {};

  const handleAddItem = (item: MenuItem) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) return prev;
      return [...prev, { ...item, count: 1 }];
    });
  };

  const handleIncrease = (name: string) =>
    setSelectedItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, count: i.count + 1 } : i))
    );

  const handleDecrease = (name: string) =>
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.name === name && i.count > 1 ? { ...i, count: i.count - 1 } : i
      )
    );

  const handleRemove = (name: string) =>
    setSelectedItems((prev) => prev.filter((i) => i.name !== name));

  const handleSubmitOrder = async () => {
    if (!customerName || !customerPhone) {
      alert("Please enter your name and phone number.");
      return;
    }

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
      customerName,
      customerPhone,
      items: selectedItems.map(({ name, count, price }) => ({
        name, count, price,
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

  const cartItemCount = selectedItems.reduce((total, item) => total + item.count, 0);

  return (
    <CenteredFormLayout title="Place an Order" icon={<ShoppingCart />}>
      <TableIdInput
        effectiveTableId={effectiveTableId}
        manualTableId={manualTableId}
        onManualTableIdChange={setManualTableId}
        customerName={customerName}
        customerInfoSet={customerInfoSet}
      />

      {view === "menu" && activeCategory && (
        <>
          {!customerInfoSet ? (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <FormControl fullWidth sx={{ flex: 1 }}>
                  <InputLabel id="country-code-label">Code</InputLabel>
                  <Select
                    labelId="country-code-label"
                    value={countryCode}
                    label="Code"
                    onChange={(e) => setCountryCode(e.target.value as string)}
                  >
                    {countryCodes.map((item) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  value={localPhone}
                  onChange={(e) => setLocalPhone(e.target.value)}
                  sx={{ flex: 2 }}
                />
              </Box>
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSaveCustomerInfo}
              >
                Continue
              </Button>
            </Box>
          ) : (
            <>
              <CategorySelector
                categories={menuCategories.map(cat => cat.name)}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {Object.keys(groupedItems).map(subcategory => (
                <SubcategorySection
                  key={subcategory}
                  title={subcategory}
                  items={groupedItems[subcategory]}
                  selectedItems={selectedItems}
                  onAddItem={handleAddItem}
                  onIncreaseItem={handleIncrease}
                  onDecreaseItem={handleDecrease}
                />
              ))}

              <CartButton
                itemCount={cartItemCount}
                onClick={() => setView("cart")}
              />
            </>
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
          customerName={customerName}
        />
      )}
    </CenteredFormLayout>
  );
};

export default OrderPage;