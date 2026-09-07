const postModel = require("../models/post.model")
const saveModel = require("../models/save.model")
const commentModel = require("../models/comment.model")
const shareModel = require("../models/share.model")

async function getPostOr404(postId, res) {
    const post = await postModel.findById(postId)
    if (!post) {
        res.status(404).json({ message: "Post not found" })
        return null
    }
    return post
}

async function savePostController(req, res) {
    if (!await getPostOr404(req.params.postId, res)) return
    const saved = await saveModel.findOneAndUpdate(
        { post: req.params.postId, user: req.user.username },
        { post: req.params.postId, user: req.user.username },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    res.status(200).json({ message: "Post saved", saved })
}

async function unsavePostController(req, res) {
    await saveModel.findOneAndDelete({ post: req.params.postId, user: req.user.username })
    res.status(200).json({ message: "Post removed from saves" })
}

async function addCommentController(req, res) {
    if (!await getPostOr404(req.params.postId, res)) return
    const text = String(req.body.text || "").trim()
    if (!text) return res.status(400).json({ message: "Comment cannot be empty" })
    const comment = await commentModel.create({ post: req.params.postId, user: req.user.username, text })
    res.status(201).json({ message: "Comment added", comment })
}

async function getCommentsController(req, res) {
    const comments = await commentModel.find({ post: req.params.postId }).sort({ createdAt: 1 }).lean()
    res.status(200).json({ comments })
}

async function sharePostController(req, res) {
    if (!await getPostOr404(req.params.postId, res)) return
    const share = await shareModel.findOneAndUpdate(
        { post: req.params.postId, user: req.user.username },
        { post: req.params.postId, user: req.user.username },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    res.status(200).json({ message: "Share recorded", share })
}

module.exports = {
    savePostController,
    unsavePostController,
    addCommentController,
    getCommentsController,
    sharePostController
}
