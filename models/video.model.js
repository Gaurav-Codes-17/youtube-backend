import mongoose from "mongoose"

const videoSchema  = mongoose.Schema({
    videoFile : String,
    title : String,
    thumbnail : String,
    description : String,
    duration : Number,
    views : Number,
    isPublished : Boolean,
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
}, 
    { timestamps : true }            )

    const videoModel = mongoose.model("video" , videoSchema)

    export {videoModel}