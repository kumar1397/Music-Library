const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Editor", "Viewer"],
    },
    Artists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
    }],
    Albums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    }],
    Tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track'
    }],
    Favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Favorite'
    }],

    
},{ timestamps: true })

module.exports = mongoose.model("user", userSchema);