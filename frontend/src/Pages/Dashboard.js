import { useEffect, useMemo, useState } from "react";
import api from "../api";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Paper,
  Grid
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "jspdf-autotable";
const getColor = (index) => {
  const hue = (index * 67) % 360;
  return `hsl(${hue}, 85%, 60%)`;
};

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    api.get("/expenses")
      .then(res => setExpenses(res.data))
      .catch(() => {
        localStorage.clear();
        window.location.href = "/login";
      });
  }, []);

  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const categoryData = useMemo(() => {
    const totals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
      return acc;
    }, {});
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const totals = expenses.reduce((acc, curr) => {
      const month = new Date(curr.date).toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + Number(curr.amount);
      return acc;
    }, {});
    return Object.entries(totals).map(([month, total]) => ({ month, total }));
  }, [expenses]);

  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "12px" }}
      >
        {`${name}: ₹${value}`}
      </text>
    );
  };

  return (
    <Box
    //   sx={{
    //     height: "100vh",
    //     overflow: "hidden",
    //     display: "flex",
    //     flexDirection: "column",
    //     minHeight: 0
    //   }}
    // >
          sx={{
        width: "100%",        // full width of parent
        height: "500px",      // fixed height
        minHeight: "400px"    // minimum height
      }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff" }}>
          Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "12px" }}>
          Welcome back! Here's your spending overview
        </Typography>
      </Box>

      {/* Metrics */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { title: "Total Spending", value: `₹${totalAmount.toLocaleString()}`, bg: "linear-gradient(135deg,#667eea,#764ba2)" },
          { title: "Transactions", value: expenses.length, bg: "linear-gradient(135deg,#f093fb,#f5576c)" },
          { title: "Avg/Transaction", value: `₹${expenses.length ? Math.round(totalAmount / expenses.length) : 0}`, bg: "linear-gradient(135deg,#4facfe,#00f2fe)" },
          { title: "Categories", value: new Set(expenses.map(e => e.category)).size, bg: "linear-gradient(135deg,#43e97b,#38f9d7)" }
        ].map((card, i) => (
          <Grid item xs={12} sm={6} md={6} key={i}>
            <Card sx={{
              background: card.bg,
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,.3)"
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: "rgba(255,255,255,.7)", fontSize: "18px" }}>
                  {card.title}
                </Typography>
                <Typography sx={{fontSize: "28px", fontWeight: 700, color: "#fff" }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
        
      {/* Charts */}
      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        <Grid item xs={12} md={6} sx={{ minHeight: 0 }}>
          <Paper sx={{
            p: 3,
            height: "500px",
            width: "350px",
            background: "rgba(30,41,59,0.85)",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0
          }}>
            <Typography sx={{ color: "#fff", fontWeight: 600, mb: 2 }}>
              Category Distribution
            </Typography>

            <Box sx={{ flex: 1, minHeight: 0, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ left: 150, right: 150 }}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={renderCustomLabel}
                    labelLine
                    dataKey="value"
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={getColor(i)} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => `₹${v}`}
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid rgba(255,255,255,.1)",
                      color: "#fff"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} sx={{ minHeight: 0 }}>
          <Paper sx={{
            p: 3,
            height: "500px",
            background: "rgba(30,41,59,0.85)",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0
          }}>
            <Typography sx={{ color: "#fff", fontWeight: 600, mb: 2 }}>
              Monthly Spending
            </Typography>

            <Box sx={{ flex: 1, minHeight: 0, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.1)" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: "#1e293b" }} />
                  <Bar dataKey="total" fill="#00d4ff" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
