import React from "react";
import { Badge, Fab } from "@mui/material";
import { ShoppingCart } from "lucide-react";

interface FloatingCartButtonProps {
  itemCount: number;
  onClick: () => void;
  disabled?: boolean;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  itemCount,
  onClick,
  disabled = false
}) => {
  return (
    <Fab
      color="primary"
      aria-label="cart"
      onClick={onClick}
      disabled={disabled}
      sx={{
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        '&:hover': {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s'
        }
      }}
    >
      <Badge badgeContent={itemCount} color="error">
        <ShoppingCart />
      </Badge>
    </Fab>
  );
};

export default FloatingCartButton;