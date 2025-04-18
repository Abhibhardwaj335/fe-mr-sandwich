import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Card,
} from "@mui/material";
import { Gift } from "lucide-react";

interface Reward {
  id: string;
  date: string;
  points: number;
  description: string;
}

interface RewardSummaryCardProps {
  totalPoints: number;
  rewards: Reward[];
  showRewards: boolean;
  setShowRewards: React.Dispatch<React.SetStateAction<boolean>>;
}

const RewardSummaryCard: React.FC<RewardSummaryCardProps> = ({
  totalPoints,
  rewards,
  showRewards,
  setShowRewards,
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ position: "relative", mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" sx={{ mr: 1 }}>
          Rewards: <strong>{totalPoints}</strong>
        </Typography>
        <IconButton
          size="small"
          color="primary"
          onClick={() => setShowRewards(!showRewards)}
        >
          <Gift size={16} />
        </IconButton>
      </Box>

      <Collapse in={showRewards}>
        <Card
          sx={{
            mt: 1,
            p: 1,
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            maxHeight: "250px",
            overflowY: "auto",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Reward History
          </Typography>
          {rewards.length > 0 ? (
            rewards.map((reward) => (
              <Box
                key={reward.id}
                sx={{
                  mb: 1,
                  p: 1,
                  bgcolor: "white",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">
                  {formatDate(reward.date)}: {reward.description}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    color: reward.points > 0 ? "green" : "error.main",
                  }}
                >
                  {reward.points > 0 ? "+" : ""}
                  {reward.points}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No rewards yet</Typography>
          )}
        </Card>
      </Collapse>
    </Box>
  );
};

export default RewardSummaryCard;
