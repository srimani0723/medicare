const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const medicationsRouter = require("./routes/medicationsRouter")
const medicationlogRouter = require("./routes/medicationlogRouter")
require("dotenv").config();

// for schema setup
const db = require("./config/db");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/user", userRouter);
app.use("/", medicationsRouter);
app.use("/", medicationlogRouter);

app.get("/", (req, res) => {
  res.send("This is home");
});

// schema setup
const schemaPath = path.join(__dirname, "models", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");
db.exec(schema, (err) => {
  if (err) console.log("Table Setup Error", err);
  else console.log("Table Setup successful");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started at http:/localhost:${PORT}`);
});
