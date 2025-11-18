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

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  position: "",
  department: "",
  salary: "",
  date_of_joining: ""
};

export default function AddEmployeeDialog({ open, onClose }) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // Reset form every time dialog opens
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setFile(null);
      setError("");
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // e.g. "data:image/png;base64,...."
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const mutation = useMutation({
    // We pass { form, file } from handleSubmit
    mutationFn: async ({ form, file }) => {
      let profileImageString = undefined;

      if (file) {
        profileImageString = await readFileAsDataUrl(file);
      }

      const payload = {
        ...form,
        salary: Number(form.salary),
        // backend expects profile_image in req.body
        profile_image: profileImageString
      };

      const res = await api.post("/emp/employees", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onClose();
    },
    onError: (err) => {
      console.error("Create employee error:", err.response?.data);
      const data = err.response?.data;

      if (data?.errors && Array.isArray(data.errors)) {
        const msg = data.errors
          .map((e) => `${e.param}: ${e.msg}`)
          .join(" | ");
        setError(msg);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("Failed to create employee. Please check the data.");
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate({ form, file });
  };

  const handleClose = () => {
    if (!mutation.isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Employee</DialogTitle>

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
                Selected file: <strong>{file.name}</strong>
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