const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 8080;
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
require("dotenv").config();
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-tutorial.kzujf.mongodb.net/mern-tutorial?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Connecting to database : OK");
  })
  .catch((error) => {
    console.error(`Connecting to database : KO. ${error.message}`);
  });
app.use(express.json());
app.get("/", (req, res) => res.send("hello world 1"));
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.listen(PORT, () => {
  console.log(`Starting server on port ${PORT} : OK`);
});
