const mongoose = require('mongoose')
const Config = require('.')

const url = Config.MONGO_URI

const connectDB = async () => {
    try{
        await mongoose.connect(url)
        console.log("Database Connected 🚀🚀")
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB;