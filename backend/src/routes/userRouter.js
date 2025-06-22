const express = require("express");
const {
  loginController,
  registerController,
  getAllPatientsController,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticate");
const requestBodyCheck = require("../middlewares/requestBodyCheck");
const router = express.Router();

router.post("/login", requestBodyCheck, loginController);
router.post("/register", requestBodyCheck, registerController);
router.get("/patients",authenticateToken,getAllPatientsController)

module.exports = router;
