require("dotenv").config(); // 👈 MUST BE FIRST

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const app = express();

const transactionRoutes = require("./src/routes/transactionRoutes");

const summaryRoutes = require("./src/routes/summaryRoutes");


// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Test route
// app.get("/", (req, res) => {
//   res.send("Money Manager API is running");
// });

// Transaction Routes 
app.use("/api/transactions", transactionRoutes);

// Summary Routes
app.use("/api/summary", summaryRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
