const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "medicare.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.log("Error:", err);
  else console.log("SQLite Database started");
});

module.exports = db;
