const express = require("express");
const router = express.Router();

const {
    deleteArtist,
    getAllArtist,
    getSingleArtist,
    updateArtist,
    addArtist,
} = require("../controllers/Artist");

const {
    auth,
    isAdmin,
    isEditor
} = require("../middlewares/Auth");

router.delete("/:id", auth, deleteArtist);
router.get("/", auth, getAllArtist);
router.get("/:id",auth, getSingleArtist);
router.put("/:id",auth, updateArtist);
router.post("/add-artist",auth, addArtist);

module.exports = router;
