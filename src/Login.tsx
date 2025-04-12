import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import CenteredFormLayout from "./components/CenteredFormLayout"; // Reuse your existing layout

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Get the 'from' location for redirection after successful login
  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    // Check if the user is already authenticated on page load
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleLogin = async () => {
    setLoading(true);

    // 👉 Simulate delay for realism
    setTimeout(() => {
      // ✅ MOCK: Set role and authentication in localStorage
      localStorage.setItem("userRole", role);
      localStorage.setItem("username", username);
      localStorage.setItem("isAuthenticated", "true");

      // ✅ Navigate to the page the user tried to access
      navigate(from, { replace: true });
      setLoading(false);
    }, 1000);

    // 🔒 Actual backend call when ready
    /*
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.role) {
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("isAuthenticated", "true");
        navigate(from, { replace: true });
      } else {
        // show error
      }
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <CenteredFormLayout title="Login">
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          select
          label="Select Role"
          fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="staff">Staff</MenuItem>
        </TextField>

        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          disabled={loading || username.trim() === ""}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </Box>
    </CenteredFormLayout>
  );
};

export default Login;
