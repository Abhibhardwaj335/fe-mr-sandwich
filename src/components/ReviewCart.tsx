import React, { useEffect } from "react";
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
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Stack,
  Badge,
  alpha,
  useTheme
} from "@mui/material";
import { ShoppingCart, PlusCircle, MinusCircle, XCircle, Gift, ArrowLeft, Check } from "lucide-react";

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
  onSubmit: (adjustedTotal: number) => void;
  onBack: () => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  loading: boolean;
  orderPlaced: boolean;
  rewardPoints?: number;
  setTotalAfterDiscount: (total: number) => void;
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
  rewardPoints,
  setTotalAfterDiscount,
}) => {
  const theme = useTheme();
  const total = selectedItems.reduce((sum, item) => sum + item.price * item.count, 0);
  const rewardDiscount = paymentMethod === "Rewards" && rewardPoints && rewardPoints >= 100
    ? Math.min(rewardPoints / 10, total)
    : 0;

  const totalAfterRewards = (total - rewardDiscount).toFixed(2);

  const handleSubmit = () => {
    onSubmit(parseFloat(totalAfterRewards));
  };

  // Update totalAfterDiscount in the parent component
  useEffect(() => {
    if (paymentMethod === "Rewards") {
      setTotalAfterDiscount(parseFloat(totalAfterRewards));
    } else {
      setTotalAfterDiscount(parseFloat(total.toFixed(2)));
    }
  }, [paymentMethod, totalAfterRewards, total, setTotalAfterDiscount]);

  // Count total items in cart
  const itemCount = selectedItems.reduce((count, item) => count + item.count, 0);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Custom AppBar for drawer */}
      <AppBar position="static" color="default" elevation={0} sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onBack} aria-label="back">
            <ArrowLeft />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
            Your Order
          </Typography>
          <Badge badgeContent={itemCount} color="primary">
            <ShoppingCart />
          </Badge>
        </Toolbar>
      </AppBar>

      {/* Reward Points Display */}
      {typeof rewardPoints === "number" && rewardPoints > 0 && (
        <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Gift size={20} color={theme.palette.primary.main} />
            <Typography variant="body2" color="primary.main" fontWeight="medium">
              You have <strong>{rewardPoints}</strong> reward points available
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Cart Items */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1 }}>
        {selectedItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8, p: 3 }}>
            <ShoppingCart size={48} color={theme.palette.text.disabled} />
            <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
              Your cart is empty. Add some items to get started.
            </Typography>
            <Button
              variant="outlined"
              onClick={onBack}
              sx={{ mt: 2 }}
            >
              Browse Menu
            </Button>
          </Box>
        ) : (
          <List disablePadding>
            {selectedItems.map((item) => (
              <Paper
                key={item.name}
                elevation={0}
                sx={{
                  mb: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <ListItem
                  sx={{
                    py: 1.5,
                    backgroundColor: theme.palette.background.default,
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {item.name}
                      </Typography>
                    }
                    secondary={`₹${item.price.toFixed(2)} each`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      size="small"
                      onClick={() => onRemove(item.name)}
                      sx={{ color: theme.palette.error.main }}
                    >
                      <XCircle size={18} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 2,
                  py: 1
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal: ₹{(item.price * item.count).toFixed(2)}
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}>
                    <IconButton
                      size="small"
                      onClick={() => onDecrease(item.name)}
                      disabled={item.count <= 1}
                      sx={{ borderRadius: 0 }}
                    >
                      <MinusCircle size={16} />
                    </IconButton>

                    <Typography variant="body2" sx={{
                      px: 2,
                      fontWeight: 'medium'
                    }}>
                      {item.count}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() => onIncrease(item.name)}
                      sx={{ borderRadius: 0 }}
                    >
                      <PlusCircle size={16} />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            ))}
          </List>
        )}
      </Box>

      {/* Payment Methods and Total */}
      {selectedItems.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.05)'
          }}
        >
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as string)}
              label="Payment Method"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              {rewardPoints && rewardPoints >= 100 && (
                <MenuItem value="Rewards">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Gift size={16} />
                    <span>Use Reward Points (100 pts = ₹10 off)</span>
                  </Stack>
                </MenuItem>
              )}
            </Select>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" color="text.secondary">Subtotal:</Typography>
            <Typography variant="body1">₹{total.toFixed(2)}</Typography>
          </Box>

          {paymentMethod === "Rewards" && rewardPoints && rewardPoints >= 100 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" color="primary">
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Gift size={16} />
                    <span>Reward Discount:</span>
                  </Stack>
                </Typography>
                <Typography variant="body1" color="primary">- ₹{rewardDiscount.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary.main">₹{totalAfterRewards}</Typography>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Using {Math.min(rewardPoints, Math.floor(total * 10))} reward points for discount
              </Typography>
            </>
          )}

          {paymentMethod !== "Rewards" && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">₹{total.toFixed(2)}</Typography>
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading || selectedItems.length === 0}
            sx={{
              py: 1.5,
              borderRadius: 2,
              boxShadow: 2
            }}
            startIcon={orderPlaced ? <Check /> : null}
          >
            {loading ? "Processing..." : orderPlaced ? "Add to Existing Order" : "Place Order"}
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ReviewCart;