const express = require("express")
const { createPostController, getPostController, getPostDetails, likePostController, getFeedController, unlikePostController } = require("../controllers/post.controller")
const { savePostController, unsavePostController, addCommentController, getCommentsController, sharePostController } = require("../controllers/engagement.controller")
const multer = require("multer")
const identifyUser = require("../middlewares/auth.middleware")
const upload = multer({storage: multer.memoryStorage()})

const postRouter = express.Router()



postRouter.post("/", upload.single("image"), identifyUser, createPostController)


postRouter.get('/', identifyUser, getPostController)


postRouter.get('/details/:postId', identifyUser, getPostDetails)

postRouter.post("/like/:postId", identifyUser, likePostController)

postRouter.post("/unlike/:postId", identifyUser, unlikePostController)

postRouter.get("/feed", identifyUser, getFeedController)

postRouter.post("/save/:postId", identifyUser, savePostController)
postRouter.post("/unsave/:postId", identifyUser, unsavePostController)
postRouter.get("/comments/:postId", identifyUser, getCommentsController)
postRouter.post("/comments/:postId", identifyUser, addCommentController)
postRouter.post("/share/:postId", identifyUser, sharePostController)

module.exports = postRouter