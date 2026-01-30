import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Chip
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import api from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalExpenses: 0, totalAmount: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userResponse = await api.get("/users/me");
        const expensesResponse = await api.get("/expenses");
        
        setUser(userResponse.data);
        
        const total = expensesResponse.data.reduce((sum, e) => sum + Number(e.amount), 0);
        setStats({
          totalExpenses: expensesResponse.data.length,
          totalAmount: total
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#fff",
            mb: 1
          }}
        >
          My Profile
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
          Manage your account information
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontSize: "48px",
                    mb: 3
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>

                <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff", mb: 1 }}>
                  {user.name}
                </Typography>

                <Chip
                  label="Active User"
                  size="small"
                  sx={{
                    background: "rgba(34, 197, 94, 0.2)",
                    color: "#22c55e",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    mb: 3
                  }}
                />

                <Divider sx={{ width: "100%", borderColor: "rgba(255,255,255,0.1)", my: 3 }} />

                <Box sx={{ width: "100%", textAlign: "left" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PersonIcon sx={{ color: "rgba(255,255,255,0.6)", mr: 2 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                        Username
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#fff", fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EmailIcon sx={{ color: "rgba(255,255,255,0.6)", mr: 2 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#fff", fontWeight: 500 }}>
                        {user.email || "Not provided"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarTodayIcon sx={{ color: "rgba(255,255,255,0.6)", mr: 2 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
                        Member Since
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#fff", fontWeight: 500 }}>
                        {new Date().toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Card */}
        <Grid item xs={12} md={7}>
          <Card
            sx={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              height: "100%"
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", mb: 3 }}>
                Account Statistics
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)"
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "#fff" }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#fff", mb: 1 }}>
                      ₹{stats.totalAmount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                      Total Spending
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      boxShadow: "0 4px 20px rgba(240, 147, 251, 0.3)"
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CalendarTodayIcon sx={{ fontSize: 40, color: "#fff" }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#fff", mb: 1 }}>
                      {stats.totalExpenses}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                      Total Transactions
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)"
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", mb: 2 }}>
                      Quick Info
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                      • Your expense data is securely stored
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                      • View detailed reports in the Reports section
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      • Export your data anytime as PDF
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
