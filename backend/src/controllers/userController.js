const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getAllPatients,
} = require("../data/userData");

const loginController = async (req, res) => {
  const { username, password } = req.body;
  if (!username && !password) {
    return res.status(400).json({
      error: "Username and Password are required",
    });
  }

  if (username && (!password || password === "")) {
    return res.status(400).json({
      error: "Password required",
    });
  }

  const response = await getUserByUsername(username);

  if (!response) {
    return res.status(400).json({
      success: false,
      error: "User Not Exists",
    });
  }

  if (!(await bcrypt.compare(password, response.password))) {
    return res.status(400).json({
      success: false,
      error: "Wrong Password",
    });
  }

  const jwtToken = jwt.sign({ username }, process.env.JWT_SECRET);

  res.status(200).json({
    status: 200,
    jwtToken,
    body: {
      id: response.id,
      fullname: response.fullname,
      username: response.username,
      email: response.email,
      role: response.role,
    },
  });
};

const registerController = async (req, res) => {
  const { fullname, username, email, password, role } = req.body;

  if (!username || !password || !fullname || !email || !role) {
    return res.status(400).json({
      error: "Details required",
    });
  }

  const emailExist = await getUserByEmail(email);
  if (emailExist) {
    return res.status(400).json({
      success: false,
      error: "Email Already Registered",
    });
  }

  const usernameExist = await getUserByUsername(username);
  if (usernameExist) {
    return res.status(400).json({
      success: false,
      error: "Username Already Registered",
    });
  }

  const response = await createUser(req.body);
  res.status(200).json(response);
};

const getAllPatientsController = async (req, res) => {
  try {
    const patients = await getAllPatients()
    res.status(200).json({
      status: true,
      patients,
    });
  } catch (error) {
    res.status(500).json({
      error: "Something Went Wrong " + error.message,
    });
  }
};

module.exports = { loginController, registerController,getAllPatientsController };
