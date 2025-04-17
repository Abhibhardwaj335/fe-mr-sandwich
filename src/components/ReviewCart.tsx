import React from 'react';
import {
  Box, Typography, IconButton, Button, Divider
} from '@mui/material';
import { PlusCircle, MinusCircle, XCircle } from 'lucide-react';

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
}

const ReviewCart: React.FC<Props> = ({ selectedItems, onRemove, onIncrease, onDecrease, onSubmit }) => {
  const total = selectedItems.reduce((sum, item) => sum + item.price * item.count, 0).toFixed(2);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Review Your Cart</Typography>
      <Divider sx={{ mb: 2 }} />

      {selectedItems.map(item => (
        <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography>{item.name} - ₹{item.price} × {item.count}</Typography>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => onDecrease(item.id)}><MinusCircle /></IconButton>
            <IconButton onClick={() => onIncrease(item.id)}><PlusCircle /></IconButton>
            <IconButton onClick={() => onRemove(item.id)} color="secondary"><XCircle /></IconButton>
          </Box>
        </Box>
      ))}

      <Typography variant="h6" mt={2}>Total: ₹{total}</Typography>
      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={onSubmit}>Submit Order</Button>
    </Box>
  );
};

export default ReviewCart;
