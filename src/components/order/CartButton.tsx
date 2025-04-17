import React from "react";
import { Box, Button } from "@mui/material";

interface CartButtonProps {
  itemCount: number;
  onClick: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ itemCount, onClick }) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 16,
        display: 'flex',
        justifyContent: 'center',
        mt: 3,
        zIndex: 10
      }}
    >
      <Button
        variant="contained"
        onClick={onClick}
        sx={{
          borderRadius: '24px',
          px: 4,
          py: 1.5,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
        disabled={itemCount === 0}
      >
        Review Cart {itemCount > 0 && `(${itemCount})`}
      </Button>
    </Box>
  );
};

export default CartButton;