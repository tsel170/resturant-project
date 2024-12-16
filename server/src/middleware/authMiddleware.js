import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../sercret/env.js";
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // const token = authHeader;
    // if (!token) {
    //   return res.status(401).json({ message: "Invalid token format" });
    // }
    console.log(JWT_SECRET);

    const decodeToken = jwt.verify(authHeader, JWT_SECRET);
    console.log(authHeader);
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
