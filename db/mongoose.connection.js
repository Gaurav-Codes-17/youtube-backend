import { mongoose } from "mongoose";
import { DB_NAME } from "../constants.js";

async function mongodb(){
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/youtube_backend`);
        console.log("mongoDb connected successfully !!")
    }       catch (error) {
            console.log("MONGODB connection error ⚠️ : ", error);
    }
}



export { mongodb }