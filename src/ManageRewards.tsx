// ManageRewards.tsx
import React, { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import CenteredFormLayout from "./components/CenteredFormLayout";
import RewardForm from "./components/RewardForm";
import SingleCustomerRewards from "./components/SingleCustomerRewards";
import AllCustomerRewards from "./components/AllCustomerRewards";
import { Gift } from "lucide-react";

const ManageRewards: React.FC = () => {
  const [viewMode, setViewMode] = useState<"form" | "single" | "all">("form");
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <CenteredFormLayout title="Manage Rewards" icon={<Gift />}>
      {/* 🔁 View Navigation */}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant={viewMode === "form" ? "contained" : "outlined"}
          onClick={() => setViewMode("form")}
        >
          ➕ Add Reward
        </Button>
        <Button
          variant={viewMode === "single" ? "contained" : "outlined"}
          onClick={() => {
            if (!phoneNumber || phoneNumber.length < 4) {
              alert("Please enter a valid phone number");
              return;
            }
            setViewMode("single");
          }}
        >
          📱 View Single Customer
        </Button>
        <Button
          variant={viewMode === "all" ? "contained" : "outlined"}
          onClick={() => setViewMode("all")}
        >
          🌍 View All Rewards
        </Button>
      </Box>

      {/* 📱 Phone Number Input (used in form & single views) */}
      <TextField
        fullWidth
        label="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        sx={{ mt: 2 }}
      />

      {viewMode === "form" && <RewardForm phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />}
      {viewMode === "single" && <SingleCustomerRewards phoneNumber={phoneNumber} />}
      {viewMode === "all" && <AllCustomerRewards />}
    </CenteredFormLayout>
  );
};

export default ManageRewards;
