require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/userRoute"));

app.get('/health', (req, res) => {
    res.status(200).send('Auth Service is healthy');
  });

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
