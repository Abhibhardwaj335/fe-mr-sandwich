import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
  IconButton,
  Drawer,
  MenuItem
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const authenticated = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authenticated);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <Router>
      {/* Full page container */}
      <Box sx={{ width: "100vw", minHeight: "100vh", boxSizing: "border-box" }}>
        {/* Top-level layout wrapper */}
        <Box sx={{ width: "100%", px: 2, py: 2 }}>
          {/* Hamburger Menu Icon */}
          <Box sx={{ display: { xs: "block", sm: "none" }, position: "absolute", left: 10, top: 20 }}>
            <IconButton onClick={toggleDrawer(true)} size="large">
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Drawer for Mobile */}
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box sx={{ width: 250, textAlign: "center" }}>
              <MenuItem component={Link} to="/order" onClick={toggleDrawer(false)} sx={{ fontWeight: "bold" }}>
                Order
              </MenuItem>
              <MenuItem component={Link} to="/generate-qr" onClick={toggleDrawer(false)} sx={{ fontWeight: "bold" }}>
                Generate QR Code
              </MenuItem>
              {isAuthenticated && (
                <>
                  <MenuItem component={Link} to="/" onClick={toggleDrawer(false)} sx={{ fontWeight: "bold" }}>
                    Customer Form
                  </MenuItem>
                  <MenuItem component={Link} to="/send-whatsapp" onClick={toggleDrawer(false)} sx={{ fontWeight: "bold" }}>
                    Send WhatsApp
                  </MenuItem>
                  <MenuItem component={Link} to="/rewards" onClick={toggleDrawer(false)} sx={{ fontWeight: "bold" }}>
                    Manage Rewards
                  </MenuItem>
                  <MenuItem component={Link} to="/coupons" onClick={toggleDrawer(false)} sx={{ fontWeight: "bold" }}>
                    Coupons
                  </MenuItem>
                  <MenuItem component={Link} to="/customer-dashboard" onClick={toggleDrawer(false)} sx={{ fontWeight: "bold" }}>
                    Dashboard
                  </MenuItem>
                </>
              )}
              {!isAuthenticated ? (
                <MenuItem component={Link} to="/login" onClick={toggleDrawer(false)} sx={{ fontWeight: "bold" }}>
                  Login
                </MenuItem>
              ) : (
                <MenuItem onClick={handleLogout} sx={{ fontWeight: "bold" }}>
                  Logout
                </MenuItem>
              )}
            </Box>
          </Drawer>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              width: "100%",
              minHeight: "80px", // keep height consistent
            }}
          >
            <Button variant="contained" component={Link} to="/order" sx={{ borderRadius: 2, minWidth: '120px' }}>
              Order
            </Button>
            <Button variant="contained" component={Link} to="/generate-qr" sx={{ borderRadius: 2, minWidth: '120px' }}>
              Generate QR Code
            </Button>

            {isAuthenticated ? (
              <>
                <Button variant="contained" component={Link} to="/" sx={{ borderRadius: 2, minWidth: '120px' }}>
                  Customer Form
                </Button>
                <Button variant="contained" component={Link} to="/send-whatsapp" sx={{ borderRadius: 2, minWidth: '120px' }}>
                  Send WhatsApp
                </Button>
                <Button variant="contained" component={Link} to="/rewards" sx={{ borderRadius: 2, minWidth: '120px' }}>
                  Manage Rewards
                </Button>
                <Button variant="contained" component={Link} to="/coupons" sx={{ borderRadius: 2, minWidth: '120px' }}>
                  Coupons
                </Button>
                <Button variant="contained" component={Link} to="/customer-dashboard" sx={{ borderRadius: 2, minWidth: '120px' }}>
                  Dashboard
                </Button>
                <Button variant="outlined" color="error" onClick={handleLogout} sx={{ borderRadius: 2, minWidth: '120px' }}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outlined" component={Link} to="/login" sx={{ borderRadius: 2, minWidth: '120px' }}>
                Login
              </Button>
            )}
          </Box>
        </Box>

        {/* Routes Section */}
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/generate-qr" element={<GenerateQRCode />} />

          <Route path="/" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CustomerForm />
            </ProtectedRoute>
          } />
          <Route path="/send-whatsapp" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SendWhatsApp />
            </ProtectedRoute>
          } />
          <Route path="/rewards" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageRewards />
            </ProtectedRoute>
          } />
          <Route path="/coupons" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CouponManager />
            </ProtectedRoute>
          } />
          <Route path="/customer-dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
