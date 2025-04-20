import React from "react";
import { Badge, Box, Fab, Typography, Zoom, useTheme } from "@mui/material";
import { ShoppingCart } from "lucide-react";

interface FloatingCartButtonProps {
  itemCount: number;
  onClick: () => void;
  disabled?: boolean;
  total?: number; // Added total prop to show price
  showTotal?: boolean; // Option to toggle price display
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  itemCount,
  onClick,
  disabled = false,
  total = 0,
  showTotal = true
}) => {
  const theme = useTheme();

return (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column', // Stack components vertically on mobile
      alignItems: 'center',
      gap: 1.5,
      position: 'relative',
      justifyContent: 'center', // Center the content on mobile
    }}
  >
    {/* Total Price Pill */}
    <Zoom in={showTotal && itemCount > 0 && total > 0}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 4,
          py: 0.5,
          px: 1.5,
          minWidth: 80,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: `1px solid ${theme.palette.divider}`,
          transition: 'all 0.2s ease',
          zIndex: 2,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
          },
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      >
        <Typography variant="body2" fontWeight="medium">
          ₹{total.toFixed(2)}
        </Typography>
      </Box>
    </Zoom>

    {/* Confirm Items Label */}
    {itemCount > 0 && (
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 'bold',
          userSelect: 'none',
          cursor: 'pointer',
          display: 'inline-block',
          transition: 'color 0.3s ease',
          whiteSpace: 'nowrap',
          fontSize: { xs: '0.85rem', sm: '1rem' },
          '&:hover': {
            color: theme.palette.primary.main,
          },
        }}
        onClick={onClick}
      >
        Review ✅👇
      </Typography>
    )}

    {/* Cart Button */}
    <Fab
      color="primary"
      aria-label="cart"
      onClick={onClick}
      disabled={disabled}
      size="medium"
      sx={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        '&:hover': {
          transform: 'scale(1.08)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
        },
        '&:active': {
          transform: 'scale(0.95)',
        },
        ...(itemCount > 0 && {
          animation: itemCount === 1 ? 'pulse 2s ease-in-out' : 'none',
          '@keyframes pulse': {
            '0%': { boxShadow: `0 0 0 0 ${theme.palette.primary.main}50` },
            '70%': { boxShadow: `0 0 0 12px ${theme.palette.primary.main}00` },
            '100%': { boxShadow: `0 0 0 0 ${theme.palette.primary.main}00` },
          },
        }),
      }}
    >
      <Badge
        badgeContent={itemCount}
        color="error"
        max={99}
        sx={{
          '& .MuiBadge-badge': {
            fontSize: '0.75rem',
            fontWeight: 'bold',
            minWidth: '20px',
            height: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s',
            transform: itemCount > 0 ? 'scale(1)' : 'scale(0.5)',
          },
        }}
      >
        <ShoppingCart size={24} />
      </Badge>
    </Fab>
    {/* Optional: Indicator for empty cart */}
      {itemCount === 0 && (
        <Box
          sx={{
            position: "absolute",
            bottom: -8,
            right: -8,
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: theme.palette.grey[300],
            border: `2px solid ${theme.palette.background.paper}`,
            zIndex: 1,
          }}
        />
      )}
  </Box>
);
};

export default FloatingCartButton;