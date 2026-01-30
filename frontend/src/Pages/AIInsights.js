import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import api from "../api";

export default function AIInsights() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    api.get("/expenses")
      .then(res => {
        generateInsights(res.data);
      })
      .catch(err => {
        if (err.response?.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
  }, []);

  const generateInsights = (data) => {
    const messages = [];

    if (!data || data.length === 0) {
      messages.push("No data yet. Start adding expenses to get insights.");
      setInsights(messages);
      return;
    }

    let total = 0;
    const categoryMap = {};
    const monthMap = {};

    data.forEach(e => {
      const amt = Number(e.amount);
      total += amt;

      categoryMap[e.category] = (categoryMap[e.category] || 0) + amt;

      const month = new Date(e.date).toLocaleString("default", {
        month: "short",
        year: "numeric"
      });

      monthMap[month] = (monthMap[month] || 0) + amt;
    });

    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];
    messages.push(`You spend the most on "${topCategory[0]}" (₹${topCategory[1]}).`);

    if (total > 50000) {
      messages.push("⚠️ You are spending a lot overall. Consider setting a monthly budget.");
    }

    const values = Object.values(monthMap);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    Object.entries(monthMap).forEach(([month, value]) => {
      if (value > avg * 1.5) {
        messages.push(`📈 Spending spike detected in ${month}: ₹${value}`);
      }
    });

    messages.push("💡 Tip: Track small daily expenses.");
    messages.push("💡 Tip: Review subscriptions & recurring costs.");

    setInsights(messages);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        AI Insights 🤖
      </Typography>

      {insights.map((msg, i) => (
        <Paper
          key={i}
          sx={{
            p: 2,
            mb: 2,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            color: "#fff"
          }}
        >
          <Typography>{msg}</Typography>
        </Paper>
      ))}
    </Box>
  );
}
