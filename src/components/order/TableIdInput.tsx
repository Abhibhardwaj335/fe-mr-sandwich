import React from "react";
import { TextField, Typography } from "@mui/material";

interface TableIdInputProps {
  effectiveTableId: string;
  manualTableId: string;
  onManualTableIdChange: (value: string) => void;
}

const TableIdInput: React.FC<TableIdInputProps> = ({
  effectiveTableId,
  manualTableId,
  onManualTableIdChange
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

  return (
    <Typography variant="h6" mt={2} mb={2}>
      You're ordering for <strong>Table {effectiveTableId}</strong>
    </Typography>
  );
};

export default TableIdInput;
