import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import QRCode from 'react-qr-code';
import CenteredFormLayout from "../components/CenteredFormLayout";
import { QrCode } from "lucide-react";

const GenerateQRCode: React.FC = () => {
  const [tableId, setTableId] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrType, setQrType] = useState('table');

  const handleGenerateQRCode = () => {
    if (qrType === 'table' && !tableId) {
      alert('Please enter a valid table ID');
      return;
    }

    if (qrType === 'link' && !customLink) {
      alert('Please enter a valid URL');
      return;
    }

    setLoading(true);

    let url;
    if (qrType === 'table') {
      url = `${window.location.origin}/order?tableId=${tableId}`;
    } else {
      // Make sure the link has http/https protocol
      url = customLink.startsWith('http') ? customLink : `https://${customLink}`;
    }

    setQrCodeUrl(url);
    setLoading(false);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQrType(event.target.value);
    setQrCodeUrl(''); // Clear QR code when changing type
  };

  return (
    <CenteredFormLayout title="Generate QR Code" icon={<QrCode />} >
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">QR Code Type</FormLabel>
        <RadioGroup
          row
          value={qrType}
          onChange={handleTypeChange}
        >
          <FormControlLabel value="table" control={<Radio />} label="Table Order" />
          <FormControlLabel value="link" control={<Radio />} label="Custom Link" />
        </RadioGroup>
      </FormControl>

      {qrType === 'table' ? (
        <TextField
          label="Enter Table ID"
          fullWidth
          value={tableId}
          onChange={(e) => setTableId(e.target.value)}
          sx={{ mb: 2 }}
        />
      ) : (
        <TextField
          label="Enter URL"
          fullWidth
          value={customLink}
          onChange={(e) => setCustomLink(e.target.value)}
          placeholder="https://example.com"
          sx={{ mb: 2 }}
        />
      )}

      <Button variant="contained" color="primary" onClick={handleGenerateQRCode}>
        {loading ? <CircularProgress size={24} /> : 'Generate QR Code'}
      </Button>

      {qrCodeUrl && (
        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <QRCode value={qrCodeUrl} size={256} />
          {qrType === 'table' ? (
            <Typography mt={2}>Scan to place order for Table: {tableId}</Typography>
          ) : (
            <Typography mt={2}>Scan to visit: {qrCodeUrl}</Typography>
          )}
        </Box>
      )}
    </CenteredFormLayout>
  );
};

export default GenerateQRCode;