import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import Reports from "./Pages/Reports";
import AddExpense from "./Pages/AddExpense";
import ProtectedRoute from "./Components/ProtectedRoute";
import AppLayout from "./Components/AppLayout";
import MonthlyAnalytics from "./Pages/MonthlyAnalytics";
import AIInsights from "./Pages/AIInsights";
import Register from "./Pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/add-expense" element={<AddExpense />} />
        </Route>
        
        <Route path="/monthly" element={<MonthlyAnalytics />} />
        <Route path="/insights" element={<AIInsights />} />
        
        {/* Fallback */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
