import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Stack, Typography, Paper } from "@mui/material";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/user/login", { email, password });

      // adjust this if your backend uses a different field name
      const jwtToken = res.data.jwt_token || res.data.token;
      if (!jwtToken) {
        setError("No token returned from server.");
        return;
      }

      // you can store more user info if your backend returns it
      login(jwtToken, { email });

      navigate("/employees");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <Paper sx={{ maxWidth: 400, mx: "auto", mt: 6, p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
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

          <Button type="submit" variant="contained">
            Login
          </Button>

          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Link to="/signup">Sign up here</Link>
          </Typography>
        </Stack>
      </form>
    </Paper>
  );
}

export default LoginPage;