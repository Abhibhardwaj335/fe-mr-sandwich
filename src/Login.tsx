import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import CenteredFormLayout from "./components/CenteredFormLayout"; // Reuse your existing layout

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

    setTimeout(() => {
      if (username === "admin" && password === "Admin@#2025") {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("username", username);
        localStorage.setItem("isAuthenticated", "true");
        navigate(from, { replace: true });
      } else {
        alert("Invalid credentials");
      }
      setLoading(false);
    }, 1000);
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
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          disabled={loading || username.trim() === "" || password.trim() === ""}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </Box>
    </CenteredFormLayout>
  );
};

export default Login;
