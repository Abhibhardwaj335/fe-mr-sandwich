import React from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MinusCircle, PlusCircle } from "lucide-react";

interface MenuItemProps {
  name: string;
  price: number;
  image: string;
  count: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  name,
  price,
  image,
  count,
  onAdd,
  onIncrease,
  onDecrease,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb={1.5}
      p={isMobile ? 1.5 : 2}
      border="1px solid #eee"
      borderRadius={2}
      sx={{
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "center",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        sx={{
          width: isMobile ? "100%" : "auto",
          mb: isMobile ? 1 : 0,
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            width: isMobile ? 50 : 60,
            height: isMobile ? 50 : 60,
            marginRight: 12,
            borderRadius: 8,
            objectFit: "cover",
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/Creamy_Oreo_Milkshake.jpg";
          }}
        />
        <Box>
          <Typography variant={isMobile ? "body2" : "body1"} fontWeight="medium">
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ₹{price}
          </Typography>
        </Box>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        sx={{
          width: isMobile ? "100%" : "auto",
          justifyContent: isMobile ? "center" : "flex-end",
        }}
      >
        {count > 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e0e0e0",
              borderRadius: "20px",
              px: 1,
            }}
          >
            <IconButton onClick={onDecrease} size={isMobile ? "small" : "medium"}>
              <MinusCircle size={isMobile ? 16 : 20} />
            </IconButton>
            <Typography sx={{ mx: 1, minWidth: "24px", textAlign: "center" }}>
              {count}
            </Typography>
            <IconButton onClick={onIncrease} size={isMobile ? "small" : "medium"}>
              <PlusCircle size={isMobile ? 16 : 20} />
            </IconButton>
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={onAdd}
            size={isMobile ? "small" : "medium"}
            sx={{ borderRadius: "20px", px: isMobile ? 2 : 3 }}
          >
            Add
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default MenuItem;
