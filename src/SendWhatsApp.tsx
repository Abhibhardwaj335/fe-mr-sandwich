import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CenteredFormLayout from "./components/CenteredFormLayout";
import { Send } from "lucide-react";

const SendWhatsApp: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [customerData, setCustomerData] = useState<{ name: string; phoneNumber: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [templateType, setTemplateType] = useState("promotion");
  const [promoCode, setPromoCode] = useState("");
  const [menuItem, setMenuItem] = useState("");
  const [occasion, setOccasion] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [rewardPeriod, setRewardPeriod] = useState("");

  const fetchCustomerDetails = async () => {
    if (!customerId.trim()) {
      alert("❌ Please enter a Customer ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/customer?id=${customerId.trim()}`
      );
      setCustomerData(response.data);
    } catch (error) {
      console.error("❌ Error fetching customer:", error);
      alert("Failed to fetch customer.");
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsAppNotification = async () => {
    if (!customerData?.phoneNumber || !templateType) {
      alert("❌ Missing required data.");
      return;
    }

    const url = `${import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL}/whatsapp?id=${customerId.trim()}`;
    const payload: any = {
      phoneNumber: customerData.phoneNumber,
      templateName: templateType,
    };

    if (templateType === "promocode_update") {
      payload.promoCode = promoCode;
    } else if (templateType === "new_menu_alert") {
      payload.menuItem = menuItem;
    } else if (templateType === "exclusive_offer") {
      payload.occasion = occasion;
    } else if (templateType === "rewards_summary") {
      payload.rewardPoints = rewardPoints;
      payload.rewardPeriod = rewardPeriod;
    }

    try {
      await axios.post(url, payload);
      alert("✅ WhatsApp Notification Sent!");
    } catch (error) {
      console.error("❌ Error sending WhatsApp:", error);
      alert("Failed to send WhatsApp message.");
    }
  };

  return (
    <CenteredFormLayout title="Send WhatsApp Message" icon={<Send />}>
    <TextField
        fullWidth
        label="Customer ID"
        margin="normal"
        variant="outlined"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      />

      <Button
        onClick={fetchCustomerDetails}
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Fetch Customer"}
      </Button>

      {customerData && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Name: {customerData.name}
          </Typography>
          <Typography variant="h6">Phone: {customerData.phoneNumber}</Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Template Type</InputLabel>
            <Select
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
              label="Template Type"
            >
              <MenuItem value="promocode_update">Promotion</MenuItem>
              <MenuItem value="new_menu_alert">New Menu</MenuItem>
              <MenuItem value="exclusive_offer">Exclusive Offer</MenuItem>
              <MenuItem value="rewards_summary">Rewards Summary</MenuItem>
            </Select>
          </FormControl>

          {templateType === "promocode_update" && (
            <TextField
              fullWidth
              label="Promo Code"
              margin="normal"
              variant="outlined"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
          )}

          {templateType === "new_menu_alert" && (
            <TextField
              fullWidth
              label="New Menu Item"
              margin="normal"
              variant="outlined"
              value={menuItem}
              onChange={(e) => setMenuItem(e.target.value)}
            />
          )}

          {templateType === "exclusive_offer" && (
            <TextField
              fullWidth
              label="Occasion (e.g., Birthday, Marriage Day)"
              margin="normal"
              variant="outlined"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            />
          )}

          {templateType === "rewards_summary" && (
            <>
              <TextField
                fullWidth
                label="Reward Points"
                margin="normal"
                variant="outlined"
                type="number"
                value={rewardPoints}
                onChange={(e) => setRewardPoints(e.target.value)}
              />
              <TextField
                fullWidth
                label="Reward Period (e.g., this week, March)"
                margin="normal"
                variant="outlined"
                value={rewardPeriod}
                onChange={(e) => setRewardPeriod(e.target.value)}
              />
            </>
          )}

          <Button
            onClick={sendWhatsAppNotification}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Send WhatsApp
          </Button>
        </>
      )}
    </CenteredFormLayout>
  );
};

export default SendWhatsApp;
