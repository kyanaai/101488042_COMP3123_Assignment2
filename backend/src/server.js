// src/server.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import dns from "dns";
import http from "http";

dns.setDefaultResultOrder?.("ipv4first");

const port = Number(process.env.PORT) || 8081;

const server = http.createServer(app);

server.on("listening", () => {
  const addr = server.address();
  console.log(`Server listening on http://127.0.0.1:${addr.port}`);
});

server.on("error", (err) => {
  console.error("Server error:", err.message);
  process.exit(1);
});

server.on("close", () => {
  console.log("Server closed");
});

// bind to 0.0.0.0 to avoid localhost quirks
server.listen(port, "0.0.0.0");