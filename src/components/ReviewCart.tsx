import React from "react";
import { Box, Typography, IconButton, Button, Divider } from "@mui/material";
import { PlusCircle, MinusCircle, XCircle } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  count: number;
}

interface Props {
  selectedItems: CartItem[];
  onRemove: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const ReviewCart: React.FC<Props> = ({
  selectedItems,
  onRemove,
  onIncrease,
  onDecrease,
  onSubmit,
  onBack,
}) => {
  const total = selectedItems
    .reduce((sum, item) => sum + item.price * item.count, 0)
    .toFixed(2);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Review Your Cart
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Button variant="outlined" onClick={onBack} sx={{ mb: 2 }}>
        Back to Menu
      </Button>

      {selectedItems.map((item) => (
        <Box
          key={item.id}
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
            <IconButton onClick={() => onDecrease(item.id)}>
              <MinusCircle />
            </IconButton>
            <Typography mx={1}>{item.count}</Typography>
            <IconButton onClick={() => onIncrease(item.id)}>
              <PlusCircle />
            </IconButton>
            <IconButton onClick={() => onRemove(item.id)} color="secondary">
              <XCircle />
            </IconButton>
          </Box>
        </Box>
      ))}

      <Typography variant="h6" mt={2}>
        Total: ₹{total}
      </Typography>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={onSubmit}
        disabled={selectedItems.length === 0}
      >
        Submit Order
      </Button>
    </Box>
  );
};

export default ReviewCart;
