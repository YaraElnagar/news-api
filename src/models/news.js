const mongoose = require ('mongoose')
const newsSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Reporter'
    },
    avatar:{
        type:Buffer
    }
})

const News = mongoose.model('News',newsSchema)

module.exports = News