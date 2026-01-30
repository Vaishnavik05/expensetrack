import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from "recharts";
import { Box, Typography, Paper, Button } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../api";

export default function MonthlyAnalytics() {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    api.get("/expenses")
      .then(res => processData(res.data))
      .catch(err => {
        if (err.response?.status === 403) {
          localStorage.clear();
          window.location.href = "/login";
        }
      });
  }, []);

  const processData = (data) => {
    const grouped = {};

    data.forEach(e => {
      const month = new Date(e.date).toLocaleString("default", {
        month: "short",
        year: "numeric"
      });

      grouped[month] = (grouped[month] || 0) + Number(e.amount);
    });

    const formatted = Object.keys(grouped).map(key => ({
      month: key,
      total: grouped[key]
    }));

    setMonthlyData(formatted);
  };

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Monthly Analytics Report", pageWidth / 2, 15, { align: "center" });

    // Summary section
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const totalAmount = monthlyData.reduce((sum, m) => sum + m.total, 0);
    doc.text(`Total Spending: ₹${totalAmount.toFixed(2)}`, 15, 25);

    // Monthly data table
    const tableData = monthlyData.map((item) => [
      item.month,
      `₹${Number(item.total).toFixed(2)}`, // ← FIX: Proper formatting
    ]);

    doc.autoTable({
      startY: 35,
      head: [["Month", "Total Spending"]],
      body: tableData,
      theme: "grid",
      headerStyles: {
        fillColor: [123, 47, 247],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        1: { halign: "right" }, // Right-align amount
      },
    });

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    const finalY = doc.lastAutoTable.finalY || 50;
    doc.text(`Report generated: ${new Date().toLocaleDateString()}`, 15, finalY + 15);

    doc.save("monthly-analytics.pdf");
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Monthly Analytics
      </Typography>

      <Button
        variant="contained"
        onClick={downloadPDF}
        sx={{
          mb: 3,
          background: "linear-gradient(90deg,#7b2ff7,#f107a3)"
        }}
      >
        Download PDF
      </Button>

      <Box display="flex" gap={4} flexWrap="wrap">
        <Paper sx={{ p: 2 }}>
          <Typography>Spending Trend</Typography>

          <LineChart width={500} height={300} data={monthlyData}>
            <CartesianGrid />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#7b2ff7" />
          </LineChart>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography>Monthly Comparison</Typography>

          <BarChart width={500} height={300} data={monthlyData}>
            <CartesianGrid />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#f107a3" />
          </BarChart>
        </Paper>
      </Box>
    </Box>
  );
}
