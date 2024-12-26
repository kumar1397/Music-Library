const express = require("express");
const router = express.Router();

const {
    signup,
    login,
    logout,
} = require("../controllers/Auth");

const {
    verifyToken,
    isAdmin,
    isEditor
} = require("../middlewares/Auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
