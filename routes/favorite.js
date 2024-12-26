const express = require("express");
const router = express.Router();

const {
    getFavoritesByCategory,
    addFavorite,
    removeFavorite,
} = require("../controllers/Favorite");

const {
    isAdmin,
    isEditor,
    auth,
} = require("../middlewares/Auth");

router.get("/:category", auth, isEditor, getFavoritesByCategory);
router.post("/add-favorite",auth, isEditor, addFavorite); 
router.delete("/:id", auth, isEditor, removeFavorite);

module.exports = router;