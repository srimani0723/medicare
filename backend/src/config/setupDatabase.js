const db = require("./db");
const path = require("path");
const fs = require("fs");

const schemaPath = path.join(__dirname, "models", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");
db.exec(schema, (err) => {
  if (err) console.log("Table Setup Error", err);
  else console.log("Table Setup successful");
});
