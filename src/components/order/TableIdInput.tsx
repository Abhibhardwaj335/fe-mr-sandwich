import React from "react";
import { TextField, Typography } from "@mui/material";

interface TableIdInputProps {
  effectiveTableId: string;
  manualTableId: string;
  onManualTableIdChange: (value: string) => void;
  customerName?: string; // Add optional customer name prop
  customerInfoSet?: boolean; // Add optional flag to check if customer info is set
}

const TableIdInput: React.FC<TableIdInputProps> = ({
  effectiveTableId,
  manualTableId,
  onManualTableIdChange,
  customerName,
  customerInfoSet
}) => {
  if (!effectiveTableId) {
    return (
      <TextField
        label="Enter Table ID"
        fullWidth
        value={manualTableId}
        onChange={(e) => onManualTableIdChange(e.target.value)}
        sx={{ mb: 2 }}
      />
    );
  }

  // Show personalized message if customer name is available and info is set
  if (customerName && customerInfoSet) {
    return (
      <Typography variant="h6" mt={2} mb={2}>
        Hey! <strong>{customerName}</strong>, you're ordering for <strong>Table {effectiveTableId}</strong>
      </Typography>
    );
  }

  // Default message if there's a table ID but no customer name yet
  return (
    <Typography variant="h6" mt={2} mb={2}>
      You're ordering for <strong>Table {effectiveTableId}</strong>
    </Typography>
  );
};

export default TableIdInput;