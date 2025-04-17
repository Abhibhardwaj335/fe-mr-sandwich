import React from "react";
import { Box, Button } from "@mui/material";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: '-ms-autohiding-scrollbar',
        py: 1,
        mb: 2,
        mt: 1,
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.2)',
          borderRadius: '10px',
        }
      }}
    >
      <Box display="flex" gap={1} flexShrink={0}>
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === selectedCategory ? "contained" : "outlined"}
            onClick={() => onSelectCategory(category)}
            sx={{
              minWidth: 'max-content',
              whiteSpace: 'nowrap',
              px: 2
            }}
          >
            {category}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default CategorySelector;