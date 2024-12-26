const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        console.log("Inside signup");

        const { name, email, password, cpassword } = req.body;
        // Validate inputs
        if (!name || !email || !password || !cpassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        if (password !== cpassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in.",
            });
        }

        // Determine role (admin for first user, editor for others)
        const userCount = await User.countDocuments(); 
        const role = userCount === 0 ? 'Admin' : 'Editor'; 

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role, // Assign the determined role
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
        });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again later.",
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user._id, role: user.role },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            );

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            });
        }
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            success: true,
            message: `User Logged Out Successfully`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `User Cannot be Logged Out`,
        });
    }
};


