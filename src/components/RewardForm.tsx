import React, { useState } from "react";
import { TextField, Button, MenuItem} from "@mui/material";
import apiClient from '../apiClient';
import { useNotify } from '../components/NotificationContext';

const rewardTypes = ["Purchase", "Referral", "Loyalty"];
const rewardPeriods = ["Weekly", "Monthly"];

const RewardForm: React.FC<{
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}> = ({ phoneNumber, setPhoneNumber }) => {
  const notify = useNotify();
  const [rewardPoints, setRewardPoints] = useState("");
  const [rewardType, setRewardType] = useState("");
  const [rewardPeriod, setRewardPeriod] = useState("");

  const resetForm = () => {
    setPhoneNumber("");
    setRewardPoints("");
    setRewardType("");
    setRewardPeriod("");
  };

  const handleRewardSubmit = async () => {
    if (!phoneNumber || !rewardPoints || !rewardType || !rewardPeriod) {
      notify("❌ Please fill all fields.");
      return;
    }

    try {
      await apiClient.post(`/rewards`, {
        phoneNumber,
        rewardPoints: parseInt(rewardPoints),
        rewardType,
        rewardPeriod,
      });

      notify("✅ Reward added successfully!");
      resetForm();
    } catch (error: any) {
      notify("Failed to add reward. " + (error.response?.data?.message || "Please try again."));
      console.error("Error adding reward:", error);
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