import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Collapse,
  Slide,
  IconButton,
  Badge,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  Clock,
  Plus,
  Minus
} from "lucide-react";

interface CartItem {
  name: string;
  price: number;
  count: number;
  image?: string;
  subcategory: string;
}

interface InteractiveCartPanelProps {
  items: CartItem[];
  onOpenCart: () => void;
  onIncreaseItem: (name: string) => void;
  onDecreaseItem: (name: string) => void;
  tableId?: string;
}

const InteractiveCartPanel: React.FC<InteractiveCartPanelProps> = ({
  items,
  onOpenCart,
  onIncreaseItem,
  onDecreaseItem,
  tableId
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const itemCount = items.reduce((total, item) => total + item.count, 0);
  const totalPrice = items.reduce((total, item) => total + (item.price * item.count), 0);

  // Control visibility of the entire panel based on cart contents
  useEffect(() => {
    if (itemCount > 0) {
      setShowPanel(true);
    } else {
      setExpanded(false);
      setTimeout(() => {
        setShowPanel(false);
      }, 300);
    }
  }, [itemCount]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleCheckout = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from toggling the expanded state
    onOpenCart();
  };

  return (
    <Slide direction="up" in={showPanel} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: {
            xs: "calc(100% - 32px)",
            sm: "450px"
          },
          maxWidth: "100%",
          borderRadius: 3,
          overflow: "hidden",
          zIndex: 1000,
          transition: "all 0.3s ease",
          boxShadow: expanded
            ? "0 12px 28px rgba(0,0,0,0.25)"
            : "0 8px 16px rgba(0,0,0,0.15)"
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            py: 1.5,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={toggleExpanded}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge badgeContent={itemCount} color="error" sx={{ mr: 1.5 }}>
              <ShoppingCart size={20} />
            </Badge>
            <Typography variant="subtitle1" fontWeight="bold">
              Your Order
            </Typography>
            {tableId && (
              <Chip
                label={`Table ${tableId}`}
                size="small"
                sx={{
                  ml: 1,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "inherit",
                  fontWeight: "medium",
                  fontSize: "0.7rem",
                  display: { xs: 'none', sm: 'flex' } // Hide on mobile
                }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 1 }}>
              ₹{totalPrice.toFixed(2)}
            </Typography>
            {expanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </Box>
        </Box>

        {/* Preview Items (when collapsed) */}
        {!expanded && items.length > 0 && (
          <Box
            sx={{
              p: 1.5,
              backgroundColor: theme.palette.background.paper,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between" // Better alignment for mobile
            }}
          >
            {/* Use responsive display to handle small screens */}
            <Box
              sx={{
                flex: { xs: '0 1 auto', sm: '1 1 auto' },
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                // On mobile, just show the item count
                ...(isMobile && {
                  justifyContent: "center",
                  mr: 2
                })
              }}
            >
              {/* On mobile, show simplified preview */}
              {isMobile ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight="medium">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </Typography>
                </Box>
              ) : (
                // On larger screens, show the preview items
                <>
                  {items.slice(0, 2).map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mr: 1.5
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: "primary.light",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 1,
                          color: "primary.contrastText",
                          fontSize: "0.75rem",
                          fontWeight: "bold"
                        }}
                      >
                        {item.count}
                      </Box>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: "140px" }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  ))}

                  {items.length > 2 && (
                    <Chip
                      label={`+${items.length - 2} more`}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </>
              )}
            </Box>

            {/* Always show checkout button */}
            <Button
              variant="contained"
              size="small"
              onClick={handleCheckout}
              sx={{
                borderRadius: 4,
                px: 2,
                whiteSpace: "nowrap"
              }}
            >
              {isMobile ? "Checkout" : "View Cart"}
            </Button>
          </Box>
        )}

        {/* Expanded Content */}
        <Collapse in={expanded}>
          <Box sx={{ maxHeight: "40vh", overflowY: "auto" }}>
            <List disablePadding>
              {items.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      py: 1.5,
                      px: 2
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: "primary.light",
                          fontSize: "0.8rem"
                        }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={item.name}
                      secondary={`₹${item.price.toFixed(2)}`}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: "medium"
                      }}
                      secondaryTypographyProps={{
                        variant: "caption"
                      }}
                      sx={{ mr: 2 }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDecreaseItem(item.name);
                        }}
                        sx={{
                          color: theme.palette.text.secondary,
                          p: 0.5
                        }}
                      >
                        <Minus size={16} />
                      </IconButton>

                      <Typography sx={{ mx: 1.5, minWidth: 16, textAlign: "center" }}>
                        {item.count}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onIncreaseItem(item.name);
                        }}
                        sx={{
                          color: theme.palette.primary.main,
                          p: 0.5
                        }}
                      >
                        <Plus size={16} />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>

          {/* Expanded Footer */}
          <Box sx={{ p: 2, bgcolor: theme.palette.background.default }}>
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              color: theme.palette.text.secondary
            }}>
              <Typography variant="body2">Items:</Typography>
              <Typography variant="body2">{itemCount}</Typography>
            </Box>

            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              color: theme.palette.text.primary
            }}>
              <Typography variant="subtitle2">Total Amount:</Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                ₹{totalPrice.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={(e) => handleCheckout(e)}
                sx={{ borderRadius: 2 }}
                startIcon={<ShoppingCart />}
              >
                Place Order
              </Button>
            </Box>

            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 2
            }}>
              <Clock size={14} />
              <Typography variant="caption" sx={{ ml: 0.5, color: "text.secondary" }}>
                Estimated delivery: 30-45 min
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </Paper>
    </Slide>
  );
};

export default InteractiveCartPanel;