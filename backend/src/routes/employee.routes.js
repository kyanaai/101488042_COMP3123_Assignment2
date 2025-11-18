import { Router } from "express";
import {
  listEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  validateCreate,
  validateEidParam,
  validateEidQuery,
  handleValidation
} from "../controllers/employee.controller.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

// Protect all employee routes with auth middleware
router.use(auth);

// GET /api/v1/emp/employees
router.get(
  "/employees",
  listEmployees
);

// GET /api/v1/emp/employees/search?department=IT&position=Developer
router.get(
  "/employees/search",
  searchEmployees
);

// POST /api/v1/emp/employees
// Uses multer to handle optional profile_image upload
router.post(
  "/employees",
  upload.single("profile_image"),
  validateCreate,
  handleValidation,
  createEmployee
);

// GET /api/v1/emp/employees/:eid
router.get(
  "/employees/:eid",
  validateEidParam,
  handleValidation,
  getEmployee
);

// PUT /api/v1/emp/employees/:eid
// Also allows updating the profile image
router.put(
  "/employees/:eid",
  upload.single("profile_image"),
  validateEidParam,
  handleValidation,
  updateEmployee
);

// DELETE /api/v1/emp/employees?eid=xxx
router.delete(
  "/employees",
  validateEidQuery,
  handleValidation,
  deleteEmployee
);

export default router;