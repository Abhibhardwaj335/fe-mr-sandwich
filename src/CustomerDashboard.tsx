import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import CenteredFormLayout from "./components/CenteredFormLayout";

const CustomerDashboard: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]); // State for coupon usage

  const fetchDashboard = async () => {
    if (!customerId) return alert("Enter a valid customer ID.");
    setLoading(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/dashboard/?id=${customerId}`
      );
      setCustomerData(res.data.customer);
      setRewards(res.data.rewards);
      setMessages(res.data.messages || []);
      setCoupons(res.data.coupons || []); // Fetch coupon data
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      alert("Failed to fetch customer dashboard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredFormLayout title="Customer Dashboard">
      <TextField
        label="Customer ID"
        fullWidth
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        onClick={fetchDashboard} // Uncomment for real call
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "View Dashboard"}
      </Button>

      {customerData && (
        <Box mt={4} textAlign="left">
          <Typography variant="h6">Customer Info:</Typography>
          <Typography>Name: {customerData.name}</Typography>
          <Typography>Phone: {customerData.phoneNumber}</Typography>
          <Typography>DOB: {customerData.dob}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Rewards
          </Typography>
          {rewards.length === 0 ? (
            <Typography>No rewards found.</Typography>
          ) : (
            rewards.map((r, i) => (
              <Box key={i} p={1} sx={{ borderBottom: "1px solid #ccc" }}>
                <Typography>
                  🎁 {r.rewardType} - {r.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(r.date).toLocaleDateString()}
                </Typography>
              </Box>
            ))
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            WhatsApp Messages
          </Typography>
          {messages.length === 0 ? (
            <Typography>No messages sent.</Typography>
          ) : (
            messages.map((msg, i) => (
              <Box key={i} p={1} sx={{ borderBottom: "1px dashed #ddd" }}>
                <Typography>📩 {msg.content}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Sent: {new Date(msg.date).toLocaleDateString()}
                </Typography>
              </Box>
            ))
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Coupon Usage History
          </Typography>
          {coupons.length === 0 ? (
            <Typography>No coupon usage found.</Typography>
          ) : (
            coupons.map((coupon, i) => (
              <Box key={i} p={1} sx={{ borderBottom: "1px dashed #ddd" }}>
                <Typography>🎁 Coupon Code: {coupon.couponCode}</Typography>
                <Typography>Description: {coupon.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Used on: {new Date(coupon.dateUsed).toLocaleDateString()}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      )}
    </CenteredFormLayout>
  );
};

export default CustomerDashboard;
