import React, { useState, useEffect } from "react";
import { menuCategories } from "../components/data/menuItems";
import ReviewCart from "../components/ReviewCart";
import CenteredFormLayout from "../components/CenteredFormLayout";
import { ShoppingCart, Search, Gift } from "lucide-react";
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
  CircularProgress,
  IconButton,
  Drawer,
  Alert,
  Snackbar,
  Tooltip,
  Badge
} from "@mui/material";
import CategorySelector from "../components/order/CategorySelector";
import SubcategorySection from "../components/order/SubcategorySection";
import TableIdInput from "../components/order/TableIdInput";
import RewardSummaryCard from "../components/order/RewardSummaryCard";
import FloatingCartButton from "../components/order/FloatingCartButton";
import { useNotify } from '../components/NotificationContext';
interface MenuItem {
  name: string;
  price: number;
  image: string;
  subcategory: string;
}

interface CartItem extends MenuItem {
  count: number;
}

interface CustomerReward {
  id: string;
  date: string;
  description: string;
  points: number;
  status: string;
}

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  dob?: string;
  totalRewardPoints: number;
  rewards: CustomerReward[];
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
  const notify = useNotify();
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [localPhone, setLocalPhone] = useState("");
  const [dob, setDob] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(menuCategories[0].name);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [manualTableId, setManualTableId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [tableId, setTableId] = useState<string>("");
  const [customerInfoSet, setCustomerInfoSet] = useState<boolean>(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [fetchingCustomer, setFetchingCustomer] = useState<boolean>(false);
  const [showRewards, setShowRewards] = useState<boolean>(false);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState<any>(0);
  const [rewardError, setRewardError] = useState<string | null>(null);
  const [rewardSuccess, setRewardSuccess] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [pointsToEarn, setPointsToEarn] = useState<number>(0);

  const urlTableId = new URLSearchParams(window.location.search).get("tableId") || "";
  const effectiveTableId = urlTableId || manualTableId;

  const activeCategory = menuCategories.find((cat) => cat.name === selectedCategory);

  // Customer information
  const customerName = name;
  const customerPhone = `${countryCode}${localPhone}`;

  // Calculate points to earn from current order
  useEffect(() => {
    // Calculate total amount of current order
    const currentOrderTotal = selectedItems.reduce((sum, i) => sum + i.price * i.count, 0);
    // Calculate points - simple calculation: 1 point per ₹1 spent
    const estimatedPoints = Math.floor(currentOrderTotal);
    setPointsToEarn(estimatedPoints);
  }, [selectedItems]);

  // Add debounce utility
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // Then use it in your component
  const debouncedPhone = useDebounce(localPhone, 500); // 500ms delay

  useEffect(() => {
    if (debouncedPhone && debouncedPhone.length >= 6) {
      fetchCustomerData();
    }
  }, [debouncedPhone, countryCode]);

  // Reset error states when closing snackbars
  const handleCloseRewardError = () => {
    setRewardError(null);
  };

  const handleCloseRewardSuccess = () => {
    setRewardSuccess(null);
  };

  const handleCloseFetchError = () => {
    setFetchError(null);
  };

  // Fetch customer data by phone number
  const fetchCustomerData = async () => {
    if (!localPhone) {
      return;
    }

    setFetchingCustomer(true);
    setFetchError(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/rewards?id=${localPhone}`);

      if (response.data && response.data.length > 0) {
        const rewardsArray = response.data.map((reward: any) => ({
          id: reward.SK,
          date: reward.createdAt,
          points: reward.points,
          description: reward.rewardType,
          status: reward.status,
        }));

        const totalPoints = rewardsArray.reduce((sum: number, r: any) => sum + (r.points || 0), 0);

        setCustomerData({
          id: response.data[0].PK,
          name: response.data[0].name,
          phone: response.data[0].phoneNumber,
          dob: response.data[0].dob,
          totalRewardPoints: totalPoints,
          rewards: rewardsArray,
        });

        setName(response.data[0].name || "");
        setDob(response.data[0].dob || "");
      } else {
        setCustomerData(null);
      }
    } catch (err) {
      console.error("Error fetching customer data:", err);
      setCustomerData(null);
      setFetchError("Failed to fetch customer rewards. Please try again later.");
    } finally {
      setFetchingCustomer(false);
    }
  };

  // Function to save customer info
  const handleSaveCustomerInfo = () => {
    if (name && localPhone) {
      setCustomerInfoSet(true);
    } else {
      notify("Please enter your name and phone number.");
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

  // Function to send WhatsApp notification to admin
  const sendAdminWhatsAppNotification = async (orderData: any) => {
    try {
      // Create a payload that matches your backend API expectations
      const url = `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/whatsapp?id=admin`;

      // Determine which template to use based on whether it's a new order or update
      const templateName = orderPlaced ? "order_update" : "new_order";

      // Calculate order total and item count
      const orderTotal = orderData.total.toFixed(2);
      const formattedItems = orderData.items.map((item: CartItem) =>
        `${item.name} x${item.count} (${item.price.toFixed(2)})`
      ).join(", ");

      // Create appropriate payload based on template
      const payload: any = {
        templateName: templateName,
        tableId: orderData.tableId,
        orderTotal: orderTotal,
        items: formattedItems
      };

      await axios.post(url, payload);
      console.log("✅ Admin notification sent successfully");
    } catch (err) {
      console.error("❌ Error sending admin notification:", err);
    }
  };

  const handleRedeemRewardPoints = async (pointsToRedeem: number) => {
    if (!customerPhone || pointsToRedeem <= 0) {
      return false;
    }

    // Additional validation - check if customer has enough points
    if (!customerData || customerData.totalRewardPoints < pointsToRedeem) {
      setRewardError(`Not enough reward points. You have ${customerData?.totalRewardPoints || 0} points but tried to redeem ${pointsToRedeem} points.`);
      return false;
    }

    // Prevent negative points
    if (customerData.totalRewardPoints - pointsToRedeem < 0) {
      setRewardError("Cannot redeem more points than available.");
      return false;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/rewards/redeem`,
        {
          phoneNumber: localPhone,
          pointsToRedeem
        }
      );

      console.log("✅ Reward points redeemed successfully:", response.data);

      // Show success message
      setRewardSuccess(`Successfully redeemed ${pointsToRedeem} points for a discount of ₹${(pointsToRedeem / 5).toFixed(2)}!`);

      // Update customer data with new point balance
      if (customerData) {
        setCustomerData({
          ...customerData,
          totalRewardPoints: customerData.totalRewardPoints - pointsToRedeem
        });
      }

      return true;
    } catch (err) {
      console.error("❌ Error redeeming reward points:", err);
      const errorMessage = (err as any).response?.data?.message || "Failed to redeem reward points";
      setRewardError(errorMessage);
      return false;
    }
  };

  const handleAddPurchaseRewardPoints = async (amount: number, phoneNumber: string) => {
    const rewardPoints = amount;

    if (rewardPoints <= 0) return; // Skip if no points to add

    const rewardPayload = {
      rewardType: "Online Purchase",
      rewardPoints,
      rewardPeriod: "Monthly",
      phoneNumber
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/rewards`,
        rewardPayload,
        { params: { id: phoneNumber } }
      );

      console.log("✅ Reward points added for purchase:", response.data);
      setRewardSuccess(`You earned ${rewardPoints} reward points from this purchase!`);

      // Update local customer data with new points
      if (customerData) {
        setCustomerData({
          ...customerData,
          totalRewardPoints: customerData.totalRewardPoints + rewardPoints
        });
      }
    } catch (err) {
      console.error("❌ Failed to add purchase reward points:", err);
      setRewardError("Failed to add reward points for your purchase. Please contact support.");
    }
  };

  // Update the handleSubmitOrder function
  const handleSubmitOrder = async () => {
    if (!customerName || !customerPhone) {
      notify("Please enter your name and phone number.");
      return;
    }

    if (!effectiveTableId) {
      notify("Please enter a Table ID.");
      return;
    }

    if (selectedItems.length === 0) {
      notify("Please add items");
      return;
    }

    if (!paymentMethod) {
      notify("Please select a payment method.");
      return;
    }

    setLoading(true);

    // Calculate original order total before discounts
    const originalOrderTotal = selectedItems.reduce((sum, i) => sum + i.price * i.count, 0);

    // Calculate points being redeemed (if any)
    const pointsBeingRedeemed = originalOrderTotal !== totalAfterDiscount ?
      Math.round((originalOrderTotal - totalAfterDiscount) * 5) : 0;

    // If points are being redeemed, call the redemption API
    let finalOrderTotal = originalOrderTotal;
    if (pointsBeingRedeemed > 0) {
      const redemptionSuccessful = await handleRedeemRewardPoints(pointsBeingRedeemed);

      // If redemption failed but we still want to place the order,
      // reset the total to original amount
      if (!redemptionSuccessful) {
        setTotalAfterDiscount(undefined);
        finalOrderTotal = originalOrderTotal;
      } else {
        finalOrderTotal = totalAfterDiscount;
      }
    }

    const orderPayload = {
      tableId: effectiveTableId,
      name: customerName,
      phoneNumber: customerPhone,
      items: selectedItems.map(({ name, count, price }) => ({
        name, count, price,
      })),
      paymentDetails: paymentMethod,
      total: finalOrderTotal,
      pointsRedeemed: pointsBeingRedeemed,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/orders`,
        orderPayload
      );

      setOrderId(response.data.orderId);
      setTableId(effectiveTableId);
      setOrderPlaced(true);

      notify("Order placed successfully!");
      setSelectedItems([]);
      setCartDrawerOpen(false);

      // Add reward points for this purchase
      await handleAddPurchaseRewardPoints(pointsToEarn, localPhone);

      // Send WhatsApp notification to admin
      await sendAdminWhatsAppNotification(orderPayload);

      // Refresh customer data to get updated rewards
      if (customerData) {
        fetchCustomerData();
      }
    } catch (err) {
      console.error("Error placing order:", err);
      notify("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // Update the handleAddToExistingOrder function similarly
  const handleAddToExistingOrder = async () => {
    if (!orderId) {
      notify("No existing order to add items to.");
      return;
    }

    if (selectedItems.length === 0) {
      notify("Please add items.");
      return;
    }

    if (!paymentMethod) {
      notify("Please select a payment method.");
      return;
    }

    setLoading(true);

    // Calculate original order total before discounts
    const originalOrderTotal = selectedItems.reduce((sum, i) => sum + i.price * i.count, 0);

    // Calculate points being redeemed (if any)
    const pointsBeingRedeemed = originalOrderTotal !== totalAfterDiscount ?
      Math.round((originalOrderTotal - totalAfterDiscount) * 5) : 0;

    // If points are being redeemed, call the redemption API
    let finalOrderTotal = originalOrderTotal;
    if (pointsBeingRedeemed > 0) {
      const redemptionSuccessful = await handleRedeemRewardPoints(pointsBeingRedeemed);

      // If redemption failed but we still want to place the order,
      // reset the total to original amount
      if (!redemptionSuccessful) {
        setTotalAfterDiscount(originalOrderTotal);
        finalOrderTotal = originalOrderTotal;
      } else {
        finalOrderTotal = totalAfterDiscount;
      }
    }

    const orderPayload = {
      tableId: tableId,
      items: selectedItems,
      paymentDetails: paymentMethod,
      total: finalOrderTotal,
      pointsRedeemed: pointsBeingRedeemed,
    };

    try {
      const orderUpdateResponse = await axios.put(
        `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/orders?id=${orderId}`,
        orderPayload
      );

      orderPayload.total = orderUpdateResponse.data.totalAmount;

      // Add reward points for this purchase
      await handleAddPurchaseRewardPoints(pointsToEarn, localPhone);

      // Send admin notification for order update
      await sendAdminWhatsAppNotification(orderPayload);

      setOrderPlaced(true);
      notify("Items added to the existing order!");
      setSelectedItems([]);
      setCartDrawerOpen(false);

      // Refresh customer data to get updated rewards
      if (customerData) {
        fetchCustomerData();
      }
    } catch (err) {
      console.error("Error adding items to existing order:", err);
      notify("Failed to add items to existing order");
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

      {/* Error and success alerts */}
      <Snackbar open={!!rewardError} autoHideDuration={6000} onClose={handleCloseRewardError}>
        <Alert onClose={handleCloseRewardError} severity="error" sx={{ width: '100%' }}>
          {rewardError}
        </Alert>
      </Snackbar>

      <Snackbar open={!!rewardSuccess} autoHideDuration={6000} onClose={handleCloseRewardSuccess}>
        <Alert onClose={handleCloseRewardSuccess} severity="success" sx={{ width: '100%' }}>
          {rewardSuccess}
        </Alert>
      </Snackbar>

      <Snackbar open={!!fetchError} autoHideDuration={6000} onClose={handleCloseFetchError}>
        <Alert onClose={handleCloseFetchError} severity="warning" sx={{ width: '100%' }}>
          {fetchError}
        </Alert>
      </Snackbar>

      {!customerInfoSet ? (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={fetchCustomerData}
                    disabled={fetchingCustomer || !localPhone}
                  >
                    {fetchingCustomer ? <CircularProgress size={20} /> : <Search />}
                  </IconButton>
                )
              }}
            />
          </Box>
          {/* Loading message outside the flex container */}
            {fetchingCustomer && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "center", fontStyle: 'italic' }}
              >
                Please wait while we fetch 🔍 your rewards 🎁 summary to serve you better ✨
              </Typography>
            )}
          <TextField
            fullWidth
            label="Date of Birth (Optional)"
            type="date"
            margin="normal"
            variant="outlined"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          {customerData && (
            <RewardSummaryCard
              totalPoints={customerData.totalRewardPoints}
              rewards={customerData.rewards}
              showRewards={showRewards}
              setShowRewards={setShowRewards}
            />
          )}

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
          {/* ✅ Minified Reward Info in top bar */}
          {customerData && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mb: 2,
              }}
            >
            {/* Points to earn notification */}
            {pointsToEarn > 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                  You'll earn <strong>{pointsToEarn}</strong> points!
              </Alert>
            )}
            <Tooltip title={`You have ${customerData.totalRewardPoints} reward points (₹${(customerData.totalRewardPoints/5).toFixed(0)} value)`}>
              <IconButton color="primary" size="small" sx={{ mr: 1 }} onClick={() => setShowRewards(!showRewards)}>
                <Badge badgeContent={customerData.totalRewardPoints} color="primary" max={999}>
                  <Gift size={40} />
                </Badge>
              </IconButton>
            </Tooltip>
            </Box>
          )}

          {/* ✅ Reward Summary (collapsible) */}
          {customerData && showRewards && (
            <RewardSummaryCard
              totalPoints={customerData.totalRewardPoints}
              rewards={customerData.rewards}
              showRewards={showRewards}
              setShowRewards={setShowRewards}
              showTotalPoints={false}
            />
          )}

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
        </>
      )}

      {customerInfoSet && (
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1200
          }}
        >
          <FloatingCartButton
            itemCount={cartItemCount}
            onClick={() => setCartDrawerOpen(true)}
            disabled={cartItemCount === 0}
            total={selectedItems.reduce((sum, item) => sum + item.price * item.count, 0)}
            showTotal={cartItemCount > 0}
          />
        </Box>
      )}

      {/* Cart Drawer - Improved */}
      <Drawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '450px' },
            maxWidth: '100%',
            borderTopLeftRadius: { xs: 0, sm: 16 },
            borderBottomLeftRadius: { xs: 0, sm: 16 },
            overflow: 'hidden'
          },
        }}
      >
        <ReviewCart
          selectedItems={selectedItems}
          onRemove={handleRemove}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onSubmit={orderPlaced ? handleAddToExistingOrder : handleSubmitOrder}
          onBack={() => setCartDrawerOpen(false)}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          loading={loading}
          orderPlaced={orderPlaced}
          rewardPoints={customerData?.totalRewardPoints}
          setTotalAfterDiscount={setTotalAfterDiscount}
          pointsToEarn={pointsToEarn}
        />
      </Drawer>
    </CenteredFormLayout>
  );
};

export default OrderPage;