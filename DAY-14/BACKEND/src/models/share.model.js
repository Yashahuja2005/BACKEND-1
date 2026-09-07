const mongoose = require("mongoose")

const shareSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "posts", required: true },
    user: { type: String, required: true }
}, { timestamps: true })

shareSchema.index({ post: 1, user: 1 }, { unique: true })

module.exports = mongoose.model("shares", shareSchema)
