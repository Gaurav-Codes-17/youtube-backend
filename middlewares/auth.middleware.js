import { userModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const  verifyJWT = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken 

    if (!token) {
        throw new ApiError(401 , "unauthorized service")
    }   

    const decodedToken = jwt.verify(token , process.env.JWT_ACCESSTOKEN_SECRET);

    const user = await userModel.findById(decodedToken._id)
    if (!user) {
        throw new ApiError(400 , "no user found with this token")
    }
    req.user = user
next();


})