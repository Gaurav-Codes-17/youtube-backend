import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"

import subscriptionRouter from "./routes/subscription.routes.js"
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors())


//getting all the required routes 
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";



//setting up routes
app.use("/api/v1/user" , userRouter )
app.use("/api/v1/video" , videoRouter )
app.use("/api/v1/tweets" , tweetRouter )
app.use("/api/v1/comments" , commentRouter)
app.use("/api/v1/likes" , likeRouter)
app.use("/api/v1/subscription", subscriptionRouter);




export {app} 

