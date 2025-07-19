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
import apiClient from '../apiClient';
import { useNotify } from '../components/NotificationContext';

const rewardTypes = ["Purchase", "Referral", "Loyalty"];
const rewardPeriods = ["Weekly", "Monthly"];

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

// Individual reward row component with its own state
const RewardRow: React.FC<{
  reward: Reward;
  phoneNumber: string;
  onDelete: () => void;
  onUpdate: () => void;
}> = ({ reward, phoneNumber, onDelete, onUpdate }) => {
  const notify = useNotify();
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState(reward.rewardType);
  const [editPeriod, setEditPeriod] = useState(reward.rewardPeriod);
  const [editPoints, setEditPoints] = useState(reward.rewardPoints);

  const handleSave = async () => {
    try {
      await apiClient.put(`/rewards`,
        {
          rewardPoints: editPoints,
          rewardType: editType,
          rewardPeriod: editPeriod,
          timestamp: new Date(reward.createdAt).getTime(),
        },
        {
          params: {
            id: phoneNumber,
          },
        }
      );
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Error updating reward:", err);
      notify("❌ Failed to update reward");
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/rewards`, {
        params: {
          id: phoneNumber,
          rewardType: reward.rewardType,
          timestamp: new Date(reward.createdAt).getTime(),
        },
      });
      onDelete();
    } catch (err) {
      console.error("Error deleting reward:", err);
      notify("❌ Failed to delete reward");
    }
  };

  const handleStartEdit = () => {
    setEditType(reward.rewardType);
    setEditPeriod(reward.rewardPeriod);
    setEditPoints(reward.rewardPoints);
    setIsEditing(true);
  };

  return (
    <TableRow key={reward.rewardId}>
      <TableCell>
        {isEditing ? (
          <TextField
            select
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
            size="small"
            fullWidth
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
        {isEditing ? (
          <TextField
            select
            value={editPeriod}
            onChange={(e) => setEditPeriod(e.target.value)}
            size="small"
            fullWidth
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
        {isEditing ? (
          <TextField
            type="number"
            value={editPoints}
            onChange={(e) => setEditPoints(Number(e.target.value))}
            size="small"
            fullWidth
            InputProps={{ sx: { minWidth: 80 } }} // <- Give it room to breathe
          />
        ) : (
          reward.rewardPoints
        )}
      </TableCell>
      <TableCell>{new Date(reward.createdAt).toLocaleString()}</TableCell>
      <TableCell>
        {isEditing ? (
          <>
            <IconButton onClick={handleSave}>
              <SaveIcon />
            </IconButton>
            <IconButton onClick={() => setIsEditing(false)}>
              <DeleteIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton onClick={handleStartEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

const SingleCustomerRewards: React.FC<{ phoneNumber: string }> = ({ phoneNumber }) => {
  const notify = useNotify();
  const [summary, setSummary] = useState<RewardSummary | null>(null);

  const fetchCustomerRewards = async () => {
    try {
      const response = await apiClient.get(`/rewards?id=${phoneNumber}`);
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
      notify("Failed to fetch customer rewards.");
    }
  };

  useEffect(() => {
    fetchCustomerRewards();
  }, [phoneNumber]);

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
              <RewardRow
                key={reward.rewardId}
                reward={reward}
                phoneNumber={phoneNumber}
                onDelete={fetchCustomerRewards}
                onUpdate={fetchCustomerRewards}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SingleCustomerRewards;
