import React, { useEffect, useState } from "react";
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
  useTheme,
  Tooltip,
  Checkbox,
  FormControlLabel,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide
} from "@mui/material";
import {
  ShoppingCart,
  PlusCircle,
  MinusCircle,
  XCircle,
  Gift,
  ArrowLeft,
  Check,
  Clock,
  CreditCard,
  DollarSign
} from "lucide-react";
import { TransitionProps } from "@mui/material/transitions";
import { useNotify } from '../components/NotificationContext';

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
  pointsToEarn?: number;
}

// Slide transition for confirmation dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  rewardPoints = 0,
  setTotalAfterDiscount,
}) => {
  const notify = useNotify();
  const theme = useTheme();
  const [useRewards, setUseRewards] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const total = selectedItems.reduce((sum, item) => sum + item.price * item.count, 0);

  // Calculate how many points can be redeemed (maximum 5 points per ₹1)
  const maxPointsToRedeem = Math.min(rewardPoints, Math.floor(total * 5));

  // Calculate the discount (5 points = ₹1)
  const rewardDiscount = useRewards && rewardPoints >= 100
    ? Math.min(maxPointsToRedeem / 5, total) // Convert points to rupees (5 points = ₹1)
    : 0;

  const totalAfterRewards = Math.max(0, total - rewardDiscount);
  const pointsBeingUsed = rewardDiscount * 5; // Points actually being used

  // Estimated delivery time (sample logic)
  const estimatedMinutes = 25 + (selectedItems.length * 5);

  const handleSubmit = () => {
    if (!paymentMethod) {
      notify("Please select a payment method.");
      return;
    }
    if (orderPlaced) {
      // Skip confirmation if adding to existing order
      onSubmit(totalAfterRewards);
    } else {
      // Show confirmation dialog
      setShowConfirmation(true);
    }
  };

  const confirmOrder = () => {
    setShowConfirmation(false);
    onSubmit(totalAfterRewards);
  };

  // Update totalAfterDiscount in the parent component
  useEffect(() => {
    setTotalAfterDiscount(useRewards ? totalAfterRewards : total);
  }, [useRewards, totalAfterRewards, total, setTotalAfterDiscount]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Custom AppBar for drawer */}
      <AppBar position="static" color="default" elevation={0} sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onBack} aria-label="back" sx={{ mr: 1 }}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Your Order
          </Typography>
          {rewardPoints > 0 && (
            <Tooltip title={`You have ${rewardPoints} reward points (₹${(rewardPoints/5).toFixed(0)} value)`}>
              <IconButton color="primary" size="small" sx={{ mr: 1 }}>
                <Badge badgeContent={rewardPoints} color="primary" max={999}>
                  <Gift size={40} />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

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
              <MenuItem value="Cash" sx={{ py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <DollarSign size={18} />
                  <Typography>Cash</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="Online" sx={{ py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CreditCard size={18} />
                  <Typography>Online Payment</Typography>
                </Stack>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Rewards Checkbox with Better Explanation */}
          {rewardPoints >= 100 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mb: 2,
                p: 1.5,
                border: `1px solid ${useRewards ? theme.palette.primary.main : theme.palette.divider}`,
                borderRadius: 2,
                backgroundColor: useRewards ? alpha(theme.palette.primary.light, 0.1) : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useRewards}
                    onChange={(e) => setUseRewards(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body1" fontWeight={useRewards ? 500 : 400}>
                    Use my reward points.                 5 points = ₹1 discount • Up to: ₹{(maxPointsToRedeem / 5).toFixed(2)}
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1" color="text.secondary">Subtotal:</Typography>
            <Typography variant="body1">₹{total.toFixed(2)}</Typography>
          </Box>

          {useRewards && rewardPoints >= 100 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" color="primary">
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Gift size={16} />
                    <span>Reward Discount:</span>
                  </Stack>
                </Typography>
                <Typography variant="body1" fontWeight="medium" color="primary">- ₹{rewardDiscount.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">₹{totalAfterRewards.toFixed(2)}</Typography>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Using {Math.round(pointsBeingUsed)} reward points for discount
              </Typography>
            </>
          )}

          {(!useRewards || rewardPoints < 100) && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h5" fontWeight="bold">₹{total.toFixed(2)}</Typography>
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading || selectedItems.length === 0 }
            sx={{
              py: 1.5,
              borderRadius: 2,
              boxShadow: 2,
              fontSize: '1rem',
              textTransform: 'none'
            }}
            startIcon={orderPlaced ? <Check /> : null}
          >
            {loading ? "Processing..." : orderPlaced ? "Add to Existing Order" : "Place Order"}
          </Button>
        </Paper>
      )}

      {/* Order Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowConfirmation(false)}
        aria-describedby="confirm-order-dialog"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Your Order</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography component="span" variant="body1" color="primary">
              You're about to place an order with {selectedItems.length} item(s) for a total of
              <Typography component="span" fontWeight="bold" color="primary.main"> ₹{(useRewards ? totalAfterRewards : total).toFixed(2)}</Typography>.
            </Typography>

            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Clock size={16} style={{ marginRight: 8 }} />
              Estimated time: {estimatedMinutes} minutes
            </Typography>

            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              <CreditCard size={16} style={{ marginRight: 8 }} />
              Payment method: {paymentMethod}
            </Typography>

            {useRewards && (
              <Box sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                display: 'flex',
                alignItems: 'center'
              }}>
                <Gift size={18} color={theme.palette.primary.main} style={{ marginRight: 8 }} />
                <Typography variant="body2" color="primary.main">
                  Using {Math.round(pointsBeingUsed)} reward points for ₹{rewardDiscount.toFixed(2)} discount
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setShowConfirmation(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmOrder}
            variant="contained"
            sx={{ borderRadius: 2 }}
            autoFocus
          >
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewCart;