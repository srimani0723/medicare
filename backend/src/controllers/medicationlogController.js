const db = require("../config/db");
const { getMedicationLogById, createMedicationLog, getMedicationLogByDateandId } = require("../data/medicationlogData");



const getMedicationLogController =async (req, res) => {
    try {

        const { userid } = req.params
        if (!userid) {
            return res.status(400).json({
                status: false,
                error:"User ID Required"
            })
        }
        const result =await getMedicationLogById(userid)

        res.status(200).json({
            status: true,
            medications:result
        })
    } catch (error) {
    res.status(500).json({
      error: "Something Went Wrong "+ error.message
    });
    }
}

const getMedicationLogByDateController = async (req, res) => {
    try {
        const { userid, date } = req.query

        if (!userid || !date) {
            return res.status(400).json({
                status: false,
                error:"Details Required"
            })
        }
        const result = await getMedicationLogByDateandId(req.query)

        res.status(200).json({
            status: true,
            medications:result
        })
    } catch (error) {
    res.status(500).json({
      error: "Something Went Wrong "+ error.message
    });
    }
}



const getDailyStreak = async (req, res) => {
    try {
        const { userid } = req.params;

        const dates = await sqliteMethodAsync(
            "all",
            `SELECT date FROM dailystreak WHERE userid = ? AND completed = 1`,
            [userid]
        );

        res.json({ dates: dates.map(d => d.date) });
    }catch(error) {
        res.status(500).json({
            error: "Something Went Wrong "+ error.message
        })
    }
}

const createMedicationLogController =async (req, res) => {
    try {
        const { userid,medicationid, datetaken, taken } = req.body

        if (!userid || !medicationid || !datetaken) {
            return res.status(400).json({
                status: false,
                error:"Details Required"
            })
        }
        const result = await createMedicationLog(req.body)
        await updateDailyStreak(userid, datetaken);
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
      error: "Something Went Wrong "+ error.message
    });
    }
}


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

const getAdherenceReport = async (req, res) => {
  try {
    const { userid } = req.params;
    if (!userid) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get first log date (across any medication)
    const firstLog = await sqliteMethodAsync(
      "get",
      `SELECT MIN(datetaken) as startDate FROM medicationlog
       WHERE userid = ?`,
      [userid]
    );

    if (!firstLog.startDate) {
      return res.status(200).json({
        userid,
        averageAdherence: "0",
        totalDays: 0,
        streakDays: 0,
        adherence: []
      });
    }

    const startDate = new Date(firstLog.startDate);
    const today = new Date();
    const totalDays =
      Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Count number of days marked as 'complete' in dailystreak table
    const streakRecords = await sqliteMethodAsync(
      "all",
      `SELECT date FROM dailystreak
       WHERE userid = ? AND completed = 1`,
      [userid]
    );

    const streakDays = streakRecords.length;
    const averageAdherence =
      totalDays > 0 ? `${Math.round((streakDays / totalDays) * 100)}` : "0";

    res.status(200).json({
      userid,
      averageAdherence,
      totalDays,
      streakDays,
      adherenceDates: streakRecords.map(row => row.date)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

const updateDailyStreak = async (userid, date) => {
  // Get all medication IDs for the user
  const meds = await sqliteMethodAsync(
    "all",
    `SELECT id FROM medications WHERE userid = ?`,
    [userid]
  );

  if (meds.length === 0) return;

  // Check how many medications were taken today
  const taken = await sqliteMethodAsync(
    "get",
    `SELECT COUNT(DISTINCT medicationid) as count FROM medicationlog
     WHERE userid = ? AND datetaken = ? AND taken = 1`,
    [userid, date]
  );

  if (taken.count === meds.length) {
    // All meds taken = streak achieved
    const id = crypto.randomUUID();
    await sqliteMethodAsync(
      "run",
      `INSERT OR REPLACE INTO dailystreak (id, userid, date, completed) VALUES (?, ?, ?, 1)`,
      [id, userid, date]
    );
  }
};

module.exports = {getMedicationLogController, createMedicationLogController, getMedicationLogByDateController, getAdherenceReport,updateDailyStreak,getDailyStreak};