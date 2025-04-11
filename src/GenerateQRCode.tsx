import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import QRCode from 'react-qr-code';
import { TextField } from "@mui/material"; // Add this import
import CenteredFormLayout from "./components/CenteredFormLayout";

const GenerateQRCode: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [tableId, setTableId] = useState<string>('');

  // Mock data for testing
  const mockTableId = 'table123'; // Example of a mock table ID

  useEffect(() => {
    // Fetch QR Code Data (Table ID based)
    const fetchQRCodeData = async () => {
      setLoading(true);
      try {
        // Uncomment below to call real API
        // const response = await axios.get(
        //   `${import.meta.env.VITE_API_URL}/generate-qr?tableId=${tableId}`
        // );

        // Mock API response for testing
        const response = { data: { qrCode: `https://restaurant.com/menu?tableId=${mockTableId}` } };

        setQrCodeData(response.data.qrCode);
      } catch (err) {
        console.error('Error fetching QR code:', err);
      } finally {
        setLoading(false);
      }
    };

    if (tableId) {
      fetchQRCodeData();
    }
  }, [tableId]);

  const handleGenerateQRCode = async () => {
    if (!tableId) {
      alert('Please enter a valid table ID');
      return;
    }

    setLoading(true);
    try {
      // Uncomment below to call real API to generate QR Code
      // const response = await axios.get(
      //   `${import.meta.env.VITE_API_URL}/generate-qr?tableId=${tableId}`
      // );

      // Mock API response for testing
      const response = { data: { qrCode: `https://restaurant.com/menu?tableId=${mockTableId}` } };

      setQrCodeData(response.data.qrCode);
    } catch (err) {
      console.error('Error generating QR code:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredFormLayout title="Generate QR Code">
      <Typography variant="h4">Generate QR Code</Typography>

      <TextField
        label="Enter Table ID"
        fullWidth
        value={tableId}
        onChange={(e) => setTableId(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateQRCode}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate QR Code'}
      </Button>

      {qrCodeData && (
        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <QRCode value={qrCodeData} size={256} />
          <Typography mt={2}>Scan this QR code to view the menu and place your order.</Typography>
        </Box>
      )}
    </CenteredFormLayout>
  );
};

export default GenerateQRCode;
