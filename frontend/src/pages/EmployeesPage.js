import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
  Stack
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { fetchEmployees, deleteEmployee } from "../api/employees";
import AddEmployeeDialog from "../components/AddEmployeeDialog";
import EditEmployeeDialog from "../components/EditEmployeeDialog";

function EmployeesPage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const {
    data: employees = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["employees", { department, position }],
    queryFn: () => fetchEmployees({ department, position })
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });

  const handleClearFilters = () => {
    setDepartment("");
    setPosition("");
    // will refetch with empty filters
    refetch();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    deleteMutation.mutate(id);
  };

  return (
    <>
      <Stack spacing={3}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">Employees</Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAdd(true)}
            >
              Add Employee
            </Button>

            <Typography variant="body2">
              Logged in as <strong>{user?.email}</strong>
            </Typography>

            <Button variant="outlined" onClick={logout}>
              Logout
            </Button>
          </Stack>
        </Stack>

        {/* Search filters */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Search Employees
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <TextField
              label="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <Button variant="contained" onClick={() => refetch()}>
              Search
            </Button>
            <Button variant="text" onClick={handleClearFilters}>
              Clear
            </Button>
          </Stack>
        </Paper>

        {/* Table */}
        <Paper sx={{ p: 2 }}>
          {isLoading && <Typography>Loading employees...</Typography>}
          {isError && (
            <Typography color="error">
              Error loading employees. Check backend is running.
            </Typography>
          )}

          {!isLoading && !isError && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Profile</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Salary</TableCell>
                    <TableCell>Date Joined</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.employee_id}>
                      <TableCell>
                        {emp.profile_image_url ? (
                          <img
                            src={`http://127.0.0.1:8081${emp.profile_image_url}`}
                            alt={`${emp.first_name} ${emp.last_name}`}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              objectFit: "cover"
                            }}
                          />
                        ) : (
                          <span>No image</span>
                        )}
                      </TableCell>
                      <TableCell>{emp.first_name}</TableCell>
                      <TableCell>{emp.last_name}</TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>${emp.salary}</TableCell>
                      <TableCell>
                        {emp.date_of_joining
                          ? new Date(emp.date_of_joining).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setEditingEmployee(emp)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDelete(emp.employee_id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                  {employees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <Typography align="center">
                          No employees found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Stack>

      {/* Add / Edit dialogs */}
      <AddEmployeeDialog open={openAdd} onClose={() => setOpenAdd(false)} />

      <EditEmployeeDialog
        open={Boolean(editingEmployee)}
        onClose={() => setEditingEmployee(null)}
        employee={editingEmployee}
      />
    </>
  );
}

export default EmployeesPage;