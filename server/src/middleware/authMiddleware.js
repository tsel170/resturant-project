import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../sercret/env.js";
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodeToken = jwt.verify(authHeader, JWT_SECRET);
    req._id = decodeToken._id;

    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
