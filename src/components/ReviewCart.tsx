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
} from "@mui/material";
import { PlusCircle, MinusCircle, XCircle } from "lucide-react";

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
}) => {
  const total = selectedItems
    .reduce((sum, item) => sum + item.price * item.count, 0)
    .toFixed(2);

  return (
    <Box>
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