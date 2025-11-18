// src/api/employees.js
import api from "./client";

// Get employees (optionally filtered by department/position)
export const fetchEmployees = async ({ department, position }) => {
  const params = {};
  if (department) params.department = department;
  if (position) params.position = position;

  // if filters present → use /search, else get all
  const endpoint =
    department || position ? "/emp/employees/search" : "/emp/employees";

  const res = await api.get(endpoint, { params });
  return res.data; // array of employees, includes profile_image_url
};

// Delete an employee by id
export const deleteEmployee = async (employeeId) => {
  const res = await api.delete("/emp/employees", {
    params: { eid: employeeId }
  });
  return res.data;
};