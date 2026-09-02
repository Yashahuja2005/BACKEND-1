const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    caption:{
        type: String,
        default: ""
    },
    imgUrl:{
        type: String,
        require: [true, "imgUrl is required for creating a post"]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        require: [true, "User Id is required for creating a post"]
    }
})

const postModel = mongoose.model("posts", postSchema)

module.exports = postModel