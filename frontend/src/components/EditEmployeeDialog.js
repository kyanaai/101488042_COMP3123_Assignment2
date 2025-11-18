import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";

export default function EditEmployeeDialog({ open, onClose, employee }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    department: "",
    salary: "",
    date_of_joining: ""
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // helper to format date for <input type="date" />
  const toDateInput = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  };

  // when dialog opens, prefill with employee data
  useEffect(() => {
    if (open && employee) {
      setForm({
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        email: employee.email || "",
        position: employee.position || "",
        department: employee.department || "",
        salary: employee.salary ?? "",
        date_of_joining: toDateInput(employee.date_of_joining)
      });
      setFile(null);
      setError("");
    }
  }, [open, employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const mutation = useMutation({
    mutationFn: async ({ form, file }) => {
      if (!employee) return;

      let profileImageString = undefined;

      if (file) {
        // if user picked a new file, convert to data URL
        profileImageString = await readFileAsDataUrl(file);
      }

      const payload = {
        ...form,
        salary: Number(form.salary)
      };

      // only send profile_image if user chose a new one
      if (profileImageString) {
        payload.profile_image_url = profileImageString;
      }

      const res = await api.put(
        `/emp/employees/${employee.employee_id}`,
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onClose();
    },
    onError: (err) => {
      console.error("Update employee error:", err.response?.data);
      const data = err.response?.data;

      if (data?.errors && Array.isArray(data.errors)) {
        const msg = data.errors
          .map((e) => `${e.param}: ${e.msg}`)
          .join(" | ");
        setError(msg);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("Failed to update employee. Please check the data.");
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate({ form, file });
  };

  const handleClose = () => {
    if (!mutation.isLoading) onClose();
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Employee</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="First Name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              required
            />
            <TextField
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              required
            />
            <TextField
              label="Salary"
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              required
            />
            <TextField
              label="Date of Joining"
              name="date_of_joining"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.date_of_joining}
              onChange={handleChange}
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && (
              <Typography variant="body2">
                New file: <strong>{file.name}</strong>
              </Typography>
            )}

            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={mutation.isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}