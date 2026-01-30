import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Sending login request with:", { name: username, password });

      const response = await axios.post("http://localhost:8080/api/auth/login", {
        name: username,
        password: password
      });

      console.log("Login response:", response.data);

      const token = response.data.token;
      console.log("Token received:", token);

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        console.log("Token stored in localStorage");

        // Verify token was stored
        const storedToken = localStorage.getItem("token");
        console.log("Verified stored token:", storedToken);

        setLoading(false);
        navigate("/dashboard");
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      setLoading(false);
      const errorMsg = err.response?.data || err.message || "Invalid credentials";
      console.error("Login error:", errorMsg);
      setError(errorMsg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          background: "rgba(30, 41, 59, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)"
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "700",
              color: "#fff",
              textAlign: "center",
              mb: 1,
              background: "linear-gradient(90deg, #00d4ff, #0099ff)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            💰 ExpenseTracker
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              color: "#94a3b8",
              mb: 3,
              fontSize: "12px"
            }}
          >
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              variant="outlined"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00d4ff",
                  }
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.5)",
                  opacity: 1,
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00d4ff",
                  }
                }
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                background: "linear-gradient(90deg, #00d4ff, #0099ff)",
                color: "#000",
                fontWeight: "600",
                padding: "12px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "16px",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 24px rgba(0, 212, 255, 0.4)"
                },
                "&:disabled": {
                  background: "rgba(0, 212, 255, 0.5)",
                  color: "#000"
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#000" }} /> : "Login"}
            </Button>
          </form>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              color: "#94a3b8",
              mt: 3,
              fontSize: "13px"
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#00d4ff",
                textDecoration: "none",
                fontWeight: "600"
              }}
            >
              Register here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
