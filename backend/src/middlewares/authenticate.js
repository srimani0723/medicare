const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  let jwtToken;
  const authHeader = req.headers["authorization"];

  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }

  if (jwtToken === undefined) {
    return res.status(401).json({
      message: "Invalid JWT Token",
    });
  } else {
    jwt.verify(jwtToken, process.env.JWT_SECRET, async (error, payload) => {
      if (error) {
        res.status(401).json({
          message: "Invalid JWT Token",
        });
      } else {
        next();
      }
    });
  }
};

module.exports = authenticateToken;
