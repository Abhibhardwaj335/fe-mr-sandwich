// components/SingleCustomerRewards.tsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  IconButton,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const rewardTypes = ["Purchase", "Referral", "Loyalty"];
const rewardPeriods = ["Weekly", "Monthly"];
const API = import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL;

interface Reward {
  rewardId: string;
  rewardType: string;
  rewardPoints: number;
  rewardPeriod: string;
  createdAt: string;
}

interface RewardSummary {
  phoneNumber: string;
  totalPoints: number;
  rewards: Reward[];
}

const SingleCustomerRewards: React.FC<{ phoneNumber: string }> = ({ phoneNumber }) => {
  const [summary, setSummary] = useState<RewardSummary | null>(null);
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [editPoints, setEditPoints] = useState<number>(0);
  const [editType, setEditType] = useState<string>("");
  const [editPeriod, setEditPeriod] = useState<string>("");

  const fetchCustomerRewards = async () => {
    try {
      const response = await axios.get(`${API}/rewards?id=${phoneNumber}`);
      const rewardsArray = response.data;
      const totalPoints = rewardsArray.reduce(
        (acc: number, r: any) => acc + r.points,
        0
      );
      setSummary({
        phoneNumber,
        totalPoints,
        rewards: rewardsArray.map((r: any) => ({
          rewardId: r.rewardId,
          rewardType: r.rewardType,
          rewardPoints: r.points,
          rewardPeriod: r.period ?? "Unknown",
          createdAt: r.createdAt,
        })),
      });
    } catch (error) {
      console.error("Error fetching customer rewards:", error);
      alert("Failed to fetch customer rewards.");
    }
  };

  useEffect(() => {
    fetchCustomerRewards();
  }, []);

  const handleDeleteReward = async (rewardId: string) => {
    try {
      await axios.delete(`${API}/rewards/${rewardId}`);
      fetchCustomerRewards();
    } catch (err) {
      console.error("Error deleting reward:", err);
      alert("❌ Failed to delete reward");
    }
  };

  const handleSaveEdit = async (rewardId: string) => {
    try {
      await axios.put(`${API}/rewards/${rewardId}`, {
        rewardPoints: editPoints,
        rewardType: editType,
        rewardPeriod: editPeriod,
      });
      setEditingRewardId(null);
      fetchCustomerRewards();
    } catch (err) {
      console.error("Error updating reward:", err);
      alert("❌ Failed to update reward");
    }
  };

  if (!summary) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Rewards Summary for {summary.phoneNumber}
      </Typography>
      <Typography>Total Points: {summary.totalPoints}</Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reward Type</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summary.rewards.map((reward) => (
              <TableRow key={reward.rewardId}>
                <TableCell>
                  {editingRewardId === reward.rewardId ? (
                    <TextField
                      select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      size="small"
                    >
                      {rewardTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    reward.rewardType
                  )}
                </TableCell>
                <TableCell>
                  {editingRewardId === reward.rewardId ? (
                    <TextField
                      select
                      value={editPeriod}
                      onChange={(e) => setEditPeriod(e.target.value)}
                      size="small"
                    >
                      {rewardPeriods.map((period) => (
                        <MenuItem key={period} value={period}>
                          {period}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    reward.rewardPeriod
                  )}
                </TableCell>
                <TableCell>
                  {editingRewardId === reward.rewardId ? (
                    <TextField
                      type="number"
                      value={editPoints}
                      onChange={(e) => setEditPoints(Number(e.target.value))}
                      size="small"
                    />
                  ) : (
                    reward.rewardPoints
                  )}
                </TableCell>
                <TableCell>{new Date(reward.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  {editingRewardId === reward.rewardId ? (
                    <IconButton onClick={() => handleSaveEdit(reward.rewardId)}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => {
                        setEditingRewardId(reward.rewardId);
                        setEditPoints(reward.rewardPoints);
                        setEditType(reward.rewardType);
                        setEditPeriod(reward.rewardPeriod);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDeleteReward(reward.rewardId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SingleCustomerRewards;
