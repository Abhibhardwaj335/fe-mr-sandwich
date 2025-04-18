import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import { PlusCircle, MinusCircle, XCircle, Gift } from "lucide-react";

interface CartItem {
  name: string;
  price: number;
  count: number;
  image: string;
  subcategory: string;
}

interface Props {
  selectedItems: CartItem[];
  onRemove: (name: string) => void;
  onIncrease: (name: string) => void;
  onDecrease: (name: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  loading: boolean;
  orderPlaced: boolean;
  customerName?: string;
  rewardPoints?: number;
}

const ReviewCart: React.FC<Props> = ({
  selectedItems,
  onRemove,
  onIncrease,
  onDecrease,
  onSubmit,
  onBack,
  paymentMethod,
  setPaymentMethod,
  loading,
  orderPlaced,
  customerName,
  rewardPoints,
}) => {
  const total = selectedItems
    .reduce((sum, item) => sum + item.price * item.count, 0)
    .toFixed(2);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        {rewardPoints !== undefined && (
          <Chip
            icon={<Gift size={16} />}
            label={`${rewardPoints} points`}
            color="primary"
            variant="outlined"
            size="small"
          />
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Button variant="outlined" onClick={onBack} sx={{ mb: 2 }}>
        Back to Menu
      </Button>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Payment Method</InputLabel>
        <Select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          label="Payment Method"
        >
          <MenuItem value="Cash">Cash</MenuItem>
          <MenuItem value="Online">Online</MenuItem>

          {rewardPoints && rewardPoints >= 100 && (
            <MenuItem value="Rewards">Use Reward Points (100 pts = ₹10 off)</MenuItem>
          )}
        </Select>
      </FormControl>

      {selectedItems.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", my: 4 }}>
          Your cart is empty. Please add some items.
        </Typography>
      ) : (
        selectedItems.map((item) => (
          <Box
            key={item.name}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            p={1}
            border="1px solid #ddd"
            borderRadius={2}
          >
            <Typography>
              {item.name} - ₹{item.price}
            </Typography>

            <Box display="flex" alignItems="center">
              <IconButton onClick={() => onDecrease(item.name)}>
                <MinusCircle />
              </IconButton>
              <Typography mx={1}>{item.count}</Typography>
              <IconButton onClick={() => onIncrease(item.name)}>
                <PlusCircle />
              </IconButton>
              <IconButton onClick={() => onRemove(item.name)} color="secondary">
                <XCircle />
              </IconButton>
            </Box>
          </Box>
        ))
      )}

      <Typography variant="h6" mt={2}>
        Total: ₹{total}
      </Typography>

      {paymentMethod === "Rewards" && rewardPoints && rewardPoints >= 100 && (
        <Box sx={{ mt: 1, mb: 2, p: 1, bgcolor: "#f0f7ff", borderRadius: 1 }}>
          <Typography variant="body2">
            You will use {Math.min(rewardPoints, Math.floor(parseFloat(total) * 10))} reward points
            for a discount of ₹{Math.min(rewardPoints / 10, parseFloat(total)).toFixed(2)}
          </Typography>
        </Box>
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={onSubmit}
        disabled={loading || selectedItems.length === 0}
      >
        {loading ? "Processing..." : orderPlaced ? "Add to Existing Order" : "Place Order"}
      </Button>
    </Box>
  );
};

export default ReviewCart;