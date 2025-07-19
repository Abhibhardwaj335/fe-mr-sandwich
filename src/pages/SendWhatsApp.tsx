import React, { useState } from "react";
import apiClient from '../apiClient';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  Card,
  CardContent,
  Alert,
  Chip,
} from "@mui/material";
import CenteredFormLayout from "../components/CenteredFormLayout";
import { Send, User, Users } from "lucide-react";
import { useNotify } from '../components/NotificationContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`whatsapp-tabpanel-${index}`}
      aria-labelledby={`whatsapp-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SendWhatsApp: React.FC = () => {
  const notify = useNotify();
  const [tabValue, setTabValue] = useState(0);

  // Single Customer States
  const [customerId, setCustomerId] = useState("");
  const [customerData, setCustomerData] = useState<{ name: string; phoneNumber: string } | null>(null);
  const [singleLoading, setSingleLoading] = useState(false);

  // All Customers States
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [allLoading, setAllLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Template States (shared)
  const [templateType, setTemplateType] = useState("promocode_update");
  const [promoCode, setPromoCode] = useState("");
  const [menuItem, setMenuItem] = useState("");
  const [occasion, setOccasion] = useState("");
  const [rewardPoints, setRewardPoints] = useState("");
  const [rewardPeriod, setRewardPeriod] = useState("");

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    // Auto-load customers when switching to "All Customers" tab
    if (newValue === 1 && allCustomers.length === 0) {
      fetchAllCustomers();
    }
  };

  // Fetch single customer details
  const fetchCustomerDetails = async () => {
    if (!customerId.trim()) {
      notify("❌ Please enter a Customer ID.");
      return;
    }

    setSingleLoading(true);
    try {
      const response = await apiClient.get(`/customer?id=${customerId.trim()}`);
      setCustomerData(response.data);
    } catch (error) {
      console.error("❌ Error fetching customer:", error);
      notify("Failed to fetch customer.");
    } finally {
      setSingleLoading(false);
    }
  };

  // Fetch all customers
  const fetchAllCustomers = async () => {
    setAllLoading(true);
    try {
      const response = await apiClient.get(`/customers`);
      setAllCustomers(response.data.customers || []);
    } catch (error) {
      console.error("❌ Error fetching customers:", error);
      notify("Failed to fetch customers.");
    } finally {
      setAllLoading(false);
    }
  };

  // Build payload based on template type
  const buildPayload = (phoneNumber: string) => {
    const payload: any = {
      phoneNumber,
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

    return payload;
  };

  // Send WhatsApp to single customer
  const sendWhatsAppToSingle = async () => {
    if (!customerData?.phoneNumber || !templateType) {
      notify("❌ Missing required data.");
      return;
    }

    const url = `/whatsapp?id=${customerId.trim()}`;
    const payload = buildPayload(customerData.phoneNumber);

    setSingleLoading(true);
    try {
      await apiClient.post(url, payload);
      notify("✅ WhatsApp message sent successfully!");
    } catch (error) {
      console.error("❌ Error sending WhatsApp:", error);
      notify("Failed to send WhatsApp message.");
    } finally {
      setSingleLoading(false);
    }
  };

  // Send WhatsApp to all customers
  const sendWhatsAppToAll = async () => {
    if (!allCustomers.length || !templateType) {
      notify("❌ No customers found or template not selected.");
      return;
    }

    // Validate required fields based on template type
    if (templateType === "promocode_update" && !promoCode.trim()) {
      notify("❌ Please enter a promo code.");
      return;
    }
    if (templateType === "new_menu_alert" && !menuItem.trim()) {
      notify("❌ Please enter a menu item.");
      return;
    }
    if (templateType === "exclusive_offer" && !occasion.trim()) {
      notify("❌ Please enter an occasion.");
      return;
    }
    if (templateType === "rewards_summary" && (!rewardPoints.trim() || !rewardPeriod.trim())) {
      notify("❌ Please enter reward points and period.");
      return;
    }

    setBulkLoading(true);
    let successCount = 0;
    let failureCount = 0;

    try {
      // Send messages sequentially to avoid rate limiting
      for (const customer of allCustomers) {
        try {
          const url = `/whatsapp?id=${customer.customerId}`;
          const payload = buildPayload(customer.phoneNumber);

          await apiClient.post(url, payload);
          successCount++;

          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`❌ Error sending to customer ${customer.customerId}:`, error);
          failureCount++;
        }
      }

      notify(`✅ Bulk message completed! Success: ${successCount}, Failed: ${failureCount}`);
    } catch (error) {
      console.error("❌ Error in bulk send:", error);
      notify("Failed to complete bulk message sending.");
    } finally {
      setBulkLoading(false);
    }
  };

  // Template field validation
  const isTemplateValid = () => {
    if (templateType === "promocode_update") return promoCode.trim();
    if (templateType === "new_menu_alert") return menuItem.trim();
    if (templateType === "exclusive_offer") return occasion.trim();
    if (templateType === "rewards_summary") return rewardPoints.trim() && rewardPeriod.trim();
    return true;
  };

  return (
    <CenteredFormLayout title="Send WhatsApp Messages" icon={<Send />}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="whatsapp tabs">
            <Tab
              icon={<User size={18} />}
              label="Single Customer"
              id="whatsapp-tab-0"
              aria-controls="whatsapp-tabpanel-0"
            />
            <Tab
              icon={<Users size={18} />}
              label="All Customers"
              id="whatsapp-tab-1"
              aria-controls="whatsapp-tabpanel-1"
            />
          </Tabs>
        </Box>

        {/* Single Customer Tab */}
        <TabPanel value={tabValue} index={0}>
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
            disabled={singleLoading}
          >
            {singleLoading ? <CircularProgress size={24} /> : "Fetch Customer"}
          </Button>

          {customerData && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6">Customer Details:</Typography>
                <Typography>Name: {customerData.name}</Typography>
                <Typography>Phone: {customerData.phoneNumber}</Typography>
              </CardContent>
            </Card>
          )}

          {customerData && (
            <>
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
                onClick={sendWhatsAppToSingle}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={singleLoading || !isTemplateValid()}
              >
                {singleLoading ? <CircularProgress size={24} /> : "Send WhatsApp"}
              </Button>
            </>
          )}
        </TabPanel>

        {/* All Customers Tab */}
        <TabPanel value={tabValue} index={1}>
          {allLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading customers...</Typography>
            </Box>
          ) : allCustomers.length > 0 ? (
            <>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customers Loaded: <Chip label={allCustomers.length} color="primary" size="small" />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ready to send bulk WhatsApp messages
                  </Typography>
                </CardContent>
              </Card>

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
                  placeholder="Enter promo code for all customers"
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
                  placeholder="Enter new menu item details"
                />
              )}

              {templateType === "exclusive_offer" && (
                <TextField
                  fullWidth
                  label="Occasion (e.g., Holiday Special, Weekend Offer)"
                  margin="normal"
                  variant="outlined"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="Enter occasion for the offer"
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
                    placeholder="Enter reward points"
                  />
                  <TextField
                    fullWidth
                    label="Reward Period (e.g., this month, Q1 2024)"
                    margin="normal"
                    variant="outlined"
                    value={rewardPeriod}
                    onChange={(e) => setRewardPeriod(e.target.value)}
                    placeholder="Enter reward period"
                  />
                </>
              )}

              <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2">
                  <strong>Bulk Message Warning:</strong> This will send WhatsApp messages to all {allCustomers.length} customers.
                  Please ensure your template and content are correct before proceeding.
                </Typography>
              </Alert>

              <Button
                onClick={sendWhatsAppToAll}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
                disabled={bulkLoading || !isTemplateValid()}
              >
                {bulkLoading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Sending to All Customers...
                  </>
                ) : (
                  `Send to All ${allCustomers.length} Customers`
                )}
              </Button>
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                No customers found. Please try refreshing or check your connection.
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Box>
    </CenteredFormLayout>
  );
};

export default SendWhatsApp;