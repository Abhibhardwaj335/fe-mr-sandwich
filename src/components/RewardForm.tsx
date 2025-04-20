// components/RewardForm.tsx
import React, { useState } from "react";
import { TextField, Button, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [existingReward, setExistingReward] = useState<any>(null);

  const resetForm = () => {
    setPhoneNumber("");
    setRewardPoints("");
    setRewardType("");
    setRewardPeriod("");
  };

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
      resetForm();
    } catch (error: any) {
      // Check if this is an existing reward error
      if (error.response &&
          error.response.status === 409 &&
          error.response.data.details === "EXISTING_REWARD") {
        // Store the existing reward and show dialog
        setExistingReward(rewardType);
        setDialogOpen(true);
      } else {
        // Handle other errors
        alert("Failed to add reward. " + (error.response?.data?.message || "Please try again."));
      }
      console.error("Error adding reward:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setExistingReward(null);
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

      {/* Dialog for existing reward notification */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Reward Already Exists</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This customer already has a {existingReward} reward.
            Please update the existing reward instead of adding a new one.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RewardForm;