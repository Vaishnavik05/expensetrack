import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useNavigate } from "react-router-dom";

export default function BottomNav() {
  const nav = useNavigate();

  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation>
        <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} onClick={() => nav("/dashboard")} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} onClick={() => nav("/profile")} />
        <BottomNavigationAction label="Reports" icon={<BarChartIcon />} onClick={() => nav("/reports")} />
      </BottomNavigation>
    </Paper>
  );
}
