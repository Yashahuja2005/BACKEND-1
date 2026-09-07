const mongoose = require("mongoose")

const saveSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: "posts", required: true },
    user: { type: String, required: true }
}, { timestamps: true })

saveSchema.index({ post: 1, user: 1 }, { unique: true })

module.exports = mongoose.model("saves", saveSchema)
