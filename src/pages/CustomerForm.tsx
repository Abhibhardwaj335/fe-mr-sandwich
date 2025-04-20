import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import CenteredFormLayout from "../components/CenteredFormLayout";
import { UserPlus } from "lucide-react";
import { useNotify } from '../components/NotificationContext';

const countryCodes = [
  { code: "+91"},
  { code: "+1"},
  { code: "+44"},
  { code: "+61"},
  { code: "+81"},
  { code: "+49"},
];

const CustomerForm: React.FC = () => {
  const notify = useNotify();
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [localPhone, setLocalPhone] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);

  const saveCustomerData = async () => {
    const fullPhoneNumber = `${countryCode}${localPhone}`;
    if (!name || !localPhone) {
      notify("❌ Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL + "/customer",
        { name, phoneNumber: fullPhoneNumber, dob }
      );
      notify("✅ Customer data saved with customerId=" + response.data.customerId + "!");
      setName("");
      setLocalPhone("");
      setDob("");
    } catch (error) {
      console.error("❌ Error saving customer:", error);
      notify("Failed to save customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredFormLayout title="Customer Form" icon={<UserPlus />} >
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
            onChange={(e) => setCountryCode(e.target.value)}
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

      <TextField
        fullWidth
        label="Date of Birth (Optional)"
        type="date"
        margin="normal"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
        Note: Your birthday will be used only for sending special offers and birthday wishes.
      </Typography>

      <Button
        onClick={saveCustomerData}
        variant="contained"
        color="success"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Save Customer"}
      </Button>
    </CenteredFormLayout>
  );
};

export default CustomerForm;