const express = require("express");
const router = express.Router();


const {
    deleteTrack,
    getAllTracks,
    getSingleTrack,
    updateTrack,
    addTrack,
} = require("../controllers/Track");

const {
    verifyToken,
    isAdmin,
    isEditor
} = require("../middlewares/Auth");

router.delete("/:id", deleteTrack);
router.get("/", getAllTracks);
router.get("/:id", getSingleTrack);
router.put("/:id", updateTrack);
router.post("/add-track", addTrack);

module.exports = router;
