const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

dotenv.config();

const morgan = require('morgan');
app.use(morgan('dev'));  // Logs all requests to the terminal

const PORT = process.env.PORT;

const userRoutes = require("./routes/userRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const orderRoutes = require("./routes/orderRoutes");


mongoose.connect( process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

//limit num times user allowed to request from server
const limit = rateLimit({
    windowMs:  10 * 60 * 1000,
    max: 60,
});

//middleware
app.use(express.json());
app.use(cors());
app.use(limit);

//api routes
app.use("/inventory-api/user", userRoutes);
app.use("/inventory-api/inventory", inventoryRoutes); 
app.use("/inventory-api", orderRoutes)


app.get ("/", (req, res) => {//for testing
    res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});