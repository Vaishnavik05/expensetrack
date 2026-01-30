import { useEffect, useState, useCallback } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from "recharts";
import { Box, Typography, Paper, Button } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../api";

const COLORS = ["#00c6ff", "#f107a3", "#7b2ff7", "#ffb347", "#00ff9c"];

export default function Admin() {
  const [expenses, setExpenses] = useState([]);
  const [userData, setUserData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const fetchAll = useCallback(async () => {
    try {
      const eRes = await api.get("/expenses");
      setExpenses(eRes.data);
      processData(eRes.data);
    } catch (err) {
      if (err.response?.status === 403) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const processData = (data) => {
    const userMap = {};
    const catMap = {};
    const monthMap = {};

    data.forEach(e => {
      const user = e.user?.name || "Unknown";
      const cat = e.category;
      const month = new Date(e.date).toLocaleString("default", {
        month: "short",
        year: "numeric"
      });

      userMap[user] = (userMap[user] || 0) + Number(e.amount);
      catMap[cat] = (catMap[cat] || 0) + Number(e.amount);
      monthMap[month] = (monthMap[month] || 0) + Number(e.amount);
    });

    setUserData(Object.entries(userMap).map(([name, value]) => ({ name, value })));
    setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));
    setMonthlyData(Object.entries(monthMap).map(([month, total]) => ({ month, total })));
  };

  const totalSystemAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Admin Report", pageWidth / 2, 15, { align: "center" });

    // Summary Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("System Summary", 15, 30);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Total Users: ${userData.length}`, 15, 40);
    doc.text(`Total Expenses: ${expenses.length}`, 15, 48);
    doc.text(`Total Amount: ₹${totalSystemAmount.toFixed(2)}`, 15, 56); // ← FIX

    // Expenses Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("All Expenses", 15, 70);

    const expenseTableData = expenses.map((expense) => [
      expense.date || "N/A",
      expense.title || "N/A",
      `₹${Number(expense.amount).toFixed(2)}`, // ← FIX: Proper formatting
      expense.category || "N/A",
      expense.user?.name || "N/A",
    ]);

    doc.autoTable({
      startY: 78,
      head: [["Date", "Title", "Amount", "Category", "User"]],
      body: expenseTableData,
      theme: "grid",
      headerStyles: {
        fillColor: [123, 47, 247],
        textColor: [255, 255, 255],
      },
      columnStyles: {
        2: { halign: "right" }, // Right-align amount
      },
    });

    let currentY = doc.lastAutoTable.finalY + 15;

    // Category Summary
    if (categoryData.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Category Breakdown", 15, currentY);

      const categoryTableData = categoryData.map((cat) => [
        cat.name,
        `₹${Number(cat.value).toFixed(2)}`, // ← FIX
      ]);

      doc.autoTable({
        startY: currentY + 8,
        head: [["Category", "Total"]],
        body: categoryTableData,
        theme: "grid",
        columnStyles: {
          1: { halign: "right" }, // Right-align amount
        },
      });

      currentY = doc.lastAutoTable.finalY + 10;
    }

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, currentY);

    doc.save("admin-report.pdf");
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Analytics Dashboard
      </Typography>

      <Typography variant="h6" gutterBottom>
        Total System Expense: ₹{totalSystemAmount}
      </Typography>

      <Button
        variant="contained"
        onClick={downloadPDF}
        sx={{
          mb: 3,
          background: "linear-gradient(90deg,#00c6ff,#7b2ff7)"
        }}
      >
        Download Report
      </Button>

      <Box display="flex" flexWrap="wrap" gap={4}>
        <Paper sx={{ p: 2 }}>
          <Typography>User-wise Spending</Typography>
          <PieChart width={300} height={300}>
            <Pie data={userData} dataKey="value" nameKey="name" outerRadius={100} label>
              {userData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography>Category-wise Spending</Typography>
          <BarChart width={400} height={300} data={categoryData}>
            <CartesianGrid />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#f107a3" />
          </BarChart>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography>Monthly Trend</Typography>
          <LineChart width={500} height={300} data={monthlyData}>
            <CartesianGrid />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="total" stroke="#00c6ff" />
          </LineChart>
        </Paper>
      </Box>
    </Box>
  );
}
