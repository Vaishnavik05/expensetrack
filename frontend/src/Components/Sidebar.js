import { Box, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const nav = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Profile", path: "/profile", icon: <PersonIcon /> },
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Add Expense", path: "/add-expense", icon: <AddIcon /> },
    { label: "Reports", path: "/reports", icon: <BarChartIcon /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <Box
      sx={{
        width: 280,
        background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        boxShadow: "4px 0 20px rgba(0,0,0,0.3)",
        "@media (max-width: 768px)": {
          display: "none"
        }
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}
          >
            💰
          </Box>
          <Box>
            <Box sx={{ fontSize: "20px", fontWeight: 700 }}>ExpenseTracker</Box>
            <Box sx={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Manage Your Finances</Box>
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 2, py: 3 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => nav(item.path)}
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  background: isActive ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                  "&:hover": {
                    background: isActive
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "rgba(255,255,255,0.05)"
                  }
                }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "15px",
                    fontWeight: isActive ? 600 : 400
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* Logout Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: "12px",
            py: 1.5,
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            "&:hover": {
              background: "rgba(239, 68, 68, 0.2)"
            }
          }}
        >
          <ListItemIcon sx={{ color: "#ef4444", minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: "15px",
              fontWeight: 500,
              color: "#ef4444"
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}
