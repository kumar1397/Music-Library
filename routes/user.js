const express = require("express");
const router = express.Router();

const {
    deleteUser,
    getAllUsers,
    addUser,
    changePassword
} = require("../controllers/User");

const {
    auth,
    isAdmin,
    isEditor
} = require("../middlewares/Auth");

router.delete("/:id", isAdmin, deleteUser);
router.get("/",auth, isAdmin, getAllUsers);
router.post("/add-user", addUser);
router.put("/change-password", changePassword);   

module.exports = router;
