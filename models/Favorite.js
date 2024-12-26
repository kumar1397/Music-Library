const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, 
    category: { 
        type: String, 
        enum: ["Artist", "Album", "Track"], 
        required: true 
    },
    item_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    }, 
}, { timestamps: true }); 
module.exports = mongoose.model("Favorite", favoriteSchema);
