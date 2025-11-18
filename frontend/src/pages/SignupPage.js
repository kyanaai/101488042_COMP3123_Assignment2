import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Stack, Typography, Paper } from "@mui/material";
import api from "../api/client";

function SignupPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/user/signup", { username, email, password });
      setSuccess("Signup successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <Paper sx={{ maxWidth: 400, mx: "auto", mt: 6, p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Signup
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            required
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="primary" variant="body2">
              {success}
            </Typography>
          )}

          <Button type="submit" variant="contained">
            Signup
          </Button>

          <Typography variant="body2">
            Already have an account?{" "}
            <Link to="/login">Login here</Link>
          </Typography>
        </Stack>
      </form>
    </Paper>
  );
}

export default SignupPage;