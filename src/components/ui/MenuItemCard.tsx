import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';

interface MenuItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  onAdd: () => void;
}

const MenuItemCard: React.FC<MenuItemProps> = ({ item, onAdd }) => {
  return (
    <Card sx={{ width: 250, m: 1 }}>
      <CardMedia
        component="img"
        height="140"
        image={item.image}
        alt={item.name}
      />
      <CardContent>
        <Typography variant="h6">{item.name}</Typography>
        <Typography variant="body2" color="text.secondary">Price: ₹{item.price}</Typography>
        <Box mt={2}>
          <Button variant="contained" fullWidth onClick={onAdd}>Add</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
