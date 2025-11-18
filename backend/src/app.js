import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// connect to MongoDB
import "./config/db.js";

// routes
import userRoutes from "./routes/user.routes.js";
import employeeRoutes from "./routes/employee.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());                     // allow frontend access
app.use(morgan("dev"));              // request logger
app.use(express.json());             // parse JSON body

// serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// simple incoming request logger (for debugging)
app.use((req, _res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// health check + root response
app.get("/__ping", (_req, res) => res.status(200).send("pong"));
app.get("/", (_req, res) =>
  res.status(200).json({ ok: true, service: "COMP3123 A2" })
);

// mount routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

// 404 fallback (for unmatched routes)
app.use((req, res) =>
  res.status(404).json({ status: false, message: "Not Found" })
);

export default app;