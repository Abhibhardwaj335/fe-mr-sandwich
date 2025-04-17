import React, { useState } from "react";
import { menuCategories } from "../components/data/menuItems";
import ReviewCart from "../components/ReviewCart";
import CenteredFormLayout from "../components/CenteredFormLayout";
import { ShoppingCart } from "lucide-react";
import { Box } from "@mui/material";
import axios from "axios";

import CategorySelector from "../components/order/CategorySelector";
import SubcategorySection from "../components/order/SubcategorySection";
import TableIdInput from "../components/order/TableIdInput";
import CartButton from "../components/order/CartButton";

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

  const urlTableId = new URLSearchParams(window.location.search).get("tableId") || "";
  const effectiveTableId = urlTableId || manualTableId;

  const activeCategory = menuCategories.find((cat) => cat.name === selectedCategory);

  // Group items by subcategory
  const groupedItems = activeCategory?.items.reduce((groups, item) => {
    if (!groups[item.subcategory]) {
      groups[item.subcategory] = [];
    }
    groups[item.subcategory].push(item);
    return groups;
  }, {} as Record<string, typeof activeCategory.items>) || {};

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

  const cartItemCount = selectedItems.reduce((total, item) => total + item.count, 0);

  return (
    <CenteredFormLayout title="Place an Order" icon={<ShoppingCart />}>
      <TableIdInput
        effectiveTableId={effectiveTableId}
        manualTableId={manualTableId}
        onManualTableIdChange={setManualTableId}
      />

      {view === "menu" && activeCategory && (
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