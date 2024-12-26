
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.deleteUser = async (req, res) => {
    try {
      const id  = req.params.id; // Extract ID from route parameters
      console.log(`Deleting user with ID: ${id}`);
  
      // Check if the user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Delete the user
      await User.findByIdAndDelete(id);
  
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        success: false,
        message: "User cannot be deleted successfully",
      });
    }
  };
  

  exports.getAllUsers = async (req, res) => {
    try {
        const { limit = 10, offset = 0, role } = req.query;

        const filter = role ? { role } : {};

        const allUsers = await User.find(filter)
            .skip(parseInt(offset))
            .limit(parseInt(limit));

        const totalUsers = await User.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data: allUsers,
            metadata: {
                total: totalUsers,
                limit: parseInt(limit),
                offset: parseInt(offset),
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Unable to fetch user data.`,
            error: error.message,
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userDetails = await User.findById(req.user.id);

        const { oldPassword, newPassword } = req.body;

        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );
        if (!isPasswordMatch) {
            return res
                .status(401)
                .json({ success: false, message: "The password is incorrect" });
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        );

        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            );
            console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            console.error("Error occurred while sending email:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            });
        }

        return res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        });
    }
};

exports.addUser = async (req, res) => {
    const {name, email, password,role} = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
}