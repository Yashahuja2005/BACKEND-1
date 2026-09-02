const express = require("express")
const { createPostController, getPostController, getPostDetails, likePostController } = require("../controllers/post.controller")
const multer = require("multer")
const identifyUser = require("../middlewares/auth.middleware")
const upload = multer({storage: multer.memoryStorage()})

const postRouter = express.Router()



postRouter.post("/", upload.single("image"), identifyUser, createPostController)


postRouter.get('/', identifyUser, getPostController)


postRouter.get('/details/:postId', identifyUser, getPostDetails)

postRouter.post("/like/:postId", identifyUser, likePostController)

module.exports = postRouter