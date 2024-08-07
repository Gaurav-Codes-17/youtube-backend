import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema  = mongoose.Schema({
    videoFile : String,
    title : String,
    thumbnail : String,
    description : String,
    duration : Number,
    views : Number,
    isPublished : Boolean,
    owner : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
}, 
    { timestamps : true }            )

    videoSchema.plugin(mongooseAggregatePaginate)

    const videoModel = mongoose.model("video" , videoSchema)

    export {videoModel}