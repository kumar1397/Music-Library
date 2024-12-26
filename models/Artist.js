const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, 
    grammy: { 
        type: Boolean, 
        default: false 
    }, 
    hidden: { 
        type: Boolean, 
        default: false }, 
}, { timestamps: true }); 

module.exports = mongoose.model("Artist", artistSchema);
