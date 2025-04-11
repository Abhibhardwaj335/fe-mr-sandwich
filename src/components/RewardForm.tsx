// components/RewardForm.tsx
import React, { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import axios from "axios";

const rewardTypes = ["Purchase", "Referral", "Loyalty"];
const rewardPeriods = ["Weekly", "Monthly"];
const API = import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL;

const RewardForm: React.FC<{
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}> = ({ phoneNumber, setPhoneNumber }) => {
  const [rewardPoints, setRewardPoints] = useState("");
  const [rewardType, setRewardType] = useState("");
  const [rewardPeriod, setRewardPeriod] = useState("");

  const handleRewardSubmit = async () => {
    if (!phoneNumber || !rewardPoints || !rewardType || !rewardPeriod) {
      alert("❌ Please fill all fields.");
      return;
    }

    try {
      await axios.post(`${API}/rewards`, {
        phoneNumber,
        rewardPoints: parseInt(rewardPoints),
        rewardType,
        rewardPeriod,
      });

      alert("✅ Reward added successfully!");
      setPhoneNumber("");
      setRewardPoints("");
      setRewardType("");
      setRewardPeriod("");
    } catch (error) {
      console.error("Error adding reward:", error);
      alert("Failed to add reward.");
    }
  };

  return (
    <>
      <TextField
        fullWidth
        label="Reward Points"
        value={rewardPoints}
        onChange={(e) => setRewardPoints(e.target.value)}
        margin="normal"
        type="number"
      />

      <TextField
        fullWidth
        select
        label="Reward Type"
        value={rewardType}
        onChange={(e) => setRewardType(e.target.value)}
        margin="normal"
      >
        {rewardTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label="Reward Period"
        value={rewardPeriod}
        onChange={(e) => setRewardPeriod(e.target.value)}
        margin="normal"
      >
        {rewardPeriods.map((period) => (
          <MenuItem key={period} value={period}>
            {period}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="contained" onClick={handleRewardSubmit} fullWidth sx={{ mt: 2 }}>
        Add Reward
      </Button>
    </>
  );
};

export default RewardForm;
