// components/AllCustomerRewards.tsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from "@mui/material";
import axios from "axios";

const API = import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL;

interface Reward {
  rewardId: string;
  rewardType: string;
  rewardPeriod: string;
  rewardPoints: number;
  createdAt: string;
}

interface RewardSummary {
  phoneNumber: string;
  totalPoints: number;
  rewards: Reward[];
}

const AllCustomerRewards: React.FC = () => {
  const [allSummaries, setAllSummaries] = useState<RewardSummary[]>([]);

  const fetchAllRewards = async () => {
    try {
      const response = await axios.get(`${API}/rewards/all`);
      const rawRewards = response.data.rewards;
      const summaryMap: Record<string, RewardSummary> = {};

      rawRewards.forEach((r: any) => {
        const phone = r.phoneNumber;
        if (!summaryMap[phone]) {
          summaryMap[phone] = {
            phoneNumber: phone,
            totalPoints: 0,
            rewards: [],
          };
        }
        summaryMap[phone].totalPoints += r.points;
        summaryMap[phone].rewards.push({
          rewardId: r.rewardId,
          rewardType: r.rewardType,
          rewardPoints: r.points,
          rewardPeriod: r.period ?? "Unknown",
          createdAt: r.createdAt,
        });
      });

      setAllSummaries(Object.values(summaryMap));
    } catch (error) {
      console.error("Error fetching all rewards:", error);
      alert("Failed to fetch all customer rewards.");
    }
  };

  useEffect(() => {
    fetchAllRewards();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        All Customer Rewards Summary
      </Typography>
      {allSummaries.map((summary, idx) => (
        <Box key={idx} sx={{ mt: 3 }}>
          <Typography fontWeight="bold">
            {summary.phoneNumber} (Total: {summary.totalPoints})
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reward Type</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.rewards.map((reward, i) => (
                  <TableRow key={i}>
                    <TableCell>{reward.rewardType}</TableCell>
                    <TableCell>{reward.rewardPeriod}</TableCell>
                    <TableCell>{reward.rewardPoints}</TableCell>
                    <TableCell>{new Date(reward.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  );
};

export default AllCustomerRewards;
