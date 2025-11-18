import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Container from "@mui/material/Container";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmployeesPage from "./pages/EmployeesPage";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Container sx={{ mt: 4 }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/employees" element={<EmployeesPage />} />
        </Route>

        {/* default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Container>
  );
}

export default App;