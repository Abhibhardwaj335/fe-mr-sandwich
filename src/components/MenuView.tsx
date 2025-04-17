import React from "react";
import { Box, Typography, Divider, Grid, Button, IconButton } from "@mui/material"; // Assuming you are using Material UI
import { PlusCircle, MinusCircle } from "lucide-react";
import MenuItemCard from "./ui/MenuItemCard"; // Import MenuItemCard (adjust path as needed)

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  subcategory: string;
}

interface MenuViewProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onNext: () => void;
  showSubcategories?: boolean;
}

const MenuView: React.FC<MenuViewProps> = ({ menuItems, onAddItem, onIncrease, onDecrease, onNext, showSubcategories }) => {
  const grouped = showSubcategories
    ? menuItems.reduce((acc, item) => {
        acc[item.subcategory] = acc[item.subcategory] || [];
        acc[item.subcategory].push(item);
        return acc;
      }, {} as Record<string, MenuItem[]>)
    : { All: menuItems };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Select Your Items</Typography>
      {Object.entries(grouped).map(([subcategory, items]) => (
        <Box key={subcategory} mt={4}>
          <Typography variant="h5" gutterBottom>{subcategory}</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item key={item.id}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <MenuItemCard item={item} onAdd={() => onAddItem(item)} />
                  <Box display="flex" alignItems="center">
                    <IconButton onClick={() => onDecrease(item.id)}><MinusCircle /></IconButton>
                    <IconButton onClick={() => onIncrease(item.id)}><PlusCircle /></IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={onNext}>Review Cart</Button>
      </Box>
    </Box>
  );
};

export default MenuView;
