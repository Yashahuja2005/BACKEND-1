const mongoose = require("mongoose")

const songSchema = new mongoose.Schema({
    url:{
        type: String,
        required: true

    },
    posterUrl:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        default: "Moodify radio"
    },
    album: {
        type: String,
        default: "Moodify sessions"
    },
    duration: {
        type: Number,
        default: 0
    },
    mood: {
        type: String,
        enum: ["sad", "happy", "surprised", "angry", "neutral", "fearful", "disgusted"],
        default: "neutral",
        index: true
    }
}, { timestamps: true })

const songModel = mongoose.model("songs", songSchema)

module.exports = songModel