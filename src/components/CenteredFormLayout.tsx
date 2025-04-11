// src/components/CenteredFormLayout.tsx
import React from "react";
import { Box, Typography } from "@mui/material";

interface CenteredFormLayoutProps {
  title: string;
  children: React.ReactNode;
  maxWidth?: number;
}

const CenteredFormLayout: React.FC<CenteredFormLayoutProps> = ({
  title,
  children,
  maxWidth = 450,
}) => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth,
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#e3f2fd",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        {children}
      </Box>
    </Box>
  );
};

export default CenteredFormLayout;
