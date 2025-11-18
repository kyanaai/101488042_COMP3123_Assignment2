import { body, param, query, validationResult } from "express-validator";
import mongoose from "mongoose";
import Employee from "../models/Employee.js";

// Validators
export const validateCreate = [
  body("first_name").notEmpty().withMessage("first_name is required"),
  body("last_name").notEmpty().withMessage("last_name is required"),
  body("email").isEmail().withMessage("valid email is required"),
  body("position").notEmpty().withMessage("position is required"),
  body("salary").isNumeric().withMessage("salary must be a number"),
  body("date_of_joining")
    .isISO8601()
    .withMessage("date_of_joining must be an ISO date"),
  body("department").notEmpty().withMessage("department is required")
];

export const validateEidParam = [
  param("eid")
    .custom((v) => mongoose.Types.ObjectId.isValid(v))
    .withMessage("invalid employee id")
];

export const validateEidQuery = [
  query("eid")
    .custom((v) => mongoose.Types.ObjectId.isValid(v))
    .withMessage("invalid employee id")
];

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ status: false, errors: errors.array() });
  next();
};

// Controllers

// GET /api/v1/emp/employees
export const listEmployees = async (_req, res) => {
  const docs = await Employee.find().select("-__v");
  const out = docs.map((d) => ({
    employee_id: d._id.toString(),
    first_name: d.first_name,
    last_name: d.last_name,
    email: d.email,
    position: d.position,
    salary: d.salary,
    date_of_joining: d.date_of_joining,
    department: d.department,
    profile_image_url: d.profile_image_url || null
  }));
  return res.status(200).json(out);
};

// GET /api/v1/emp/employees/search?department=IT&position=Developer
export const searchEmployees = async (req, res) => {
  const { department, position } = req.query;

  const filter = {};
  if (department) {
    filter.department = { $regex: department, $options: "i" };
  }

  if (position) {
    filter.position = { $regex: position, $options: "i" };
  }

  const docs = await Employee.find(filter).select("-__v");

  const out = docs.map((d) => ({
    employee_id: d._id.toString(),
    first_name: d.first_name,
    last_name: d.last_name,
    email: d.email,
    position: d.position,
    salary: d.salary,
    date_of_joining: d.date_of_joining,
    department: d.department,
    profile_image_url: d.profile_image_url || null
  }));

  return res.status(200).json(out);
};

// POST /api/v1/emp/employees
// profile_image is an optional uploaded file -> profile_image_url stored in DB
export const createEmployee = async (req, res) => {
  const payload = { ...req.body };

  // salary comes as string from frontend
  if (payload.salary) {
    payload.salary = Number(payload.salary);
  }

  // if a file was uploaded by Multer, set the URL
  if (req.file) {
    payload.profile_image_url = `/uploads/${req.file.filename}`;
  }

  const emp = await Employee.create(payload);

  return res.status(201).json({
    status: true,
    message: "Employee created successfully.",
    employee: {
      employee_id: emp._id.toString(),
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      salary: emp.salary,
      date_of_joining: emp.date_of_joining,
      department: emp.department,
      profile_image_url: emp.profile_image_url || null
    }
  });
};

// GET /api/v1/emp/employees/:eid
export const getEmployee = async (req, res) => {
  const { eid } = req.params;
  const emp = await Employee.findById(eid).select("-__v");
  if (!emp)
    return res
      .status(404)
      .json({ status: false, message: "Employee not found" });

  return res.status(200).json({
    employee_id: emp._id.toString(),
    first_name: emp.first_name,
    last_name: emp.last_name,
    email: emp.email,
    position: emp.position,
    salary: emp.salary,
    date_of_joining: emp.date_of_joining,
    department: emp.department,
    profile_image_url: emp.profile_image_url || null
  });
};

// PUT /api/v1/emp/employees/:eid
export const updateEmployee = async (req, res) => {
  const { eid } = req.params;
  const payload = { ...req.body };

  if (payload.salary) {
    payload.salary = Number(payload.salary);
  }

  // if user uploads a new file during edit, update the URL
  if (req.file) {
    payload.profile_image_url = `/uploads/${req.file.filename}`;
  }

  const updated = await Employee.findByIdAndUpdate(eid, payload, { new: true });
  if (!updated)
    return res
      .status(404)
      .json({ status: false, message: "Employee not found" });

  return res.status(200).json({
    status: true,
    message: "Employee details updated successfully.",
    employee: {
      employee_id: updated._id.toString(),
      first_name: updated.first_name,
      last_name: updated.last_name,
      email: updated.email,
      position: updated.position,
      salary: updated.salary,
      date_of_joining: updated.date_of_joining,
      department: updated.department,
      profile_image_url: updated.profile_image_url || null
    }
  });
};

// DELETE /api/v1/emp/employees?eid=xxx
export const deleteEmployee = async (req, res) => {
  const { eid } = req.query;
  const del = await Employee.findByIdAndDelete(eid);
  if (!del)
    return res
      .status(404)
      .json({ status: false, message: "Employee not found" });

  return res
    .status(200)
    .json({ status: true, message: "Employee deleted successfully." });
};