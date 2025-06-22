const requestBodyCheck = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({
      error: "Details Required",
    });
  } else {
    next();
  }
};

module.exports = requestBodyCheck;
