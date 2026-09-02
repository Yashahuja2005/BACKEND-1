const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true, "User name already exists"],
        require: [true, "User name is required"]
    },
    email:{
        type: String,
        unique: [true, "Email already exists"],
        require: [true, "Email is required"]
    },
    password:{
        type: String,
        require: [true, "Password is required"]
    },
    bio: String,
    profileImage: {
        type: String,
        default: "https://ik.imagekit.io/1gs2aps1a/User-Profile-PNG-File.png"
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel