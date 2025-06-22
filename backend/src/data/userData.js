const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

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

const getUserByEmail = async (email) => {
  const emailExist = await sqliteMethodAsync(
    "get",
    `select * from users where email = ?`,
    [email]
  );
  return emailExist;
};

const getUserByUsername = async (username) => {
  const usernameExist = await sqliteMethodAsync(
    "get",
    `select * from users where username = ?`,
    [username]
  );
  return usernameExist;
};

const createUser = async (userDetails) => {
  const { fullname, username, email, password, role } = userDetails;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users (id,fullname,username,email,password,role) VALUES (?,?,?,?,?,?)";
    const result = await sqliteMethodAsync("run", query, [
      uuidv4(),
      fullname,
      username,
      email,
      hashedPassword,
      role,
    ]);

    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (err) {
    console.log(err);
  }
};

const getPatients = async (email) => {
  const result = await sqliteMethodAsync(
    "all",
    `select * from users where role = 'patient'`
  );
  return result;
};


const getAllPatients = async () => {
  try {
    const patients = await sqliteMethodAsync(
      "all",
      `SELECT id, fullname, email FROM users WHERE role = 'patient'`
    );

    const report = [];

    for (const patient of patients) {
      const userid = patient.id;

      // Get total medications
      const medResult = await sqliteMethodAsync(
        "get",
        `SELECT COUNT(*) as medCount FROM medications WHERE userid = ?`,
        [userid]
      );

      // First log date across all medication logs
      const firstLog = await sqliteMethodAsync(
        "get",
        `SELECT MIN(datetaken) as start FROM medicationlog WHERE userid = ?`,
        [userid]
      );

      let totalDays = 0;
      if (firstLog?.start) {
        const start = new Date(firstLog.start);
        const today = new Date();
        totalDays = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
      }

      // Get count of completed streak days
      const streakDays = await sqliteMethodAsync(
        "get",
        `SELECT COUNT(*) as streakCount FROM dailystreak 
         WHERE userid = ? AND completed = 1`,
        [userid]
      );

      const adherence =
        totalDays > 0
          ? `${Math.round((streakDays.streakCount / totalDays) * 100)}%`
          : "0%";

      report.push({
        id: patient.id,
        fullname: patient.fullname,
        email: patient.email,
        medicationCount: medResult.medCount || 0,
        adherence
      });
    }

    return report;
  } catch (error) {
    console.error("Error fetching patient stats:", error.message);
    throw error;
  }
};

module.exports = { createUser, getUserByEmail, getUserByUsername, getAllPatients };
