const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")

async function followUserController(req, res){

    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    if(followerUsername == followeeUsername){
        return res.status(400).json({
            message: 'You cannot follow yourself'
        })
    }

    const isFolloweeExists = await userModel.findOne({
        username: followeeUsername
    })

    if(!isFolloweeExists){
        return res.status(404).json({
            message: "User doesn't exist"
        })
    }

    const existingFollow = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (existingFollow) {
        if (existingFollow.status === "accepted") {
            return res.status(200).json({
                message: `You are already following ${followeeUsername}`,
                follow: existingFollow
            })
        }

        if (existingFollow.status === "pending") {
            return res.status(200).json({
                message: `Follow request already sent to ${followeeUsername}`,
                follow: existingFollow
            })
        }

        if (existingFollow.status === "rejected") {
            existingFollow.status = "pending"
            await existingFollow.save()

            return res.status(200).json({
                message: `Follow request sent again to ${followeeUsername}`,
                follow: existingFollow
            })
        }
    }

    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername,
        status: "pending"
    })

    res.status(201).json({
        message: `Follow request sent to ${followeeUsername}`,
        follow: followRecord
    })
}

async function getFollowRequestsController(req, res){
    const username = req.user.username

    const requests = await followModel.find({
        followee: username,
        status: "pending"
    }).sort({ createdAt: -1 })

    return res.status(200).json({
        message: "Pending follow requests fetched successfully",
        requests
    })
}

async function acceptFollowRequestController(req, res){
    const followeeUsername = req.user.username
    const followerUsername = req.params.username

    const request = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername,
        status: "pending"
    })

    if(!request){
        return res.status(404).json({
            message: `No pending follow request found from ${followerUsername}`
        })
    }

    request.status = "accepted"
    await request.save()

    return res.status(200).json({
        message: `You accepted ${followerUsername}'s follow request`,
        follow: request
    })
}

async function rejectFollowRequestController(req, res){
    const followeeUsername = req.user.username
    const followerUsername = req.params.username

    const request = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername,
        status: "pending"
    })

    if(!request){
        return res.status(404).json({
            message: `No pending follow request found from ${followerUsername}`
        })
    }

    request.status = "rejected"
    await request.save()

    return res.status(200).json({
        message: `You rejected ${followerUsername}'s follow request`,
        follow: request
    })
}

async function unfollowUserController(req, res){
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername,
    })

    if (!isUserFollowing) {
        return res.status(200).json({
            message: `You are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message: `You have unfollowed ${followeeUsername}`
    })
}

module.exports = {
    followUserController,
    getFollowRequestsController,
    acceptFollowRequestController,
    rejectFollowRequestController,
    unfollowUserController
}