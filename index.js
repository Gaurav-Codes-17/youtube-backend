import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import { mongodb } from "./db/mongoose.connection.js";



mongodb()
  .then(() => {
    app.listen(4000, () => {
      console.log("server is running at port 4000");
    });
  })
  .catch((err) => {
    console.log("connection failed ", err);
  });
