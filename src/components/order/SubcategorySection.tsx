import React from "react";
import { Box, Typography } from "@mui/material";
import MenuItem from "./MenuItem";

interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  subcategory: string;
}

interface SubcategorySectionProps {
  title: string;
  items: Item[];
  selectedItems: { id: number; count: number }[];
  onAddItem: (item: Item) => void;
  onIncreaseItem: (id: number) => void;
  onDecreaseItem: (id: number) => void;
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
        const selected = selectedItems.find((i) => i.id === item.id);
        const count = selected ? selected.count : 0;

        return (
          <MenuItem
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
            count={count}
            onAdd={() => onAddItem(item)}
            onIncrease={() => onIncreaseItem(item.id)}
            onDecrease={() => onDecreaseItem(item.id)}
          />
        );
      })}
    </Box>
  );
};

export default SubcategorySection;