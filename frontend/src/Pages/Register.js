import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        name,
        email,
        password
      });

      if (response.data.error) {
        alert(response.data.error);
      } else {
        alert("Registered successfully!");
        navigate("/login");
      }
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "100px auto", padding: 2 }}>
      <CardContent>
        <Typography variant="h5">Register</Typography>
        <TextField fullWidth label="Username" margin="normal" value={name} onChange={e => setName(e.target.value)} />
        <TextField fullWidth label="Email" margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
        <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        <Button fullWidth variant="contained" onClick={handleRegister}>Register</Button>

        <Typography mt={2}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Register;
