const express = require("express")
const {
    followUserController,
    getFollowRequestsController,
    acceptFollowRequestController,
    rejectFollowRequestController,
    unfollowUserController,
    getConnectionsController
} = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")

const userRouter = express.Router()

userRouter.post('/follow/:username', identifyUser, followUserController)
userRouter.get('/follow-requests', identifyUser, getFollowRequestsController)
userRouter.post('/follow/accept/:username', identifyUser, acceptFollowRequestController)
userRouter.post('/follow/reject/:username', identifyUser, rejectFollowRequestController)
userRouter.post('/unfollow/:username', identifyUser, unfollowUserController)
userRouter.get('/connections', identifyUser, getConnectionsController)

module.exports = userRouter