const express = require("express");
const requestBodyCheck = require("../middlewares/requestBodyCheck");
const { getAllMedicationsController, createMedicationController, updateMedicationController, deleteMedicationController } = require("../controllers/medicationsController");
const authenticateToken = require("../middlewares/authenticate");
const router = express.Router();

router.get("/medications",authenticateToken,getAllMedicationsController);
router.post("/medications", authenticateToken,requestBodyCheck,createMedicationController);
router.put("/medications/:id",authenticateToken, requestBodyCheck,updateMedicationController);
router.delete("/medications/:id",authenticateToken,deleteMedicationController);

module.exports = router;
