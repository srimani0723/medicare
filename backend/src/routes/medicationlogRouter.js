const express = require("express");
const requestBodyCheck = require("../middlewares/requestBodyCheck");
const { getMedicationLogController, createMedicationLogController,getMedicationLogByDateController, getAdherenceReport, getDailyStreak } = require("../controllers/medicationlogController");
const authenticateToken = require("../middlewares/authenticate");
const router = express.Router();

router.get("/dailystreak/:userid",authenticateToken,getDailyStreak);
router.get("/medicationlogs/:userid", authenticateToken, getMedicationLogController);
router.get("/adherencereport/:userid", authenticateToken, getAdherenceReport);
router.get("/medicationlog/date", authenticateToken, getMedicationLogByDateController);
router.post("/medicationlog", authenticateToken,requestBodyCheck,createMedicationLogController);

module.exports = router;
