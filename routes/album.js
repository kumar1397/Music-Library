const express = require("express");
const router = express.Router();


const {
    deleteAlbum,
    getAllAlbums,
    getSingleAlbum,
    updateAlbum,
    addAlbum,
} = require("../controllers/Album");

const {
    auth,
    isAdmin,
    isEditor
} = require("../middlewares/Auth");

router.delete("/:id",auth, isEditor, deleteAlbum);
router.get("/",auth, isEditor, getAllAlbums);
router.get("/:id", auth, isEditor, getSingleAlbum);
router.put("/:id",auth, isEditor,  updateAlbum);
router.post("/add-album",auth, isEditor, addAlbum);

module.exports = router;
