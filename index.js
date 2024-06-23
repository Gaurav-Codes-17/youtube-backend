import dotenv from "dotenv";
import { app } from "./app.js";
import { mongodb } from "./db/mongoose.connection.js";
dotenv.config();

;

mongodb()
.then(()=>{
    app.listen(4000 , ()=>{
        console.log("server is running at port 4000")
    })
})
.catch((err) => {
    console.log("connection failed " , err)
})



