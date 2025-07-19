import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import CenteredFormLayout from "../components/CenteredFormLayout";
import { Lock } from "lucide-react";
import { useNotify } from '../components/NotificationContext';
import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

// Import the configuration
import '../aws-config';

type LoginProps = {
  onLogin: () => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const notify = useNotify();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    // Check if user is already authenticated with Cognito
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // Get the current session to extract the JWT token
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken?.toString();
          if (token) {
            localStorage.setItem("authToken", token);
            localStorage.setItem("userRole", "admin");
            localStorage.setItem("username", user.username);
            localStorage.setItem("isAuthenticated", "true");
            navigate(from, { replace: true });
          }
        }
      } catch (error) {
        // User is not authenticated, stay on login page
        console.log("User not authenticated:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");
      }
    };

    // Only check auth if we're not already on login page due to failed auth
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      checkAuth();
    }
  }, [navigate, from]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log("Attempting login with username:", username);

      // First, try to sign out any existing user
      try {
        await signOut();
        console.log("Signed out existing user");
      } catch (signOutError) {
        console.log("No existing user to sign out:", signOutError);
      }

      // Use Cognito signIn instead of Auth.signIn
      const result = await signIn({
        username,
        password
      });

      console.log("Sign in result:", result);

      if (result.nextStep && result.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        // Handle case where user needs to set a new password
        notify("Please set a new password");
        setLoading(false);
        return;
      }

      if (result.isSignedIn) {
        // Successfully authenticated - get session to extract token
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        if (token) {
          // Store authentication data
          localStorage.setItem("authToken", token);
          localStorage.setItem("userRole", "admin");
          localStorage.setItem("username", username);
          localStorage.setItem("isAuthenticated", "true");
          onLogin();
          navigate(from, { replace: true });
        } else {
          notify("Failed to get authentication token", "error");
        }
      }

    } catch (error: any) {
      console.error('Login error:', error);

      // Handle different types of Cognito errors
      let errorMessage = "Login failed";

      switch (error.name) {
        case 'UserNotFoundException':
          errorMessage = "User not found";
          break;
        case 'NotAuthorizedException':
          errorMessage = "Invalid username or password";
          break;
        case 'UserNotConfirmedException':
          errorMessage = "User account not confirmed";
          break;
        case 'PasswordResetRequiredException':
          errorMessage = "Password reset required";
          break;
        case 'TooManyRequestsException':
          errorMessage = "Too many login attempts. Please try again later";
          break;
        case 'UserAlreadyAuthenticatedException':
          // Handle the case where user is already authenticated
          try {
            console.log("User already authenticated, getting current session");
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken?.toString();

            if (token) {
              localStorage.setItem("authToken", token);
              localStorage.setItem("userRole", "admin");
              localStorage.setItem("username", username);
              localStorage.setItem("isAuthenticated", "true");
              onLogin();
              navigate(from, { replace: true });
              notify("Already logged in!", "success");
              setLoading(false);
              return;
            }
          } catch (sessionError) {
            console.error("Failed to get session for already authenticated user:", sessionError);
            errorMessage = "Authentication session error. Please try refreshing the page.";
          }
          break;
        case 'AuthUserPoolException':
          errorMessage = "Authentication service configuration error";
          break;
        default:
          errorMessage = error.message || "Login failed";
      }

      notify(errorMessage, "error");
    }
    setLoading(false);
  };

  return (
    <CenteredFormLayout title="Login" icon={<Lock />}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
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