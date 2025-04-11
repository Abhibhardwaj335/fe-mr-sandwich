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
} from "@mui/material";
import CenteredFormLayout from "./components/CenteredFormLayout";

const countryCodes = [
  { code: "+91", label: "India" },
  { code: "+1", label: "USA" },
  { code: "+44", label: "UK" },
  { code: "+61", label: "Australia" },
  { code: "+81", label: "Japan" },
  { code: "+49", label: "Germany" },
];

const CustomerForm: React.FC = () => {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [localPhone, setLocalPhone] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);

  const saveCustomerData = async () => {
    const fullPhoneNumber = `${countryCode}${localPhone}`;
    if (!name || !localPhone || !dob) {
      alert("❌ Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL + "/customer",
        { name, phoneNumber: fullPhoneNumber, dob }
      );
      alert("✅ Customer data saved with customerId=" + response.data.customerId + "!");
      setName("");
      setLocalPhone("");
      setDob("");
    } catch (error) {
      console.error("❌ Error saving customer:", error);
      alert("Failed to save customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredFormLayout title="Customer Form">
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
                {item.label} ({item.code})
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
        label="Date of Birth"
        type="date"
        margin="normal"
        variant="outlined"
        InputLabelProps={{ shrink: true }}
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />

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
