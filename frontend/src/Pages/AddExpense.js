import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Food",
    "Transport",
    "Entertainment",
    "Shopping",
    "Bills",
    "Healthcare",
    "Education",
    "Other",
  ];

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!amount || amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    if (!date) {
      setError("Date is required");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/expenses", {
        title: title.trim(),
        amount: parseFloat(amount),
        category,
        date,
      });

      console.log("Expense added:", response.data);
      setSuccess("✓ Expense added successfully!");

      // Reset form
      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate(new Date().toISOString().split("T")[0]);

      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add expense"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}
          >
            Add New Expense
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleAddExpense} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Title */}
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              placeholder="e.g., Grocery shopping"
              disabled={loading}
            />

            {/* Amount */}
            <TextField
              label="Amount (₹)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              placeholder="0.00"
              inputProps={{ step: "0.01", min: "0" }}
              disabled={loading}
            />

            {/* Category */}
            <TextField
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              fullWidth
              disabled={loading}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            {/* Date */}
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
                py: 1.5,
                mt: 2,
                fontSize: "1rem",
                fontWeight: "bold",
              }}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Expense"}
            </Button>

            {/* Cancel Button */}
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}