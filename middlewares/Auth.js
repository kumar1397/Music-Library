const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

exports.auth = async (req, res, next) => {
  try {
    // Extract token from headers, cookies, or body
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Split 'Bearer <token>'
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing." });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded token payload to request object
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed. Please try again.",
    });
  }
};
// Middleware to check for Admin role
exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });
    if (!userDetails || userDetails.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }
    next();
  } catch (error) {
    console.error("Admin role verification error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error verifying user role." });
  }
};

// Middleware to check for Editor or higher roles
exports.isEditor = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });
    if (
      !userDetails ||
      !["Editor", "Admin"].includes(userDetails.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Viewers, Editors, or Admins only.",
      });
    }
    next();
  } catch (error) {
    console.error("Editor role verification error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error verifying user role." });
  }
};

// Middleware to check for Viewer or higher roles
exports.isViewer = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });
    if (
      !userDetails ||
      !["Viewer", "Editor", "Admin"].includes(userDetails.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Viewers, Editors, or Admins only.",
      });
    }
    next();
  } catch (error) {
    console.error("Viewer role verification error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error verifying user role." });
  }
};
