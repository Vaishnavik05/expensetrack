import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";

export default function AppLayout() {
  return (
    <Box sx={{ 
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1a2e4a 100%)"
    }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1, 
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <Box sx={{ 
          flex: 1,
          overflow: "auto",
          padding: "32px",
          "@media (max-width: 768px)": {
            padding: "20px 16px"
          }
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
