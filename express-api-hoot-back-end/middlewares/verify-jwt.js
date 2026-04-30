const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  try {
    console.log("AUTH HEADER:", req.headers.authorization);
    console.log("SECRET_KEY:", process.env.SECRET_KEY);

    if (!req.headers.authorization) {
      return res.status(401).json({ err: "No authorization header sent" });
    }

    const token = req.headers.authorization.split(" ")[1];

    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({ err: "No token found after Bearer" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded.user;
    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    res.status(401).json({ err: error.message });
  }
};

module.exports = verifyJwt;