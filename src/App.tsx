import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import CustomerForm from "./CustomerForm";
import SendWhatsApp from "./SendWhatsApp";
import ManageRewards from "./ManageRewards";
import CouponManager from "./CouponManager";
import CustomerDashboard from "./CustomerDashboard";
import OrderPage from "./OrderPage";
import GenerateQRCode from "./GenerateQRCode";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import {
  Box,
  Button,
  MenuItem,
  IconButton,
  Drawer
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  //const role = localStorage.getItem("userRole");

  // Set authentication status based on localStorage
  useEffect(() => {
    const authenticated = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authenticated);
  }, []);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    window.location.href = "/login"; // Redirect to login page after logout
  };

  return (
    <Router>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        {/* Hamburger Menu Icon for mobile */}
        <Box
          sx={{
            display: { xs: "block", sm: "none" },
            position: "absolute",
            left: 10,
            top: 20,
          }}
        >
          <IconButton onClick={toggleDrawer(true)} size="large">
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Drawer for Mobile Navigation */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250, textAlign: "center" }}>
            <MenuItem component={Link} to="/" onClick={toggleDrawer(false)}>
              Customer Form
            </MenuItem>
            <MenuItem component={Link} to="/send-whatsapp" onClick={toggleDrawer(false)}>
              Send WhatsApp
            </MenuItem>
            <MenuItem component={Link} to="/rewards" onClick={toggleDrawer(false)}>
              Manage Rewards
            </MenuItem>
            <MenuItem component={Link} to="/coupons" onClick={toggleDrawer(false)}>
              Coupons
            </MenuItem>
            <MenuItem component={Link} to="/customer-dashboard" onClick={toggleDrawer(false)}>
              Dashboard
            </MenuItem>
            <MenuItem component={Link} to="/order" onClick={toggleDrawer(false)}>
              Order
            </MenuItem>
            <MenuItem component={Link} to="/generate-qr" onClick={toggleDrawer(false)}>
              Generate QR Code
            </MenuItem>
            <MenuItem component={Link} to="/login" onClick={toggleDrawer(false)}>
              Login
            </MenuItem>
            {isAuthenticated && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
          </Box>
        </Drawer>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "center" }}>
          <Button variant="contained" component={Link} to="/" sx={{ mr: 2 }}>
            Customer Form
          </Button>
          <Button variant="contained" component={Link} to="/send-whatsapp" sx={{ mr: 2 }}>
            Send WhatsApp
          </Button>
          <Button variant="contained" component={Link} to="/rewards" sx={{ mr: 2 }}>
            Manage Rewards
          </Button>
          <Button variant="contained" component={Link} to="/coupons" sx={{ mr: 2 }}>
            Coupons
          </Button>
          <Button variant="contained" component={Link} to="/customer-dashboard" sx={{ mr: 2 }}>
            Dashboard
          </Button>
          <Button variant="contained" component={Link} to="/order" sx={{ mr: 2 }}>
            Order
          </Button>
          <Button variant="contained" component={Link} to="/generate-qr" sx={{ mr: 2 }}>
            Generate QR Code
          </Button>

          {!isAuthenticated ? (
            <Button variant="outlined" component={Link} to="/login" sx={{ mr: 2 }}>
              Login
            </Button>
          ) : (
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Box>

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<CustomerForm />} />
        <Route path="/send-whatsapp" element={<SendWhatsApp />} />
        <Route
          path="/rewards"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageRewards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coupons"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CouponManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/generate-qr" element={<GenerateQRCode />} />
      </Routes>
    </Router>
  );
};

export default App;
