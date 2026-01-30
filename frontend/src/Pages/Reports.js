import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../api";

const COLORS = ["#00c6ff", "#0072ff", "#7b2ff7", "#f107a3", "#ff9800"];

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [userData, setUserData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [category, setCategory] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const userRes = await api.get("/users/me");
        setIsAdmin(userRes.data.email?.includes("admin") || userRes.data.name === "admin");
      } catch (err) {
        console.error("Error checking admin:", err);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/expenses");
        setExpenses(res.data || []);
        processUserData(res.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (isAdmin && tabValue === 1) {
      const fetchAllExpenses = async () => {
        try {
          const res = await api.get("/expenses");
          setAllExpenses(res.data || []);
          processAdminData(res.data);
        } catch (err) {
          console.error("Error fetching all expenses:", err);
        }
      };
      fetchAllExpenses();
    }
  }, [isAdmin, tabValue]);

  const processUserData = (data) => {
    setFiltered(data);
  };

  const processAdminData = (data) => {
    const categoryMap = {};
    const monthMap = {};

    data.forEach((e) => {
      const cat = e.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount);

      const month = new Date(e.date).toLocaleString("default", { month: "short" });
      monthMap[month] = (monthMap[month] || 0) + Number(e.amount);
    });

    setCategoryData(
      Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
    );
    setMonthlyData(
      Object.entries(monthMap).map(([month, total]) => ({ month, total }))
    );

    const userMap = {};
    data.forEach((e) => {
      const userName = e.user?.name || "Unknown";
      userMap[userName] = (userMap[userName] || 0) + Number(e.amount);
    });

    setUserData(
      Object.entries(userMap).map(([name, total]) => ({ name, total }))
    );
  };

  useEffect(() => {
    let result = expenses;

    if (from) result = result.filter((e) => new Date(e.date) >= new Date(from));
    if (to) result = result.filter((e) => new Date(e.date) <= new Date(to));
    if (category) result = result.filter((e) => e.category === category);

    setFiltered(result);
  }, [from, to, category, expenses]);

  const downloadMyExpensesPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("My Expenses Report", pageWidth / 2, 15, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const dateText = `${from || "All dates"} to ${to || "All dates"}`;
    doc.text(`Date Range: ${dateText}`, pageWidth / 2, 22, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Total Amount: ₹${total.toFixed(2)}`, 15, 32);
    doc.text(`Total Expenses: ${filtered.length}`, 15, 40);

    const tableData = filtered.map((expense) => [
      expense.date || "N/A",
      expense.title || "N/A",
      `₹${Number(expense.amount).toFixed(2)}`,
      expense.category || "N/A",
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["Date", "Title", "Amount", "Category"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        2: { halign: "right" },
      },
    });

    const finalY = doc.lastAutoTable?.finalY || 60;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, finalY + 15);

    doc.save("my-expenses.pdf");
  };

  const downloadSystemReportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const totalSystemAmount = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("System Report", pageWidth / 2, 15, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Total Spending: ₹${totalSystemAmount.toFixed(2)}`, 15, 25);
    doc.text(`Total Expenses: ${allExpenses.length}`, 15, 32);
    doc.text(`Total Users: ${userData.length}`, 15, 39);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("All Expenses", 15, 50);

    const expenseTableData = allExpenses.map((expense) => [
      expense.date || "N/A",
      expense.title || "N/A",
      `₹${Number(expense.amount).toFixed(2)}`,
      expense.category || "N/A",
      expense.user?.name || "N/A",
    ]);

    autoTable(doc, {
      startY: 58,
      head: [["Date", "Title", "Amount", "Category", "User"]],
      body: expenseTableData,
      theme: "grid",
      headStyles: {
        fillColor: [123, 47, 247],
        textColor: [255, 255, 255],
      },
      columnStyles: {
        2: { halign: "right" },
      },
    });

    let currentY = doc.lastAutoTable?.finalY + 15 || 80;

    if (categoryData.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Category Breakdown", 15, currentY);

      const categoryTableData = categoryData.map((cat) => [
        cat.name,
        `₹${Number(cat.value).toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: currentY + 8,
        head: [["Category", "Total"]],
        body: categoryTableData,
        theme: "grid",
        columnStyles: {
          1: { halign: "right" },
        },
      });

      currentY = doc.lastAutoTable?.finalY + 10 || currentY + 20;
    }

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 15, currentY);

    doc.save("system-report.pdf");
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      {!isAdmin && (
        <Alert severity="info" sx={{ mb: 2 }}>
          📊 View your personal expense reports and analytics
        </Alert>
      )}

      {isAdmin && (
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 3, borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Tab label="My Expenses" />
          <Tab label="System Report" />
        </Tabs>
      )}

      {tabValue === 0 && (
        <Box>
          <Card
            sx={{
              mb: 3,
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Filters
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
                <TextField
                  label="From Date"
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="To Date"
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  select
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Transport">Transport</MenuItem>
                  <MenuItem value="Entertainment">Entertainment</MenuItem>
                  <MenuItem value="Shopping">Shopping</MenuItem>
                  <MenuItem value="Bills">Bills</MenuItem>
                  <MenuItem value="Healthcare">Healthcare</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  onClick={() => {
                    setFrom("");
                    setTo("");
                    setCategory("");
                  }}
                  sx={{ background: "linear-gradient(90deg, #7b2ff7, #f107a3)" }}
                >
                  Clear Filters
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <Paper sx={{ p: 2, flex: 1, minWidth: "200px" }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Total Amount
              </Typography>
              <Typography variant="h5" sx={{ color: "#7b2ff7", fontWeight: "bold" }}>
                ₹{filtered.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, minWidth: "200px" }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Total Expenses
              </Typography>
              <Typography variant="h5" sx={{ color: "#f107a3", fontWeight: "bold" }}>
                {filtered.length}
              </Typography>
            </Paper>
            <Button
              variant="contained"
              onClick={downloadMyExpensesPDF}
              sx={{ background: "linear-gradient(90deg, #7b2ff7, #f107a3)", alignSelf: "center" }}
            >
              Download PDF
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: "rgba(123, 47, 247, 0.2)" }}>
                  <TableCell sx={{ color: "#7b2ff7", fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ color: "#7b2ff7", fontWeight: "bold" }}>Title</TableCell>
                  <TableCell sx={{ color: "#7b2ff7", fontWeight: "bold" }}>Amount</TableCell>
                  <TableCell sx={{ color: "#7b2ff7", fontWeight: "bold" }}>Category</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.title}</TableCell>
                      <TableCell>₹{Number(expense.amount).toFixed(2)}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: "center", py: 3 }}>
                      No expenses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 1 && isAdmin && (
        <Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, background: "rgba(123, 47, 247, 0.1)", border: "1px solid rgba(123, 47, 247, 0.3)" }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Total Spending
              </Typography>
              <Typography variant="h5" sx={{ color: "#7b2ff7", fontWeight: "bold" }}>
                ₹{allExpenses.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, background: "rgba(241, 7, 163, 0.1)", border: "1px solid rgba(241, 7, 163, 0.3)" }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Total Expenses
              </Typography>
              <Typography variant="h5" sx={{ color: "#f107a3", fontWeight: "bold" }}>
                {allExpenses.length}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, background: "rgba(100, 200, 255, 0.1)", border: "1px solid rgba(100, 200, 255, 0.3)" }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                Total Users
              </Typography>
              <Typography variant="h5" sx={{ color: "#64c8ff", fontWeight: "bold" }}>
                {userData.length}
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              onClick={downloadSystemReportPDF}
              sx={{ background: "linear-gradient(90deg, #7b2ff7, #f107a3)" }}
            >
              Download System Report PDF
            </Button>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 3, mb: 3 }}>
            <Paper sx={{ p: 2, background: "rgba(255, 255, 255, 0.05)" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Spending by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ₹${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>

            <Paper sx={{ p: 2, background: "rgba(255, 255, 255, 0.05)" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Monthly Spending Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", border: "1px solid #7b2ff7" }} />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#7b2ff7" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          <Paper sx={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: "rgba(123, 47, 247, 0.2)" }}>
                    <TableCell sx={{ color: "#7b2ff7", fontWeight: "bold" }}>Date</TableCell>
                    <TableCell sx={{ color: "#7b2ff7", fontWeight: "bold" }}>Title</TableCell>
                    <TableCell sx={{ color: "#7b2ff7", fontWeight: "bold" }}>Amount</TableCell>
                    <TableCell sx={{ color: "#7b2ff7", fontWeight: "bold" }}>Category</TableCell>
                    <TableCell sx={{ color: "#7b2ff7", fontWeight: "bold" }}>User</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.date}</TableCell>
                      <TableCell>{expense.title}</TableCell>
                      <TableCell>₹{Number(expense.amount).toFixed(2)}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.user?.name || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
