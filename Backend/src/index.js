require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const connection = require("./config/db");
const loggingMiddleware = require("./middlewares/loggingMiddleware");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");

connection();

app.use(cors());
app.use(express.json());
app.use(loggingMiddleware);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
