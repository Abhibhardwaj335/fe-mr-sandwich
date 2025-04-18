import React from "react";
import { Box, Typography } from "@mui/material";
import MenuItem from "./MenuItem";

interface Item {
  name: string;
  price: number;
  image: string;
  subcategory: string;
}

interface CartItem extends Item {
  count: number;
}

interface SubcategorySectionProps {
  title: string;
  items: Item[];
  selectedItems: CartItem[];
  onAddItem: (item: Item & { count?: number }) => void;
  onIncreaseItem: (name: string) => void;
  onDecreaseItem: (name: string) => void;
}

const SubcategorySection: React.FC<SubcategorySectionProps> = ({
  title,
  items,
  selectedItems,
  onAddItem,
  onIncreaseItem,
  onDecreaseItem
}) => {
  return (
    <Box mb={3}>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{
          mb: 1.5,
          borderBottom: '1px solid #eee',
          pb: 0.5
        }}
      >
        {title}
      </Typography>

      {items.map((item) => {
        const selected = selectedItems.find((i) => i.name === item.name);
        const count = selected ? selected.count : 0;

        return (
          <MenuItem
            key={item.name}
            name={item.name}
            price={item.price}
            image={item.image}
            count={count}
            onAdd={() => onAddItem(item)}
            onIncrease={() => onIncreaseItem(item.name)}
            onDecrease={() => onDecreaseItem(item.name)}
          />
        );
      })}
    </Box>
  );
};

export default SubcategorySection;