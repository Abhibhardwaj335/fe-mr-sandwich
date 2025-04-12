import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, TextField } from '@mui/material';
import QRCode from 'react-qr-code';
import CenteredFormLayout from "./components/CenteredFormLayout";

const GenerateQRCode: React.FC = () => {
  const [tableId, setTableId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateQRCode = () => {
    if (!tableId) {
      alert('Please enter a valid table ID');
      return;
    }

    setLoading(true);
    const url = `${window.location.origin}/order?tableId=${tableId}`;
    setQrCodeUrl(url);
    setLoading(false);
  };

  return (
    <CenteredFormLayout title="Generate QR Code">
      <TextField
        label="Enter Table ID"
        fullWidth
        value={tableId}
        onChange={(e) => setTableId(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleGenerateQRCode}>
        {loading ? <CircularProgress size={24} /> : 'Generate QR Code'}
      </Button>

      {qrCodeUrl && (
        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <QRCode value={qrCodeUrl} size={256} />
          <Typography mt={2}>Scan to place order for Table: {tableId}</Typography>
        </Box>
      )}
    </CenteredFormLayout>
  );
};

export default GenerateQRCode;
