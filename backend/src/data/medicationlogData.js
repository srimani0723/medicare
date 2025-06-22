const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

const sqliteMethodAsync = (method, sql, params) =>
  new Promise((resolve, reject) => {
    if (typeof db[method] !== "function") {
      return reject(new Error(`Method ${method} is not valid db function`));
    }

    db[method](sql, params, (err, row) => {
      if (err) reject(err);

      if (method === "run") {
        return resolve({ lastId: this.lastId, changes: this.changes });
      } else resolve(row);
    });
  });


const getMedicationLogById = async (id) => {
    try {
        const query = `select * from medicationlog where userid = ?`      
        const result = await sqliteMethodAsync("all", query, [id]);
        return result ? result : [];
    } catch (err) {
        console.log(err);
        return null;
    }
}

const getMedicationLogByDateandId = async (med) => {
    try {
        const { userid, date } = med
        const query = `select * from medicationlog where userid = ? and datetaken = ?`;
      const result = await sqliteMethodAsync("all", query, [userid, date]);

        return result ? result : [];
    } catch (err) {
        console.log(err);
        return null;
    }
}


const createMedicationLog =async (med) => {
    const { userid, medicationid, datetaken,taken=true } = med
  try {
      const checkQuery = `SELECT * FROM medicationlog WHERE userid = ? AND medicationid = ? AND datetaken = ?`;
    const existing = await sqliteMethodAsync("get", checkQuery, [
      userid,
      medicationid,
      datetaken,
    ]);

    if (existing) {
      return {
        success: false,
        message: "Already marked as taken for today",
      };
    }

        const query = `INSERT INTO medicationlog (id, userid, medicationid, datetaken, taken) VALUES (?, ?, ?, ?, ?)`;
        const result = await sqliteMethodAsync("run", query, [
          uuidv4(),
            userid,
            medicationid,
            datetaken,
            taken
        ]);
    
        if (result.changes === 0) {
          return {
            success: false,
            message: "Failed to add medication",
          };
        }

        return {
          success: true,
          message: "Medication Added Successfully",
        };
      } catch (err) {
        console.log(err);
      }
}


module.exports = { getMedicationLogById, createMedicationLog, getMedicationLogByDateandId };