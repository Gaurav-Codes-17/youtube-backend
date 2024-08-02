import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"
import  userRouter  from "./routes/user.routes.js";
import  videoRouter  from "./routes/video.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors())

//setting up routes
app.use("/api/v1/user" , userRouter )
app.use("/api/v1/video" , videoRouter )



export {app} 

