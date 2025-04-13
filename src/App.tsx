import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import CustomerForm from "./pages/CustomerForm";
import SendWhatsApp from "./pages/SendWhatsApp";
import ManageRewards from "./pages/ManageRewards";
import CouponManager from "./pages/CouponManager";
import CustomerDashboard from "./pages/CustomerDashboard";
import OrderPage from "./pages/OrderPage";
import GenerateQRCode from "./pages/GenerateQRCode";
import Login from "./pages/Login";
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
      <MainLayout>
      {/* Full page container */}
      <Box sx={{ width: "100vw", minHeight: "100vh", boxSizing: "border-box" }}>
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
      </MainLayout>
    </Router>
  );
};

export default App;