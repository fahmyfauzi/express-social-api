const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");

const app = express();
dotenv.config();

// menangani error cors origin
app.use(cors());

// parse json dari body
app.use(express.json());

//middleware route auth
app.use("/api/users", authRoute);

//middleware route post
app.use("/api/posts", postRoute);

//connect mongodb
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected is Successfully!!!");
  })
  .catch((err) => {
    console.log(err.message);
  });

//server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
