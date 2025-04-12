import { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CenteredFormLayout from "./components/CenteredFormLayout";

export default function CouponManager() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [newCoupon, setNewCoupon] = useState({
    title: "", code: "", description: "", validFrom: "", validTo: "", usageLimit: 0,
  });
  const [viewMode, setViewMode] = useState<"create" | "existing">("existing");

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL + "/coupons");
      const data = Array.isArray(res.data) ? res.data : res.data.coupons || [];
      setCoupons(data);
    } catch (err) {
      console.error("Failed to fetch coupons", err);
      setCoupons([]);
    }
  };

  const createCoupon = async () => {
    try {
      await axios.post(import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL + "/coupons", newCoupon);
      setNewCoupon({ title: "", code: "", description: "", validFrom: "", validTo: "", usageLimit: 0 });
      fetchCoupons();
      setViewMode("existing"); // Switch to existing coupons view after creating a coupon
    } catch (err) {
      console.error("Failed to create coupon", err);
    }
  };

  const deleteCoupon = async (code: string) => {
    try {
      await axios.delete(import.meta.env.VITE_MR_SANDWICH_SERVICE_API_URL + `/coupons/?code=${code}`);
      fetchCoupons();
    } catch (err) {
      console.error("Failed to delete coupon", err);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  return (
    <CenteredFormLayout title="Coupon Manager">
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Buttons for toggling views */}
        <Box display="flex" justifyContent="flex-start" gap={2}>
          <Button
            variant={viewMode === "create" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setViewMode("create")}
          >
            Create Coupon
          </Button>
          <Button
            variant={viewMode === "existing" ? "contained" : "outlined"}
            color="primary"
            onClick={() => setViewMode("existing")}
          >
            Existing Coupons
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Show Create Coupon Form if viewMode is "create" */}
        {viewMode === "create" && (
          <>
            <TextField label="Title" value={newCoupon.title}
              onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })} />
            <TextField label="Code" value={newCoupon.code}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })} />
            <TextField label="Description" value={newCoupon.description}
              onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })} />
            <TextField type="date" label="Valid From" InputLabelProps={{ shrink: true }}
              value={newCoupon.validFrom}
              onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })} />
            <TextField type="date" label="Valid To" InputLabelProps={{ shrink: true }}
              value={newCoupon.validTo}
              onChange={(e) => setNewCoupon({ ...newCoupon, validTo: e.target.value })} />
            <TextField type="number" label="Usage Limit"
              value={newCoupon.usageLimit}
              onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: parseInt(e.target.value) || 0 })} />

            <Button variant="contained" color="primary" onClick={createCoupon}>
              Create Coupon
            </Button>
          </>
        )}

        {/* Show Existing Coupons if viewMode is "existing" */}
        {viewMode === "existing" && (
          <>
            <Typography variant="h6">Existing Coupons</Typography>
            {coupons.length === 0 ? (
              <Typography variant="body2" color="textSecondary">No coupons found.</Typography>
            ) : (
              coupons.map((c: any) => (
                <Box key={c.code} p={2} bgcolor="#f9f9f9" borderRadius={2} mb={2} boxShadow={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography fontWeight="bold">{c.title} ({c.code})</Typography>
                      <Typography variant="body2">{c.description}</Typography>
                      <Typography variant="body2">Valid: {c.validFrom} to {c.validTo}</Typography>
                      <Typography variant="body2">Used {c.usedCount || 0} / {c.usageLimit}</Typography>
                    </Box>
                    <IconButton onClick={() => deleteCoupon(c.code)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </>
        )}
      </Box>
    </CenteredFormLayout>
  );
}
