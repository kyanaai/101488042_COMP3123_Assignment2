import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const uri = process.env.MONGO_URI;

(async () => {
  try {
    if (!uri) throw new Error("Missing MONGO_URI in .env");

    await mongoose.connect(uri, {
      dbName: "comp3123_assigment1",    // specify DB name
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,    // fail fast if cluster unreachable
      socketTimeoutMS: 20000
    });

    console.log("MongoDB connected");
    console.log("Using database:", mongoose.connection.name);
  } catch (err) {
    // keep the HTTP server alive even if DB fails
    console.error("Mongo connection error:", err.message);
  }
})();