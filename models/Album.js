const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    
    title: { 
        type: String, 
        required: true 
    }, 
    artist: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Artist", 
        required: true 
    }, 
    year: { 
        type: Number 
    }, 
    hidden: { 
        type: Boolean, 
        default: false 
    }, 
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model("Album", albumSchema);
