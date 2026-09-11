const mongoose = require("mongoose")

const connectToDB = async () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to Database");
    })
    .catch(err => {
        console.log("Error connecting to DB", err);
    })
}

module.exports = connectToDB;